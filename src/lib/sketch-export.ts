import { formatSketchTime, type SavedSketch } from "@/lib/sketch-types";

export interface ExportSketchesOptions {
  sketches: ReadonlyArray<SavedSketch>;
  videoTitle?: string;
}

const EXPORT_WIDTH = 960;
const TARGET_EXPORT_SCALE = 2;
const OUTER_PAD = 24;
const INNER_STITCH_PAD = 36;
const CONTENT_LEFT = 68;
const CONTENT_WIDTH = EXPORT_WIDTH - CONTENT_LEFT * 2;
const CARD_PAD_X = 22;
const CARD_PAD_TOP = 18;
const CARD_PAD_BOTTOM = 22;
const INFO_ROW_HEIGHT = 44;
const INFO_TO_IMAGE_GAP = 14;
const IMAGE_SLOT_WIDTH = CONTENT_WIDTH - CARD_PAD_X * 2;
const MAX_SINGLE_IMAGE_HEIGHT = 640;
const HEADER_HEIGHT = 206;
const HEADER_BOTTOM_GAP = 22;
const SEPARATOR_HEIGHT = 68;
const FOOTER_HEIGHT = 76;

const MAX_CANVAS_HEIGHT = 16000;
const MAX_CANVAS_AREA = 36000000;
const FALLBACK_CANVAS_AREA = 15500000;

const DISPLAY_FONT = '"Fredoka", "Nunito", ui-rounded, "Comic Sans MS", sans-serif';
const MONO_FONT = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

interface MeasuredCard {
  sketch: SavedSketch;
  image: HTMLImageElement | null;
  drawWidth: number;
  drawHeight: number;
  cardHeight: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (maxWidth <= 0) return "";
  if (ctx.measureText(text).width <= maxWidth) return text;

