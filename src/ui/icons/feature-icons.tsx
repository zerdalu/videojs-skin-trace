/** @jsxImportSource react */

import type { ComponentProps } from "react";
import { cn } from "@/lib/resolve-class-name";

export interface SpeechBubbleCcIconProps extends ComponentProps<"svg"> {
  active?: boolean;
}

/**
 * Hand-sketched fluffy storybook cloud with friendly, bubbly "CC" lettering in the middle.
 */
export function SpeechBubbleCcIcon({
  active = false,
  className,
  ...props
}: SpeechBubbleCcIconProps) {
  return (
    <svg
      viewBox="0 0 44 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_1px_3px_rgba(80,50,20,0.2)]", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Fluffy Storybook Cloud */}
      <path
        d="M 11 29.5 C 6 29.5 3.5 25.5 5 21 C 3.5 16.5 7.5 12.5 12.5 13.5 C 14.5 7 25 5.5 29.5 11.5 C 34.5 10.5 39 14 38 19 C 41 22.5 39 29.5 33.5 29.5 Q 22 30.5 11 29.5 Z"
        fill={active ? "#FEF08A" : "#FFFDF7"}
        stroke="#3F2D1C"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Subtle Bottom Cloud Shading */}
      <path
        d="M 9.5 26.5 Q 22 28 34.5 26.5"
        stroke={active ? "#F59E0B" : "#E5D7BF"}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Centered "CC" Text */}
      <g
        stroke="#3F2D1C"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* First C */}
        <path d="M 20.5 17 C 18.8 15.2 15 16 15 20.5 C 15 25 18.8 25.8 20.5 24" />
        {/* Second C */}
        <path d="M 29.5 17 C 27.8 15.2 24 16 24 20.5 C 24 25 27.8 25.8 29.5 24" />
      </g>
    </svg>
  );
}

/**
 * Rustic picture frame icon for Picture-in-Picture.
 */
export function RusticPipIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 44 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_1px_3px_rgba(80,50,20,0.2)]", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Main wooden easel frame */}
      <rect
        x="6"
        y="6"
        width="32"
        height="26"
        rx="4"
        fill="#FDF9EF"
        stroke="#4A331E"
        strokeWidth="2.2"
      />
      {/* Subtle inner frame bevel */}
      <rect
        x="9"
        y="9"
        width="26"
        height="20"
        rx="2"
        fill="none"
        stroke="#C9B89D"
        strokeWidth="1"
        opacity="0.45"
      />
      {/* Mini Picture-in-Picture Frame with small sun & hills */}
      <rect
        x="20"
        y="17"
        width="15"
        height="12"
        rx="2"
        fill="#FEF3C7"
        stroke="#4A331E"
        strokeWidth="1.6"
      />
      <circle cx="24" cy="20" r="1.5" fill="#F59E0B" />
      <path d="M 21 27 L 25 23 L 28 25 L 32 21 L 34 27 Z" fill="#84CC16" />
    </svg>
  );
}

/**
 * Storybook wooden framed TV/Screen with broadcast waves for Cast/Airplay.
 */
export function RusticCastIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 44 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_1px_3px_rgba(80,50,20,0.2)]", className)}
      aria-hidden="true"
      {...props}
    >
      <rect
        x="6"
        y="6"
        width="32"
        height="24"
        rx="4"
        fill="#FDF9EF"
        stroke="#4A331E"
        strokeWidth="2.2"
      />
      {/* Broadcast Arcs */}
      <path
        d="M 10 24 A 4 4 0 0 1 14 28"
        stroke="#4A331E"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 10 19 A 9 9 0 0 1 19 28"
        stroke="#4A331E"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 10 14 A 14 14 0 0 1 24 28"
        stroke="#4A331E"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Magic Star in corner */}
      <circle cx="10" cy="28" r="1.5" fill="#F59E0B" />
    </svg>
  );
}
