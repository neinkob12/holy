import { describe, expect, it } from "vitest";
import { scorePicks, spotOf, toSplit, type TypeKey } from "../score.js";

describe("toSplit", () => {
  it("ergibt immer genau 100", () => {
    const s = toSplit({ chad: 1, alpha: 1, soy: 1, gooner: 0 });
    expect(s.chad + s.alpha + s.soy + s.gooner).toBe(100);
  });
  it("rechnet klare Fälle exakt", () => {
    expect(toSplit({ chad: 5, alpha: 3, soy: 1, gooner: 1 })).toEqual({ chad: 50, alpha: 30, soy: 10, gooner: 10 });
  });
  it("wirft ohne Antworten", () => {
    expect(() => toSplit({ chad: 0, alpha: 0, soy: 0, gooner: 0 })).toThrow();
  });
});

describe("scorePicks", () => {
  it("nimmt den häufigsten Typ", () => {
    const picks: TypeKey[] = ["chad", "gooner", "gooner", "alpha", "gooner"];
    expect(scorePicks(picks).type).toBe("gooner");
  });
  it("bei Gleichstand gewinnt der zuletzt gewählte", () => {
    expect(scorePicks(["chad", "alpha", "alpha", "chad"]).type).toBe("chad");
    expect(scorePicks(["chad", "alpha", "chad", "alpha", "soy"]).type).toBe("alpha");
  });
  it("Summe bleibt 100 bei 36 Antworten", () => {
    const picks = Array.from({ length: 36 }, (_, i) => (["chad", "alpha", "soy", "gooner", "soy"] as TypeKey[])[i % 5]);
    const { split } = scorePicks(picks);
    expect(split.chad + split.alpha + split.soy + split.gooner).toBe(100);
  });
});

describe("spotOf", () => {
  it("liegt beim reinen Typ in seiner Ecke", () => {
    expect(spotOf({ chad: 100, alpha: 0, soy: 0, gooner: 0 })).toEqual([15, 15]);
    expect(spotOf({ chad: 0, alpha: 0, soy: 0, gooner: 100 })).toEqual([85, 85]);
  });
  it("liegt bei Gleichverteilung in der Mitte", () => {
    expect(spotOf({ chad: 25, alpha: 25, soy: 25, gooner: 25 })).toEqual([50, 50]);
  });
});
