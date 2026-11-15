/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { StatusIndicator as StatusIndicatorPrimitive } from "@videojs/react";
import {
  CaptionsOnIcon as CaptionsOnIconPrimitive,
  CaptionsOffIcon as CaptionsOffIconPrimitive,
  FullscreenEnterIcon as FullscreenEnterIconPrimitive,
  FullscreenExitIcon as FullscreenExitIconPrimitive,
  PipEnterIcon as PipEnterIconPrimitive,
  PipExitIcon as PipExitIconPrimitive,
} from "@videojs/react/icons/neutral";

import { cn, resolveClassName } from "@/lib/resolve-class-name";
import { SunflowerPauseIcon, SunflowerPlayIcon } from "@/ui/icons/sunflower-icons";

const TOP_STATUS_ACTIONS = [
  "toggleSubtitles",
  "toggleFullscreen",
  "togglePictureInPicture",
] as const;

const PLAYBACK_STATUS_ACTIONS = ["togglePaused"] as const;

export type StatusIndicatorProps = Omit<StatusIndicatorPrimitive.RootProps, "children">;

export function StatusIndicator({ className, ...props }: StatusIndicatorProps = {}) {
  return (
    <StatusIndicatorPrimitive.Root
      actions={TOP_STATUS_ACTIONS}
      className={(state) =>
        cn(
          "pointer-events-none absolute origin-top",
          "transition-[opacity,translate,filter] duration-media-fast ease-out",
          "media-transitioning:opacity-0 media-transitioning:duration-media-indicator media-transitioning:ease-in",
          "inset-x-0 top-1.5 media-md:top-3 flex justify-center",
          "pointer-fine:media-transitioning:blur-media-hidden",
          "data-ending-style:translate-y-media-hidden-indicator-offset",
          "group/input-status",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-xl border-2 border-(--media-frame-border,#805D35) bg-media-popover/95 px-2.5 py-0.5 media-md:px-3 media-md:py-1 font-bold text-xs text-media-popover-foreground shadow-[0_4px_14px_rgba(80,50,20,0.2)]",
        )}
      >
        <CaptionsOnIconPrimitive
          className={cn(
            "hidden shrink-0 size-4",
            "group-data-[status=captions-on]/input-status:block",
            "text-media-primary",
          )}
        />
        <CaptionsOffIconPrimitive
          className={cn(
            "hidden shrink-0 size-4",
            "group-data-[status=captions-off]/input-status:block",
            "text-media-muted-foreground",
          )}
        />
        <FullscreenEnterIconPrimitive
          className={cn(
            "hidden shrink-0 size-4",
            "group-data-[status=fullscreen]/input-status:block",
            "text-media-primary",
          )}
        />
        <FullscreenExitIconPrimitive
          className={cn(
            "hidden shrink-0 size-4",
            "group-data-[status=exit-fullscreen]/input-status:block",
            "text-media-primary",
          )}
        />
        <PipEnterIconPrimitive
          className={cn(
            "hidden shrink-0 size-4",
            "group-data-[status=pip]/input-status:block",
            "text-media-primary",
          )}
        />
        <PipExitIconPrimitive
          className={cn(
            "hidden shrink-0 size-4",
            "group-data-[status=exit-pip]/input-status:block",
            "text-media-primary",
          )}
        />
        <StatusIndicatorPrimitive.Value
          className={"ms-auto font-bold text-media-popover-foreground"}
        />
      </div>
    </StatusIndicatorPrimitive.Root>
  );
}

export type PlaybackStatusIndicatorProps = Omit<StatusIndicatorPrimitive.RootProps, "children">;

export function PlaybackStatusIndicator({
  className,
  ...props
}: PlaybackStatusIndicatorProps = {}) {
  return (
    <StatusIndicatorPrimitive.Root
      actions={PLAYBACK_STATUS_ACTIONS}
      className={(state) =>
        cn(
          "group/playback-status col-start-2 row-start-1 grid place-items-center p-4 text-center",
          "transition-[opacity,scale] duration-media-slow ease-out",
          "media-transitioning:scale-media-hidden-playback media-transitioning:opacity-0",
          "data-ending-style:duration-media-fast data-ending-style:ease-in",
          "media-max-5xs:hidden!",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <div className="grid size-16 media-md:size-24 place-items-center drop-shadow-[0_6px_20px_rgba(32,23,14,0.35)]">
        <SunflowerPlayIcon
          className={cn(
            "col-start-1 row-start-1 size-full scale-75 opacity-0",
            "transition-[opacity,scale] duration-media-base ease-out",
            "group-data-[status=play]/playback-status:scale-100 group-data-[status=play]/playback-status:opacity-100",
          )}
        />
        <SunflowerPauseIcon
          className={cn(
            "col-start-1 row-start-1 size-full scale-75 opacity-0",
            "transition-[opacity,scale] duration-media-base ease-out",
            "group-data-[status=pause]/playback-status:scale-100 group-data-[status=pause]/playback-status:opacity-100",
          )}
        />
      </div>
    </StatusIndicatorPrimitive.Root>
  );
}
