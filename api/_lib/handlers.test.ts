import { describe, expect, it } from "vitest";
import type { TypeKey } from "../../shared/score.js";
import type { ResultView } from "../../shared/view.js";
import { createResult, readResult, recordVisit } from "./handlers.js";
import { memoryStore } from "./store.js";

const OWNER = "owner-device-1";
const FRIEND = "friend-device-2";
const picks = (t: TypeKey, n = 10): TypeKey[] => Array.from({ length: n }, (_, i) => (i < n - 3 ? t : "soy"));

async function setup() {
  const store = memoryStore();
  const r = await createResult(store, { device: OWNER, picks: picks("chad") }, "aaaaaaaa");
  expect(r.status).toBe(201);
  return store;
}
const view = async (store: ReturnType<typeof memoryStore>, device: string) =>
  (await readResult(store, "aaaaaaaa", device)).body as ResultView;

describe("Ergebnis anlegen", () => {
  it("lehnt falsche Testlängen und Typen ab", async () => {
    const store = memoryStore();
    expect((await createResult(store, { device: OWNER, picks: ["chad"] })).status).toBe(400);
    expect((await createResult(store, { device: OWNER, picks: Array(10).fill("sigma") })).status).toBe(400);
    expect((await createResult(store, { picks: picks("chad") })).status).toBe(400);
  });
  it("rechnet selbst und nimmt 36er-Tests an", async () => {
    const store = memoryStore();
    await createResult(store, { device: OWNER, picks: picks("gooner", 36) }, "bbbbbbbb");
    expect((await store.getResult("bbbbbbbb"))?.type).toBe("gooner");
  });
});

describe("Freischalten", () => {
  it("ist am Anfang gesperrt und verrät keine Prozente", async () => {
    const v = await view(await setup(), OWNER);
    expect(v.isOwner).toBe(true);
    expect(v.unlocked).toBe(false);
    expect(v.split).toBeNull();
    expect(v.spot).toHaveLength(2);
  });
  it("eigener Besuch zählt nicht", async () => {
    const store = await setup();
    expect((await recordVisit(store, { id: "aaaaaaaa", device: OWNER })).body).toEqual({ counted: false });
    expect((await view(store, OWNER)).unlocked).toBe(false);
  });
  it("Besuch von anderem Gerät schaltet frei", async () => {
    const store = await setup();
    await recordVisit(store, { id: "aaaaaaaa", device: FRIEND });
    const v = await view(store, OWNER);
    expect(v.unlocked).toBe(true);
    expect(v.split?.chad).toBe(70);
  });
  it("Fremde sehen nie die Prozente", async () => {
    const store = await setup();
    await recordVisit(store, { id: "aaaaaaaa", device: FRIEND });
    const v = await view(store, FRIEND);
    expect(v.isOwner).toBe(false);
    expect(v.split).toBeNull();
  });
});

describe("Freunde", () => {
  it("Test über den Link zählt als Besuch und taucht als Freund auf", async () => {
    const store = await setup();
    await createResult(store, { device: FRIEND, picks: picks("alpha"), ref: "aaaaaaaa" }, "cccccccc");
    const v = await view(store, OWNER);
    expect(v.unlocked).toBe(true);
    expect(v.friends).toEqual(["alpha"]);
  });
  it("eigener Test über den eigenen Link zählt nicht", async () => {
    const store = await setup();
    await createResult(store, { device: OWNER, picks: picks("alpha"), ref: "aaaaaaaa" }, "dddddddd");
    const v = await view(store, OWNER);
    expect(v.unlocked).toBe(false);
    expect(v.friends).toEqual([]);
  });
});
