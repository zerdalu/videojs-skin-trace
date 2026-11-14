export type TraceMode = "playback" | "sketch" | "filmstrip";

export type PenType = "pen" | "marker" | "crayon" | "highlighter";

export type DrawingTool = PenType | "text" | "eraser";

export type BrushSize = "sm" | "md" | "lg";

export interface SketchPoint {
  x: number;
  y: number;
}

export interface StrokeOperation {
  id: string;
  kind: "stroke";
  tool: PenType | "eraser";
  color: string;
  size: BrushSize;
  points: SketchPoint[];
  seed: number;
}

export interface TextOperation {
  id: string;
  kind: "text";
  x: number;
  y: number;
  text: string;
  color: string;
  size: BrushSize;
}

export type DrawOperation = StrokeOperation | TextOperation;

export interface SavedSketch {
  id: string;
  imageDataUrl: string;
  timestamp: number;
  duration: number;
  createdAt: number;
  aspectRatio: number;
  chapterTitle?: string;
}

export interface SketchColorOption {
  id: string;
  label: string;
  value: string;
}

export const SKETCH_COLORS: readonly SketchColorOption[] = [
  { id: "ink", label: "Charcoal Ink", value: "#2B2118" },
  { id: "berry", label: "Crimson Berry", value: "#DC2626" },
  { id: "sunflower", label: "Sunflower Gold", value: "#F59E0B" },
  { id: "meadow", label: "Meadow Leaf", value: "#16A34A" },
  { id: "river", label: "Sky River", value: "#2563EB" },
  { id: "plum", label: "Wild Plum", value: "#9333EA" },
  { id: "chalk", label: "Chalk Cream", value: "#FFFDF7" },
] as const;

export const PEN_TYPE_OPTIONS: ReadonlyArray<{ id: PenType; label: string }> = [
  { id: "pen", label: "Pen" },
  { id: "marker", label: "Marker" },
  { id: "crayon", label: "Crayon" },
  { id: "highlighter", label: "Highlighter" },
];

export const BRUSH_SIZE_OPTIONS: ReadonlyArray<{ id: BrushSize; label: string; dotPx: number }> = [
  { id: "sm", label: "Small", dotPx: 6 },
  { id: "md", label: "Medium", dotPx: 10 },
  { id: "lg", label: "Large", dotPx: 15 },
];

export function formatSketchTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const rounded = Math.floor(seconds);
  const hrs = Math.floor(rounded / 3600);
  const mins = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;
  const paddedSecs = String(secs).padStart(2, "0");
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${paddedSecs}`;
  }
  return `${mins}:${paddedSecs}`;
}
