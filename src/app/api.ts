import type { TypeKey } from "../../shared/score";
import type { ResultView } from "../../shared/view";
import { deviceId } from "./local";

async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, { ...init, headers: { "content-type": "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export const createResult = (picks: TypeKey[], ref: string | null) =>
  call<{ id: string }>("/api/result", { method: "POST", body: JSON.stringify({ device: deviceId(), picks, ref }) });

export const readResult = (id: string) =>
  call<ResultView>(`/api/result?id=${encodeURIComponent(id)}&device=${encodeURIComponent(deviceId())}`);

export const recordVisit = (id: string) =>
  call<{ counted: boolean }>("/api/visit", { method: "POST", body: JSON.stringify({ id, device: deviceId() }) });
