/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { SeekIndicator as SeekIndicatorPrimitive } from "@videojs/react";
import { ChevronIcon as ChevronIconPrimitive } from "@videojs/react/icons/neutral";

import { cn, resolveClassName } from "@/lib/resolve-class-name";

export type SeekIndicatorProps = Omit<SeekIndicatorPrimitive.RootProps, "children">;

export function SeekIndicator({ className, ...props }: SeekIndicatorProps = {}) {
  return (
    <SeekIndicatorPrimitive.Root
      className={(state) =>
        cn(
          "group/seek-status col-start-2 row-start-1 grid place-content-center p-4 text-center",
          "media-2xl:p-6",
          "data-[direction=backward]:col-start-1 data-[direction=backward]:justify-self-start",
          "data-[direction=forward]:col-start-3 data-[direction=forward]:justify-self-end",
          "filter-media-feedback",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <div
        className={cn(
          "hidden group-data-direction/seek-status:flex flex-col items-center gap-1",
          "rounded-2xl border-2 border-(--media-frame-border,#805D35) bg-media-popover/95 px-3.5 py-2",
          "text-media-popover-foreground shadow-[0_6px_20px_rgba(32,23,14,0.28)]",
        )}
      >
        <ChevronIconPrimitive
          className={cn(
            "size-media-icon text-media-primary",
            "group-data-[direction=backward]/seek-status:scale-[-1_1]",
            "transition-[translate,opacity] duration-media-slow ease-in-out",
            "group-media-transitioning/seek-status:opacity-0",
            "group-data-[direction=forward]/seek-status:group-data-starting-style/seek-status:-translate-x-media-hidden-seek-offset",
            "group-data-[direction=backward]/seek-status:group-data-starting-style/seek-status:translate-x-media-hidden-seek-offset",
          )}
        />
        <SeekIndicatorPrimitive.Value
          className={
            "storybook-tabular-nums text-xs font-bold tabular-nums text-media-popover-foreground"
          }
        />
      </div>
    </SeekIndicatorPrimitive.Root>
  );
}