  const ellipsis = "…";
  let low = 0;
  let high = text.length;

  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const candidate = `${text.slice(0, mid).trimEnd()}${ellipsis}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return low <= 0 ? ellipsis : `${text.slice(0, low).trimEnd()}${ellipsis}`;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function waitForFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.race([
      document.fonts.ready,
      new Promise<void>((resolve) => window.setTimeout(resolve, 1200)),
    ]);
  } catch {
    // Proceed with fallback fonts if document.fonts is unavailable.
  }
}

function drawFourPointStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  fill: string,
  stroke?: string,
): void {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    const radius = i % 2 === 0 ? outerR : innerR;
    const px = cx + Math.cos(angle) * radius;
    const py = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  ctx.restore();
}

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  width: number,
  angleRad: number,
  fill = "#6E9A3E",
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleRad);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.5, -width, length, 0);
  ctx.quadraticCurveTo(length * 0.5, width, 0, 0);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = "#3F611E";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(length * 0.12, 0);
  ctx.lineTo(length * 0.78, 0);
  ctx.strokeStyle = "#D9F99D";
  ctx.lineWidth = 0.9;
  ctx.stroke();
  ctx.restore();
}

function drawSunflowerGlyph(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale = 1,
): void {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  for (let i = 0; i < 12; i += 1) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 6);
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.bezierCurveTo(-4, -15, -4.5, -21, 0, -23);
    ctx.bezierCurveTo(4.5, -21, 4, -15, 0, -10);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? "#FBBF24" : "#FDE047";
    ctx.fill();
    ctx.strokeStyle = "#845318";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, 11.5, 0, Math.PI * 2);
  ctx.fillStyle = "#D97706";
  ctx.fill();
  ctx.strokeStyle = "#6A3F12";
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
  ctx.fillStyle = "#78350F";
  ctx.fill();
  ctx.restore();
}

function drawLadybugGlyph(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.translate(cx, cy);

  // Legs
  ctx.strokeStyle = "#2E1C12";
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  for (const offset of [-6, 0, 6]) {
    ctx.beginPath();
    ctx.moveTo(offset, -8);
    ctx.lineTo(offset + (offset < 0 ? -3 : offset > 0 ? 3 : 0), -13);
    ctx.moveTo(offset, 8);
    ctx.lineTo(offset + (offset < 0 ? -3 : offset > 0 ? 3 : 0), 13);
    ctx.stroke();
  }

  // Red spotted shell
  ctx.beginPath();
  ctx.ellipse(-1, 0, 12.5, 9.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#DE2B2B";
  ctx.fill();
  ctx.strokeStyle = "#2E1C12";
  ctx.lineWidth = 1.7;
  ctx.stroke();

  // Center wing seam
  ctx.beginPath();
  ctx.moveTo(-13, 0);
  ctx.lineTo(8, 0);
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(9.5, 0, 5.2, -Math.PI * 0.55, Math.PI * 0.55);
  ctx.fillStyle = "#231A12";
  ctx.fill();

  // Spots
  ctx.fillStyle = "#231A12";
  for (const [sx, sy, sr] of [
    [-6, -4.5, 1.8],
    [1, -5, 1.9],
    [-6, 4.5, 1.8],
    [1, 5, 1.9],
  ] as const) {
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eyes
  ctx.fillStyle = "#FFFDF7";
  ctx.beginPath();
  ctx.arc(11.5, -2.1, 1.3, 0, Math.PI * 2);
  ctx.arc(11.5, 2.1, 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAcornGlyph(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.translate(cx, cy);

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.quadraticCurveTo(2, -10, 0, -8);
  ctx.strokeStyle = "#4A2A0C";
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.stroke();

  // Nut body
  ctx.beginPath();
  ctx.moveTo(-9, -2);
  ctx.bezierCurveTo(-9, 7, -4, 12, 0, 14);
  ctx.bezierCurveTo(4, 12, 9, 7, 9, -2);
  ctx.closePath();
  ctx.fillStyle = "#F59E0B";
  ctx.fill();
  ctx.strokeStyle = "#4A2A0C";
  ctx.lineWidth = 1.7;
  ctx.stroke();

  // Cap
  ctx.beginPath();
  ctx.ellipse(0, -3.5, 11.5, 5.2, 0, Math.PI, Math.PI * 2);
  ctx.lineTo(11.5, -1.5);
  ctx.quadraticCurveTo(0, 1.5, -11.5, -1.5);
  ctx.closePath();
  ctx.fillStyle = "#78350F";
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawCornerFlourish(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  flipX: 1 | -1,
  flipY: 1 | -1,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX, flipY);
  drawLeaf(ctx, 8, 8, 18, 5.5, 0.25, "#82B34B");
  drawLeaf(ctx, 8, 8, 18, 5.5, 1.25, "#6E9A3E");
  drawFourPointStar(ctx, 8, 8, 7, 2.8, "#FBBF24", "#78350F");
  ctx.restore();
}

function drawBackgroundAndFrame(ctx: CanvasRenderingContext2D, totalHeight: number): void {
  const bg = ctx.createLinearGradient(0, 0, 0, totalHeight);
  bg.addColorStop(0, "#FEF9EE");
  bg.addColorStop(0.5, "#FDF6E9");
  bg.addColorStop(1, "#F7EBD5");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, EXPORT_WIDTH, totalHeight);

  // Soft watercolor washes along page margins
  const washStep = 520;
  for (let wy = 160, idx = 0; wy < totalHeight; wy += washStep, idx += 1) {
    const wx = idx % 2 === 0 ? 110 : EXPORT_WIDTH - 110;
    const rad = ctx.createRadialGradient(wx, wy, 20, wx, wy, 240);
    rad.addColorStop(
      0,
      idx % 3 === 0
        ? "rgba(251, 191, 36, 0.08)"
        : idx % 3 === 1
          ? "rgba(130, 179, 75, 0.07)"
          : "rgba(217, 119, 6, 0.05)",
    );
    rad.addColorStop(1, "rgba(253, 246, 233, 0)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, Math.max(0, wy - 240), EXPORT_WIDTH, 480);
  }

  // Deterministic warm paper grain speckles
  const speckCount = Math.min(2600, Math.round(totalHeight * 0.45));
  for (let i = 0; i < speckCount; i += 1) {
    const sx = seededRandom(i * 3 + 1) * EXPORT_WIDTH;
    const sy = seededRandom(i * 7 + 2) * totalHeight;
    const sr = 0.6 + seededRandom(i * 11 + 3) * 1.1;
    ctx.fillStyle = i % 2 === 0 ? "rgba(120, 53, 15, 0.035)" : "rgba(255, 255, 255, 0.22)";
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer oak book border
  ctx.save();
  drawRoundedRectPath(
    ctx,
    OUTER_PAD,
    OUTER_PAD,
    EXPORT_WIDTH - OUTER_PAD * 2,
    totalHeight - OUTER_PAD * 2,
    28,
  );
  ctx.strokeStyle = "#6E4E28";
  ctx.lineWidth = 4.5;
  ctx.stroke();

  // Inner stitched seam
  drawRoundedRectPath(
    ctx,
    INNER_STITCH_PAD,
    INNER_STITCH_PAD,
    EXPORT_WIDTH - INNER_STITCH_PAD * 2,
    totalHeight - INNER_STITCH_PAD * 2,
    20,
  );
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = "#B4966E";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // Four corner flourishes
  drawCornerFlourish(ctx, INNER_STITCH_PAD + 10, INNER_STITCH_PAD + 10, 1, 1);
  drawCornerFlourish(ctx, EXPORT_WIDTH - INNER_STITCH_PAD - 10, INNER_STITCH_PAD + 10, -1, 1);
  drawCornerFlourish(ctx, INNER_STITCH_PAD + 10, totalHeight - INNER_STITCH_PAD - 10, 1, -1);
  drawCornerFlourish(
    ctx,
    EXPORT_WIDTH - INNER_STITCH_PAD - 10,
    totalHeight - INNER_STITCH_PAD - 10,
    -1,
    -1,
  );
}

function drawStoryHeader(
  ctx: CanvasRenderingContext2D,
  sketchCount: number,
  videoTitle?: string,
): number {
  const centerX = EXPORT_WIDTH / 2;
  const headerTop = OUTER_PAD + 30;

  // Center sunflower emblem with flanking leaves
  drawLeaf(ctx, centerX - 24, headerTop + 40, 26, 7.5, -2.7, "#82B34B");
  drawLeaf(ctx, centerX + 24, headerTop + 40, 26, 7.5, -0.44, "#6E9A3E");
  drawSunflowerGlyph(ctx, centerX, headerTop + 34, 0.96);

  const cleanTitle = videoTitle?.trim();
  const mainTitle = cleanTitle || "My Video Storybook";
  const subtitle = cleanTitle ? "Field Journal Sketchbook" : "Illustrated Video Sketches";

  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.font = `700 32px ${DISPLAY_FONT}`;
  ctx.fillStyle = "#38281A";
  ctx.fillText(truncateText(ctx, mainTitle, CONTENT_WIDTH - 40), centerX, headerTop + 92);

  ctx.font = `600 16px ${DISPLAY_FONT}`;
  ctx.fillStyle = "#78350F";
  ctx.fillText(subtitle, centerX, headerTop + 122);

  // Summary badge pill
  const countLabel = `${sketchCount} ${sketchCount === 1 ? "Sketch" : "Sketches"}`;
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const pillText = `${countLabel}  •  ${dateLabel}`;

  ctx.font = `700 13px ${DISPLAY_FONT}`;
  const pillTextW = ctx.measureText(pillText).width;
  const pillW = pillTextW + 36;
  const pillH = 28;
  const pillX = centerX - pillW / 2;
  const pillY = headerTop + 140;

  drawRoundedRectPath(ctx, pillX, pillY, pillW, pillH, 14);
  ctx.fillStyle = "#F4E8D0";
  ctx.fill();
  ctx.strokeStyle = "#805D35";
  ctx.lineWidth = 1.6;
  ctx.stroke();

  ctx.fillStyle = "#38281A";
  ctx.fillText(pillText, centerX, pillY + pillH / 2 + 0.5);

  // Decorative divider under header
  const lineY = headerTop + HEADER_HEIGHT - 14;
  ctx.beginPath();
  ctx.moveTo(CONTENT_LEFT + 32, lineY);
  ctx.lineTo(centerX - 36, lineY);
  ctx.moveTo(centerX + 36, lineY);
  ctx.lineTo(CONTENT_LEFT + CONTENT_WIDTH - 32, lineY);
  ctx.strokeStyle = "#BCA888";
  ctx.lineWidth = 2;
  ctx.stroke();

  drawFourPointStar(ctx, centerX, lineY, 7.5, 3, "#F59E0B", "#78350F");
  drawFourPointStar(ctx, centerX - 18, lineY, 4.5, 1.8, "#82B34B", "#3F611E");
  drawFourPointStar(ctx, centerX + 18, lineY, 4.5, 1.8, "#82B34B", "#3F611E");
  ctx.restore();

  return headerTop + HEADER_HEIGHT + HEADER_BOTTOM_GAP;
}

function drawClockGlyph(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, 6.2, 0, Math.PI * 2);
  ctx.strokeStyle = "#FDE68A";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy - 3.6);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + 2.8, cy + 1.5);
  ctx.strokeStyle = "#FFFDF7";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.restore();
}

function drawBookGlyph(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ctx.save();
  ctx.strokeStyle = "#3F611E";
  ctx.lineWidth = 1.4;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx, cy - 4);
  ctx.quadraticCurveTo(cx - 4, cy - 6, cx - 7, cy - 4);
  ctx.lineTo(cx - 7, cy + 4.5);
  ctx.quadraticCurveTo(cx - 4, cy + 2.5, cx, cy + 4.5);
  ctx.quadraticCurveTo(cx + 4, cy + 2.5, cx + 7, cy + 4.5);
  ctx.lineTo(cx + 7, cy - 4);
  ctx.quadraticCurveTo(cx + 4, cy - 6, cx, cy - 4);
  ctx.closePath();
  ctx.fillStyle = "#FEF9C3";
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy - 4);
  ctx.lineTo(cx, cy + 4.5);
  ctx.stroke();
  ctx.restore();
}

function drawCornerTapeTab(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  corner: "tl" | "tr" | "bl" | "br",
): void {
  ctx.save();
  ctx.translate(x, y);
  const angle = corner === "tl" ? -0.78 : corner === "tr" ? 0.78 : corner === "bl" ? 0.78 : -0.78;
  ctx.rotate(angle);
  drawRoundedRectPath(ctx, -13, -5, 26, 10, 3);
  ctx.fillStyle = "rgba(244, 232, 208, 0.92)";
  ctx.fill();
  ctx.strokeStyle = "#805D35";
  ctx.lineWidth = 1.3;
  ctx.stroke();
  ctx.restore();
}

function drawSketchCard(
  ctx: CanvasRenderingContext2D,
  card: MeasuredCard,
  index: number,
  total: number,
  cardY: number,
): void {
  const { sketch, image, drawWidth, drawHeight, cardHeight } = card;

  // Card backing with soft book drop shadow
  ctx.save();
  ctx.shadowColor = "rgba(80, 50, 20, 0.14)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 6;
  drawRoundedRectPath(ctx, CONTENT_LEFT, cardY, CONTENT_WIDTH, cardHeight, 22);
  ctx.fillStyle = "#FFFDF7";
  ctx.fill();
  ctx.restore();

  // Card border
  ctx.save();
  drawRoundedRectPath(ctx, CONTENT_LEFT, cardY, CONTENT_WIDTH, cardHeight, 22);
  ctx.strokeStyle = "#BCA888";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Info bar above the sketch
  const rowCenterY = cardY + CARD_PAD_TOP + INFO_ROW_HEIGHT / 2;
  let cursorX = CONTENT_LEFT + CARD_PAD_X;

  // 1. Page number seal
  const sealRadius = 15;
  ctx.beginPath();
  ctx.arc(cursorX + sealRadius, rowCenterY, sealRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#D97706";
  ctx.fill();
  ctx.strokeStyle = "#6A3F12";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 14px ${DISPLAY_FONT}`;
  ctx.fillStyle = "#FFFDF7";
  ctx.fillText(String(index + 1), cursorX + sealRadius, rowCenterY + 0.5);
  cursorX += sealRadius * 2 + 12;

