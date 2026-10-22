# Typ-Test: Chad, Alpha, SoyBoy oder Gooner?

Handy-Webseite: 10 oder 36 Fragen, danach das Ergebnis als Story zum Durchtippen.
Die Prozente schalten sich frei, sobald jemand den persönlichen Link auf einem anderen Gerät öffnet.

## Lokal starten

```bash
npm install
npm run dev      # http://localhost:5173, die API läuft lokal im Arbeitsspeicher mit
npm run check    # Typen, Tests, Build. Grün oder nicht pushen.
```

## Auf Vercel bringen

1. Auf vercel.com: **Add New → Project**, das Repo `holy` importieren. Vite wird automatisch erkannt, sonst nichts einstellen.
2. Im Projekt: **Storage → Create Database → Upstash for Redis** (Free Plan) und mit dem Projekt verbinden.
   Vercel legt dabei `KV_REST_API_URL` und `KV_REST_API_TOKEN` an. Die API liest diese automatisch.
3. **Deployments → Redeploy**, damit die neuen Variablen greifen.
4. Testen: Test am Handy machen, Link an ein zweites Gerät schicken und dort öffnen. Auf dem ersten Handy schalten sich die Prozente nach ein paar Sekunden frei.

Ohne Upstash läuft die Seite trotzdem, zeigt das Ergebnis dann aber nur auf dem eigenen Handy und ohne Freischalten.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `src/` | Oberfläche (Vite + TypeScript, kein Framework) |
| `src/content/` | Fragen, Ergebnistexte, alle sichtbaren Texte |
| `shared/` | Auswertung, läuft im Browser und auf dem Server gleich |
| `api/` | Vercel Functions: `/api/result` (anlegen, lesen), `/api/visit` (Besuch zählen) |
| `docs/` | Konzept, Fragenkatalog, Ergebnistexte |
| `prototypes/` | Design-Entwürfe der Ergebnisseite |

Daten in Redis, alles läuft nach 180 Tagen ab:
`res:<id>` Ergebnis, `vis:<id>` Geräte, die den Link geöffnet haben, `fr:<id>` Ergebnisse von Freunden über diesen Link.
