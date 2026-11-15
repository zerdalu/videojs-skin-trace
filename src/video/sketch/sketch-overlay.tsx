/** @jsxImportSource react */

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { useDialogFocusTrap } from "@/lib/focus-trap";
import {
  captureCompositeSketch,
  computeVideoContentRect,
  findMediaElements,
  readActiveChapterTitle,
  type VideoContentRect,
} from "@/lib/media-element";
import { cn } from "@/lib/resolve-class-name";
import { getToolLineWidth, renderSketchOperations } from "@/lib/sketch-renderer";
import {
  SKETCH_COLORS,
  type BrushSize,
  type DrawingTool,
  type DrawOperation,
  type SavedSketch,
  type StrokeOperation,
} from "@/lib/sketch-types";
import { CloseCrossIcon } from "@/ui/icons/trace-icons";
import { SketchToolbar } from "@/video/sketch/sketch-toolbar";

export interface SketchOverlayProps {
  containerEl: HTMLElement | null;
  editingSketch?: SavedSketch | null;
  onCancel: () => void;
  onSaveSketch: (sketch: SavedSketch) => void;
}

interface PendingTextPlacement {
  x: number;
  y: number;
  value: string;
}

function createOpId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function roundCoord(value: number): number {
  return Math.round(clamp01(value) * 10000) / 10000;
}

function cloneOperations(operations: ReadonlyArray<DrawOperation>): DrawOperation[] {
  return operations.map((op) =>
    op.kind === "stroke"
      ? { ...op, points: op.points.map((pt) => ({ x: pt.x, y: pt.y })) }
      : { ...op },
  );
}

function compactOperationsForStorage(operations: ReadonlyArray<DrawOperation>): DrawOperation[] {
  return operations.map((op) =>
    op.kind === "stroke"
      ? {
          ...op,
          points: op.points.map((pt) => ({ x: roundCoord(pt.x), y: roundCoord(pt.y) })),
        }
      : { ...op, x: roundCoord(op.x), y: roundCoord(op.y) },
  );
}

function measureVideoRect(containerEl: HTMLElement | null): VideoContentRect {
  if (!containerEl) {
    return { left: 0, top: 0, width: 640, height: 360, aspectRatio: 16 / 9 };
  }
  const { video, poster } = findMediaElements(containerEl);
  return computeVideoContentRect(containerEl, video, poster);
}

function isTargetFrameReady(
  containerEl: HTMLElement | null,
  editingSketch: SavedSketch | null,
): boolean {
  if (!editingSketch || !containerEl) return true;
  if (
    (editingSketch.savedWithPoster && editingSketch.timestamp === 0) ||
    (!editingSketch.operations && editingSketch.imageDataUrl)
  ) {
    return true;
  }

  const { media, video } = findMediaElements(containerEl);
  const target = video ?? media;
  if (!target) return true;

  const currentTime = target.currentTime;
  const closeEnough =
    Number.isFinite(currentTime) && Math.abs(currentTime - editingSketch.timestamp) <= 0.25;
  if (video) {
    return !video.seeking && video.readyState >= 2 && closeEnough;
  }
  return closeEnough;
}

