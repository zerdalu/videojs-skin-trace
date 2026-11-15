/** @jsxImportSource react */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useDialogFocusTrap } from "@/lib/focus-trap";
import { cn } from "@/lib/resolve-class-name";
import { exportSketchesAsPng } from "@/lib/sketch-export";
import { formatSketchTime, type SavedSketch } from "@/lib/sketch-types";
import {
  ChevronNavIcon,
  CloseCrossIcon,
  ExportStorybookIcon,
  PenNibIcon,
  StorybookFilmstripIcon,
  StorybookPenIcon,
  TrashSketchIcon,
} from "@/ui/icons/trace-icons";

export interface FilmstripOverlayProps {
  sketches: ReadonlyArray<SavedSketch>;
  videoTitle?: string;
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  onEditSketch: (sketch: SavedSketch) => void;
  onDeleteSketch: (id: string) => void;
  onJumpToTimestamp: (seconds: number) => void;
  onStartNewSketch: () => void;
  onClose: () => void;
}

type ExportStatus = "idle" | "exporting" | "done" | "error";

const SPROCKET_COUNT = 18;

function FilmSprocketRail() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-between gap-2 overflow-hidden px-3 py-1 media-md:py-1.5 media-max-sm:hidden"
    >
      {Array.from({ length: SPROCKET_COUNT }, (_, idx) => (
        <span key={idx} className="h-2 w-3.5 shrink-0 rounded-[3px] bg-[#FDF6E9]/85 shadow-inner" />
      ))}
    </div>
  );
}

function EmptyFilmSlot({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "hidden aspect-video w-[17%] media-md:w-[21%] min-w-12 max-w-44 shrink-0 place-items-center rounded-xl",
        "border-2 border-dashed border-[#996E3D]/45 bg-[#20170E]/45 text-center text-[11px] font-bold text-[#E6D5BC]/60",
        "media-md:grid",
      )}
    >
      <span className="px-2">{label}</span>
    </div>
  );
}

