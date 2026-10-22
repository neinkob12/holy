import { TEST_LENGTHS, TYPE_KEYS, type Mode, type TypeKey } from "../../shared/score";
import type { Question } from "../content/questions";

export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Aus jeder Überlappungsgruppe bleibt genau eine zufällige Frage übrig. */
export function onePerGroup(all: readonly Question[], rng: Rng = Math.random): Question[] {
  const seen = new Set<string>();
  return shuffle(all, rng).filter(q => {
    if (!q.group) return true;
    if (seen.has(q.group)) return false;
    seen.add(q.group);
    return true;
  });
}

export function selectQuestions(all: readonly Question[], mode: Mode, rng: Rng = Math.random): Question[] {
  const pool = onePerGroup(all, rng);
  const n = TEST_LENGTHS[mode];
  if (pool.length < n) throw new Error(`Zu wenige Fragen: ${pool.length} statt ${n}`);
  return pool.slice(0, n);
}

/** Reihenfolge der Antworten pro Frage mischen. */
export const answerOrder = (rng: Rng = Math.random): TypeKey[] => shuffle(TYPE_KEYS, rng);
