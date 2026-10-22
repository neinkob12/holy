import { createResult, readResult } from "./_lib/handlers.js";
import { readJson, withStore } from "./_lib/http.js";

export function GET(req: Request): Promise<Response> {
  const q = new URL(req.url).searchParams;
  return withStore(store => readResult(store, q.get("id"), q.get("device")));
}

export async function POST(req: Request): Promise<Response> {
  const body = await readJson(req);
  return withStore(store => createResult(store, body));
}
