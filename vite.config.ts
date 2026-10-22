import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vitest/config";
import { createResult, readResult, recordVisit } from "./api/_lib/handlers";
import { memoryStore, storeFromEnv } from "./api/_lib/store";

/**
 * Lokale API für `npm run dev`: gleiche Logik wie auf Vercel.
 * Ohne Upstash-Zugang landet alles im Arbeitsspeicher.
 */
function devApi(): Plugin {
  const store = storeFromEnv() ?? memoryStore();
  const body = (req: IncomingMessage) => new Promise<unknown>(resolve => {
    let raw = "";
    req.on("data", c => (raw += c));
    req.on("end", () => { try { resolve(JSON.parse(raw)); } catch { resolve(null); } });
  });
  const send = (res: ServerResponse, r: { status: number; body: unknown }) => {
    res.statusCode = r.status;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(r.body));
  };
  return {
    name: "dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://local");
        if (url.pathname === "/api/result" && req.method === "GET") return send(res, await readResult(store, url.searchParams.get("id"), url.searchParams.get("device")));
        if (url.pathname === "/api/result" && req.method === "POST") return send(res, await createResult(store, await body(req)));
        if (url.pathname === "/api/visit" && req.method === "POST") return send(res, await recordVisit(store, await body(req)));
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [devApi()],
  test: {
    include: ["shared/**/*.test.ts", "api/**/*.test.ts", "src/**/*.test.ts"]
  }
});
