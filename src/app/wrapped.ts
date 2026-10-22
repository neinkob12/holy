import { TYPE_KEYS, type TypeKey } from "../../shared/score";
import type { ResultView } from "../../shared/view";
import { S } from "../content/strings";
import { TYPES } from "../content/results";
import { ICON, app, esc, stage, sweep, toast } from "./dom";
import { readResult } from "./api";
import { copyLink, shareLink, shareStory } from "./share";

const N = 5;
const SPLIT_SLIDE = 3;
// Gesperrt: feste Reihenfolge und Fantasie-Längen, damit man nichts ablesen kann
const FAKE = [64, 38, 52, 27];
const POLL_MS = 4000;

function typed(text: string): string {
  const chars = [...text].map((c, n) => `<span class="tc" style="--n:${n}">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");
  return `<p class="typed" aria-label="${esc(text)}">${chars}<span class="caret"></span></p>`;
}

function quote(type: TypeKey): string {
  const t = TYPES[type];
  const words = `„${t.quote}“`.split(" ");
  return `<p class="quote" aria-label="${esc(t.quote)}">${words.map((w, n) => {
    const hl = t.highlight.includes(w.replace(/[„“]/g, ""));
    return `<span class="w disp${hl ? " hl" : ""}" style="--n:${n}${hl ? `;--md:calc(${n} * 170ms + 650ms)` : ""}">${esc(w)}</span>`;
  }).join(" ")}</p>`;
}

function map(v: ResultView): string {
  const [x, y] = v.spot;
  const lab = (k: TypeKey, i: number) => `<span class="lab l${i}" style="--c:var(--${k})">${TYPES[k].name}</span>`;
  return `<div class="mapw" style="--d:1">
    <div class="q"><div class="areas"><i></i><i></i><i></i><i></i></div><i class="me${y < 40 ? " below" : ""}" style="left:${x}%;top:${y}%"></i></div>
    ${lab("chad", 1)}${lab("alpha", 2)}${lab("soy", 3)}${lab("gooner", 4)}</div>`;
}

function split(v: ResultView): string {
  const row = (k: TypeKey, i: number, pct: string, w: number) =>
    `<div class="wrow" style="--c:var(--${k})"><div class="h"><span><i class="dot"></i>${TYPES[k].name}</span><b>${pct}</b></div><div class="t"><i style="width:${w}%;--i:${i}"></i></div></div>`;
  if (v.split) {
    const s = v.split;
    const rows = TYPE_KEYS.slice().sort((a, b) => s[b] - s[a]).map((k, i) => row(k, i, `${s[k]}%`, s[k]));
    return `<div class="wsplit" style="--d:2"><div class="bars4">${rows.join("")}</div></div>`;
  }
  const rows = TYPE_KEYS.map((k, i) => row(k, i, "?? %", FAKE[i]));
  return `<div class="wsplit" style="--d:2"><div class="bars4 blur" aria-hidden="true">${rows.join("")}</div>
    <div class="lock"><b>${S.splitLocked}</b><button class="btn primary" data-act="share">${ICON.share}${S.unlockCta}</button></div></div>`;
}

function friends(v: ResultView): string {
  if (v.friends.length === 0) return "";
  return `<div class="friends" style="--d:2"><span class="ft">${S.friendsTitle}</span>${
    v.friends.map(k => `<span class="pill" style="--c:var(--${k})">${TYPES[k].name}</span>`).join("")}</div>`;
}

function slide(v: ResultView, s: number): string {
  const t = TYPES[v.type];
  switch (s) {
    case 0: return `<p class="big disp">${S.slide1a}</p><p class="count disp" style="--d:1">${v.n}</p><p class="big disp" style="--d:2">${S.slide1b}</p>`;
    case 1: return `${typed(S.slide2)}<p class="huge">${t.name}</p>`;
    case 2: return quote(v.type);
    case 3: return `${map(v)}${split(v)}`;
    default: return `<p class="big disp oneline">${v.unlocked ? S.shareMore : S.unlockAll}</p>${friends(v)}
      <div class="actions" style="--d:2">
        <button class="btn primary" data-act="share">${ICON.share}${S.shareLink}</button>
        <button class="btn ghost" data-act="story">${ICON.story}${S.shareStory}</button>
        <button class="btn ghost" data-act="copy">${ICON.copy}${S.copyLink}</button>
      </div>
      <button class="link" data-act="restart" style="--d:3">${S.newTest}</button>`;
  }
}

/**
 * Ergebnis als Story zum Durchtippen. Rechts tippen: weiter, links: zurück.
 * Solange gesperrt, fragt die Seite regelmäßig nach, ob jemand den Link geöffnet hat.
 */
export function showWrapped(view: ResultView, onRestart: () => void): void {
  let v = view;
  let s = 0;
  let timer = 0;
  app().dataset.type = v.type;

  const paint = (withSweep: boolean) => {
    const bars = Array.from({ length: N }, (_, i) => `<i class="${i <= s ? "done" : ""}"></i>`).join("");
    stage().innerHTML = `<div class="wr" role="button" tabindex="0" aria-label="${S.tapNext}">
      <div class="bars">${bars}</div>
      <section class="screen${s === N - 1 ? " center" : ""}">${slide(v, s)}</section>
      <div class="hint">${s < N - 1 ? S.tapNext : ""}</div></div>`;
    if (withSweep) sweep();
  };
  const go = (d: number) => { s = Math.min(N - 1, Math.max(0, s + d)); paint(true); };

  const poll = async () => {
    if (document.hidden) return;
    const next = await readResult(v.id);
    if (!next || !next.unlocked) return;
    v = next;
    window.clearInterval(timer);
    toast(S.unlockedToast);
    if (s >= SPLIT_SLIDE) paint(false);
  };
  if (v.isOwner && !v.unlocked) timer = window.setInterval(poll, POLL_MS);

  stage().onclick = e => {
    const t = e.target as HTMLElement;
    const act = t.closest<HTMLElement>("[data-act]")?.dataset.act;
    if (act === "share") { void shareLink(v.id, v.type); return; }
    if (act === "story") { void shareStory(v.id, v.type); return; }
    if (act === "copy") { void copyLink(v.id); return; }
    if (act === "restart") { window.clearInterval(timer); stage().onclick = null; stage().onkeydown = null; onRestart(); return; }
    if (!t.closest(".wr") || t.closest("button")) return;
    const r = stage().getBoundingClientRect();
    const back = e.clientX - r.left < r.width * 0.28;
    if (back || s < N - 1) go(back ? -1 : 1);
  };
  stage().onkeydown = e => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };
  paint(false);
}
