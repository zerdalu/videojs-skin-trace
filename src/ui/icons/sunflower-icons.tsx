/** @jsxImportSource react */

import type { ComponentProps } from "react";
import { cn } from "@/lib/resolve-class-name";

type StorybookIconProps = ComponentProps<"svg">;

/**
 * Hand-illustrated sunflower play icon with golden petals, amber core,
 * warm inner rim, and chunky wood/ink play arrow.
 */
export function SunflowerPlayIcon({ className, ...props }: StorybookIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_2px_4px_rgba(90,50,15,0.25)]", className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <radialGradient id="sunflower-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="65%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        <linearGradient id="sunflower-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* 12 Radiant Golden Sunflower Petals */}
      <g stroke="#845318" strokeWidth="1.2" strokeLinejoin="round">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <path
            key={deg}
            d="M 32 14 C 29 10 27 5 32 2 C 37 5 35 10 32 14 Z"
            fill="url(#sunflower-petal)"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
      </g>

      {/* Sunflower Seed Core */}
      <circle
        cx="32"
        cy="32"
        r="18.5"
        fill="url(#sunflower-center)"
        stroke="#6A3F12"
        strokeWidth="2"
      />
      {/* Warm inner highlight ring */}
      <circle
        cx="32"
        cy="32"
        r="15"
        fill="none"
        stroke="#925114"
        strokeWidth="1.2"
        opacity="0.45"
      />

      {/* Play Glyph (Chunky hand-inked leaf/wood triangle) */}
      <path
        d="M 27 22 C 26 21 24.5 21.6 24.5 23 L 24.5 41 C 24.5 42.4 26 43 27 42 L 43 33 C 44 32.2 44 31.8 43 31 Z"
        fill="#382513"
        stroke="#241508"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hand-illustrated sunflower pause icon with dual leaf/wood pause bars.
 */
export function SunflowerPauseIcon({ className, ...props }: StorybookIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_2px_4px_rgba(90,50,15,0.25)]", className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <radialGradient id="sunflower-center-pause" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="65%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        <linearGradient id="sunflower-petal-pause" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Sunflower Petals */}
      <g stroke="#845318" strokeWidth="1.2" strokeLinejoin="round">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <path
            key={deg}
            d="M 32 14 C 29 10 27 5 32 2 C 37 5 35 10 32 14 Z"
            fill="url(#sunflower-petal-pause)"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
      </g>

      {/* Sunflower Seed Core */}
      <circle
        cx="32"
        cy="32"
        r="18.5"
        fill="url(#sunflower-center-pause)"
        stroke="#6A3F12"
        strokeWidth="2"
      />
      <circle
        cx="32"
        cy="32"
        r="15"
        fill="none"
        stroke="#925114"
        strokeWidth="1.2"
        opacity="0.45"
      />

      {/* Pause Bars */}
      <rect
        x="24"
        y="22"
        width="5.5"
        height="20"
        rx="2.75"
        fill="#382513"
        stroke="#241508"
        strokeWidth="1.5"
      />
      <rect
        x="34.5"
        y="22"
        width="5.5"
        height="20"
        rx="2.75"
        fill="#382513"
        stroke="#241508"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * Hand-illustrated restart arrow inside the sunflower medallion.
 */
export function SunflowerRestartIcon({ className, ...props }: StorybookIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_2px_4px_rgba(90,50,15,0.25)]", className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <radialGradient id="sunflower-center-restart" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="65%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </radialGradient>
        <linearGradient id="sunflower-petal-restart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="40%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Sunflower Petals */}
      <g stroke="#845318" strokeWidth="1.2" strokeLinejoin="round">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <path
            key={deg}
            d="M 32 14 C 29 10 27 5 32 2 C 37 5 35 10 32 14 Z"
            fill="url(#sunflower-petal-restart)"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
      </g>

      <circle
        cx="32"
        cy="32"
        r="18.5"
        fill="url(#sunflower-center-restart)"
        stroke="#6A3F12"
        strokeWidth="2"
      />
      <circle
        cx="32"
        cy="32"
        r="15"
        fill="none"
        stroke="#925114"
        strokeWidth="1.2"
        opacity="0.45"
      />

      {/* Curved loop arrow */}
      <path
        d="M 38 24 A 10 10 0 1 0 42 32 L 40 32"
        fill="none"
        stroke="#382513"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M 35 20 L 40 24 L 35 28 Z" fill="#382513" stroke="#241508" strokeWidth="1" />
    </svg>
  );
}
