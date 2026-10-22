import { recordVisit } from "./_lib/handlers.js";
import { readJson, withStore } from "./_lib/http.js";

export async function POST(req: Request): Promise<Response> {
  const body = await readJson(req);
  return withStore(store => recordVisit(store, body));
}
