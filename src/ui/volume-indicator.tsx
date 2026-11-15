/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { VolumeIndicator as VolumeIndicatorPrimitive } from "@videojs/react";
import {
  VolumeHighIcon as VolumeHighIconPrimitive,
  VolumeLowIcon as VolumeLowIconPrimitive,
  VolumeOffIcon as VolumeOffIconPrimitive,
} from "@videojs/react/icons/neutral";

import { cn, resolveClassName } from "@/lib/resolve-class-name";

export type VolumeIndicatorProps = Omit<VolumeIndicatorPrimitive.RootProps, "children">;

export function VolumeIndicator({ className, ...props }: VolumeIndicatorProps = {}) {
  return (
    <VolumeIndicatorPrimitive.Root
      className={(state) =>
        cn(
          "pointer-events-none absolute origin-top",
          "transition-[opacity,translate,filter] duration-media-fast ease-out",
          "media-transitioning:opacity-0 media-transitioning:duration-media-indicator media-transitioning:ease-in",
          "inset-x-0 top-1.5 media-md:top-3 flex justify-center",
          "pointer-fine:media-transitioning:blur-media-hidden",
          "data-ending-style:translate-y-media-hidden-indicator-offset",
          "group/volume-status",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <VolumeIndicatorPrimitive.Fill
        className={cn(
          "items-center justify-between gap-2 media-md:gap-2.5 px-2.5 py-1.5 media-md:px-3.5 media-md:py-2",
          "rounded-xl media-md:rounded-2xl border-2 border-(--media-frame-border,#805D35) bg-media-popover/95 text-media-popover-foreground",
          "shadow-[0_6px_20px_rgba(32,23,14,0.28)]",
          "grid w-[min(80%,14rem)] grid-cols-[auto_minmax(0,1fr)_auto] transform-[translateX(0)]",
          "before:col-start-2 before:row-start-1 before:h-1.5 before:w-full before:rounded-media-pill",
          "before:bg-media-muted",
          "after:col-start-2 after:row-start-1 after:h-1.5 after:w-(--media-volume-fill,0%) after:justify-self-start",
          "after:rounded-media-pill after:bg-media-primary",
          "after:transition-[width] after:duration-media-slow after:ease-linear",
        )}
      >
        <VolumeHighIconPrimitive
          className={cn(
            "hidden size-4 shrink-0 text-media-primary group-data-[level=high]/volume-status:block",
            "col-start-1 row-start-1",
          )}
        />
        <VolumeLowIconPrimitive
          className={cn(
            "hidden size-4 shrink-0 text-media-primary group-data-[level=low]/volume-status:block",
            "col-start-1 row-start-1",
          )}
        />
        <VolumeOffIconPrimitive
          className={cn(
            "hidden size-4 shrink-0 text-media-muted-foreground group-data-[level=off]/volume-status:block",
            "col-start-1 row-start-1",
          )}
        />
        <VolumeIndicatorPrimitive.Value
          className={
            "storybook-tabular-nums col-start-3 row-start-1 text-xs font-bold tabular-nums text-media-popover-foreground"
          }
        />
      </VolumeIndicatorPrimitive.Fill>
    </VolumeIndicatorPrimitive.Root>
  );
}
