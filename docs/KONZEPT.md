# Typ-Test: Chad, Alpha, SoyBoy oder Gooner

Halb ernster Persönlichkeitstest auf Deutsch für Jungs von 16 bis 25. Webseite, am Handy im Browser.

## Entscheidungen

| Thema | Entscheidung |
|---|---|
| Ton | Halb ernst: lustig verpackt, Ergebnis kurz, keine Tipps |
| Sprache | Jugendsprache und Memes |
| Plattform | Eigene Webseite auf Vercel, erstmal Vercel-Adresse |
| Tests | Schnell: 10 Fragen (ca. 2 Min). Lang: 36 Fragen (ca. 7 Min) |
| Antwortformat | 4 Antworten pro Frage, jede gibt Punkte für genau einen Typ. Reihenfolge wird gemischt |
| Themen | Aussehen und Kleidung, Dating, Bildschirmzeit und Internet, Konflikte, Geld, Freunde. Gym nur als Bonus |
| Bildfragen | 13 Fragen mit 4 Fotos als 2x2-Kacheln. Freie Fotos (CC0, Public Domain, CC BY, CC BY-SA) über Openverse, Nachweise unter /bildnachweise.html |
| Gooner | Jugendfrei angedeutet: zu viel Internet, Nachtmensch, keine Disziplin. Nichts Explizites |
| Ergebnis | Haupttyp groß. Der volle Prozent-Split ist verschwommen, bis jemand deinen Link öffnet |
| Ergebnistext | Kurz, ein Spruch plus ein paar Zeilen, ohne Tipps |
| Vergleich | Du siehst, welche Typen deine Freunde sind, die über deinen Link kamen |
| Design | Wrapped-Story in Anthrazit, Karte als Viereck ohne Füllung (Entwürfe in `prototypes/`) |

## Die 4 Typen

- **Chad**: stilvoll, entspannt, souverän. Anzug, BMW, Steak medium, Kurzurlaub, Champagner. Sein Idol ist er selbst.
- **Alpha**: laut und protzig. Gucci-Cap, AMG, Marlboro Rot, Dubai, Rap, Club, Kampfsport.
- **SoyBoy**: Standard und zurückhaltend, eher unterwürfig und langweilig. Normale Haare, weißes Shirt, Jeans, Stofftasche, Fahrrad, Radler, Bio-Markt.
- **Gooner**: zockt nur, viel Bildschirmzeit, macht mit niemandem was, hängt vor dem PC. Zottelige Haare mit etwas Ausfall, Discord, Reddit, Monster, E-Roller.

Antworten nicht zu extrem formulieren. Jede Antwort soll so klingen, dass sich jemand wirklich dafür entscheiden würde.

## Freischalten durch echtes Teilen

Ein Teilen-Knopf allein lässt sich nicht prüfen. Darum:

1. Nach dem Test bekommt das Ergebnis eine eigene Kennung, z.B. `/r/k7x2p9`.
2. Geteilt wird dieser Link (Teilen-Menü vom Handy, Story-Bild 9:16 mit Link, Link kopieren).
3. Öffnet jemand den Link auf einem **anderen Gerät**, zählt ein Besuch. Ein Besuch reicht, dann ist der volle Split frei.
4. Die Ergebnisseite fragt regelmäßig nach und schaltet live frei.
5. Macht der Besucher selbst den Test, taucht sein Typ in deiner Freundesliste auf.

Gerät erkennen: zufällige Geräte-ID im Browser-Speicher. Eigener Link auf eigenem Gerät zählt nicht. Wer mit Inkognito schummelt, schummelt halt (bewusst so entschieden).

## Technik

- Vite + TypeScript, eine Seite, kein Framework.
- Vercel Functions als API, Upstash Redis (Free Plan) als Speicher.
- Redis-Schlüssel: `res:<id>` (Typ, Split, Geräte-ID), `vis:<id>` (Set mit Geräte-IDs), `fr:<id>` (Ergebnis-IDs der Freunde).
- Story-Bild wird im Browser per Canvas erzeugt.

## Reihenfolge

1. Fragenkatalog (`docs/FRAGEN.md`). Erledigt.
2. Ergebnistexte (`docs/ERGEBNISSE.md`). Erledigt.
3. Design: Wrapped in Anthrazit, Karte als Viereck ohne Füllung. Erledigt.
4. Test, Teilen, Freischalten mit Upstash. Erledigt, siehe `README.md`.
5. Deployment auf Vercel. Erledigt: https://holy-silk.vercel.app
6. Hintergrund wechselt die Szene je Screen, 13 Bildfragen mit Fotos. Erledigt.
7. Offen: Haarschnitt, Outfit, Schuhe, Bart (nur mit Personenfotos oder KI-Bildern machbar).
