import type { Mode, TypeKey } from "../../shared/score";
import { QUESTIONS, type Question } from "../content/questions";
import { S } from "../content/strings";
import { esc, setScene, stage, sweep } from "./dom";
import { answerOrder, selectQuestions } from "./select";

/** Fragt alle Fragen nacheinander ab und gibt die gewählten Typen zurück. */
export function runQuiz(mode: Mode): Promise<TypeKey[]> {
  const questions = selectQuestions(QUESTIONS, mode);
  const orders = questions.map(() => answerOrder());
  const picks: TypeKey[] = [];
  let busy = false;

  return new Promise(resolve => {
    const paint = () => {
      const i = picks.length;
      const q = questions[i];
      const n = questions.length;
      setScene(i + 2);
      stage().innerHTML = `<section class="screen quiz">
        <div class="qtop">
          <div class="progress" aria-hidden="true"><i style="width:${(i / n) * 100}%"></i></div>
          <div class="qmeta"><span>${S.questionOf(i + 1, n)}</span>${i > 0 ? `<button class="link" data-back>${S.back}</button>` : ""}</div>
        </div>
        <div class="qbody">
          <h2 class="qtext">${esc(q.text)}</h2>
          <div class="answers${q.images ? " tiles" : ""}">${orders[i].map((k, j) => q.images
            ? `<button class="answer tile" data-pick="${k}" style="--i:${j}"><img src="${q.images[k]}" alt="" loading="eager" decoding="async"><span>${esc(q.answers[k])}</span></button>`
            : `<button class="answer" data-pick="${k}" style="--i:${j}">${esc(q.answers[k])}</button>`).join("")}</div>
        </div>
      </section>`;
      busy = false;
    };

    stage().onclick = e => {
      const t = e.target as HTMLElement;
      if (busy) return;
      if (t.closest("[data-back]")) { picks.pop(); sweep(); paint(); return; }
      const btn = t.closest<HTMLButtonElement>("[data-pick]");
      if (!btn) return;
      busy = true;
      btn.classList.add("picked");
      picks.push(btn.dataset.pick as TypeKey);
      window.setTimeout(() => {
        if (picks.length === questions.length) { stage().onclick = null; resolve(picks); return; }
        sweep();
        paint();
      }, 260);
    };
    paint();
    preload(questions.slice(1));
  });
}

/** Bilder der nächsten Fragen schon mal laden, damit die Kacheln sofort da sind. */
function preload(qs: Question[]): void {
  for (const q of qs) if (q.images) for (const src of Object.values(q.images)) { const img = new Image(); img.src = src; }
}
