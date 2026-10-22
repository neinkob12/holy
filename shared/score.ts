// Auswertung: wird im Browser und in der API benutzt, damit beide gleich rechnen.

export const TYPE_KEYS = ["chad", "alpha", "soy", "gooner"] as const;
export type TypeKey = (typeof TYPE_KEYS)[number];
export type Split = Record<TypeKey, number>;

/** Erlaubte Testlängen: Schnelltest und kompletter Test. */
export const TEST_LENGTHS = { short: 10, long: 36 } as const;
export type Mode = keyof typeof TEST_LENGTHS;

export function isTypeKey(v: unknown): v is TypeKey {
  return typeof v === "string" && (TYPE_KEYS as readonly string[]).includes(v);
}

/** Prozente nach größtem Rest runden, damit die Summe immer genau 100 ist. */
export function toSplit(counts: Record<TypeKey, number>): Split {
  const total = TYPE_KEYS.reduce((s, k) => s + counts[k], 0);
  if (total === 0) throw new Error("Keine Antworten");
  const raw = TYPE_KEYS.map(k => ({ k, v: (counts[k] / total) * 100 }));
  const split = Object.fromEntries(raw.map(r => [r.k, Math.floor(r.v)])) as Split;
  let rest = 100 - TYPE_KEYS.reduce((s, k) => s + split[k], 0);
  for (const r of raw.slice().sort((a, b) => (b.v % 1) - (a.v % 1))) {
    if (rest <= 0) break;
    split[r.k] += 1;
    rest -= 1;
  }
  return split;
}

/**
 * Haupttyp und Split aus den gewählten Antworten.
 * Bei Gleichstand gewinnt der Typ, der zuletzt gewählt wurde.
 */
export function scorePicks(picks: readonly TypeKey[]): { type: TypeKey; split: Split } {
  if (picks.length === 0) throw new Error("Keine Antworten");
  const counts = { chad: 0, alpha: 0, soy: 0, gooner: 0 } as Record<TypeKey, number>;
  for (const p of picks) counts[p] += 1;
  const max = Math.max(...TYPE_KEYS.map(k => counts[k]));
  const tied = new Set(TYPE_KEYS.filter(k => counts[k] === max));
  let type: TypeKey = picks[picks.length - 1];
  for (let i = picks.length - 1; i >= 0; i--) {
    if (tied.has(picks[i])) { type = picks[i]; break; }
  }
  return { type, split: toSplit(counts) };
}

// Ecken der Karte: Chad oben links, Alpha oben rechts, SoyBoy unten links, Gooner unten rechts.
const CORNERS: Record<TypeKey, [number, number]> = { chad: [0, 0], alpha: [1, 0], soy: [0, 1], gooner: [1, 1] };

/**
 * Position auf der Karte in Prozent (15 bis 85), damit der Punkt nie auf den Namen sitzt.
 * Quadrierte Anteile ziehen den Punkt deutlicher zum Haupttyp.
 */
export function spotOf(split: Split): [number, number] {
  let sx = 0, sy = 0, sw = 0;
  for (const k of TYPE_KEYS) {
    const w = split[k] ** 2;
    sx += w * CORNERS[k][0];
    sy += w * CORNERS[k][1];
    sw += w;
  }
  if (sw === 0) return [50, 50];
  const clamp = (v: number) => Math.round(Math.min(85, Math.max(15, (v / sw) * 100)));
  return [clamp(sx), clamp(sy)];
}
