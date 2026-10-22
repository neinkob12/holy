import type { TypeKey } from "../../shared/score";
import { S } from "../content/strings";
import { TYPES } from "../content/results";
import { toast } from "./dom";
import { storyImage } from "./story";

export const shareUrl = (id: string | null): string => (id ? `${location.origin}/r/${id}` : location.origin);

async function copy(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* weiter unten */ }
  const ta = document.createElement("textarea");
  ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  ta.remove();
  return ok;
}

export async function copyLink(id: string | null): Promise<void> {
  const ok = await copy(shareUrl(id));
  toast(ok ? S.copied : shareUrl(id));
}

/** Teilen-Menü vom Handy, sonst Link kopieren. */
export async function shareLink(id: string | null, type: TypeKey): Promise<void> {
  const data = { title: S.title, text: S.shareText(TYPES[type].name), url: shareUrl(id) };
  if (navigator.share) {
    try { await navigator.share(data); return; } catch (e) { if ((e as DOMException).name === "AbortError") return; }
  }
  await copyLink(id);
}

/** Story-Bild 9:16 erzeugen und teilen oder herunterladen. */
export async function shareStory(id: string | null, type: TypeKey): Promise<void> {
  const blob = await storyImage(type, shareUrl(id));
  const file = new File([blob], `typ-test-${TYPES[type].name.toLowerCase()}.png`, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], text: S.shareText(TYPES[type].name), url: shareUrl(id) }); return; }
    catch (e) { if ((e as DOMException).name === "AbortError") return; }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
