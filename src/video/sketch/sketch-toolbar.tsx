/** @jsxImportSource react */

"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/resolve-class-name";
import {
  BRUSH_SIZE_OPTIONS,
  formatSketchTime,
  PEN_TYPE_OPTIONS,
  SKETCH_COLORS,
  type BrushSize,
  type DrawingTool,
  type PenType,
} from "@/lib/sketch-types";
import {
  CloseCrossIcon,
  CrayonTipIcon,
  EraserBlockIcon,
  HighlighterTipIcon,
  MarkerTipIcon,
  PenNibIcon,
  RedoInkIcon,
  SaveBookmarkIcon,
  TextToolIcon,
  TrashSketchIcon,
  UndoInkIcon,
} from "@/ui/icons/trace-icons";

export interface SketchToolbarProps {
  activeTool: DrawingTool;
  activeColor: string;
  activeSize: BrushSize;
  timestamp: number;
  canUndo: boolean;
  canRedo: boolean;
  hasOperations: boolean;
  isSaving: boolean;
  onSelectTool: (tool: DrawingTool) => void;
  onSelectColor: (color: string) => void;
  onSelectSize: (size: BrushSize) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const PEN_ICONS: Record<PenType, ReactNode> = {
  pen: <PenNibIcon />,
  marker: <MarkerTipIcon />,
  crayon: <CrayonTipIcon />,
  highlighter: <HighlighterTipIcon />,
};

export function SketchToolbar({
  activeTool,
  activeColor,
  activeSize,
  timestamp,
  canUndo,
  canRedo,
  hasOperations,
  isSaving,
  onSelectTool,
  onSelectColor,
  onSelectSize,
  onUndo,
  onRedo,
  onClear,
  onCancel,
  onSave,
}: SketchToolbarProps) {
  const isEraser = activeTool === "eraser";

  return (
    <>
      {/* Top Action Header */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-2 top-2 z-40 flex items-center justify-between gap-1.5",
          "media-md:inset-x-4 media-md:top-3.5 media-md:gap-2",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex shrink-0 items-center gap-1.5 media-md:gap-2 rounded-2xl border-2 border-(--media-frame-border,#805D35)",
            "bg-media-popover/95 px-2.5 py-1 media-md:px-3 media-md:py-1.5 text-xs font-bold text-media-popover-foreground",
            "shadow-[0_4px_14px_rgba(80,50,20,0.2)]",
          )}
        >
          <span className="inline-block size-2.5 rounded-full bg-[#F59E0B] ring-2 ring-media-primary/30" />
          <span className="media-max-xs:hidden">Sketch Mode</span>
          <span className="storybook-tabular-nums rounded-md bg-media-accent px-1.5 py-0.5 tabular-nums text-media-primary">
            {formatSketchTime(timestamp)}
          </span>
        </div>

        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1 media-md:gap-1.5 rounded-2xl border-2 border-(--media-frame-border,#805D35)",
            "bg-media-popover/95 p-0.5 media-md:p-1 text-media-popover-foreground shadow-[0_4px_14px_rgba(80,50,20,0.2)]",
          )}
        >
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo || isSaving}
            aria-label="Undo"
            title="Undo"
            className={cn(
              "grid size-8 pointer-coarse:size-9 media-md:pointer-coarse:size-10 place-items-center rounded-xl transition-all cursor-pointer",
              "hover:bg-media-accent motion-safe:active:scale-95 disabled:cursor-not-allowed disabled:opacity-35",
              "focus-visible:outline-2 focus-visible:outline-media-ring",
            )}
          >
            <UndoInkIcon />
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo || isSaving}
            aria-label="Redo"
            title="Redo"
            className={cn(
              "grid size-8 pointer-coarse:size-9 media-md:pointer-coarse:size-10 place-items-center rounded-xl transition-all cursor-pointer",
              "hover:bg-media-accent motion-safe:active:scale-95 disabled:cursor-not-allowed disabled:opacity-35",
              "focus-visible:outline-2 focus-visible:outline-media-ring",
            )}
          >
            <RedoInkIcon />
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={!hasOperations || isSaving}
            aria-label="Clear sketch"
            title="Clear drawing"
            className={cn(
              "grid size-8 pointer-coarse:size-9 media-md:pointer-coarse:size-10 place-items-center rounded-xl transition-all cursor-pointer",
              "hover:bg-[#FEE2E2] hover:text-[#991B1B] motion-safe:active:scale-95 disabled:cursor-not-allowed disabled:opacity-35",
              "focus-visible:outline-2 focus-visible:outline-media-ring",
            )}
          >
            <TrashSketchIcon />
          </button>

          <div className="mx-0.5 h-5 w-px shrink-0 bg-media-border" aria-hidden="true" />

          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            aria-label="Cancel sketching"
            title="Close sketch mode"
            className={cn(
              "flex h-8 pointer-coarse:h-9 media-md:pointer-coarse:h-10 items-center gap-1 rounded-xl px-2 media-md:px-2.5 text-xs font-bold transition-all cursor-pointer",
              "hover:bg-media-accent motion-safe:active:scale-95",
              "focus-visible:outline-2 focus-visible:outline-media-ring",
            )}
          >
            <CloseCrossIcon />
            <span className="media-max-sm:hidden">Cancel</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            aria-label="Save sketch"
            className={cn(
              "flex h-8 pointer-coarse:h-9 media-md:pointer-coarse:h-10 items-center gap-1.5 rounded-xl border-2 border-[#3B561E] bg-[#6E9A3E] px-2.5 media-md:px-3 text-xs font-bold text-[#FFFDF7]",
              "shadow-sm transition-all cursor-pointer hover:bg-[#5E8633] motion-safe:active:scale-95 disabled:opacity-60",
              "focus-visible:outline-2 focus-visible:outline-media-ring",
            )}
          >
            <SaveBookmarkIcon />
            <span>{isSaving ? "Saving…" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Drawing App Dock */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-2 bottom-2 z-40 flex justify-center",
          "media-md:inset-x-4 media-md:bottom-3.5",
        )}
      >
        <div
          role="toolbar"
          aria-label="Sketching tools"
          className={cn(
            "storybook-no-scrollbar pointer-events-auto flex max-w-full items-center gap-1.5 rounded-2xl",
            "media-max-md:flex-nowrap media-max-md:justify-start media-max-md:overflow-x-auto media-max-md:overscroll-x-contain",
            "media-md:flex-wrap media-md:justify-center",
            "border-2 border-(--media-frame-border,#805D35) bg-media-popover/95 px-2 py-1 media-md:px-2.5 media-md:py-1.5",
            "text-media-popover-foreground shadow-[0_6px_22px_rgba(80,50,20,0.24)]",
          )}
        >
          {/* Pen Types */}
          <fieldset className="flex shrink-0 items-center gap-1" aria-label="Pen types">
            {PEN_TYPE_OPTIONS.map((pen) => {
              const selected = activeTool === pen.id;
              return (
                <button
                  key={pen.id}
                  type="button"
                  onClick={() => onSelectTool(pen.id)}
                  aria-pressed={selected}
                  aria-label={pen.label}
                  title={pen.label}
                  className={cn(
                    "flex h-8 shrink-0 pointer-coarse:h-9 pointer-coarse:min-w-9 media-md:pointer-coarse:h-10 media-md:pointer-coarse:min-w-10 items-center justify-center gap-1 rounded-xl px-2 text-xs font-bold transition-all cursor-pointer",
                    "focus-visible:outline-2 focus-visible:outline-media-ring",
                    selected
                      ? "bg-[#78350F] text-[#FFFDF7] shadow-sm ring-1 ring-[#F59E0B]/60"
                      : "hover:bg-media-accent text-media-popover-foreground",
                  )}
                >
                  {PEN_ICONS[pen.id]}
                  <span className="media-max-lg:hidden">{pen.label}</span>
                </button>
              );
            })}
          </fieldset>

          <div className="h-5 w-px shrink-0 bg-media-border" aria-hidden="true" />

          {/* Text & Eraser Tools */}
          <fieldset className="flex shrink-0 items-center gap-1" aria-label="Text and eraser tools">
            <button
              type="button"
              onClick={() => onSelectTool("text")}
              aria-pressed={activeTool === "text"}
              aria-label="Text tool"
              title="Add text onto video frame"
              className={cn(
                "flex h-8 shrink-0 pointer-coarse:h-9 pointer-coarse:min-w-9 media-md:pointer-coarse:h-10 media-md:pointer-coarse:min-w-10 items-center justify-center gap-1 rounded-xl px-2 text-xs font-bold transition-all cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-media-ring",
                activeTool === "text"
                  ? "bg-[#78350F] text-[#FFFDF7] shadow-sm ring-1 ring-[#F59E0B]/60"
                  : "hover:bg-media-accent text-media-popover-foreground",
              )}
            >
              <TextToolIcon />
              <span className="media-max-lg:hidden">Text</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool("eraser")}
              aria-pressed={isEraser}
              aria-label="Eraser tool"
              title="Erase drawing without erasing video frame"
              className={cn(
                "flex h-8 shrink-0 pointer-coarse:h-9 pointer-coarse:min-w-9 media-md:pointer-coarse:h-10 media-md:pointer-coarse:min-w-10 items-center justify-center gap-1 rounded-xl px-2 text-xs font-bold transition-all cursor-pointer",
                "focus-visible:outline-2 focus-visible:outline-media-ring",
                isEraser
                  ? "bg-[#78350F] text-[#FFFDF7] shadow-sm ring-1 ring-[#F59E0B]/60"
                  : "hover:bg-media-accent text-media-popover-foreground",
              )}
            >
              <EraserBlockIcon />
              <span className="media-max-lg:hidden">Eraser</span>
            </button>
          </fieldset>

          <div className="h-5 w-px shrink-0 bg-media-border" aria-hidden="true" />

          {/* Brush / Text Size */}
          <fieldset className="flex shrink-0 items-center gap-1" aria-label="Stroke size">
            {BRUSH_SIZE_OPTIONS.map((opt) => {
              const selected = activeSize === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectSize(opt.id)}
                  aria-pressed={selected}
                  aria-label={`${opt.label} size`}
                  title={`${opt.label} size`}
                  className={cn(
                    "grid size-8 shrink-0 pointer-coarse:size-9 media-md:pointer-coarse:size-10 place-items-center rounded-xl transition-all cursor-pointer",
                    "focus-visible:outline-2 focus-visible:outline-media-ring",
                    selected
                      ? "bg-media-accent ring-2 ring-media-primary"
                      : "hover:bg-media-accent/70",
                  )}
                >
                  <span
                    className="rounded-full bg-current"
                    style={{ width: `${opt.dotPx}px`, height: `${opt.dotPx}px` }}
                  />
                </button>
              );
            })}
          </fieldset>

          <div className="h-5 w-px shrink-0 bg-media-border" aria-hidden="true" />

          {/* Ink & Crayon Color Swatches */}
          <fieldset
            className={cn(
              "flex shrink-0 items-center gap-1.5 pe-0.5 transition-opacity",
              isEraser && "opacity-45",
            )}
            aria-label="Ink colors"
          >
            {SKETCH_COLORS.map((swatch) => {
              const selected = activeColor === swatch.value && !isEraser;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => {
                    onSelectColor(swatch.value);
                    if (isEraser) onSelectTool("pen");
                  }}
                  aria-pressed={selected}
                  aria-label={swatch.label}
                  title={swatch.label}
                  className={cn(
                    "relative size-6 shrink-0 pointer-coarse:size-7 rounded-full border-2 border-[#3F2D1C]/60 transition-transform cursor-pointer",
                    "after:absolute after:-inset-1.5 after:rounded-full",
                    "motion-safe:hover:scale-115 motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-media-ring",
                    selected &&
                      "scale-115 ring-2 ring-[#F59E0B] ring-offset-2 ring-offset-media-popover",
                  )}
                  style={{ backgroundColor: swatch.value }}
                />
              );
            })}
          </fieldset>
        </div>
      </div>
    </>
  );
}
