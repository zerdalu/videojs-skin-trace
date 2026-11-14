"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/resolve-class-name";
import { LadybugThumbIcon } from "./icons/ladybug-icon";

/** Storybook garden trail slider track with earthy border. */
export type SliderTrackProps = ComponentProps<"div">;

export function SliderTrack({ className, ...props }: SliderTrackProps) {
  return (
    <div
      className={cn(
        "relative isolate w-full select-none rounded-media-pill storybook-vine-track",
        "data-[orientation=horizontal]:h-3.5 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-3",
        className,
      )}
      {...props}
    />
  );
}

/** Lush green vine progress fill for horizontal and vertical sliders. */
export type SliderFillProps = ComponentProps<"div">;

export function SliderFill({ className, ...props }: SliderFillProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-media-pill overflow-hidden",
        "before:absolute before:size-full before:rounded-media-pill before:from-[#82B34B] before:to-[#6E9A3E]",
        "data-[orientation=horizontal]:before:bg-linear-to-r data-[orientation=horizontal]:before:border-y data-[orientation=horizontal]:before:border-[#3B561E]",
        "data-[orientation=vertical]:before:bg-linear-to-t data-[orientation=vertical]:before:border-x data-[orientation=vertical]:before:border-[#3B561E]",
        "data-[orientation=horizontal]:[clip-path:inset(0_calc(100%-var(--media-slider-fill,0%))_0_0)]",
        "rtl:data-[orientation=horizontal]:[clip-path:inset(0_0_0_calc(100%-var(--media-slider-fill,0%)))]",
        "group-data-dragging/slider:data-[orientation=horizontal]:[clip-path:inset(0_calc(100%-var(--media-slider-pointer,var(--media-slider-fill,0%)))_0_0)]",
        "rtl:group-data-dragging/slider:data-[orientation=horizontal]:[clip-path:inset(0_0_0_calc(100%-var(--media-slider-pointer,var(--media-slider-fill,0%))))]",
        "data-[orientation=vertical]:[clip-path:inset(calc(100%-var(--media-slider-fill,0%))_0_0_0)]",
        "group-data-dragging/slider:data-[orientation=vertical]:[clip-path:inset(calc(100%-var(--media-slider-pointer,var(--media-slider-fill,0%)))_0_0_0)]",
        className,
      )}
      {...props}
    />
  );
}

/** Earthy buffered trail with clear contrast. */
export type SliderBufferProps = ComponentProps<"div">;

export function SliderBuffer({ className, ...props }: SliderBufferProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-media-pill overflow-hidden",
        "before:absolute before:size-full before:rounded-media-pill before:bg-[#6E9A3E]/45 before:border-y before:border-[#4B6B26]/30",
        "data-[orientation=horizontal]:[clip-path:inset(0_calc(100%-var(--media-slider-buffer,0%))_0_0)]",
        "rtl:data-[orientation=horizontal]:[clip-path:inset(0_0_0_calc(100%-var(--media-slider-buffer,0%)))]",
        className,
      )}
      {...props}
    />
  );
}

/** Slider thumb defaulting to the ladybug seeker for the timeline track. */
export type SliderThumbProps = ComponentProps<"div">;

export function SliderThumb({ className, children, ...props }: SliderThumbProps) {
  return (
    <div
      className={cn(
        "absolute z-10 top-1/2 inset-s-(--media-slider-fill,0%) -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2",
        "rounded-full select-none transition-transform duration-media-fast ease-out cursor-grab active:cursor-grabbing",
        "after:absolute after:-inset-2 after:rounded-full",
        "motion-safe:hover:scale-115 motion-safe:active:scale-120 motion-safe:group-hover/slider:scale-115 motion-safe:group-data-dragging/slider:scale-125",
        "focus-visible:outline-2 focus-visible:outline-media-ring focus-visible:outline-offset-2",
        "data-[orientation=vertical]:top-[calc(100%-var(--media-slider-fill,0%))] data-[orientation=vertical]:inset-s-1/2",
        "group-data-dragging/slider:data-[orientation=horizontal]:inset-s-(--media-slider-pointer,var(--media-slider-fill,0%))",
        "group-data-dragging/slider:data-[orientation=vertical]:top-[calc(100%-var(--media-slider-pointer,var(--media-slider-fill,0%)))]",
        className,
      )}
      {...props}
    >
      {children ?? <LadybugThumbIcon className="h-8 w-10" />}
    </div>
  );
}