  // 2. Video time pill
  const timeText =
    sketch.duration > 0
      ? `${formatSketchTime(sketch.timestamp)} / ${formatSketchTime(sketch.duration)}`
      : formatSketchTime(sketch.timestamp);
  ctx.font = `700 13.5px ${MONO_FONT}`;
  const timeWidth = ctx.measureText(timeText).width;
  const timePillW = 18 + 8 + timeWidth + 16;
  const timePillH = 30;

  drawRoundedRectPath(ctx, cursorX, rowCenterY - timePillH / 2, timePillW, timePillH, 10);
  ctx.fillStyle = "#78350F";
  ctx.fill();

  drawClockGlyph(ctx, cursorX + 15, rowCenterY);
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFDF7";
  ctx.fillText(timeText, cursorX + 26, rowCenterY + 0.5);
  cursorX += timePillW + 10;

  // 3. Right-aligned page indicator
  const pageLabel = `Page ${index + 1} of ${total}`;
  ctx.font = `600 13px ${DISPLAY_FONT}`;
  const pageLabelWidth = ctx.measureText(pageLabel).width;
  const rightEdge = CONTENT_LEFT + CONTENT_WIDTH - CARD_PAD_X;
  ctx.textAlign = "right";
  ctx.fillStyle = "#7C654B";
  ctx.fillText(pageLabel, rightEdge, rowCenterY + 0.5);