export function FilmstripOverlay({
  sketches,
  videoTitle,
  activeIndex,
  onChangeIndex,
  onEditSketch,
  onDeleteSketch,
  onJumpToTimestamp,
  onStartNewSketch,
  onClose,
}: FilmstripOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const statusTimerRef = useRef<number | null>(null);

  const total = sketches.length;
  const safeIndex = total > 0 ? ((activeIndex % total) + total) % total : 0;

  useDialogFocusTrap(dialogRef, total);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    onChangeIndex((safeIndex - 1 + total) % total);
  }, [onChangeIndex, safeIndex, total]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    onChangeIndex((safeIndex + 1) % total);
  }, [onChangeIndex, safeIndex, total]);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current !== null) {
        window.clearTimeout(statusTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, onClose]);

  const handleExportPng = async () => {
    if (total === 0 || exportStatus === "exporting") return;
    if (statusTimerRef.current !== null) {
      window.clearTimeout(statusTimerRef.current);
      statusTimerRef.current = null;
    }

    setExportStatus("exporting");
    try {
      await exportSketchesAsPng({ sketches, videoTitle });
      setExportStatus("done");
    } catch {
      setExportStatus("error");
    }

    statusTimerRef.current = window.setTimeout(() => {
      setExportStatus("idle");
      statusTimerRef.current = null;
    }, 2600);
  };

  const leftSketch =
    total >= 3
      ? sketches[(safeIndex - 1 + total) % total]!
      : total === 2 && safeIndex === 1
        ? sketches[0]!
        : null;

  const centerSketch = total > 0 ? sketches[safeIndex]! : null;

  const rightSketch =
    total >= 3
      ? sketches[(safeIndex + 1) % total]!
      : total === 2 && safeIndex === 0
        ? sketches[1]!
        : null;

  return (
    <dialog
      ref={dialogRef}
      open
      aria-modal="true"
      aria-label="Saved sketches filmstrip"
      tabIndex={-1}
      className={cn(
        "absolute inset-0 z-30 m-0 flex size-full max-h-none max-w-none flex-col justify-between gap-1.5 overflow-y-auto overscroll-contain rounded-[inherit] border-0 text-inherit outline-hidden",
        "bg-[#20170E]/82 backdrop-blur-xs p-1.5 media-md:gap-2 media-md:p-4",
      )}
    >
      {/* Top Header */}
      <div className="flex shrink-0 items-center justify-between gap-1.5 media-md:gap-2">
        <div
          className={cn(
            "flex items-center gap-1.5 media-md:gap-2 rounded-2xl border-2 border-(--media-frame-border,#805D35)",
            "bg-media-popover/95 px-2.5 py-1 media-md:px-3 media-md:py-1.5 text-[11px] media-md:text-xs font-bold text-media-popover-foreground shadow-md",
          )}
        >
          <StorybookFilmstripIcon className="size-4 media-md:size-5 shrink-0" />
          <span>
            <span className="media-max-xs:hidden">Sketch </span>Filmstrip
          </span>
          {total > 0 && (
            <span className="storybook-tabular-nums rounded-md bg-media-accent px-1.5 py-0.5 tabular-nums text-media-primary">
              {safeIndex + 1} / {total}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 media-md:gap-1.5">
          {total > 0 && (
            <button
              type="button"
              onClick={handleExportPng}
              disabled={exportStatus === "exporting"}
              aria-label="Export all sketches as a long storybook PNG image"
              title="Export all sketches as a long storybook PNG"
              className={cn(
                "flex h-7 media-md:h-8 pointer-coarse:h-9 items-center gap-1.5 rounded-xl border-2 px-2 media-md:px-2.5 text-xs font-bold shadow-md",
                "cursor-pointer transition-all motion-safe:active:scale-95 disabled:cursor-wait disabled:opacity-75",
                "focus-visible:outline-2 focus-visible:outline-media-ring",
                exportStatus === "done"
                  ? "border-[#3B561E] bg-[#6E9A3E] text-[#FFFDF7]"
                  : exportStatus === "error"
                    ? "border-[#991B1B] bg-[#FEE2E2] text-[#991B1B]"
                    : "border-[#92400E] bg-[#F59E0B] text-[#2B2118] hover:bg-[#FBBF24]",
              )}
            >
              <ExportStorybookIcon className="size-4 shrink-0" />
              <span className="media-max-xs:hidden">
                {exportStatus === "exporting"
                  ? "Exporting…"
                  : exportStatus === "done"
                    ? "Exported!"
                    : exportStatus === "error"
                      ? "Export failed"
                      : "Export PNG"}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onStartNewSketch}
            aria-label="Create new sketch"
            title="New sketch"
            className={cn(
              "flex h-7 media-md:h-8 pointer-coarse:h-9 items-center gap-1.5 rounded-xl border-2 border-(--media-frame-border,#805D35)",
              "bg-media-popover/95 px-2 media-md:px-2.5 text-xs font-bold text-media-popover-foreground shadow-md",
              "cursor-pointer transition-all hover:bg-media-accent motion-safe:active:scale-95",
              "focus-visible:outline-2 focus-visible:outline-media-ring",
            )}
          >
            <StorybookPenIcon className="size-4 shrink-0" />
            <span className="media-max-xs:hidden">New Sketch</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filmstrip"
            className={cn(
              "flex h-7 media-md:h-8 pointer-coarse:h-9 items-center gap-1 rounded-xl border-2 border-(--media-frame-border,#805D35)",
              "bg-media-popover/95 px-2 media-md:px-2.5 text-xs font-bold text-media-popover-foreground shadow-md",
              "cursor-pointer transition-all hover:bg-media-accent motion-safe:active:scale-95",
              "focus-visible:outline-2 focus-visible:outline-media-ring",
            )}
          >
            <CloseCrossIcon />
            <span className="media-max-xs:hidden">Close</span>
          </button>
        </div>
      </div>

      {/* Filmstrip Carousel Body */}
      {total === 0 || !centerSketch ? (
        <div className="my-auto flex min-h-0 flex-1 flex-col items-center justify-center px-3 text-center">
          <div className="rounded-2xl border-2 border-(--media-frame-border,#805D35) bg-media-popover/95 p-3 media-md:p-5 text-media-popover-foreground shadow-xl max-w-xs">
            <StorybookFilmstripIcon className="mx-auto mb-2 size-10 media-md:size-12 media-max-sm:hidden" />
            <p className="text-xs media-md:text-sm font-bold">No saved sketches yet</p>
            <p className="mt-1 text-[11px] media-md:text-xs text-media-muted-foreground">
              Tap the pen button to draw on any video frame and collect it here.
            </p>
            <button
              type="button"
              onClick={onStartNewSketch}
              className={cn(
                "mt-2.5 media-md:mt-3 inline-flex items-center gap-1.5 rounded-xl border-2 border-[#3B561E] bg-[#6E9A3E]",
                "px-3 py-1.5 text-xs font-bold text-[#FFFDF7] shadow-sm cursor-pointer",
                "transition-all hover:bg-[#5E8633] motion-safe:active:scale-95",
                "focus-visible:outline-2 focus-visible:outline-media-ring",
              )}
            >
              <StorybookPenIcon className="size-4" />
              <span>Sketch This Frame</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="my-auto flex min-h-0 flex-1 flex-col justify-center">
          {/* Filmstrip Band with Top & Bottom Sprocket Rails */}
          <div className="rounded-xl media-md:rounded-2xl border-2 border-[#6E4E28] bg-[#2D1F13]/95 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
            <FilmSprocketRail />

            {/* 3-Slot Carousel: Left (Small), Center (Big), Right (Small) */}
            <div className="flex items-center justify-center gap-1.5 px-1.5 py-1 media-md:gap-4 media-md:px-5 media-md:py-3">
              {/* Left Small Sketch (Previous) */}
              {leftSketch ? (
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={`Previous sketch at ${formatSketchTime(leftSketch.timestamp)}`}
                  title="Previous sketch"
                  className={cn(
                    "group relative w-[17%] min-w-10 media-md:w-[21%] media-md:min-w-16 max-w-44 shrink-0 overflow-hidden rounded-lg media-md:rounded-xl",
                    "border-2 border-[#996E3D]/80 bg-[#1C1611] opacity-80 shadow-md",
                    "cursor-pointer transition-all duration-media-base ease-out",
                    "motion-safe:hover:scale-105 hover:opacity-100 hover:border-[#F59E0B] focus-visible:outline-2 focus-visible:outline-[#F59E0B]",
                  )}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={leftSketch.imageDataUrl}
                      alt={`Previous sketch from ${formatSketchTime(leftSketch.timestamp)}`}
                      className="size-full object-cover transition-transform duration-media-base motion-safe:group-hover:scale-105"
                      draggable={false}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-start bg-linear-to-r from-black/45 to-transparent px-1 opacity-80 group-hover:opacity-100">
                    <span className="grid size-5 media-md:size-6 place-items-center rounded-full bg-[#FFFDF7]/90 text-[#38281A] shadow">
                      <ChevronNavIcon direction="left" className="size-3.5 media-md:size-4" />
                    </span>
                  </div>
                  <span className="storybook-tabular-nums pointer-events-none absolute right-1 bottom-1 rounded bg-black/75 px-1 py-0.5 text-[10px] font-bold tabular-nums text-[#FFFDF7] media-max-xs:hidden">
                    {formatSketchTime(leftSketch.timestamp)}
                  </span>
                </button>
              ) : (
                <EmptyFilmSlot label="Start" />
              )}

              {/* Center Big Sketch (Active) */}
              <div
                className={cn(
                  "relative w-[56%] media-md:w-[50%] min-w-36 max-w-lg shrink-0 overflow-hidden rounded-xl media-md:rounded-2xl",
                  "border-2 media-md:border-3 border-[#F59E0B] bg-[#1C1611] shadow-[0_10px_30px_rgba(0,0,0,0.6)]",
                )}
              >
                <div className="aspect-video w-full overflow-hidden bg-[#140F0A]">
                  <img
                    src={centerSketch.imageDataUrl}
                    alt={`Saved sketch at ${formatSketchTime(centerSketch.timestamp)}`}
                    className="size-full object-contain"
                    draggable={false}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-1 media-md:gap-2 border-t border-media-border bg-media-popover/95 px-1.5 py-1 media-md:px-2.5 media-md:py-1.5 text-xs text-media-popover-foreground">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="storybook-tabular-nums shrink-0 rounded-md bg-[#78350F] px-1.5 py-0.5 text-[10px] media-md:text-xs font-bold tabular-nums text-[#FFFDF7]">
                      {formatSketchTime(centerSketch.timestamp)}
                    </span>
                    {centerSketch.chapterTitle && (
                      <span className="truncate font-semibold text-media-muted-foreground media-max-md:hidden">
                        {centerSketch.chapterTitle}
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditSketch(centerSketch)}
                      aria-label="Edit sketch"
                      title="Edit sketch"
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg bg-[#F59E0B] px-1.5 media-md:px-2 py-0.5 media-md:py-1 text-[11px] font-bold text-[#2B2118]",
                        "cursor-pointer transition-all hover:bg-[#FBBF24] motion-safe:active:scale-95",
                        "focus-visible:outline-2 focus-visible:outline-media-ring",
                      )}
                    >
                      <PenNibIcon className="size-3 shrink-0" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onJumpToTimestamp(centerSketch.timestamp)}
                      aria-label={`Jump video to ${formatSketchTime(centerSketch.timestamp)}`}
                      title="Go to Frame"
                      className={cn(
                        "rounded-lg bg-[#6E9A3E] px-1.5 media-md:px-2 py-0.5 media-md:py-1 text-[11px] font-bold text-[#FFFDF7]",
                        "cursor-pointer transition-all hover:bg-[#5E8633] motion-safe:active:scale-95",
                        "focus-visible:outline-2 focus-visible:outline-media-ring",
                      )}
                    >
                      <span className="media-max-md:hidden">Go to Frame</span>
                      <span className="media-md:hidden">Frame</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteSketch(centerSketch.id)}
                      aria-label="Delete saved sketch"
                      title="Delete sketch"
                      className={cn(
                        "grid size-6 media-md:size-7 pointer-coarse:size-8 place-items-center rounded-lg text-media-muted-foreground",
                        "cursor-pointer transition-all hover:bg-[#FEE2E2] hover:text-[#991B1B] motion-safe:active:scale-95",
                        "focus-visible:outline-2 focus-visible:outline-media-ring",
                      )}
                    >
                      <TrashSketchIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Small Sketch (Next) */}
              {rightSketch ? (
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={`Next sketch at ${formatSketchTime(rightSketch.timestamp)}`}
                  title="Next sketch"
                  className={cn(
                    "group relative w-[17%] min-w-10 media-md:w-[21%] media-md:min-w-16 max-w-44 shrink-0 overflow-hidden rounded-lg media-md:rounded-xl",
                    "border-2 border-[#996E3D]/80 bg-[#1C1611] opacity-80 shadow-md",
                    "cursor-pointer transition-all duration-media-base ease-out",
                    "motion-safe:hover:scale-105 hover:opacity-100 hover:border-[#F59E0B] focus-visible:outline-2 focus-visible:outline-[#F59E0B]",
                  )}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={rightSketch.imageDataUrl}
                      alt={`Next sketch from ${formatSketchTime(rightSketch.timestamp)}`}
                      className="size-full object-cover transition-transform duration-media-base motion-safe:group-hover:scale-105"
                      draggable={false}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-end bg-linear-to-l from-black/45 to-transparent px-1 opacity-80 group-hover:opacity-100">
                    <span className="grid size-5 media-md:size-6 place-items-center rounded-full bg-[#FFFDF7]/90 text-[#38281A] shadow">
                      <ChevronNavIcon direction="right" className="size-3.5 media-md:size-4" />
                    </span>
                  </div>
                  <span className="storybook-tabular-nums pointer-events-none absolute right-1 bottom-1 rounded bg-black/75 px-1 py-0.5 text-[10px] font-bold tabular-nums text-[#FFFDF7] media-max-xs:hidden">
                    {formatSketchTime(rightSketch.timestamp)}
                  </span>
                </button>
              ) : (
                <EmptyFilmSlot label="End" />
              )}
            </div>

            <FilmSprocketRail />
          </div>
        </div>
      )}

      {/* Bottom Indicator Dots */}
      <div className="flex h-4 media-md:h-6 shrink-0 items-center justify-center gap-1.5">
        {total > 1 &&
          sketches.map((sketch, index) => (
            <button
              key={sketch.id}
              type="button"
              onClick={() => onChangeIndex(index)}
              aria-label={`View sketch ${index + 1}`}
              aria-current={index === safeIndex ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-media-ring",
                index === safeIndex
                  ? "w-5 bg-[#F59E0B]"
                  : "w-2 bg-[#FFFDF7]/50 hover:bg-[#FFFDF7]/85",
              )}
            />
          ))}
      </div>
    </dialog>
  );
}
