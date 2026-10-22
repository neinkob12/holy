import type { Split, TypeKey } from "./score.js";

/** Antwort von GET /api/result */
export interface ResultView {
  id: string;
  type: TypeKey;
  n: number;
  isOwner: boolean;
  unlocked: boolean;
  /** Position auf der Karte. Darf man auch gesperrt sehen. */
  spot: [number, number];
  /** Nur für den Ersteller und erst nach dem Freischalten. */
  split: Split | null;
  friends: TypeKey[];
}
