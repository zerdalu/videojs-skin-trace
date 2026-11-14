/** @jsxImportSource react */

"use client";

import { BufferingIndicator as BufferingIndicatorPrimitive } from "@videojs/react";
import { cn, resolveClassName } from "@/lib/resolve-class-name";

export type BufferingIndicatorProps = Omit<BufferingIndicatorPrimitive.Props, "children">;

export function BufferingIndicator({ className, ...props }: BufferingIndicatorProps = {}) {
  return (
    <BufferingIndicatorPrimitive
      className={(state) =>
        cn(
          "pointer-events-none absolute inset-0 hidden place-content-center text-media-controls-foreground",
          "before:absolute before:inset-0 before:bg-media-background/60 before:backdrop-blur-xs",
          "not-data-visible:[--media-spinner-animation:none] data-visible:grid z-40",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <div className="relative z-30 flex flex-col items-center gap-2">
        {/* Spinning Sunflower Whirligig */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-14 motion-safe:animate-spin text-[#F59E0B] drop-shadow-[0_2px_4px_rgba(90,50,20,0.3)]"
          aria-hidden="true"
        >
          {/* Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="24"
              cy="9"
              rx="4.5"
              ry="8"
              fill="#FBBF24"
              stroke="#B45309"
              strokeWidth="1.2"
              transform={`rotate(${deg} 24 24)`}
            />
          ))}
          {/* Golden Center */}
          <circle cx="24" cy="24" r="10" fill="#D97706" stroke="#78350F" strokeWidth="1.8" />
          <circle
            cx="24"
            cy="24"
            r="7.5"
            fill="none"
            stroke="#FDE68A"
            strokeWidth="1"
            opacity="0.6"
          />
        </svg>

        <span className="rounded-full border-2 border-(--media-frame-border,#805D35) bg-media-popover px-3 py-1 font-bold text-xs tracking-wider text-media-popover-foreground shadow-md">
          Turning page…
        </span>
      </div>
    </BufferingIndicatorPrimitive>
  );
}
