/** @jsxImportSource react */

"use client";

import { MuteButton as MuteButtonPrimitive } from "@videojs/react";
import { useEffect, useRef, useState } from "react";

import { findMediaElements, type MediaHostLike } from "@/lib/media-element";
import { cn, resolveClassName } from "@/lib/resolve-class-name";
import { Button } from "@/ui/button";
import { SongbirdVolumeIcon } from "@/ui/icons/volume-icons";

export type MuteButtonProps = Omit<MuteButtonPrimitive.Props, "children">;

export function MuteButton({ className, ...props }: MuteButtonProps = {}) {
  const probeRef = useRef<HTMLSpanElement | null>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    const container = probeRef.current?.closest(".media-skin");
    if (!(container instanceof HTMLElement)) return;

    let boundTarget: HTMLVideoElement | MediaHostLike | null = null;
    let boundShadowRoot: ShadowRoot | null = null;

    const syncPaused = () => {
      const { media, video } = findMediaElements(container);
      const target = video ?? media;
      const ended = Boolean(target && "ended" in target && target.ended);
      const pausedNow = target ? Boolean(target.paused || ended) : true;
      setIsPaused((prev) => (prev === pausedNow ? prev : pausedNow));
    };

    const detachTarget = (target: HTMLVideoElement | MediaHostLike | null) => {
      if (!target) return;
      target.removeEventListener("play", syncPaused);
      target.removeEventListener("playing", syncPaused);
      target.removeEventListener("pause", syncPaused);
      target.removeEventListener("ended", syncPaused);
      target.removeEventListener("emptied", syncPaused);
      target.removeEventListener("loadedmetadata", syncPaused);
    };

    const bindMedia = () => {
      const { media, video } = findMediaElements(container);
      const nextTarget = video ?? media;

      if (media?.shadowRoot && media.shadowRoot !== boundShadowRoot) {
        boundShadowRoot = media.shadowRoot;
        shadowObserver?.disconnect();
        shadowObserver?.observe(boundShadowRoot, { childList: true, subtree: true });
      }

      if (nextTarget !== boundTarget) {
        detachTarget(boundTarget);
        boundTarget = nextTarget;
        if (boundTarget) {
          boundTarget.addEventListener("play", syncPaused);
          boundTarget.addEventListener("playing", syncPaused);
          boundTarget.addEventListener("pause", syncPaused);
          boundTarget.addEventListener("ended", syncPaused);
          boundTarget.addEventListener("emptied", syncPaused);
          boundTarget.addEventListener("loadedmetadata", syncPaused);
        }
      }
    };

    const containerObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            bindMedia();
            syncPaused();
          })
        : null;
    const shadowObserver =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            bindMedia();
            syncPaused();
          })
        : null;

    containerObserver?.observe(container, { childList: true, subtree: true });
    container.addEventListener("loadedmetadata", syncPaused, true);
    bindMedia();
    const rafId = window.requestAnimationFrame(syncPaused);

    return () => {
      window.cancelAnimationFrame(rafId);
      containerObserver?.disconnect();
      shadowObserver?.disconnect();
      container.removeEventListener("loadedmetadata", syncPaused, true);
      detachTarget(boundTarget);
    };
  }, []);

  return (
    <MuteButtonPrimitive
      render={<Button />}
      data-video-paused={isPaused ? "" : undefined}
      className={(state) =>
        cn(
          "group/mute h-10! w-11! p-0.5! motion-safe:hover:scale-110 motion-safe:active:scale-95 transition-transform duration-media-base",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <span ref={probeRef} hidden aria-hidden="true" />
      <SongbirdVolumeIcon
        level="off"
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "opacity-0 scale-75",
          "group-data-muted/mute:scale-100 group-data-muted/mute:opacity-100",
          "group-data-[volume-level=off]/mute:scale-100 group-data-[volume-level=off]/mute:opacity-100",
        )}
      />
      <SongbirdVolumeIcon
        level="paused"
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "opacity-0 scale-75",
          "group-[:not([data-muted]):not([data-volume-level=off])[data-video-paused]]/mute:opacity-100",
          "group-[:not([data-muted]):not([data-volume-level=off])[data-video-paused]]/mute:scale-100",
        )}
      />
      <SongbirdVolumeIcon
        level="low"
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "opacity-0 scale-75",
          "group-not-data-muted/mute:group-not-data-video-paused/mute:group-data-[volume-level=low]/mute:opacity-100",
          "group-not-data-muted/mute:group-not-data-video-paused/mute:group-data-[volume-level=low]/mute:scale-100",
        )}
      />
      <SongbirdVolumeIcon
        level="high"
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "opacity-0 scale-75",
          "group-[:not([data-muted]):not([data-video-paused]):not([data-volume-level=low]):not([data-volume-level=off])]/mute:opacity-100",
          "group-[:not([data-muted]):not([data-video-paused]):not([data-volume-level=low]):not([data-volume-level=off])]/mute:scale-100",
        )}
      />
    </MuteButtonPrimitive>
  );
}