  // 4. Chapter badge (if available and space permits)
  const chapterTitle = sketch.chapterTitle?.trim();
  const maxChapterPillWidth = rightEdge - pageLabelWidth - 14 - cursorX;
  if (chapterTitle && maxChapterPillWidth >= 96) {
    ctx.font = `600 13.5px ${DISPLAY_FONT}`;
    const maxTextWidth = maxChapterPillWidth - 36;
    const fittedChapter = truncateText(ctx, chapterTitle, maxTextWidth);
    const chapterTextW = ctx.measureText(fittedChapter).width;
    const chapterPillW = 28 + chapterTextW + 14;
    const chapterPillH = 30;

    drawRoundedRectPath(
      ctx,
      cursorX,
      rowCenterY - chapterPillH / 2,
      chapterPillW,
      chapterPillH,
      10,
    );
    ctx.fillStyle = "#F2F7EA";
    ctx.fill();
    ctx.strokeStyle = "#82B34B";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    drawBookGlyph(ctx, cursorX + 16, rowCenterY);
    ctx.textAlign = "left";
    ctx.fillStyle = "#365314";
    ctx.fillText(fittedChapter, cursorX + 29, rowCenterY + 0.5);
  }

  // Sketch image frame
  const imageY = cardY + CARD_PAD_TOP + INFO_ROW_HEIGHT + INFO_TO_IMAGE_GAP;
  const imageX = CONTENT_LEFT + (CONTENT_WIDTH - drawWidth) / 2;

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  drawRoundedRectPath(ctx, imageX, imageY, drawWidth, drawHeight, 14);
  ctx.fillStyle = "#20170E";
  ctx.fill();
  ctx.clip();

