/** @jsxImportSource react */

"use client";

import type { SliderPreviewOverflow } from "@videojs/core";
import { Slider as SliderPrimitive, TimeSlider as TimeSliderPrimitive } from "@videojs/react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import { resolveTextTrackList } from "@/lib/captions";
import {
  chapterSegmentsEqual,
  findTrackElements,
  readActiveChapterIndex,
  readChapterSegments,
  type ChapterSegment,
} from "@/lib/chapters";
import { findMediaElements, type MediaHostLike } from "@/lib/media-element";
import { cn, resolveClassName } from "@/lib/resolve-class-name";
import { LadybugThumbIcon } from "@/ui/icons/ladybug-icon";
import { SliderThumb, type SliderThumbProps } from "@/ui/slider";

export interface TimeSliderProps extends Omit<TimeSliderPrimitive.RootProps, "children"> {
  previewOverflow?: SliderPreviewOverflow | undefined;
  /** Draws the thumbnail preview image in place of the one the skin renders. */
  renderThumbnail?: SliderPrimitive.Thumbnail.ImageProps["render"];
}

interface TimeSliderThumbProps extends SliderThumbProps {
  playing: boolean;
  paused: boolean;
  wingsOpen: boolean;
}

const WING_FLUTTER_DURATION_MS = 1300;
const SEGMENT_GAP_HALF_PX = 3.5;

const DEFAULT_SEGMENTS: ChapterSegment[] = [
  {
    key: "segment-0-0.00-100.00",
    startPercent: 0,
    endPercent: 100,
    spanPercent: 100,
    spanRatio: 1,
    isFirst: true,
    isLast: true,
  },
];

function TimeSliderThumb({ playing, paused, wingsOpen, ...props }: TimeSliderThumbProps) {
  return (
    <SliderThumb {...props}>
      <LadybugThumbIcon
        className="h-8 w-10"
        playing={playing}
        paused={paused}
        wingsOpen={wingsOpen}
      />
    </SliderThumb>
  );
}

