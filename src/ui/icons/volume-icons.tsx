/** @jsxImportSource react */

import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/resolve-class-name";

export interface SongbirdVolumeIconProps extends ComponentProps<"svg"> {
  level?: "off" | "low" | "high" | "muted" | "paused";
}

/**
 * Charming animated singing bird perched on a leafy vine branch.
 * Sings and chirps with floating musical notes when playing, perches quietly when paused,
 * and snoozes with rising Zzz plus a crossed-out music note when muted.
 */
export function SongbirdVolumeIcon({
  level = "high",
  className,
  ...props
}: SongbirdVolumeIconProps) {
  const isMuted = level === "off" || level === "muted";
  const isPaused = level === "paused";
  const isHigh = level === "high";
  const levelClass = isMuted
    ? "songbird-level-off"
    : isPaused
      ? "songbird-level-paused"
      : isHigh
        ? "songbird-level-high"
        : "songbird-level-low";

  return (
    <svg
      viewBox="0 0 54 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "overflow-visible size-full drop-shadow-[0_1px_2px_rgba(90,50,15,0.2)]",
        levelClass,
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      {/* Winding Woody Twig Branch */}
      <path
        d="M 2 34 C 14 36 28 35 44 38 C 48 39 51 40 52 42"
        stroke="#593A1C"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Sprouting Green Leaves on the Branch */}
      <g
        className="songbird-leaf"
        style={{ transformOrigin: "39px 37px", transformBox: "view-box" }}
      >
        <path
          d="M 38 36 C 42 32 46 33 46 33 C 46 33 44 38 39 37 Z"
          fill="#6E9A3E"
          stroke="#3F611E"
          strokeWidth="1"
        />
        <path
          d="M 44 38 C 48 36 51 38 51 38 C 51 38 49 42 45 40 Z"
          fill="#82B34B"
          stroke="#3F611E"
          strokeWidth="0.9"
        />
      </g>

      {/* Little Songbird Body */}
      <g
        className="songbird-bird"
        style={{ transformOrigin: "18.5px 34px", transformBox: "view-box" }}
      >
        {/* Tail */}
        <path
          d="M 10 32 L 3 34 L 7 28 Z"
          fill="#E67E22"
          stroke="#4A2E10"
          strokeWidth="1.2"
          className="songbird-tail"
          style={{ transformOrigin: "11px 30px", transformBox: "view-box" }}
        />
        {/* Plump Robin / Songbird Body */}
        <path
          d="M 12 28 C 10 22 14 14 23 14 C 29 14 32 18 31 24 C 30 28 26 33 19 33 C 15 33 12 31 12 28 Z"
          fill="#F6B843"
          stroke="#4A2E10"
          strokeWidth="1.5"
        />
        {/* Red/Amber Breast */}
        <path
          d="M 18 20 C 23 20 26 23 27 27 C 27 30 23 32 18 32 C 14 32 15 26 18 20 Z"
          fill="#E86C32"
          opacity="0.9"
        />
        {/* Folded Wing */}
        <path
          d="M 13 25 C 16 23 21 24 22 28 C 21 31 16 31 13 28 Z"
          fill="#C95F26"
          stroke="#4A2E10"
          strokeWidth="1"
          className="songbird-wing"
          style={{ transformOrigin: "20px 26px", transformBox: "view-box" }}
        />
        {/* Feet clasping twig */}
        <path
          d="M 17 33 L 17 35 M 20 33 L 20 35"
          stroke="#4A2E10"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Beak & Eyes */}
        {isMuted ? (
          <>
            {/* Sleeping eye */}
            <path d="M 23 18 Q 25 16 27 18" stroke="#4A2E10" strokeWidth="1.2" fill="none" />
            {/* Closed beak */}
            <path d="M 29 19 L 34 20 L 29 21 Z" fill="#E67E22" stroke="#4A2E10" strokeWidth="1" />
          </>
        ) : isPaused ? (
          <>
            {/* Alert Calm Eye with catchlight */}
            <circle cx="25" cy="18" r="1.8" fill="#2E1B07" />
            <circle cx="24.4" cy="17.4" r="0.6" fill="#FFFFFF" />
            {/* Closed Resting Beak */}
            <path d="M 29 19 L 34 20 L 29 21 Z" fill="#E67E22" stroke="#4A2E10" strokeWidth="1" />
          </>
        ) : (
          <>
            {/* Alert Happy Eye with catchlight */}
            <circle cx="25" cy="18" r="1.8" fill="#2E1B07" />
            <circle cx="24.4" cy="17.4" r="0.6" fill="#FFFFFF" />
            {/* Open Singing Beak */}
            <path
              d="M 28 17 L 35 18 L 29 20 Z"
              fill="#E67E22"
              stroke="#4A2E10"
              strokeWidth="1"
              className="songbird-beak-top"
              style={{ transformOrigin: "28.5px 19px", transformBox: "view-box" }}
            />
            <path
              d="M 29 20 L 33 22 L 28 21 Z"
              fill="#C95F26"
              stroke="#4A2E10"
              strokeWidth="1"
              className="songbird-beak-bottom"
              style={{ transformOrigin: "28.5px 20px", transformBox: "view-box" }}
            />
          </>
        )}
      </g>

      {/* Floating Sleep Zzz + Muted Slash, or Singing Musical Notes */}
      {isMuted ? (
        <>
          <text
            x="34"
            y="14"
            fill="#8C704B"
            fontSize="8.5"
            fontWeight="bold"
            fontFamily="sans-serif"
            className="songbird-zzz-1"
            style={{ transformOrigin: "36px 12px", transformBox: "view-box" }}
          >
            z
          </text>
          <text
            x="40"
            y="9"
            fill="#8C704B"
            fontSize="7"
            fontWeight="bold"
            fontFamily="sans-serif"
            className="songbird-zzz-2"
            style={{ transformOrigin: "42px 7px", transformBox: "view-box" }}
          >
            z
          </text>
          {/* Crossed-out Mute Note Badge */}
          <g aria-hidden="true">
            <circle cx="43" cy="23.5" r="6.5" fill="#FFFDF7" stroke="#DC2626" strokeWidth="1.5" />
            <ellipse
              cx="41.8"
              cy="25.2"
              rx="1.7"
              ry="1.3"
              transform="rotate(-18 41.8 25.2)"
              fill="#593A1C"
            />
            <path
              d="M 43.3 24.8 L 43.8 19.6 L 46.5 20.8"
              stroke="#593A1C"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 38.5 28 L 47.5 19" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          </g>
        </>
      ) : isPaused ? null : (
        <>
          {/* Note 1 (Eighth note) */}
          <g
            fill="#437626"
            stroke="#2F5517"
            strokeWidth="0.8"
            className="songbird-note-1"
            style={{ transformOrigin: "40px 15px", transformBox: "view-box" }}
          >
            <ellipse cx="38" cy="18" rx="2" ry="1.6" transform="rotate(-20 38 18)" />
            <path d="M 40 17 L 41 9 L 45 11 L 44 13 L 41 11" />
          </g>
          {/* Note 2 (High Volume Quarter Note) */}
          {isHigh && (
            <g
              fill="#D9531E"
              stroke="#8A310C"
              strokeWidth="0.8"
              className="songbird-note-2"
              style={{ transformOrigin: "47px 9px", transformBox: "view-box" }}
            >
              <ellipse cx="46" cy="11" rx="1.8" ry="1.4" transform="rotate(-20 46 11)" />
              <path d="M 47.5 10 L 48.5 4" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          )}
        </>
      )}
    </svg>
  );
}

