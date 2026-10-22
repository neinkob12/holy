import { describe, expect, it } from "vitest";
import { QUESTIONS } from "../content/questions";
import { selectQuestions } from "./select";

function seeded(seed: number) {
  return () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

describe("Fragenauswahl", () => {
  it("Katalog hat 42 Fragen mit eindeutigen IDs", () => {
    expect(QUESTIONS).toHaveLength(42);
    expect(new Set(QUESTIONS.map(q => q.id)).size).toBe(42);
  });
  it("langer Test hat genau 36 Fragen", () => {
    expect(selectQuestions(QUESTIONS, "long", seeded(1))).toHaveLength(36);
  });
  it("nie zwei Fragen aus derselben Gruppe", () => {
    for (let s = 1; s <= 50; s++) {
      for (const mode of ["short", "long"] as const) {
        const groups = selectQuestions(QUESTIONS, mode, seeded(s)).map(q => q.group).filter(Boolean);
        expect(new Set(groups).size).toBe(groups.length);
      }
    }
  });
  it("Schnelltest hat 10 verschiedene Fragen", () => {
    const qs = selectQuestions(QUESTIONS, "short", seeded(7));
    expect(new Set(qs.map(q => q.id)).size).toBe(10);
  });
});
