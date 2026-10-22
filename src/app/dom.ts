export const esc = (s: string): string =>
  s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);

export const app = (): HTMLElement => document.getElementById("app") as HTMLElement;

export function toast(msg: string): void {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("on");
  window.clearTimeout(Number(el.dataset.t));
  el.dataset.t = String(window.setTimeout(() => el.classList.remove("on"), 2200));
}

const WAVE = (cls: string) =>
  `<svg class="wave ${cls}" viewBox="0 0 400 40" preserveAspectRatio="none"><path d="M0 20 Q25 0 50 20 T100 20 T150 20 T200 20 T250 20 T300 20 T350 20 T400 20"/></svg>`;

/** Bewegter Hintergrund, bleibt beim Seitenwechsel stehen. */
export const BACKGROUND = `<div class="bgl" aria-hidden="true"><div class="conic"></div><div class="dots"></div>
  <div class="orb o1"></div><div class="orb o2"></div><div class="ring r1"></div><div class="ring r2"></div>
  ${WAVE("w1")}${WAVE("w2")}
  <i class="spark" style="left:80%;top:16%"></i><i class="spark" style="left:18%;top:74%;animation-delay:2.5s"></i>
  <div class="shimmer"></div></div>`;

/** Hintergrund einmal anlegen, Inhalt darüber austauschen. */
export function stage(): HTMLElement {
  const root = app();
  let st = root.querySelector<HTMLElement>(":scope > .stage");
  if (!st) {
    root.innerHTML = `${BACKGROUND}<div class="stage"></div>`;
    st = root.querySelector<HTMLElement>(":scope > .stage") as HTMLElement;
  }
  return st;
}

export function sweep(): void {
  const root = app();
  root.querySelector(":scope > .sweep")?.remove();
  const el = document.createElement("div");
  el.className = "sweep";
  root.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

const svg = (d: string) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
export const ICON = {
  share: svg(`<path d="M12 3v12M7 8l5-5 5 5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>`),
  story: svg(`<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/>`),
  copy: svg(`<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>`)
};