export function SketchOverlay({
  containerEl,
  editingSketch = null,
  onCancel,
  onSaveSketch,
}: SketchOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);
  const strokeSeedRef = useRef(1);

  const [activeTool, setActiveTool] = useState<DrawingTool>("pen");
  const [activeColor, setActiveColor] = useState<string>(SKETCH_COLORS[1]!.value);
  const [activeSize, setActiveSize] = useState<BrushSize>("md");
  const [operations, setOperations] = useState<DrawOperation[]>(() =>
    editingSketch?.operations ? cloneOperations(editingSketch.operations) : [],
  );
  const [redoStack, setRedoStack] = useState<DrawOperation[]>([]);
  const [activeStroke, setActiveStroke] = useState<StrokeOperation | null>(null);
  const [pendingText, setPendingText] = useState<PendingTextPlacement | null>(null);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [useLegacyBackdrop, setUseLegacyBackdrop] = useState<boolean>(() =>
    Boolean(editingSketch && !editingSketch.operations && editingSketch.imageDataUrl),
  );
  const [seekSettled, setSeekSettled] = useState<boolean>(() =>
    isTargetFrameReady(containerEl, editingSketch),
  );

  const [frameRect, setFrameRect] = useState<VideoContentRect>(() => measureVideoRect(containerEl));

  useDialogFocusTrap(dialogRef, editingSketch?.id ?? "new");

  const isFrameReady = seekSettled || useLegacyBackdrop;

  const mediaSnapshot = useMemo(() => {
    const { media, video, poster } = findMediaElements(containerEl);
    const timestamp = editingSketch
      ? editingSketch.timestamp
      : Number.isFinite(media?.currentTime)
        ? media!.currentTime
        : 0;
    const duration =
      editingSketch && editingSketch.duration > 0
        ? editingSketch.duration
        : Number.isFinite(media?.duration)
          ? media!.duration
          : 0;
    const chapterTitle = editingSketch?.chapterTitle ?? readActiveChapterTitle(video, media);
    return { media, video, poster, timestamp, duration, chapterTitle };
  }, [containerEl, editingSketch]);

  const updateRect = useCallback(() => {
    if (!containerEl) return;
    const { video, poster } = findMediaElements(containerEl);
    const next = computeVideoContentRect(containerEl, video, poster);
    setFrameRect((prev) =>
      prev.left === next.left &&
      prev.top === next.top &&
      prev.width === next.width &&
      prev.height === next.height &&
      prev.aspectRatio === next.aspectRatio
        ? prev
        : next,
    );
  }, [containerEl]);

  useEffect(() => {
    if (seekSettled || !editingSketch || !containerEl) return;

    const { media, video } = findMediaElements(containerEl);
    const target = video ?? media;
    let active = true;

    const markReady = () => {
      if (!active) return;
      setSeekSettled(true);
      updateRect();
    };

    if (!target || isTargetFrameReady(containerEl, editingSketch)) {
      const rafId = window.requestAnimationFrame(markReady);
      return () => {
        active = false;
        window.cancelAnimationFrame(rafId);
      };
    }

    const handleSeekEvent = () => {
      if (!video || (!video.seeking && video.readyState >= 2)) {
        markReady();
      }
    };

    target.addEventListener("seeked", handleSeekEvent);
    target.addEventListener("loadeddata", handleSeekEvent);
    target.addEventListener("canplay", handleSeekEvent);
    const timeoutId = window.setTimeout(markReady, 2500);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      target.removeEventListener("seeked", handleSeekEvent);
      target.removeEventListener("loadeddata", handleSeekEvent);
      target.removeEventListener("canplay", handleSeekEvent);
    };
  }, [containerEl, editingSketch, seekSettled, updateRect]);

  useEffect(() => {
    if (!containerEl) return;

    const rafId = window.requestAnimationFrame(updateRect);
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => updateRect()) : null;
    observer?.observe(containerEl);

    const { video } = findMediaElements(containerEl);
    video?.addEventListener("loadedmetadata", updateRect);
    video?.addEventListener("resize", updateRect);

    return () => {
      window.cancelAnimationFrame(rafId);
      observer?.disconnect();
      video?.removeEventListener("loadedmetadata", updateRect);
      video?.removeEventListener("resize", updateRect);
    };
  }, [containerEl, updateRect]);

  const allOperations = useMemo(
    () => (activeStroke ? [...operations, activeStroke] : operations),
    [operations, activeStroke],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssWidth = Math.max(1, Math.round(frameRect.width));
    const cssHeight = Math.max(1, Math.round(frameRect.height));

    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderSketchOperations(ctx, cssWidth, cssHeight, allOperations);
  }, [allOperations, frameRect.height, frameRect.width]);

  useEffect(() => {
    if (pendingText) {
      textInputRef.current?.focus();
    }
  }, [pendingText]);

  const commitPendingText = useCallback(() => {
    if (!pendingText) return;
    const cleaned = pendingText.value.trim();
    if (cleaned.length > 0) {
      setOperations((prev) => [
        ...prev,
        {
          id: createOpId(),
          kind: "text",
          x: pendingText.x,
          y: pendingText.y,
          text: cleaned,
          color: activeColor,
          size: activeSize,
        },
      ]);
      setRedoStack([]);
    }
    setPendingText(null);
    dialogRef.current?.focus({ preventScroll: true });
  }, [activeColor, activeSize, pendingText]);

  const dismissPendingText = useCallback(() => {
    setPendingText(null);
    dialogRef.current?.focus({ preventScroll: true });
  }, []);

  const handleUndo = useCallback(() => {
    setPendingText(null);
    setOperations((prev) => {
      if (prev.length === 0) return prev;
      const popped = prev[prev.length - 1]!;
      setRedoStack((redo) => [...redo, popped]);
      return prev.slice(0, -1);
    });
  }, []);

  const handleRedo = useCallback(() => {
    setPendingText(null);
    setRedoStack((redo) => {
      if (redo.length === 0) return redo;
      const restored = redo[redo.length - 1]!;
      setOperations((prev) => [...prev, restored]);
      return redo.slice(0, -1);
    });
  }, []);

  const handleClear = useCallback(() => {
    setPendingText(null);
    setOperations([]);
    setRedoStack([]);
    setUseLegacyBackdrop(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (pendingText) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) handleRedo();
        else handleUndo();
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        handleRedo();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRedo, handleUndo, onCancel, pendingText]);

  const toNormalizedPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: clamp01((event.clientX - rect.left) / Math.max(1, rect.width)),
      y: clamp01((event.clientY - rect.top) / Math.max(1, rect.height)),
    };
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    event.preventDefault();
    event.stopPropagation();

    const point = toNormalizedPoint(event);

    if (activeTool === "text") {
      if (pendingText) {
        commitPendingText();
      } else {
        setPendingText({ x: point.x, y: point.y, value: "" });
      }
      return;
    }

    if (pendingText) {
      commitPendingText();
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    strokeSeedRef.current += 1;
    setActiveStroke({
      id: createOpId(),
      kind: "stroke",
      tool: activeTool,
      color: activeColor,
      size: activeSize,
      points: [point],
      seed: strokeSeedRef.current * 97,
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoverPoint({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    if (!activeStroke) return;
    event.preventDefault();
    const point = toNormalizedPoint(event);
    setActiveStroke((current) => {
      if (!current) return null;
      const last = current.points[current.points.length - 1];
      if (last && Math.hypot(last.x - point.x, last.y - point.y) < 0.002) {
        return current;
      }
      return { ...current, points: [...current.points, point] };
    });
  };

  const finishStroke = () => {
    if (!activeStroke) return;
    const finished = activeStroke;
    setActiveStroke(null);
    setOperations((prev) => [...prev, finished]);
    setRedoStack([]);
  };

  const handleTextKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      commitPendingText();
    } else if (event.key === "Escape") {
      event.preventDefault();
      dismissPendingText();
    }
  };

  const handleSave = async () => {
    if (isSaving || !isFrameReady) return;
    if (pendingText?.value.trim()) {
      commitPendingText();
    }
    setIsSaving(true);
    try {
      const finalOps =
        pendingText && pendingText.value.trim().length > 0
          ? [
              ...operations,
              {
                id: createOpId(),
                kind: "text" as const,
                x: pendingText.x,
                y: pendingText.y,
                text: pendingText.value.trim(),
                color: activeColor,
                size: activeSize,
              },
            ]
          : operations;

      const { video, poster } = findMediaElements(containerEl);
      const posterRoot = poster?.closest("media-poster");
      const preferPoster = editingSketch
        ? Boolean(editingSketch.savedWithPoster && editingSketch.timestamp === 0)
        : Boolean(posterRoot?.hasAttribute("data-visible"));

      const imageDataUrl = await captureCompositeSketch({
        video,
        poster,
        aspectRatio: frameRect.aspectRatio,
        operations: finalOps,
        preferPoster,
        backdropImageUrl: useLegacyBackdrop ? editingSketch?.imageDataUrl : undefined,
      });

      if (editingSketch) {
        onSaveSketch({
          ...editingSketch,
          imageDataUrl,
          duration: mediaSnapshot.duration,
          aspectRatio: frameRect.aspectRatio,
          chapterTitle: mediaSnapshot.chapterTitle,
          updatedAt: Date.now(),
          savedWithPoster: preferPoster,
          operations: useLegacyBackdrop ? undefined : compactOperationsForStorage(finalOps),
        });
      } else {
        onSaveSketch({
          id: createOpId(),
          imageDataUrl,
          timestamp: mediaSnapshot.timestamp,
          duration: mediaSnapshot.duration,
          createdAt: Date.now(),
          aspectRatio: frameRect.aspectRatio,
          chapterTitle: mediaSnapshot.chapterTitle,
          savedWithPoster: preferPoster,
          operations: compactOperationsForStorage(finalOps),
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const eraserRadius = getToolLineWidth("eraser", activeSize, frameRect.width) / 2;
  const isCompactHeight = frameRect.height < 260;
  const minTextTop = isCompactHeight ? Math.min(44, Math.max(8, frameRect.height * 0.2)) : 8;
  const maxTextTop = Math.max(minTextTop, frameRect.height - (isCompactHeight ? 96 : 56));
  const maxTextLeft = Math.max(8, frameRect.width - (frameRect.width < 420 ? 204 : 236));

  return (
    <dialog
      ref={dialogRef}
      open
      aria-modal="true"
      aria-label={editingSketch ? "Edit saved sketch" : "Video frame drawing mode"}
      tabIndex={-1}
      className="absolute inset-0 z-30 m-0 size-full max-h-none max-w-none select-none overflow-hidden rounded-[inherit] border-0 bg-transparent p-0 text-inherit outline-hidden"
    >
      {/* Drawing Surface Strictly Aligned Over the Rendered Video Frame */}
      <div
        className="absolute overflow-hidden outline-2 -outline-offset-2 outline-dashed outline-[#F59E0B]/65"
        style={{
          left: `${frameRect.left}px`,
          top: `${frameRect.top}px`,
          width: `${frameRect.width}px`,
          height: `${frameRect.height}px`,
        }}
      >
        {useLegacyBackdrop && editingSketch?.imageDataUrl && (
          <img
            src={editingSketch.imageDataUrl}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none absolute inset-0 size-full object-fill select-none"
          />
        )}

        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
          onPointerLeave={() => setHoverPoint(null)}
          className={cn(
            "relative block size-full touch-none",
            activeTool === "text"
              ? "cursor-text"
              : activeTool === "eraser"
                ? "cursor-none"
                : "cursor-crosshair",
          )}
        />

        {editingSketch && !isFrameReady && (
          <div
            aria-live="polite"
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-(--media-frame-border,#805D35) bg-media-popover/90 px-3 py-1 text-xs font-bold text-media-popover-foreground shadow-md"
          >
            Finding frame…
          </div>
        )}

        {/* Custom Eraser Ring Preview */}
        {activeTool === "eraser" && hoverPoint && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FFFDF7] bg-[#2B2118]/20 shadow-[0_0_0_1.5px_#2B2118]"
            style={{
              left: `${hoverPoint.x}px`,
              top: `${hoverPoint.y}px`,
              width: `${Math.max(12, eraserRadius * 2)}px`,
              height: `${Math.max(12, eraserRadius * 2)}px`,
            }}
          />
        )}

        {/* Inline Click-to-Place Text Input */}
        {pendingText && (
          <div
            className="absolute z-50 flex items-center gap-1 rounded-xl border-2 border-(--media-frame-border,#805D35) bg-media-popover/95 p-1 shadow-[0_6px_18px_rgba(80,50,20,0.3)]"
            style={{
              left: `${Math.min(Math.max(8, pendingText.x * frameRect.width), maxTextLeft)}px`,
              top: `${Math.min(Math.max(minTextTop, pendingText.y * frameRect.height - 20), maxTextTop)}px`,
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <input
              ref={textInputRef}
              type="text"
              value={pendingText.value}
              onChange={(e) => setPendingText({ ...pendingText, value: e.target.value })}
              onKeyDown={handleTextKeyDown}
              placeholder="Write on frame…"
              aria-label="Text to place on video frame"
              className="w-28 media-md:w-36 bg-transparent px-2 py-1 text-sm font-bold text-media-popover-foreground outline-hidden placeholder:text-media-muted-foreground"
              style={{
                color:
                  activeColor === "#FFFDF7" || activeColor === "#2B2118" ? undefined : activeColor,
              }}
            />
            <button
              type="button"
              onClick={commitPendingText}
              aria-label="Place text"
              className="rounded-lg bg-[#6E9A3E] px-2 py-1 text-xs font-bold text-[#FFFDF7] hover:bg-[#5E8633] cursor-pointer focus-visible:outline-2 focus-visible:outline-media-ring"
            >
              Add
            </button>
            <button
              type="button"
              onClick={dismissPendingText}
              aria-label="Discard text"
              className="grid size-6 place-items-center rounded-lg hover:bg-media-accent text-media-popover-foreground cursor-pointer focus-visible:outline-2 focus-visible:outline-media-ring"
            >
              <CloseCrossIcon className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Drawing App Header & Tool Dock */}
      <SketchToolbar
        activeTool={activeTool}
        activeColor={activeColor}
        activeSize={activeSize}
        timestamp={mediaSnapshot.timestamp}
        canUndo={operations.length > 0}
        canRedo={redoStack.length > 0}
        hasOperations={operations.length > 0 || useLegacyBackdrop}
        isSaving={isSaving}
        isEditing={Boolean(editingSketch)}
        saveDisabled={!isFrameReady}
        onSelectTool={(tool) => {
          if (tool !== "text" && pendingText) commitPendingText();
          setActiveTool(tool);
        }}
        onSelectColor={setActiveColor}
        onSelectSize={setActiveSize}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onCancel={onCancel}
        onSave={handleSave}
      />
    </dialog>
  );
}