/**
 * Hand-illustrated woodland acorn thumb for the volume slider:
 * plump, high-contrast silhouette with cream rim halo so it stays crisp and selectable.
 */
export function AcornThumbIcon({ className, ...props }: ComponentProps<"svg">) {
  const uid = useId().replace(/:/g, "");
  const nutGradId = `${uid}-acorn-nut`;
  const capGradId = `${uid}-acorn-cap`;

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("overflow-visible drop-shadow-[0_0_2px_rgba(255,253,247,0.95)]", className)}
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id={nutGradId} x1="0.15" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="42%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id={capGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#4E260A" />
        </linearGradient>
      </defs>

      {/* Sturdy Woodland Twig Stem */}
      <path d="M 16 1.5 Q 18 3.5 16 6.2" stroke="#2B180A" strokeWidth="3" strokeLinecap="round" />

      {/* Plump Golden-Honey Acorn Nut Body */}
      <path
        d="M 5.8 14 C 5.8 22 10.2 27.6 16 30.2 C 21.8 27.6 26.2 22 26.2 14 Z"
        fill={`url(#${nutGradId})`}
        stroke="#2B180A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Bright Glossy Nut Highlight */}
      <path
        d="M 9.6 17 C 10.1 21 11.8 24 14.2 26.2"
        stroke="#FEF9C3"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Wide Overhanging Textured Chestnut Cap */}
      <path
        d="M 2.8 14.4 C 2.8 7.8 8.6 5.2 16 5.2 C 23.4 5.2 29.2 7.8 29.2 14.4 C 25.4 15.8 20.6 14.8 16 15.6 C 11.4 14.8 6.6 15.8 2.8 14.4 Z"
        fill={`url(#${capGradId})`}
        stroke="#2B180A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Cross-Hatch Cap Texture */}
      <path
        d="M 8.2 9.8 L 12.6 13.6 M 13.8 8.2 L 18.6 13.4 M 19.6 8.4 L 23.8 12.8 M 11.4 8.4 L 7.6 12.8 M 17.4 8.2 L 12.6 13.6 M 23 9.8 L 18.6 13.6"
        stroke="#2B180A"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Warm Cap Highlight */}
      <path
        d="M 7.8 8.8 C 11.4 7.1 18.4 6.9 22.8 8.4"
        stroke="#F6D1A2"
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
