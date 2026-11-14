/** @jsxImportSource react */

"use client";

import "../styles/video/neutral.css";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import {
  findMediaElements,
  loadStoredSketches,
  resolveStorageKey,
  saveStoredSketches,
} from "@/lib/media-element";
import { cn } from "@/lib/resolve-class-name";
import type { SavedSketch, TraceMode } from "@/lib/sketch-types";
import { BufferingIndicator } from "@/ui/buffering-indicator";
import { Container } from "@/ui/container";
import { ErrorDialog } from "@/ui/error-dialog";
import { Poster } from "@/ui/poster";
import { StorybookCaptions } from "@/ui/storybook-captions";
import { Title } from "@/ui/title";
import { VideoGestures } from "@/video/behaviors/gestures";
import { VideoHotkeys } from "@/video/behaviors/hotkeys";
import { VideoStatusIndicators } from "@/video/display/status-indicators";
import { FilmstripOverlay } from "@/video/filmstrip/filmstrip-overlay";
import { NeutralVideoControls } from "@/video/layout/controls";
import { SketchOverlay } from "@/video/sketch/sketch-overlay";

export interface VideoSkinProps extends Omit<
  NonNullable<ComponentProps<typeof Container>>,
  "children"
> {
  children?: ReactNode;
  title?: string;
  renderPoster?: NonNullable<ComponentProps<typeof Poster>>["renderImage"];
  renderThumbnail?: NonNullable<ComponentProps<typeof NeutralVideoControls>>["renderThumbnail"];
}

