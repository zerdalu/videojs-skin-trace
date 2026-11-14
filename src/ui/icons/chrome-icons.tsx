/** @jsxImportSource react */

import type { ComponentProps } from "react";
import { cn } from "@/lib/resolve-class-name";

/**
 * Hand-carved wooden ship's helm for Settings.
 */
export function WoodenGearSettingsIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_1px_3px_rgba(80,50,20,0.25)]", className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <radialGradient id="helm-wood-grad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F5BE58" />
          <stop offset="55%" stopColor="#D98829" />
          <stop offset="100%" stopColor="#A85914" />
        </radialGradient>
      </defs>

      {/* 8 Turned Spokes & Protruding Helm Handles */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 24 24)`}>
          {/* Inner spoke */}
          <rect
            x="22.5"
            y="12.5"
            width="3"
            height="8"
            fill="url(#helm-wood-grad)"
            stroke="#4A2A0C"
            strokeWidth="1.4"
          />
          {/* Protruding turned handle */}
          <path
            d="M 22.7 9 L 22.2 5.8 C 21.6 4.2 22.3 2.2 24 2.2 C 25.7 2.2 26.4 4.2 25.8 5.8 L 25.3 9 Z"
            fill="url(#helm-wood-grad)"
            stroke="#4A2A0C"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {/* Outer Wooden Wheel Rim */}
      <circle
        cx="24"
        cy="24"
        r="13.5"
        fill="none"
        stroke="url(#helm-wood-grad)"
        strokeWidth="4.2"
      />
      <circle cx="24" cy="24" r="15.6" fill="none" stroke="#4A2A0C" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="11.4" fill="none" stroke="#4A2A0C" strokeWidth="1.6" />

      {/* Warm Rim Highlight */}
      <path
        d="M 14.5 14.5 A 13.5 13.5 0 0 1 33.5 14.5"
        fill="none"
        stroke="#FEF08A"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Central Hub & Brass Cap */}
      <circle
        cx="24"
        cy="24"
        r="5.2"
        fill="url(#helm-wood-grad)"
        stroke="#4A2A0C"
        strokeWidth="1.7"
      />
      <circle cx="24" cy="24" r="2.2" fill="#FDE047" stroke="#4A2A0C" strokeWidth="1.3" />
    </svg>
  );
}

export interface TwigFullscreenIconProps extends ComponentProps<"svg"> {
  exit?: boolean;
}

/**
 * Two hand-carved diagonal wooden arrows pointing outward (or inward for exit fullscreen).
 */
export function TwigFullscreenIcon({ exit = false, className, ...props }: TwigFullscreenIconProps) {
  const gradientId = exit ? "arrow-wood-grad-exit" : "arrow-wood-grad-enter";

  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_1px_3px_rgba(80,50,20,0.2)]", className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5BE58" />
          <stop offset="55%" stopColor="#D9822B" />
          <stop offset="100%" stopColor="#B05E14" />
        </linearGradient>
      </defs>

      {exit ? (
        <>
          {/* Top-right wooden arrow pointing inward */}
          <path
            d="M 38.2 8.8 L 31.2 15.8 L 34.8 19.4 C 35.6 20.2 35 21.6 33.9 21.5 L 23.4 20.6 L 22.5 10.1 C 22.4 9 23.8 8.4 24.6 9.2 L 28.2 12.8 L 35.2 5.8 C 35.9 5.1 36.9 5.1 37.6 5.8 L 38.2 6.4 C 38.9 7.1 38.9 8.1 38.2 8.8 Z"
            fill={`url(#${gradientId})`}
            stroke="#4A2A0C"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M 35.5 8.5 L 30 14"
            stroke="#FEF08A"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Bottom-left wooden arrow pointing inward */}
          <path
            d="M 5.8 35.2 L 12.8 28.2 L 9.2 24.6 C 8.4 23.8 9 22.4 10.1 22.5 L 20.6 23.4 L 21.5 33.9 C 21.6 35 20.2 35.6 19.4 34.8 L 15.8 31.2 L 8.8 38.2 C 8.1 38.9 7.1 38.9 6.4 38.2 L 5.8 37.6 C 5.1 36.9 5.1 35.9 5.8 35.2 Z"
            fill={`url(#${gradientId})`}
            stroke="#4A2A0C"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M 8.5 35.5 L 14 30"
            stroke="#FEF08A"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.6"
          />
        </>
      ) : (
        <>
          {/* Top-right wooden arrow pointing outward */}
          <path
            d="M 22.8 18.2 L 29.8 11.2 L 26.2 7.6 C 25.4 6.8 26 5.4 27.1 5.5 L 37.8 6.2 L 38.5 16.9 C 38.6 18 37.2 18.6 36.4 17.8 L 32.8 14.2 L 25.8 21.2 C 25.1 21.9 24.1 21.9 23.4 21.2 L 22.8 20.6 C 22.1 19.9 22.1 18.9 22.8 18.2 Z"
            fill={`url(#${gradientId})`}
            stroke="#4A2A0C"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M 25 18.5 L 31.5 12"
            stroke="#FEF08A"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Bottom-left wooden arrow pointing outward */}
          <path
            d="M 21.2 25.8 L 14.2 32.8 L 17.8 36.4 C 18.6 37.2 18 38.6 16.9 38.5 L 6.2 37.8 L 5.5 27.1 C 5.4 26 6.8 25.4 7.6 26.2 L 11.2 29.8 L 18.2 22.8 C 18.9 22.1 19.9 22.1 20.6 22.8 L 21.2 23.4 C 21.9 24.1 21.9 25.1 21.2 25.8 Z"
            fill={`url(#${gradientId})`}
            stroke="#4A2A0C"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M 12.5 32 L 19 25.5"
            stroke="#FEF08A"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.6"
          />
        </>
      )}
    </svg>
  );
}
