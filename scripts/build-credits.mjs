// Erzeugt public/bildnachweise.html und public/img/q/QUELLEN.md aus public/img/q/credits.json.
// Aufruf: node scripts/build-credits.mjs
import { readFileSync, writeFileSync } from "node:fs";

const rows = JSON.parse(readFileSync("public/img/q/credits.json", "utf8"));
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const LIC = {
  cc0: ["CC0 1.0", "https://creativecommons.org/publicdomain/zero/1.0/"],
  pdm: ["Public Domain Mark", "https://creativecommons.org/publicdomain/mark/1.0/"],
  by: ["CC BY", "https://creativecommons.org/licenses/by/"],
  "by-sa": ["CC BY-SA", "https://creativecommons.org/licenses/by-sa/"]
};
const lic = r => {
  const [name, url] = LIC[r.license] ?? [r.license, ""];
  const v = r.version && !["cc0", "pdm"].includes(r.license) ? ` ${r.version}` : "";
  return { name: name + v, url: url && v ? `${url}${r.version}/` : url };
};

const items = rows.map(r => {
  const l = lic(r);
  return `<li><img src="/img/q/${esc(r.file)}" alt="" loading="lazy"><div><b>${esc(r.title || r.file)}</b><br>
    ${r.creator ? `Foto: ${esc(r.creator)} · ` : ""}<a href="${esc(l.url)}" rel="noopener">${esc(l.name)}</a> · <a href="${esc(r.source)}" rel="noopener">Quelle</a>
    ${r.license.startsWith("by") ? "<br><small>Zugeschnitten und verkleinert.</small>" : ""}</div></li>`;
}).join("\n");

writeFileSync("public/bildnachweise.html", `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bildnachweise · Typ-Test</title>
<style>
body { margin: 0; background: #1d2026; color: #f3f4f6; font: 15px/1.5 system-ui, sans-serif; padding: 24px max(16px, env(safe-area-inset-left)) 48px }
main { max-width: 640px; margin: 0 auto }
a { color: #f3f4f6 } h1 { font-size: 22px; margin: 0 0 8px } p { opacity: .8 }
ul { list-style: none; padding: 0; display: grid; gap: 12px }
li { display: flex; gap: 12px; align-items: center; background: rgba(255,255,255,.06); border-radius: 10px; padding: 8px }
li img { width: 64px; height: 64px; object-fit: cover; border-radius: 6px; flex: none }
li div { min-width: 0; overflow-wrap: anywhere }
</style></head><body><main>
<p><a href="/">← Zurück zum Test</a></p>
<h1>Bildnachweise</h1>
<p>Alle Fotos stammen über openverse.org aus freien Quellen (Flickr, Wikimedia Commons u. a.). Bei CC BY und CC BY-SA ist der Urheber genannt.</p>
<ul>
${items}
</ul></main></body></html>
`);

writeFileSync("public/img/q/QUELLEN.md", `# Bildquellen

Erzeugt aus \`credits.json\` mit \`node scripts/build-credits.mjs\`. Öffentlich unter /bildnachweise.html.

| Datei | Lizenz | Titel | Urheber | Quelle |
|---|---|---|---|---|
${rows.map(r => `| ${r.file} | ${lic(r).name} | ${String(r.title ?? "").replace(/\|/g, "/").slice(0, 60)} | ${String(r.creator ?? "").replace(/\|/g, "/")} | ${r.source} |`).join("\n")}
`);
console.log(`${rows.length} Bilder`);
