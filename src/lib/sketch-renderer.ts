import type { BrushSize, DrawOperation, StrokeOperation, TextOperation } from "@/lib/sketch-types";

const BASE_STROKE_WIDTH: Record<BrushSize, number> = {
  sm: 3.5,
  md: 7,
  lg: 13,
};

const BASE_FONT_SIZE: Record<BrushSize, number> = {
  sm: 20,
  md: 30,
  lg: 44,
};

export function getToolLineWidth(
  tool: StrokeOperation["tool"],
  size: BrushSize,
  canvasWidth: number,
): number {
  const scale = Math.max(0.4, canvasWidth / 960);
  const base = BASE_STROKE_WIDTH[size] * scale;

  switch (tool) {
    case "pen":
      return base;
    case "marker":
      return base * 1.9;
    case "crayon":
      return base * 2.1;
    case "highlighter":
      return base * 3.8;
    case "eraser":
      return base * 3.6;
  }
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function drawSmoothPath(
  ctx: CanvasRenderingContext2D,
  points: ReadonlyArray<{ x: number; y: number }>,
  width: number,
): void {
  if (points.length === 0) return;

  if (points.length === 1) {
    ctx.beginPath();
    ctx.arc(points[0]!.x, points[0]!.y, Math.max(1, width / 2), 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0]!.x, points[0]!.y);

  for (let i = 1; i < points.length - 1; i += 1) {
    const curr = points[i]!;
    const next = points[i + 1]!;
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
  }

  const last = points[points.length - 1]!;
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
}

function drawCrayonStroke(
  ctx: CanvasRenderingContext2D,
  points: ReadonlyArray<{ x: number; y: number }>,
  lineWidth: number,
  color: string,
  seed: number,
): void {
  if (points.length === 0) return;
  ctx.fillStyle = color;
  const radius = Math.max(1.5, lineWidth * 0.52);
  const grainSize = Math.max(1.2, lineWidth * 0.19);
  let grainStep = 0;

  const stampAt = (cx: number, cy: number) => {
    const count = 6;
    for (let g = 0; g < count; g += 1) {
      const r1 = seededRandom(seed + grainStep * 7 + g * 3);
      const r2 = seededRandom(seed + grainStep * 13 + g * 5 + 1);
      const angle = r1 * Math.PI * 2;
      const dist = Math.sqrt(r2) * radius;
      const gx = cx + Math.cos(angle) * dist;
      const gy = cy + Math.sin(angle) * dist;
      ctx.globalAlpha = 0.45 + seededRandom(seed + grainStep + g) * 0.45;
      ctx.beginPath();
      ctx.arc(gx, gy, grainSize * (0.6 + r1 * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    grainStep += 1;
  };

  if (points.length === 1) {
    stampAt(points[0]!.x, points[0]!.y);
    return;
  }

  const stepSpacing = Math.max(1.5, lineWidth * 0.24);
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i]!;
    const p1 = points[i + 1]!;
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(1, Math.ceil(dist / stepSpacing));

    for (let s = 0; s < steps; s += 1) {
      const t = s / steps;
      stampAt(p0.x + dx * t, p0.y + dy * t);
    }
  }
  const end = points[points.length - 1]!;
  stampAt(end.x, end.y);
}

function renderStroke(
  ctx: CanvasRenderingContext2D,
  op: StrokeOperation,
  width: number,
  height: number,
): void {
  const pixelPoints = op.points.map((pt) => ({ x: pt.x * width, y: pt.y * height }));
  const lineWidth = getToolLineWidth(op.tool, op.size, width);

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;

  if (op.tool === "eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.fillStyle = "rgba(0,0,0,1)";
    drawSmoothPath(ctx, pixelPoints, lineWidth);
    ctx.restore();
    return;
  }

  if (op.tool === "crayon") {
    drawCrayonStroke(ctx, pixelPoints, lineWidth, op.color, op.seed);
    ctx.restore();
    return;
  }

  ctx.strokeStyle = op.color;
  ctx.fillStyle = op.color;

  if (op.tool === "highlighter") {
    ctx.globalAlpha = 0.36;
  } else if (op.tool === "marker") {
    ctx.globalAlpha = 0.92;
  } else {
    ctx.globalAlpha = 1;
  }

  drawSmoothPath(ctx, pixelPoints, lineWidth);
  ctx.restore();
}

function renderText(
  ctx: CanvasRenderingContext2D,
  op: TextOperation,
  width: number,
  height: number,
): void {
  const scale = Math.max(0.45, width / 960);
  const fontSize = Math.round(BASE_FONT_SIZE[op.size] * scale);
  const px = op.x * width;
  const py = op.y * height;
  const isLightInk = op.color.toUpperCase() === "#FFFDF7";

  ctx.save();
  ctx.font = `700 ${fontSize}px "Fredoka", "Nunito", ui-rounded, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(2, fontSize * 0.18);
  ctx.strokeStyle = isLightInk ? "rgba(32, 23, 14, 0.85)" : "rgba(255, 253, 247, 0.9)";
  ctx.strokeText(op.text, px, py);
  ctx.fillStyle = op.color;
  ctx.fillText(op.text, px, py);
  ctx.restore();
}

export function renderSketchOperations(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  operations: ReadonlyArray<DrawOperation>,
): void {
  ctx.clearRect(0, 0, width, height);
  for (const op of operations) {
    if (op.kind === "stroke") {
      renderStroke(ctx, op, width, height);
    } else {
      renderText(ctx, op, width, height);
    }
  }
}
