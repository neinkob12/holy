import type { TypeKey } from "../../shared/score";
import { S } from "../content/strings";
import { TYPES } from "../content/results";

const W = 1080, H = 1920;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxW && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Story-Bild im Anthrazit-Look: Typ groß, Spruch, Link. */
export async function storyImage(type: TypeKey, url: string): Promise<Blob> {
  await document.fonts.ready;
  const t = TYPES[type];
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d") as CanvasRenderingContext2D;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#1d2026"); bg.addColorStop(1, "#2e323b");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W * 0.2, H * 0.12, 0, W * 0.2, H * 0.12, 700);
  glow.addColorStop(0, "rgba(255,255,255,.12)"); glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(243,244,246,.14)"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(W + 80, 220, 620, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([18, 18]);
  ctx.beginPath(); ctx.arc(-60, H - 120, 420, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);

  const x = 96;
  ctx.fillStyle = "#f3f4f6";
  ctx.font = "800 64px Manrope, sans-serif";
  ctx.fillText(S.storyHeadline, x, 640);

  let size = 230;
  ctx.font = `900 ${size}px Unbounded, sans-serif`;
  while (ctx.measureText(t.name).width > W - 2 * x && size > 120) { size -= 6; ctx.font = `900 ${size}px Unbounded, sans-serif`; }
  const ng = ctx.createLinearGradient(0, 700, 0, 700 + size);
  ng.addColorStop(0, "#ffffff"); ng.addColorStop(0.15, t.color); ng.addColorStop(1, t.color);
  ctx.save();
  ctx.shadowColor = t.color; ctx.shadowBlur = 80;
  ctx.fillStyle = ng;
  ctx.fillText(t.name, x, 700 + size * 0.82);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.font = "900 62px Unbounded, sans-serif";
  let y = 1130;
  for (const line of wrap(ctx, `„${t.quote}“`, W - 2 * x)) { ctx.fillText(line, x, y); y += 84; }

  ctx.fillStyle = "#f3f4f6";
  ctx.font = "800 58px Manrope, sans-serif";
  ctx.fillText(S.storyCta, x, H - 300);
  ctx.globalAlpha = 0.75;
  ctx.font = "600 44px Manrope, sans-serif";
  ctx.fillText(url.replace(/^https?:\/\//, ""), x, H - 220);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) => c.toBlob(b => (b ? resolve(b) : reject(new Error("Bild fehlgeschlagen"))), "image/png"));
}
