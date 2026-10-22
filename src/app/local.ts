// Browser-Speicher: nur Bequemlichkeit, alles muss auch ohne funktionieren.
const get = (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k: string, v: string): void => { try { localStorage.setItem(k, v); } catch { /* egal */ } };

let memDevice: string | null = null;

/** Zufällige Geräte-ID. Der eigene Link auf diesem Gerät zählt nicht als Besuch. */
export function deviceId(): string {
  const saved = get("tt.device");
  if (saved) return saved;
  if (!memDevice) {
    const b = crypto.getRandomValues(new Uint8Array(12));
    memDevice = Array.from(b, x => x.toString(16).padStart(2, "0")).join("");
  }
  set("tt.device", memDevice);
  return memDevice;
}

export function myResults(): string[] {
  try { return JSON.parse(get("tt.mine") ?? "[]") as string[]; } catch { return []; }
}
export function rememberResult(id: string): void {
  set("tt.mine", JSON.stringify([id, ...myResults().filter(x => x !== id)].slice(0, 20)));
}

/** Über wessen Link man gekommen ist. */
export const getRef = (): string | null => get("tt.ref");
export const setRef = (id: string): void => set("tt.ref", id);

