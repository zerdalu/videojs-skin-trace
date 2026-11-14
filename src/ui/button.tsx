"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/resolve-class-name";

export type ButtonProps = ComponentProps<"button">;

/** Tactile storybook button with soft rounded targets, high-contrast focus, and gentle springy press physics. */
export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "grid size-media-control min-h-0 shrink-0 touch-manipulation select-none place-items-center rounded-media-control border-0 bg-transparent p-1 text-center text-media-controls-foreground",
        "cursor-pointer",
        "transition-all duration-media-base ease-out",
        "motion-safe:hover:scale-105 hover:bg-media-accent/85",
        "motion-safe:active:scale-95 active:bg-media-muted",
        "focus-visible:outline-media-ring focus-visible:outline-2 focus-visible:outline-offset-2",
        "aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}