  if (image && image.naturalWidth > 0 && image.naturalHeight > 0) {
    ctx.drawImage(image, imageX, imageY, drawWidth, drawHeight);
  } else {
    ctx.fillStyle = "#38281A";
    ctx.fillRect(imageX, imageY, drawWidth, drawHeight);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 16px ${DISPLAY_FONT}`;
    ctx.fillStyle = "#FDE68A";
    ctx.fillText("Sketch frame unavailable", imageX + drawWidth / 2, imageY + drawHeight / 2);
  }
  ctx.restore();

  // Oak picture frame outline
  drawRoundedRectPath(ctx, imageX, imageY, drawWidth, drawHeight, 14);
  ctx.strokeStyle = "#805D35";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Four scrapbook corner tabs
  drawCornerTapeTab(ctx, imageX + 6, imageY + 6, "tl");
  drawCornerTapeTab(ctx, imageX + drawWidth - 6, imageY + 6, "tr");
  drawCornerTapeTab(ctx, imageX + 6, imageY + drawHeight - 6, "bl");
  drawCornerTapeTab(ctx, imageX + drawWidth - 6, imageY + drawHeight - 6, "br");

  ctx.restore();
}

function drawSketchSeparator(
  ctx: CanvasRenderingContext2D,
  topY: number,
  separatorIndex: number,
): void {
  const centerX = EXPORT_WIDTH / 2;
  const centerY = topY + SEPARATOR_HEIGHT / 2;
  const lineStart = CONTENT_LEFT + 28;
  const lineEnd = CONTENT_LEFT + CONTENT_WIDTH - 28;
  const gapHalf = 46;

  ctx.save();
  // Left & right warm vine branches
  ctx.strokeStyle = "#996E3D";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lineStart, centerY);
  ctx.bezierCurveTo(
    lineStart + 90,
    centerY - 7,
    centerX - gapHalf - 80,
    centerY + 7,
    centerX - gapHalf,
    centerY,
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + gapHalf, centerY);
  ctx.bezierCurveTo(
    centerX + gapHalf + 80,
    centerY - 7,
    lineEnd - 90,
    centerY + 7,
    lineEnd,
    centerY,
  );
  ctx.stroke();

  // Small botanical buds along both vines
  drawLeaf(ctx, centerX - gapHalf - 110, centerY + 1, 14, 4.5, -2.6, "#82B34B");
  drawLeaf(ctx, centerX + gapHalf + 110, centerY - 1, 14, 4.5, -0.5, "#6E9A3E");
  drawLeaf(ctx, centerX - 24, centerY, 15, 4.5, -2.85, "#82B34B");
  drawLeaf(ctx, centerX + 24, centerY, 15, 4.5, -0.3, "#6E9A3E");

  // Cycle storybook motifs between cards
  const motif = separatorIndex % 3;
  if (motif === 0) {
    drawLadybugGlyph(ctx, centerX, centerY);
  } else if (motif === 1) {
    drawSunflowerGlyph(ctx, centerX, centerY, 0.72);
  } else {
    drawAcornGlyph(ctx, centerX, centerY);
  }
  ctx.restore();
}

function drawFooter(ctx: CanvasRenderingContext2D, topY: number): void {
  const centerX = EXPORT_WIDTH / 2;
  const centerY = topY + FOOTER_HEIGHT / 2;

  ctx.save();
  drawFourPointStar(ctx, centerX - 132, centerY, 5.5, 2.2, "#F59E0B", "#78350F");
  drawFourPointStar(ctx, centerX + 132, centerY, 5.5, 2.2, "#F59E0B", "#78350F");

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 14px ${DISPLAY_FONT}`;
  ctx.fillStyle = "#6E4E28";
  ctx.fillText("Trace Field Journal  •  Keep Exploring!", centerX, centerY + 0.5);
  ctx.restore();
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob && blob.size > 0) {
        resolve(blob);
        return;
      }
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const commaIndex = dataUrl.indexOf(",");
        const base64 = commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : "";
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) {
          bytes[i] = binary.charCodeAt(i);
        }
        resolve(new Blob([bytes], { type: "image/png" }));
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Failed to export PNG."));
      }
    }, "image/png");
  });
}