export function VideoSkin({
  children,
  className,
  title,
  renderPoster,
  renderThumbnail,
  ...props
}: VideoSkinProps = {}) {
  const probeRef = useRef<HTMLSpanElement | null>(null);
  const sketchTriggerRef = useRef<HTMLButtonElement | null>(null);
  const filmstripTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);
  const [mode, setMode] = useState<TraceMode>("playback");
  const [sketches, setSketches] = useState<SavedSketch[]>([]);
  const [activeFilmstripIndex, setActiveFilmstripIndex] = useState(0);
  const [storageKey, setStorageKey] = useState("trace-sketches:v1:default");
  const [savedNoticeVisible, setSavedNoticeVisible] = useState(false);
  const [resolvedVideoTitle, setResolvedVideoTitle] = useState<string | undefined>(title);

  useEffect(() => {
    const parent = probeRef.current?.parentElement ?? null;
    setContainerEl(parent);
    if (!parent) return;

    const { media } = findMediaElements(parent);
    const key = resolveStorageKey(media);
    setStorageKey(key);
    setSketches(loadStoredSketches(key));
  }, [children]);

  useEffect(() => {
    if (!savedNoticeVisible) return;
    const timer = window.setTimeout(() => setSavedNoticeVisible(false), 2800);
    return () => window.clearTimeout(timer);
  }, [savedNoticeVisible]);

  const pauseMediaIfPlaying = useCallback(() => {
    const { media } = findMediaElements(containerEl);
    if (media && !media.paused) {
      media.pause();
    }
  }, [containerEl]);

  const restoreTriggerFocus = useCallback(
    (targetKind: "sketch" | "filmstrip" | "container") => {
      window.requestAnimationFrame(() => {
        if (targetKind === "container") {
          if (containerEl && containerEl.tabIndex >= 0) {
            containerEl.focus({ preventScroll: true });
          } else if (filmstripTriggerRef.current?.offsetParent !== null) {
            filmstripTriggerRef.current?.focus({ preventScroll: true });
          }
          return;
        }

        const button =
          targetKind === "filmstrip" ? filmstripTriggerRef.current : sketchTriggerRef.current;
        if (button && button.offsetParent !== null) {
          button.focus({ preventScroll: true });
        } else if (containerEl && containerEl.tabIndex >= 0) {
          containerEl.focus({ preventScroll: true });
        }
      });
    },
    [containerEl],
  );

  const handleOpenSketch = useCallback(() => {
    pauseMediaIfPlaying();
    setSavedNoticeVisible(false);
    setMode("sketch");
  }, [pauseMediaIfPlaying]);

  const handleOpenFilmstrip = useCallback(() => {
    pauseMediaIfPlaying();
    setSavedNoticeVisible(false);
    const { media, video } = findMediaElements(containerEl);
    setResolvedVideoTitle(
      title?.trim() ||
        media?.getAttribute("title")?.trim() ||
        video?.getAttribute("title")?.trim() ||
        undefined,
    );
    setActiveFilmstripIndex((current) => {
      if (sketches.length === 0) return 0;
      return Math.min(current, sketches.length - 1);
    });
    setMode("filmstrip");
  }, [containerEl, pauseMediaIfPlaying, sketches.length, title]);

  const handleSaveSketch = useCallback(
    (sketch: SavedSketch) => {
      setSketches((prev) => {
        const next = [...prev, sketch];
        saveStoredSketches(storageKey, next);
        setActiveFilmstripIndex(next.length - 1);
        return next;
      });
      setMode("playback");
      setSavedNoticeVisible(true);
      restoreTriggerFocus("filmstrip");
    },
    [restoreTriggerFocus, storageKey],
  );

  const handleDeleteSketch = useCallback(
    (id: string) => {
      setSketches((prev) => {
        const next = prev.filter((item) => item.id !== id);
        saveStoredSketches(storageKey, next);
        setActiveFilmstripIndex((current) =>
          next.length === 0 ? 0 : Math.min(current, next.length - 1),
        );
        return next;
      });
    },
    [storageKey],
  );

  const handleJumpToTimestamp = useCallback(
    (seconds: number) => {
      const { media } = findMediaElements(containerEl);
      if (media) {
        const maxTime =
          Number.isFinite(media.duration) && media.duration > 0 ? media.duration : seconds;
        media.currentTime = Math.max(0, Math.min(seconds, maxTime));
      }
      setMode("playback");
      restoreTriggerFocus("container");
    },
    [containerEl, restoreTriggerFocus],
  );

  const isPlaybackMode = mode === "playback";

  return (
    <Container
      className={cn(
        isPlaybackMode && "pointer-fine:not-data-controls-visible:cursor-none",
        className,
      )}
      data-theme="storybook"
      data-preset="video"
      data-trace-mode={mode}
      {...props}
    >
      <span ref={probeRef} hidden aria-hidden="true" />
      {children}
      <Poster renderImage={renderPoster} />
      {isPlaybackMode && <BufferingIndicator />}
      <ErrorDialog />
      {isPlaybackMode && <Title containerEl={containerEl} fallbackTitle={title} />}
      <StorybookCaptions containerEl={containerEl} hidden={!isPlaybackMode} />

      <NeutralVideoControls
        renderThumbnail={renderThumbnail}
        mode={mode}
        sketchCount={sketches.length}
        sketchTriggerRef={sketchTriggerRef}
        filmstripTriggerRef={filmstripTriggerRef}
        onOpenSketch={handleOpenSketch}
        onOpenFilmstrip={handleOpenFilmstrip}
      />

      {mode === "sketch" && (
        <SketchOverlay
          containerEl={containerEl}
          onCancel={() => {
            setMode("playback");
            restoreTriggerFocus("sketch");
          }}
          onSaveSketch={handleSaveSketch}
        />
      )}

      {mode === "filmstrip" && (
        <FilmstripOverlay
          sketches={sketches}
          videoTitle={title?.trim() || resolvedVideoTitle}
          activeIndex={activeFilmstripIndex}
          onChangeIndex={setActiveFilmstripIndex}
          onDeleteSketch={handleDeleteSketch}
          onJumpToTimestamp={handleJumpToTimestamp}
          onStartNewSketch={handleOpenSketch}
          onClose={() => {
            setMode("playback");
            restoreTriggerFocus("filmstrip");
          }}
        />
      )}

      {isPlaybackMode && savedNoticeVisible && (
        <div className="pointer-events-none absolute top-3 left-1/2 z-40 -translate-x-1/2">
          <button
            type="button"
            onClick={handleOpenFilmstrip}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-full border-2 border-[#6E9A3E]",
              "bg-media-popover/95 px-3.5 py-1 text-xs font-bold text-media-popover-foreground shadow-lg",
              "cursor-pointer transition-transform motion-safe:hover:scale-105 focus-visible:outline-2 focus-visible:outline-media-ring",
            )}
          >
            <span className="size-2 rounded-full bg-[#6E9A3E]" />
            <span>Sketch saved! View filmstrip</span>
          </button>
        </div>
      )}

      <VideoHotkeys disabled={!isPlaybackMode} />
      <VideoGestures disabled={!isPlaybackMode} />
      {isPlaybackMode && <VideoStatusIndicators />}
    </Container>
  );
}
