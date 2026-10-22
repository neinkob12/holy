import { Redis } from "@upstash/redis";
import type { Split, TypeKey } from "../../shared/score.js";

export interface ResultRecord {
  type: TypeKey;
  split: Split;
  /** Anzahl beantworteter Fragen (10 oder 36). */
  n: number;
  /** Geräte-ID des Erstellers. Sein eigener Besuch zählt nicht. */
  device: string;
  /** Ergebnis-ID, über deren Link dieser Test gestartet wurde. */
  ref: string | null;
  created: number;
}

export interface Store {
  getResult(id: string): Promise<ResultRecord | null>;
  getResults(ids: string[]): Promise<(ResultRecord | null)[]>;
  setResult(id: string, rec: ResultRecord): Promise<void>;
  /** Fügt ein Gerät zu den Besuchern hinzu und gibt die neue Anzahl zurück. */
  addVisit(id: string, device: string): Promise<number>;
  visitCount(id: string): Promise<number>;
  addFriend(ref: string, id: string): Promise<void>;
  friends(ref: string): Promise<string[]>;
}

const TTL = 60 * 60 * 24 * 180; // 180 Tage
const MAX_FRIENDS = 50;
const k = { res: (id: string) => `res:${id}`, vis: (id: string) => `vis:${id}`, fr: (id: string) => `fr:${id}` };

export function redisStore(redis: Redis): Store {
  return {
    async getResult(id) {
      return (await redis.get<ResultRecord>(k.res(id))) ?? null;
    },
    async getResults(ids) {
      if (ids.length === 0) return [];
      return (await redis.mget<(ResultRecord | null)[]>(...ids.map(k.res))).map(r => r ?? null);
    },
    async setResult(id, rec) {
      await redis.set(k.res(id), rec, { ex: TTL });
    },
    async addVisit(id, device) {
      const p = redis.pipeline();
      p.sadd(k.vis(id), device);
      p.expire(k.vis(id), TTL);
      p.scard(k.vis(id));
      const out = await p.exec<[number, number, number]>();
      return out[2];
    },
    async visitCount(id) {
      return redis.scard(k.vis(id));
    },
    async addFriend(ref, id) {
      const p = redis.pipeline();
      p.lpush(k.fr(ref), id);
      p.ltrim(k.fr(ref), 0, MAX_FRIENDS - 1);
      p.expire(k.fr(ref), TTL);
      await p.exec();
    },
    async friends(ref) {
      return redis.lrange<string>(k.fr(ref), 0, MAX_FRIENDS - 1);
    }
  };
}

/** Upstash über die Vercel-Integration (KV_*) oder direkt (UPSTASH_*). */
export function storeFromEnv(): Store | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return redisStore(new Redis({ url, token }));
}

/** Nur für Tests. */
export function memoryStore(): Store {
  const res = new Map<string, ResultRecord>();
  const vis = new Map<string, Set<string>>();
  const fr = new Map<string, string[]>();
  return {
    async getResult(id) { return res.get(id) ?? null; },
    async getResults(ids) { return ids.map(id => res.get(id) ?? null); },
    async setResult(id, rec) { res.set(id, rec); },
    async addVisit(id, device) {
      const s = vis.get(id) ?? new Set<string>();
      s.add(device); vis.set(id, s);
      return s.size;
    },
    async visitCount(id) { return vis.get(id)?.size ?? 0; },
    async addFriend(ref, id) { fr.set(ref, [id, ...(fr.get(ref) ?? [])].slice(0, MAX_FRIENDS)); },
    async friends(ref) { return fr.get(ref) ?? []; }
  };
}