async function renderExportBlob(
  cards: ReadonlyArray<MeasuredCard>,
  logicalHeight: number,
  scale: number,
  videoTitle?: string,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(EXPORT_WIDTH * scale));
  canvas.height = Math.max(1, Math.round(logicalHeight * scale));

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not initialize 2D canvas for PNG export.");
  }

  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  drawBackgroundAndFrame(ctx, logicalHeight);
  let cursorY = drawStoryHeader(ctx, cards.length, videoTitle);

  for (let i = 0; i < cards.length; i += 1) {
    const card = cards[i]!;
    drawSketchCard(ctx, card, i, cards.length, cursorY);
    cursorY += card.cardHeight;

    if (i < cards.length - 1) {
      drawSketchSeparator(ctx, cursorY, i);
      cursorY += SEPARATOR_HEIGHT;
    }
  }

  drawFooter(ctx, cursorY);

  return canvasToPngBlob(canvas);
}

function buildExportFilename(videoTitle?: string): string {
  const slug = (videoTitle ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const dateStamp = new Date().toISOString().slice(0, 10);
  return `${slug || "trace"}-sketches-${dateStamp}.png`;
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportSketchesAsPng({
  sketches,
  videoTitle,
}: ExportSketchesOptions): Promise<void> {
  if (sketches.length === 0) return;

  await waitForFonts();

  const ordered = [...sketches].sort(
    (a, b) => a.timestamp - b.timestamp || a.createdAt - b.createdAt,
  );
  const images = await Promise.all(ordered.map((sketch) => loadImage(sketch.imageDataUrl)));

  const cards: MeasuredCard[] = ordered.map((sketch, index) => {
    const image = images[index] ?? null;
    const rawRatio =
      image && image.naturalWidth > 0 && image.naturalHeight > 0
        ? image.naturalWidth / image.naturalHeight
        : sketch.aspectRatio;
    const ratio = clamp(Number.isFinite(rawRatio) && rawRatio > 0 ? rawRatio : 16 / 9, 0.45, 2.6);

    let drawWidth = IMAGE_SLOT_WIDTH;
    let drawHeight = Math.round(drawWidth / ratio);
    if (drawHeight > MAX_SINGLE_IMAGE_HEIGHT) {
      drawHeight = MAX_SINGLE_IMAGE_HEIGHT;
      drawWidth = Math.round(drawHeight * ratio);
    }

    const cardHeight =
      CARD_PAD_TOP + INFO_ROW_HEIGHT + INFO_TO_IMAGE_GAP + drawHeight + CARD_PAD_BOTTOM;

    return { sketch, image, drawWidth, drawHeight, cardHeight };
  });

  const cardsTotalHeight = cards.reduce((sum, card) => sum + card.cardHeight, 0);
  const separatorsTotalHeight = Math.max(0, cards.length - 1) * SEPARATOR_HEIGHT;
  const logicalHeight =
    OUTER_PAD +
    30 +
    HEADER_HEIGHT +
    HEADER_BOTTOM_GAP +
    cardsTotalHeight +
    separatorsTotalHeight +
    FOOTER_HEIGHT +
    OUTER_PAD;

  const primaryScale = Math.min(
    TARGET_EXPORT_SCALE,
    MAX_CANVAS_HEIGHT / logicalHeight,
    Math.sqrt(MAX_CANVAS_AREA / (EXPORT_WIDTH * logicalHeight)),
  );

  let blob: Blob;
  try {
    blob = await renderExportBlob(cards, logicalHeight, primaryScale, videoTitle);
  } catch {
    const fallbackScale = Math.min(
      1,
      primaryScale,
      Math.sqrt(FALLBACK_CANVAS_AREA / (EXPORT_WIDTH * logicalHeight)),
    );
    blob = await renderExportBlob(cards, logicalHeight, fallbackScale, videoTitle);
  }

  triggerBlobDownload(blob, buildExportFilename(videoTitle));
}
