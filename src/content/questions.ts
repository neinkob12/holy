// Fragenkatalog, Quelle: docs/FRAGEN.md. Jede Antwort zählt für genau einen Typ.
import type { TypeKey } from "../../shared/score";

export interface Question {
  id: string;
  text: string;
  /** Fragen derselben Gruppe kommen nie zusammen in einen Test. */
  group?: string;
  answers: Record<TypeKey, string>;
  /** Bildfrage: je Antwort ein Foto, angezeigt als 2x2-Kacheln. */
  images?: Record<TypeKey, string>;
}

export const QUESTIONS: Question[] = [
  { id: "A01", text: "Welcher Haarschnitt bist du?", answers: { chad: "Mittellang, locker nach hinten (Flow)", alpha: "Frischer Skin Fade, scharfe Konturen", soy: "Ganz normaler Standard-Kurzhaarschnitt", gooner: "Zottelig, mit etwas Haarausfall" } },
  { id: "A02", text: "Welches Outfit ziehst du an?", answers: { chad: "Anzug", alpha: "Designer-Outfit mit Gucci-Cap", soy: "Weißes Shirt, Jeans, lange Stofftasche", gooner: "Hoodie und Jogginghose" } },
  { id: "A03", text: "Welche Schuhe würdest du anziehen?", answers: { chad: "Elegante Lederschuhe", alpha: "Limitierte Designer-Sneaker", soy: "Graue New Balance", gooner: "Badelatschen mit Socken" } },
  { id: "A04", text: "Welcher Bart?", answers: { chad: "3-Tage-Bart", alpha: "Getrimmter Vollbart mit Übergang", soy: "Nur Schnauzer", gooner: "Flaum" } },
  { id: "A05", text: "Dein Profilbild?", group: "fortbewegung", answers: { chad: "Du im Auto am Fahren", alpha: "Du im AMG", soy: "Du auf dem Fahrrad", gooner: "Du auf dem E-Roller oder im Bus" } },
  { id: "Q01", text: "Welche Kippen rauchst du?", answers: { chad: "Keine", alpha: "Marlboro Rot", soy: "Iqos", gooner: "Vape" } },
  { id: "Q02", text: "Welche Automarke am ehesten?", group: "fortbewegung", answers: { chad: "BMW", alpha: "Mercedes", soy: "Tesla", gooner: "Monstertruck" } },
  { id: "Q03", text: "Welches Gericht am ehesten?", group: "essen", answers: { chad: "Geiles Steak, medium", alpha: "Fast rohes Steak", soy: "Poke Bowl", gooner: "Pizza" } },
  { id: "Q04", text: "Welchen Sport am ehesten?", group: "hobbys", answers: { chad: "Schwimmen", alpha: "Kampfsport", soy: "Handball", gooner: "E-Sport" } },
  { id: "Q05", text: "Welcher Urlaubsort?", answers: { chad: "Ibiza", alpha: "Dubai", soy: "Bali", gooner: "Japan" } },
  { id: "Q06", text: "Wo kaufst du ein?", answers: { chad: "Rewe", alpha: "Immer Restaurant", soy: "Bio-Markt", gooner: "Kiosk" } },
  { id: "Q07", text: "Deine Rolle im Gruppenprojekt?", answers: { chad: "Hat die Ideen", alpha: "Kommandiert", soy: "Schreibt mit", gooner: "„Welches Gruppenprojekt?“" } },
  { id: "Q09", text: "Wo verbringst du am meisten Zeit?", group: "apps", answers: { chad: "Claude", alpha: "Instagram", soy: "TikTok", gooner: "Reddit" } },
  { id: "Q10", text: "Welches Spaßgetränk am liebsten?", answers: { chad: "Wasser", alpha: "Coke Zero", soy: "Matcha Latte", gooner: "Monster" } },
  { id: "Q11", text: "Das kaufst du beim Kiosk:", answers: { chad: "Kokoswasser", alpha: "Kippen", soy: "Snickers", gooner: "Haribo" } },
  { id: "Q12", text: "Hier schreibst du deinem Akh:", answers: { chad: "iMessage", alpha: "WhatsApp", soy: "Signal", gooner: "Discord" } },
  { id: "Q13", text: "Der Kontrolleur kommt, du hast kein Ticket.", answers: { chad: "Nichts sagen, einfach weitergehen", alpha: "Diskutieren", soy: "Bezahlen", gooner: "Tut so, als ob er schläft" } },
  { id: "Q14", text: "Wer ist dein Idol?", answers: { chad: "Du selbst", alpha: "Ronaldo", soy: "Christian Wolff", gooner: "Monte" } },
  { id: "Q15", text: "Welche Musik hörst du am liebsten?", answers: { chad: "House", alpha: "Rap", soy: "RnB", gooner: "Phonk" } },
  { id: "Q16", text: "Das nimmst du aus der Backwarenabteilung:", group: "essen", answers: { chad: "Nichts", alpha: "Schokocroissant", soy: "Belegtes Brötchen", gooner: "Pizzastück" } },
  { id: "Q17", text: "Was spielst du am liebsten? 🎮", answers: { chad: "Schach", alpha: "UFC", soy: "FIFA", gooner: "Valorant" } },
  { id: "Q18", text: "Was machst du im Unterricht?", answers: { chad: "Nicht da", alpha: "Macht Quatsch", soy: "Hört zu", gooner: "Am Handy" } },
  { id: "Q19", text: "Was machst du am Wochenende?", answers: { chad: "Kurzurlaub", alpha: "Club", soy: "Mit Freundin zuhause", gooner: "Zocken" } },
  { id: "Q20", text: "Wie kommst du von A nach B?", group: "fortbewegung", answers: { chad: "Uber", alpha: "AMG, selbst gefahren", soy: "Fahrrad", gooner: "E-Roller" } },
  { id: "Q21", text: "Wie schnell antwortest du?", answers: { chad: "1 Tag", alpha: "Mindestens 15 Minuten", soy: "Sofort", gooner: "Schreibt zuerst" } },
  { id: "Q22", text: "Was machst du an Silvester?", answers: { chad: "Champagner", alpha: "Böllern", soy: "Mit dem Hund", gooner: "Zocken" } },
  { id: "Q23", text: "Deine Bildschirmzeit pro Tag?", answers: { chad: "Unter 1 Stunde", alpha: "7 Stunden", soy: "3 Stunden", gooner: "Mehr als 7 Stunden" } },
  { id: "Q24", text: "Was sind deine Hobbys?", group: "hobbys", answers: { chad: "Sport", alpha: "Auto fahren", soy: "Lesen", gooner: "Zocken" } },
  { id: "Q25", text: "Zuletzt benutzte App?", group: "apps", answers: { chad: "Wetter", alpha: "Tinder", soy: "Vinted", gooner: "Inkognito-Tab" } },
  { id: "Q26", text: "Alkoholisches Getränk deiner Wahl?", answers: { chad: "Bier", alpha: "Jacky-Cola (Dose)", soy: "Radler", gooner: "Vodka-E" } },
  { id: "Q27", text: "Jemand drängelt sich vor. Was machst du?", answers: { chad: "Lacht und stellt sich wieder davor", alpha: "Regt sich auf und geht davor", soy: "Bleibt ruhig", gooner: "Bestellt online (war nie im Supermarkt)" } },
  { id: "Q28", text: "Du findest 1000 Euro in einem Portemonnaie.", answers: { chad: "Bringst es zurück", alpha: "Neue Klamotten kaufen", soy: "Geld spenden", gooner: "An einem Tag ausgeben" } },
  { id: "Q29", text: "Wann stehst du auf?", answers: { chad: "9:00", alpha: "5:30", soy: "10:00", gooner: "14:00" } },
  { id: "N02", text: "Welches Handy hast du?", answers: { chad: "iPhone, ohne Hülle", alpha: "Neuestes iPhone Pro Max", soy: "Refurbished", gooner: "Samsung" } },
  { id: "N03", text: "Welches Parfum?", answers: { chad: "Bleu de Chanel", alpha: "Creed Aventus", soy: "Dior Sauvage, wie alle", gooner: "Axe" } },
  { id: "N04", text: "Welcher Film?", group: "filme", answers: { chad: "James Bond", alpha: "Scarface", soy: "Harry Potter", gooner: "Ein Anime-Film" } },
  { id: "N05", text: "Welche Serie?", group: "filme", answers: { chad: "Suits", alpha: "Peaky Blinders", soy: "Friends", gooner: "One Piece" } },
  { id: "N06", text: "Was trinkst du morgens?", answers: { chad: "Espresso", alpha: "Pre-Workout", soy: "Hafer-Cappuccino", gooner: "Cola vom Vortag" } },
  { id: "N07", text: "Erstes Date, wohin?", answers: { chad: "Rooftop-Bar", alpha: "Shisha-Bar", soy: "Café", gooner: "Discord-Call" } },
  { id: "N09", text: "Wie trainierst du im Gym?", answers: { chad: "Full Body", alpha: "Brust", soy: "Cardio", gooner: "Ist nicht da" } },
  { id: "N15", text: "Welches Haustier?", answers: { chad: "Golden Retriever", alpha: "Rottweiler", soy: "Katze", gooner: "Hamster" } },
  { id: "N16", text: "Wie bezahlst du?", answers: { chad: "Apple Pay", alpha: "Bargeld aus der Rolle", soy: "Mit Münzen", gooner: "PayPal von Mama" } }
];

/** Fragen mit Fotos (gemeinfrei, Quellen in public/img/q/QUELLEN.md). */
export const IMAGE_QUESTIONS: string[] = [];

for (const q of QUESTIONS) {
  if (IMAGE_QUESTIONS.includes(q.id)) {
    q.images = { chad: `/img/q/${q.id}-chad.jpg`, alpha: `/img/q/${q.id}-alpha.jpg`, soy: `/img/q/${q.id}-soy.jpg`, gooner: `/img/q/${q.id}-gooner.jpg` };
  }
}
