// Ergebnistexte, Quelle: docs/ERGEBNISSE.md
import type { TypeKey } from "../../shared/score";

export interface TypeInfo {
  name: string;
  color: string;
  quote: string;
  /** Wörter aus dem Spruch, die markiert werden (genau wie im Spruch geschrieben, mit Satzzeichen). */
  highlight: string[];
  text: string;
}

export const TYPES: Record<TypeKey, TypeInfo> = {
  chad: {
    name: "Chad", color: "#3d6bff",
    quote: "Andere suchen das Rampenlicht. Dich findet es von allein.", highlight: ["Rampenlicht."],
    text: "Wenn du einen Raum betrittst, wird es kurz still. Nicht weil du laut bist, sondern weil alle spüren, dass gerade jemand angekommen ist. Du jagst nichts hinterher. Die Dinge kommen zu dir, und du entscheidest in aller Ruhe, was davon bleiben darf. Andere nennen das Glück. Für dich ist es ein ganz normaler Tag."
  },
  alpha: {
    name: "Alpha", color: "#ff3b3b",
    quote: "Andere warten auf ihre Chance. Du nimmst sie dir.", highlight: ["nimmst"],
    text: "Du bist nicht Teil der Gruppe. Du bist der Grund, warum es sie gibt. Jeder Raum ist ein Revier, jedes Gespräch ein Duell, jeder Tag eine Schlacht, die gewonnen werden will. Ruhe kennst du nur vom Hörensagen. Und genau deshalb vergisst niemand deinen Namen. Ob er will oder nicht."
  },
  soy: {
    name: "SoyBoy", color: "#3fae7c",
    quote: "Die Welt braucht Helden. Und jemanden, der danach aufräumt.", highlight: ["aufräumt."],
    text: "Du bist der, der bleibt, wenn alle anderen längst gegangen sind. Kein Drama, kein Risiko, keine Szene. Während andere Geschichte schreiben, liest du sie. Leise, pünktlich, gewissenhaft. Es gibt niemanden, auf den man sich mehr verlassen kann. Es gibt nur leider auch niemanden, der es bemerkt."
  },
  gooner: {
    name: "Gooner", color: "#9a5cff",
    quote: "Die Welt dreht sich weiter. Nur eben ohne dich.", highlight: ["ohne", "dich."],
    text: "Irgendwo hinter verschlossenen Rollläden brennt ein einsames Licht. Dort sitzt du. Tage verschwimmen, Nächte werden zu Morgen, und die Welt da draußen ist nur noch ein Gerücht. Du hast dir dein eigenes Reich gebaut. Es ist klein, es ist dunkel, und niemand kommt rein. Genau so, wie du es willst."
  }
};
