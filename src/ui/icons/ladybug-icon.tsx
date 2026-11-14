/** @jsxImportSource react */

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/resolve-class-name";

export interface LadybugThumbIconProps extends ComponentProps<"svg"> {
  /** Walks smoothly along the timeline while video plays. */
  playing?: boolean;
  /** Looks around curiously while video is paused. */
  paused?: boolean;
  /** Spreads red spotted elytra and flutters inner wings when advancing to the next chapter. */
  wingsOpen?: boolean;
}

/**
 * Hand-drawn animated ladybug for the timeline seek slider:
 * walks while playing, opens her wings across chapters, and looks around when paused.
 */
export function LadybugThumbIcon({
  playing = false,
  paused = false,
  wingsOpen = false,
  className,
  ...props
}: LadybugThumbIconProps) {
  const uid = useId().replace(/:/g, "");
  const bodyGradId = `${uid}-ladybug-body`;
  const innerWingGradId = `${uid}-ladybug-inner-wing`;

  const stateClass = wingsOpen
    ? "ladybug-state-wings"
    : playing
      ? "ladybug-state-playing"
      : paused
        ? "ladybug-state-paused"
        : undefined;

  return (
    <svg
      viewBox="0 0 46 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "overflow-visible drop-shadow-[0_2px_4px_rgba(80,30,10,0.38)] rtl:scale-[-1_1]",
        stateClass,
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <radialGradient id={bodyGradId} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="45%" stopColor="#DE2B2B" />
          <stop offset="100%" stopColor="#9C1111" />
        </radialGradient>
        <linearGradient id={innerWingGradId} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity="0.65" />
        </linearGradient>
      </defs>

      <g
        className="ladybug-body-group"
        style={{ transformOrigin: "21px 18px", transformBox: "view-box" }}
      >
        {/* 6 Articulated Walking Legs (Alternating Tripod Gait) */}
        <g stroke="#231A12" strokeWidth="1.75" strokeLinecap="round">
          <path
            d="M 13 26 L 10 31.5"
            className="ladybug-leg-a"
            style={{ transformOrigin: "13px 26px", transformBox: "view-box" }}
          />
          <path
            d="M 21 28 L 20.5 33"
            className="ladybug-leg-b"
            style={{ transformOrigin: "21px 28px", transformBox: "view-box" }}
          />
          <path
            d="M 29 26.5 L 32 31.5"
            className="ladybug-leg-a"
            style={{ transformOrigin: "29px 26.5px", transformBox: "view-box" }}
          />
          <path
            d="M 13 10 L 10 4.5"
            className="ladybug-leg-b"
            style={{ transformOrigin: "13px 10px", transformBox: "view-box" }}
          />
          <path
            d="M 21 8 L 20.5 3"
            className="ladybug-leg-a"
            style={{ transformOrigin: "21px 8px", transformBox: "view-box" }}
          />
          <path
            d="M 29 9.5 L 32 4.5"
            className="ladybug-leg-b"
            style={{ transformOrigin: "29px 9.5px", transformBox: "view-box" }}
          />
        </g>

        {/* Inner Dark Segmented Abdomen (revealed when wings open) */}
        <ellipse
          cx="20.5"
          cy="18"
          rx="14.2"
          ry="9.8"
          fill="#2E1C12"
          stroke="#1A100A"
          strokeWidth="1.2"
        />
        <g stroke="#6B3F23" strokeWidth="1.1" strokeLinecap="round" opacity="0.85">
          <path d="M 12 12 Q 11 18 12 24" />
          <path d="M 16.5 10.2 Q 15.5 18 16.5 25.8" />
          <path d="M 21 9.6 Q 20 18 21 26.4" />
          <path d="M 25.5 10.6 Q 24.5 18 25.5 25.4" />
        </g>

        {/* Translucent Inner Flight Wings */}
        <g
          className="ladybug-flight-wing-top"
          style={{ transformOrigin: "32px 16.5px", transformBox: "view-box" }}
        >
          <g
            className="ladybug-flight-wing-buzz"
            style={{ transformOrigin: "32px 16.5px", transformBox: "view-box" }}
          >
            <path
              d="M 32 16.5 C 23 11.5 12 12 7.5 16.5 C 12 19 23 19 32 17.4 Z"
              fill={`url(#${innerWingGradId})`}
              stroke="#92400E"
              strokeWidth="0.9"
            />
            <path
              d="M 28 16.6 L 13 15.5 M 24 16 L 16 14"
              stroke="#B45309"
              strokeWidth="0.65"
              opacity="0.65"
            />
          </g>
        </g>

        <g
          className="ladybug-flight-wing-bottom"
          style={{ transformOrigin: "32px 19.5px", transformBox: "view-box" }}
        >
          <g
            className="ladybug-flight-wing-buzz"
            style={{ transformOrigin: "32px 19.5px", transformBox: "view-box" }}
          >
            <path
              d="M 32 19.5 C 23 24.5 12 24 7.5 19.5 C 12 17 23 17 32 18.6 Z"
              fill={`url(#${innerWingGradId})`}
              stroke="#92400E"
              strokeWidth="0.9"
            />
            <path
              d="M 28 19.4 L 13 20.5 M 24 20 L 16 22"
              stroke="#B45309"
              strokeWidth="0.65"
              opacity="0.65"
            />
          </g>
        </g>

        {/* Upper Red Spotted Wing (Elytron) */}
        <g
          className="ladybug-elytron-top"
          style={{ transformOrigin: "33px 16.5px", transformBox: "view-box" }}
        >
          <g
            className="ladybug-elytron-flutter"
            style={{ transformOrigin: "33px 16.5px", transformBox: "view-box" }}
          >
            <path
              d="M 5 18 A 16 12 0 0 1 37 18 Z"
              fill={`url(#${bodyGradId})`}
              stroke="#2E1C12"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="14" cy="12" r="2.3" fill="#231A12" />
            <circle cx="23" cy="10" r="2.5" fill="#231A12" />
            <circle cx="28" cy="14" r="2.1" fill="#231A12" />
            <path
              d="M 10 12.2 C 14 8.2 23 7.8 29 11.2"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.65"
            />
          </g>
        </g>

        {/* Lower Red Spotted Wing (Elytron) */}
        <g
          className="ladybug-elytron-bottom"
          style={{ transformOrigin: "33px 19.5px", transformBox: "view-box" }}
        >
          <g
            className="ladybug-elytron-flutter"
            style={{ transformOrigin: "33px 19.5px", transformBox: "view-box" }}
          >
            <path
              d="M 5 18 A 16 12 0 0 0 37 18 Z"
              fill={`url(#${bodyGradId})`}
              stroke="#2E1C12"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="14" cy="24" r="2.3" fill="#231A12" />
            <circle cx="23" cy="26" r="2.5" fill="#231A12" />
            <circle cx="28" cy="22" r="2.1" fill="#231A12" />
          </g>
        </g>

        {/* Articulated Ladybug Head, Eyes & Antennae */}
        <g
          className="ladybug-head"
          style={{ transformOrigin: "33px 18px", transformBox: "view-box" }}
        >
          {/* Pronotum Collar + Head */}
          <path
            d="M 32.5 11.8 C 38.2 12.6 41.4 14.8 41.4 18 C 41.4 21.2 38.2 23.4 32.5 24.2 C 33.8 20.5 33.8 15.5 32.5 11.8 Z"
            fill="#231A12"
            stroke="#1A120B"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* White Sclera */}
          <circle cx="37.2" cy="14.9" r="1.95" fill="#FFFFFF" />
          <circle cx="37.2" cy="21.1" r="1.95" fill="#FFFFFF" />

          {/* Expressive Pupils */}
          <g className="ladybug-pupils">
            <circle cx="37.6" cy="14.9" r="0.95" fill="#1A120B" />
            <circle cx="37.3" cy="14.5" r="0.32" fill="#FFFFFF" />
            <circle cx="37.6" cy="21.1" r="0.95" fill="#1A120B" />
            <circle cx="37.3" cy="20.7" r="0.32" fill="#FFFFFF" />
          </g>

          {/* Antennae with Little Knobs */}
          <g
            className="ladybug-antennae"
            style={{ transformOrigin: "40px 18px", transformBox: "view-box" }}
          >
            <path
              d="M 40 15.8 Q 44 13.8 45.2 10.6"
              stroke="#231A12"
              strokeWidth="1.25"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="45.2" cy="10.2" r="1.05" fill="#231A12" />
            <path
              d="M 40 20.2 Q 44 22.2 45.2 25.4"
              stroke="#231A12"
              strokeWidth="1.25"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="45.2" cy="25.8" r="1.05" fill="#231A12" />
          </g>
        </g>
      </g>
    </svg>
  );
}