export function TimeSlider({
  className,
  previewOverflow = "visible",
  renderThumbnail,
  ...props
}: TimeSliderProps = {}) {
  const probeRef = useRef<HTMLSpanElement | null>(null);
  const lastChapterIndexRef = useRef<number | null>(null);
  const wingsTimerRef = useRef<number | null>(null);
  const waitingRef = useRef(false);

  const [segments, setSegments] = useState<ChapterSegment[]>(DEFAULT_SEGMENTS);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wingsOpen, setWingsOpen] = useState(false);

  const triggerWingsOpen = useCallback(() => {
    if (wingsTimerRef.current !== null) {
      window.clearTimeout(wingsTimerRef.current);
    }
    setWingsOpen(true);
    wingsTimerRef.current = window.setTimeout(() => {
      setWingsOpen(false);
      wingsTimerRef.current = null;
    }, WING_FLUTTER_DURATION_MS);
  }, []);

  const evaluateChapterTransition = useCallback(() => {
    const container = probeRef.current?.closest(".media-skin");
    if (!(container instanceof HTMLElement)) return;

    const { media, video } = findMediaElements(container);
    const nextIndex = readActiveChapterIndex(video, media);
    if (nextIndex === null) return;

    const prevIndex = lastChapterIndexRef.current;
    if (prevIndex === null) {
      lastChapterIndexRef.current = nextIndex;
      return;
    }

    if (nextIndex !== prevIndex) {
      lastChapterIndexRef.current = nextIndex;
      if (nextIndex > prevIndex) {
        triggerWingsOpen();
      }
    }
  }, [triggerWingsOpen]);

  const syncPlaybackState = useCallback(() => {
    const container = probeRef.current?.closest(".media-skin");
    if (!(container instanceof HTMLElement)) {
      setIsPlaying(false);
      return;
    }

    const { media, video } = findMediaElements(container);
    const target = video ?? media;
    const ended = Boolean(target && "ended" in target && target.ended);
    const playingNow = Boolean(target && !target.paused && !ended && !waitingRef.current);
    setIsPlaying((prev) => (prev === playingNow ? prev : playingNow));
  }, []);

  const syncChapters = useCallback(() => {
    const container = probeRef.current?.closest(".media-skin");
    if (!(container instanceof HTMLElement)) {
      setSegments((prev) =>
        chapterSegmentsEqual(prev, DEFAULT_SEGMENTS) ? prev : DEFAULT_SEGMENTS,
      );
      return;
    }
    const { media, video } = findMediaElements(container);
    const next = readChapterSegments(video, media);
    setSegments((prev) => (chapterSegmentsEqual(prev, next) ? prev : next));
    evaluateChapterTransition();
  }, [evaluateChapterTransition]);

  useEffect(() => {
    const container = probeRef.current?.closest(".media-skin");
    if (!(container instanceof HTMLElement)) return;

    let boundTarget: HTMLVideoElement | MediaHostLike | null = null;
    let boundTrackList: TextTrackList | null = null;
    let boundChapterTracks: TextTrack[] = [];
    let boundTrackElements: HTMLTrackElement[] = [];
    let boundShadowRoot: ShadowRoot | null = null;

    const handlePlay = () => {
      waitingRef.current = false;
      syncPlaybackState();
    };

    const handleWaiting = () => {
      waitingRef.current = true;
      syncPlaybackState();
    };

    const handlePauseOrEnd = () => {
      waitingRef.current = false;
      syncPlaybackState();
    };

    const handleTimeProgress = () => {
      const target = boundTarget;
      if (target && !target.paused && !("ended" in target && target.ended)) {
        waitingRef.current = false;
      }
      syncPlaybackState();
      evaluateChapterTransition();
    };

    const handleEmptied = () => {
      waitingRef.current = false;
      lastChapterIndexRef.current = null;
      if (wingsTimerRef.current !== null) {
        window.clearTimeout(wingsTimerRef.current);
        wingsTimerRef.current = null;
      }
      setWingsOpen(false);
      syncPlaybackState();
      syncChapters();
    };

    const handleChapterCueChange = () => {
      syncChapters();
      evaluateChapterTransition();
    };

    const detachTargetListeners = (target: HTMLVideoElement | MediaHostLike | null) => {
      if (!target) return;
      target.removeEventListener("loadedmetadata", syncChapters);
      target.removeEventListener("durationchange", syncChapters);
      target.removeEventListener("canplay", handlePlay);
      target.removeEventListener("play", handlePlay);
      target.removeEventListener("playing", handlePlay);
      target.removeEventListener("waiting", handleWaiting);
      target.removeEventListener("pause", handlePauseOrEnd);
      target.removeEventListener("ended", handlePauseOrEnd);
      target.removeEventListener("timeupdate", handleTimeProgress);
      target.removeEventListener("seeking", handleTimeProgress);
      target.removeEventListener("seeked", handleTimeProgress);
      target.removeEventListener("emptied", handleEmptied);
    };

    const detachChapterListeners = () => {
      for (const track of boundChapterTracks) {
        track.removeEventListener("cuechange", handleChapterCueChange);
      }
      boundChapterTracks = [];

      for (const el of boundTrackElements) {
        el.removeEventListener("load", syncChapters);
      }
      boundTrackElements = [];
    };

    const rebindTrackListeners = () => {
      detachChapterListeners();
      const { media } = findMediaElements(container);

      for (const el of findTrackElements(container, media)) {
        el.addEventListener("load", syncChapters);
        boundTrackElements.push(el);
      }

      if (!boundTrackList) return;
      for (let i = 0; i < boundTrackList.length; i += 1) {
        const track = boundTrackList[i];
        if (track && track.kind === "chapters") {
          track.addEventListener("cuechange", handleChapterCueChange);
          boundChapterTracks.push(track);
        }
      }
    };

    const handleTrackMutation = () => {
      rebindTrackListeners();
      syncChapters();
    };

    const bindAll = () => {
      const { media, video } = findMediaElements(container);
      const nextTrackList = resolveTextTrackList(video, media);
      const nextTarget = video ?? media;

      if (media?.shadowRoot && media.shadowRoot !== boundShadowRoot) {
        boundShadowRoot = media.shadowRoot;
        shadowObserver?.disconnect();
        shadowObserver?.observe(boundShadowRoot, { childList: true, subtree: true });
      }

      if (nextTarget !== boundTarget) {
        detachTargetListeners(boundTarget);
        boundTarget = nextTarget;
        if (boundTarget) {
          boundTarget.addEventListener("loadedmetadata", syncChapters);
          boundTarget.addEventListener("durationchange", syncChapters);
          boundTarget.addEventListener("canplay", handlePlay);
          boundTarget.addEventListener("play", handlePlay);
          boundTarget.addEventListener("playing", handlePlay);
          boundTarget.addEventListener("waiting", handleWaiting);
          boundTarget.addEventListener("pause", handlePauseOrEnd);
          boundTarget.addEventListener("ended", handlePauseOrEnd);
          boundTarget.addEventListener("timeupdate", handleTimeProgress);
          boundTarget.addEventListener("seeking", handleTimeProgress);
          boundTarget.addEventListener("seeked", handleTimeProgress);
          boundTarget.addEventListener("emptied", handleEmptied);
        }
      }

      if (nextTrackList !== boundTrackList) {
        boundTrackList?.removeEventListener("addtrack", handleTrackMutation);
        boundTrackList?.removeEventListener("removetrack", handleTrackMutation);
        boundTrackList?.removeEventListener("change", syncChapters);

        boundTrackList = nextTrackList;
        if (boundTrackList) {
          boundTrackList.addEventListener("addtrack", handleTrackMutation);
          boundTrackList.addEventListener("removetrack", handleTrackMutation);
          boundTrackList.addEventListener("change", syncChapters);
        }
      }

      rebindTrackListeners();
      syncPlaybackState();
      syncChapters();
    };

    const containerObserver =
      typeof MutationObserver !== "undefined" ? new MutationObserver(bindAll) : null;
    const shadowObserver =
      typeof MutationObserver !== "undefined" ? new MutationObserver(bindAll) : null;

    containerObserver?.observe(container, { childList: true, subtree: true });
    container.addEventListener("loadedmetadata", bindAll, true);
    container.addEventListener("durationchange", syncChapters, true);
    container.addEventListener("load", syncChapters, true);
    bindAll();

    return () => {
      containerObserver?.disconnect();
      shadowObserver?.disconnect();
      container.removeEventListener("loadedmetadata", bindAll, true);
      container.removeEventListener("durationchange", syncChapters, true);
      container.removeEventListener("load", syncChapters, true);
      detachTargetListeners(boundTarget);
      boundTrackList?.removeEventListener("addtrack", handleTrackMutation);
      boundTrackList?.removeEventListener("removetrack", handleTrackMutation);
      boundTrackList?.removeEventListener("change", syncChapters);
      detachChapterListeners();
      if (wingsTimerRef.current !== null) {
        window.clearTimeout(wingsTimerRef.current);
        wingsTimerRef.current = null;
      }
    };
  }, [evaluateChapterTransition, syncChapters, syncPlaybackState]);

  return (
    <TimeSliderPrimitive.Root
      className={(state) =>
        cn(
          "group/slider relative flex flex-1 cursor-pointer items-center justify-center outline-hidden",
          "data-disabled:pointer-events-none py-2 pointer-coarse:py-3",
          "transition-[--media-slider-fill,--media-slider-buffer] duration-media-slider ease-out data-dragging:duration-0",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <span ref={probeRef} hidden aria-hidden="true" />
      <TimeSliderPrimitive.Track
        render={
          <div className="relative isolate w-full select-none data-[orientation=horizontal]:h-3.5 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3" />
        }
      >
        {segments.map((segment) => {
          const insetLeft = segment.isFirst ? 0 : SEGMENT_GAP_HALF_PX;
          const insetRight = segment.isLast ? 0 : SEGMENT_GAP_HALF_PX;
          const segmentVars = {
            "--seg-start": `${segment.startPercent}%`,
            "--seg-ratio": String(segment.spanRatio),
          } as CSSProperties;

          return (
            <div
              key={segment.key}
              aria-hidden="true"
              style={{
                ...segmentVars,
                insetInlineStart: `calc(${segment.startPercent}% + ${insetLeft}px)`,
                width: `calc(${segment.spanPercent}% - ${insetLeft + insetRight}px)`,
              }}
              className="storybook-vine-track pointer-events-none absolute inset-y-0 min-w-1.5 overflow-hidden rounded-media-pill"
            >
              <div
                className={cn(
                  "storybook-chapter-segment-buffer pointer-events-none absolute inset-y-0 inset-s-0 rounded-media-pill",
                  "bg-[#6E9A3E]/45",
                )}
              />
              <div
                className={cn(
                  "storybook-chapter-segment-fill pointer-events-none absolute inset-y-0 inset-s-0 rounded-media-pill",
                  "border-y border-[#3B561E] bg-linear-to-r rtl:bg-linear-to-l from-[#82B34B] to-[#6E9A3E]",
                )}
              />
            </div>
          );
        })}
      </TimeSliderPrimitive.Track>

      <TimeSliderPrimitive.Thumb
        render={<TimeSliderThumb playing={isPlaying} paused={!isPlaying} wingsOpen={wingsOpen} />}
      />

      {/* Storybook Timestamp & Thumbnail Preview */}
      <TimeSliderPrimitive.Preview
        className={cn(
          "group/preview pointer-events-none absolute inset-0",
          "[--media-slider-preview-max-width:min(12rem,100cqi)]",
          "[--media-preview-left:var(--media-slider-pointer)]",
        )}
        overflow={previewOverflow}
      >
        {/* Storybook Picture Card Preview */}
        <SliderPrimitive.Thumbnail.Root
          className={cn(
            "absolute max-w-(--media-slider-preview-max-width) -translate-x-1/2 rtl:translate-x-1/2 scale-95 opacity-0",
            "origin-bottom transition-all duration-75 ease-out",
            "group-data-pointing/preview:scale-100 group-data-pointing/preview:opacity-100",
            "group-has-focus-visible/slider:scale-100 group-has-focus-visible/slider:opacity-100",
            "bg-media-popover text-media-popover-foreground border-2 border-(--media-frame-border,#805D35) shadow-[0_6px_20px_rgba(80,50,20,0.24)]",
            "group/thumbnail pointer-events-none overflow-hidden rounded-xl",
            "bottom-[calc(100%+2.25rem)]",
            "data-loading:aspect-video data-loading:w-(--media-slider-preview-max-width)",
            "inset-s-(--media-preview-left,var(--media-slider-pointer))",
          )}
        >
          <SliderPrimitive.Thumbnail.Image
            render={renderThumbnail}
            className={cn(
              "block transition-opacity duration-75 ease-out",
              "group-data-loading/thumbnail:opacity-0",
            )}
          />
        </SliderPrimitive.Thumbnail.Root>

        {/* Storybook Chapter & Timestamp Tag */}
        <div
          className={cn(
            "pointer-events-none absolute max-w-44 -translate-x-1/2 rtl:translate-x-1/2 bottom-[calc(100%+0.5rem)] scale-95 opacity-0",
            "transition-all duration-75 ease-out rounded-lg px-2.5 py-0.5",
            "bg-media-popover border-2 border-(--media-frame-border,#805D35) text-media-popover-foreground shadow-md font-bold text-xs",
            "group-data-pointing/preview:scale-100 group-data-pointing/preview:opacity-100",
            "group-has-focus-visible/slider:scale-100 group-has-focus-visible/slider:opacity-100",
            "inset-s-(--media-preview-left,var(--media-slider-pointer)) flex items-center justify-center gap-2 whitespace-nowrap",
          )}
        >
          <TimeSliderPrimitive.ChapterTitle
            className={"max-w-28 min-w-0 truncate empty:hidden text-media-popover-foreground"}
          />
          <TimeSliderPrimitive.Value
            className={"storybook-tabular-nums tabular-nums text-media-primary font-bold"}
            type="pointer"
          />
        </div>
      </TimeSliderPrimitive.Preview>
    </TimeSliderPrimitive.Root>
  );
}
