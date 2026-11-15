/** @jsxImportSource react */

"use client";

import { Fragment, useCallback, useEffect, useState, type ReactNode } from "react";

import {
  isCaptionTrack,
  readActiveCaptionCues,
  resolveTextTrackList,
  suppressNativeVideoCaptions,
  type ActiveCaptionCue,
  type CueInlineNode,
} from "@/lib/captions";
import { findMediaElements } from "@/lib/media-element";
import { cn } from "@/lib/resolve-class-name";

export interface StorybookCaptionsProps {
  containerEl: HTMLElement | null;
  hidden?: boolean;
  className?: string;
}

function renderCueNodes(nodes: ReadonlyArray<CueInlineNode>, keyPrefix: string): ReactNode {
  return nodes.map((node, index) => {
    const key = `${keyPrefix}-${index}`;
    switch (node.kind) {
      case "text":
        return <Fragment key={key}>{node.value}</Fragment>;
      case "br":
        return <br key={key} />;
      case "bold":
        return (
          <strong key={key} className="font-extrabold">
            {renderCueNodes(node.children, key)}
          </strong>
        );
      case "italic":
        return (
          <em key={key} className="italic">
            {renderCueNodes(node.children, key)}
          </em>
        );
      case "underline":
        return (
          <span key={key} className="underline decoration-2 underline-offset-2">
            {renderCueNodes(node.children, key)}
          </span>
        );
      case "ruby":
        return <ruby key={key}>{renderCueNodes(node.children, key)}</ruby>;
      case "rt":
        return (
          <rt key={key} className="text-[0.65em] font-semibold">
            {renderCueNodes(node.children, key)}
          </rt>
        );
    }
  });
}

function cuesEqual(
  a: ReadonlyArray<ActiveCaptionCue>,
  b: ReadonlyArray<ActiveCaptionCue>,
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i]!.signature !== b[i]!.signature) return false;
  }
  return true;
}

export function StorybookCaptions({
  containerEl,
  hidden = false,
  className,
}: StorybookCaptionsProps) {
  const [cues, setCues] = useState<ActiveCaptionCue[]>([]);

  const syncFromContainer = useCallback(() => {
    if (!containerEl) {
      setCues((prev) => (prev.length === 0 ? prev : []));
      return;
    }
    const { media, video } = findMediaElements(containerEl);
    suppressNativeVideoCaptions(video, media);
    const trackList = resolveTextTrackList(video, media);
    const next = readActiveCaptionCues(trackList);
    setCues((prev) => (cuesEqual(prev, next) ? prev : next));
  }, [containerEl]);

  useEffect(() => {
    if (!containerEl) return;

    let boundTracks: TextTrack[] = [];
    let boundTrackList: TextTrackList | null = null;
    let boundVideo: HTMLVideoElement | null = null;
    let boundShadowRoot: ShadowRoot | null = null;

    const detachTrackListeners = () => {
      for (const track of boundTracks) {
        track.removeEventListener("cuechange", syncFromContainer);
      }
      boundTracks = [];
    };

    const rebindTracks = () => {
      detachTrackListeners();
      if (!boundTrackList) return;
      for (let i = 0; i < boundTrackList.length; i += 1) {
        const track = boundTrackList[i];
        if (track && isCaptionTrack(track)) {
          track.addEventListener("cuechange", syncFromContainer);
          boundTracks.push(track);
        }
      }
    };

    const handleTrackListMutation = () => {
      rebindTracks();
      syncFromContainer();
    };

    const bindMediaListeners = () => {
      const { media, video } = findMediaElements(containerEl);
      suppressNativeVideoCaptions(video, media);
      const nextTrackList = resolveTextTrackList(video, media);

      if (media?.shadowRoot && media.shadowRoot !== boundShadowRoot) {
        boundShadowRoot = media.shadowRoot;
        shadowObserver?.disconnect();
        shadowObserver?.observe(boundShadowRoot, { childList: true, subtree: true });
      }

      if (video !== boundVideo) {
        boundVideo?.removeEventListener("seeked", syncFromContainer);
        boundVideo?.removeEventListener("emptied", syncFromContainer);
        boundVideo = video;
        boundVideo?.addEventListener("seeked", syncFromContainer);
        boundVideo?.addEventListener("emptied", syncFromContainer);
      }

      if (nextTrackList !== boundTrackList) {
        boundTrackList?.removeEventListener("addtrack", handleTrackListMutation);
        boundTrackList?.removeEventListener("removetrack", handleTrackListMutation);
        boundTrackList?.removeEventListener("change", syncFromContainer);

        boundTrackList = nextTrackList;
        if (boundTrackList) {
          boundTrackList.addEventListener("addtrack", handleTrackListMutation);
          boundTrackList.addEventListener("removetrack", handleTrackListMutation);
          boundTrackList.addEventListener("change", syncFromContainer);
        }
      }

      rebindTracks();
      syncFromContainer();
    };

    const containerObserver =
      typeof MutationObserver !== "undefined" ? new MutationObserver(bindMediaListeners) : null;
    const shadowObserver =
      typeof MutationObserver !== "undefined" ? new MutationObserver(bindMediaListeners) : null;

    containerObserver?.observe(containerEl, { childList: true, subtree: true });
    containerEl.addEventListener("loadedmetadata", bindMediaListeners, true);
    bindMediaListeners();

    return () => {
      containerObserver?.disconnect();
      shadowObserver?.disconnect();
      containerEl.removeEventListener("loadedmetadata", bindMediaListeners, true);
      boundVideo?.removeEventListener("seeked", syncFromContainer);
      boundVideo?.removeEventListener("emptied", syncFromContainer);
      boundTrackList?.removeEventListener("addtrack", handleTrackListMutation);
      boundTrackList?.removeEventListener("removetrack", handleTrackListMutation);
      boundTrackList?.removeEventListener("change", syncFromContainer);
      detachTrackListeners();
    };
  }, [containerEl, syncFromContainer]);

  if (hidden || cues.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="off"
      className={cn(
        "storybook-captions-layer pointer-events-none absolute inset-x-2 media-md:inset-x-3 z-20 flex flex-col items-center justify-end gap-1 media-md:gap-1.5 overflow-hidden",
        className,
      )}
    >
      {cues.slice(0, 1).map((cue) => (
        <div
          key={cue.key}
          className={cn(
            "storybook-caption-plaque max-w-[min(90%,42rem)] text-center font-media",
            "rounded-2xl px-4 py-1.5",
            "border-2 border-(--media-frame-border,#805D35) text-media-popover-foreground",
            "shadow-[0_4px_16px_rgba(32,23,14,0.28)] ring-1 ring-inset ring-media-border/45",
            "text-media media-2xl:text-media-lg font-semibold leading-snug tracking-[0.01em]",
          )}
        >
          <span className="block media-max-md:line-clamp-3">
            {renderCueNodes(cue.nodes, cue.key)}
          </span>
        </div>
      ))}
    </div>
  );
}
