import "./styles.css";
import type { Mode } from "../shared/score";
import { TYPE_KEYS, scorePicks, spotOf } from "../shared/score";
import type { ResultView } from "../shared/view";
import { S } from "./content/strings";
import { TYPES } from "./content/results";
import { createResult, readResult, recordVisit } from "./app/api";
import { app, esc, setScene, stage, sweep, toast } from "./app/dom";
import { getRef, myResults, rememberResult, setRef } from "./app/local";
import { runQuiz } from "./app/quiz";
import { showWrapped } from "./app/wrapped";

const ID_PATH = /^\/r\/([a-z2-9]{8})\/?$/;

const modeButtons = (d: number) => `<div class="modes" style="--d:${d}">
  <button class="mode primary" data-mode="short"><b>${S.modeShort}</b><span>${S.modeShortSub}</span></button>
  <button class="mode" data-mode="long"><b>${S.modeLong}</b><span>${S.modeLongSub}</span></button></div>`;

function bindModes(): void {
  stage().onclick = e => {
    const mode = (e.target as HTMLElement).closest<HTMLElement>("[data-mode]")?.dataset.mode as Mode | undefined;
    if (mode) { stage().onclick = null; void play(mode); }
  };
}

function start(): void {
  delete app().dataset.type;
  stage();
  setScene(0);
  stage().innerHTML = `<section class="screen">
    <h1 class="title">${TYPE_KEYS.map(k => `<span class="t ${k}">${TYPES[k].name}${k === "gooner" ? "?" : ""}</span>`).join("")}</h1>
    <p class="small" style="--d:1">${S.startLead}</p>
    ${modeButtons(2)}
    <p class="fine" style="--d:3">${S.disclaimer}</p></section>`;
  bindModes();
}

/** Jemand hat einen fremden Link geöffnet: Besuch zählen, Typ zeigen, Test anbieten. */
async function landing(id: string): Promise<void> {
  const [view] = await Promise.all([readResult(id), recordVisit(id)]);
  if (!view) { history.replaceState(null, "", "/"); start(); return; }
  setRef(id);
  app().dataset.type = view.type;
  setScene(3);
  stage().innerHTML = `<section class="screen">
    <p class="small">${S.landingLead}</p>
    <p class="huge" style="--delay:.3s">${esc(TYPES[view.type].name)}</p>
    <p class="big disp" style="--d:6">${S.landingQ}</p>
    ${modeButtons(7)}</section>`;
  bindModes();
}

async function play(mode: Mode): Promise<void> {
  delete app().dataset.type;
  sweep();
  const picks = await runQuiz(mode);
  setScene(5);
  stage().innerHTML = `<section class="screen center"><div class="loading"><div class="spinner"></div><p class="small">${S.evaluating}</p></div></section>`;
  const ref = getRef();
  const [created] = await Promise.all([createResult(picks, ref), new Promise(r => setTimeout(r, 1200))]);
  if (created) {
    rememberResult(created.id);
    history.pushState(null, "", `/r/${created.id}`);
    const view = await readResult(created.id);
    if (view) { sweep(); showWrapped(view, restart); return; }
  }
  // Server nicht erreichbar: Ergebnis nur lokal zeigen, dann eben direkt freigeschaltet
  const { type, split } = scorePicks(picks);
  const local: ResultView = { id: "", type, n: picks.length, isOwner: true, unlocked: true, spot: spotOf(split), split, friends: [] };
  toast(S.offline);
  sweep();
  showWrapped(local, restart);
}

function restart(): void {
  history.pushState(null, "", "/");
  sweep();
  start();
}

async function route(): Promise<void> {
  const m = ID_PATH.exec(location.pathname);
  if (!m) { start(); return; }
  const id = m[1];
  if (myResults().includes(id)) {
    const view = await readResult(id);
    if (view?.isOwner) { showWrapped(view, restart); return; }
  }
  await landing(id);
}

window.addEventListener("popstate", () => { void route(); });
void route();
