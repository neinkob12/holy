import { TEST_LENGTHS, isTypeKey, scorePicks, spotOf, type TypeKey } from "../../shared/score.js";
import type { ResultView } from "../../shared/view.js";
import type { Store } from "./store.js";

export type Reply = { status: number; body: unknown };

const DEVICE_RE = /^[A-Za-z0-9_-]{8,64}$/;
const ID_RE = /^[a-z2-9]{8}$/;
const ID_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";

export function newId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, b => ID_ALPHABET[b % ID_ALPHABET.length]).join("");
}

export const isId = (v: unknown): v is string => typeof v === "string" && ID_RE.test(v);
const isDevice = (v: unknown): v is string => typeof v === "string" && DEVICE_RE.test(v);
const bad = (msg: string): Reply => ({ status: 400, body: { error: msg } });

/** POST /api/result: speichert ein neues Ergebnis. Die Auswertung rechnet der Server selbst. */
export async function createResult(store: Store, body: unknown, id = newId()): Promise<Reply> {
  const b = (body ?? {}) as { device?: unknown; picks?: unknown; ref?: unknown };
  if (!isDevice(b.device)) return bad("device fehlt");
  const lengths: number[] = Object.values(TEST_LENGTHS);
  if (!Array.isArray(b.picks) || !lengths.includes(b.picks.length) || !b.picks.every(isTypeKey)) return bad("picks ungültig");
  const picks = b.picks as TypeKey[];
  const { type, split } = scorePicks(picks);

  let ref: string | null = null;
  if (isId(b.ref)) {
    const parent = await store.getResult(b.ref);
    if (parent && parent.device !== b.device) {
      ref = b.ref;
      await store.addFriend(ref, id);
      await store.addVisit(ref, b.device);
    }
  }
  await store.setResult(id, { type, split, n: picks.length, device: b.device, ref, created: Date.now() });
  return { status: 201, body: { id } };
}

/** GET /api/result?id=...&device=... */
export async function readResult(store: Store, id: unknown, device: unknown): Promise<Reply> {
  if (!isId(id)) return bad("id ungültig");
  const rec = await store.getResult(id);
  if (!rec) return { status: 404, body: { error: "nicht gefunden" } };
  const isOwner = isDevice(device) && device === rec.device;
  const unlocked = isOwner && (await store.visitCount(id)) > 0;
  let friends: TypeKey[] = [];
  if (isOwner && unlocked) {
    const recs = await store.getResults(await store.friends(id));
    friends = recs.filter((r): r is NonNullable<typeof r> => r !== null).map(r => r.type);
  }
  const view: ResultView = {
    id, type: rec.type, n: rec.n, isOwner, unlocked,
    spot: spotOf(rec.split), split: unlocked ? rec.split : null, friends
  };
  return { status: 200, body: view };
}

/** POST /api/visit: jemand anderes hat den Link geöffnet. */
export async function recordVisit(store: Store, body: unknown): Promise<Reply> {
  const b = (body ?? {}) as { id?: unknown; device?: unknown };
  if (!isId(b.id)) return bad("id ungültig");
  if (!isDevice(b.device)) return bad("device fehlt");
  const rec = await store.getResult(b.id);
  if (!rec) return { status: 404, body: { error: "nicht gefunden" } };
  if (rec.device === b.device) return { status: 200, body: { counted: false } };
  await store.addVisit(b.id, b.device);
  return { status: 200, body: { counted: true } };
}
