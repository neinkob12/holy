import { storeFromEnv, type Store } from "./store.js";
import type { Reply } from "./handlers.js";

export function json({ status, body }: Reply): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

export function withStore(fn: (store: Store) => Promise<Reply>): Promise<Response> {
  const store = storeFromEnv();
  if (!store) return Promise.resolve(json({ status: 503, body: { error: "Speicher nicht eingerichtet" } }));
  return fn(store).then(json, err => {
    console.error(err);
    return json({ status: 500, body: { error: "Serverfehler" } });
  });
}

export async function readJson(req: Request): Promise<unknown> {
  try { return await req.json(); } catch { return null; }
}
