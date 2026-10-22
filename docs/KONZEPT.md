# Typ-Test: Chad, Alpha, SoyBoy oder Gooner

Halb ernster Persönlichkeitstest auf Deutsch für Jungs von 16 bis 25. Webseite, am Handy im Browser.

## Entscheidungen

| Thema | Entscheidung |
|---|---|
| Ton | Halb ernst: lustig verpackt, Ergebnis kurz, keine Tipps |
| Sprache | Jugendsprache und Memes |
| Plattform | Eigene Webseite auf Vercel, erstmal Vercel-Adresse |
| Tests | Schnell: 10 Fragen (ca. 2 Min). Lang: 40 Fragen (ca. 8 Min) |
| Antwortformat | 4 Antworten pro Frage, jede gibt Punkte für genau einen Typ. Reihenfolge wird gemischt |
| Themen | Aussehen und Kleidung, Dating, Bildschirmzeit und Internet, Konflikte, Geld, Freunde. Gym nur als Bonus |
| Bildfragen | Einige Fragen mit 4 Bildern statt Text, z.B. Haarschnitt, Outfit, Schuhe, Bart. Bilder kommen später (Illustrationen im gleichen Stil) |
| Gooner | Jugendfrei angedeutet: zu viel Internet, Nachtmensch, keine Disziplin. Nichts Explizites |
| Ergebnis | Haupttyp groß. Der volle Prozent-Split ist verschwommen, bis jemand deinen Link öffnet |
| Ergebnistext | Kurz, ein Spruch plus ein paar Zeilen, ohne Tipps |
| Vergleich | Du siehst, welche Typen deine Freunde sind, die über deinen Link kamen |
| Design | 3 Entwürfe zum Vergleichen: Clean und hell, Trading Card, Spotify-Wrapped-Stil |

## Die 4 Typen

- **Chad**: mühelos selbstbewusst, entspannt, Aura ohne Anstrengung.
- **Alpha**: dominant, Hustle, Kontrolle, Wettbewerb, laut.
- **SoyBoy**: übertrieben lieb, konfliktscheu, Fandom und Konsum, Mund offen auf Fotos.
- **Gooner**: lebt am Bildschirm, nachtaktiv, Zimmer mit Rollladen unten, null Disziplin.

## Freischalten durch echtes Teilen

Ein Teilen-Knopf allein lässt sich nicht prüfen. Darum:

1. Nach dem Test bekommt das Ergebnis eine eigene Kennung, z.B. `/r/k7x2p9`.
2. Geteilt wird dieser Link (Teilen-Menü vom Handy, Story-Bild 9:16 mit Link, Link kopieren).
3. Öffnet jemand den Link auf einem **anderen Gerät**, zählt ein Besuch. Ein Besuch reicht, dann ist der volle Split frei.
4. Die Ergebnisseite fragt regelmäßig nach und schaltet live frei.
5. Macht der Besucher selbst den Test, taucht sein Typ in deiner Freundesliste auf.

Gerät erkennen: zufällige Geräte-ID im Browser-Speicher. Eigener Link auf eigenem Gerät zählt nicht. Wer mit Inkognito schummelt, schummelt halt (bewusst so entschieden).

## Technik (Vorschlag)

- Vite + TypeScript, eine Seite, keine schwere Bibliothek.
- Vercel Functions als API, Upstash Redis (Free Plan) als Speicher.
- Redis-Schlüssel: `result:<id>` (Typ, Split, Geräte-ID), `visits:<id>` (Set mit Geräte-IDs), `friends:<id>` (Ergebnis-IDs der Freunde).
- Story-Bild wird im Browser per Canvas erzeugt.

## Reihenfolge

1. Fragenkatalog aussortieren (`docs/FRAGEN.md`). **Jetzt dran.**
2. Ergebnistexte für die 4 Typen.
3. 3 Design-Entwürfe der Ergebnisseite.
4. Test-Ablauf bauen.
5. Teilen und Freischalten mit Upstash.
6. Deployment auf Vercel.
