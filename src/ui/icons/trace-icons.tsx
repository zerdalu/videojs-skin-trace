/** @jsxImportSource react */

import type { ComponentProps } from "react";
import { cn } from "@/lib/resolve-class-name";

export type TraceIconProps = ComponentProps<"svg">;

/** Hand-illustrated wooden sketch pen icon sized to match the storybook video control icons. */
export function StorybookPenIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 44 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_1px_3px_rgba(80,50,20,0.2)]", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Drawn ink trail */}
      <path
        d="M 7 32 Q 14.5 29 21.5 32 T 37 31"
        stroke="var(--media-primary, #78350F)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Pencil / sketch pen body */}
      <g transform="rotate(-38 23 18)">
        <rect
          x="18.5"
          y="4.5"
          width="9"
          height="21"
          rx="2.5"
          fill="#FBBF24"
          stroke="#4A331E"
          strokeWidth="2.1"
        />
        {/* Wooden collar */}
        <path d="M 18.5 9.5 H 27.5" stroke="#4A331E" strokeWidth="2" />
        {/* Eraser cap */}
        <rect
          x="18.5"
          y="4"
          width="9"
          height="5.2"
          rx="2"
          fill="#F87171"
          stroke="#4A331E"
          strokeWidth="2.1"
        />
        {/* Tapered wood tip */}
        <path
          d="M 18.5 25.5 L 23 34 L 27.5 25.5 Z"
          fill="#FDE68A"
          stroke="#4A331E"
          strokeWidth="2.1"
          strokeLinejoin="round"
        />
        {/* Ink nib */}
        <path d="M 21.3 30.5 L 23 34 L 24.7 30.5 Z" fill="#4A331E" />
      </g>
    </svg>
  );
}

/** Hand-illustrated storybook filmstrip icon sized to match the storybook video control icons. */
export function StorybookFilmstripIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 44 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full drop-shadow-[0_1px_3px_rgba(80,50,20,0.2)]", className)}
      aria-hidden="true"
      {...props}
    >
      {/* Filmstrip ribbon frame */}
      <rect
        x="5"
        y="6"
        width="34"
        height="26"
        rx="4"
        fill="#854D0E"
        stroke="var(--media-foreground, #4A331E)"
        strokeOpacity="0.88"
        strokeWidth="2.2"
      />
      {/* Top & bottom film sprocket holes */}
      {[8.5, 16, 23.5, 31].map((x) => (
        <g key={x}>
          <rect x={x} y="8.2" width="3.5" height="2.8" rx="0.9" fill="#FFFDF7" />
          <rect x={x} y="27" width="3.5" height="2.8" rx="0.9" fill="#FFFDF7" />
        </g>
      ))}
      {/* Left & right mini frames */}
      <rect
        x="7.5"
        y="13.2"
        width="7"
        height="11.6"
        rx="1.4"
        fill="#FDE68A"
        stroke="#4A331E"
        strokeWidth="1.4"
      />
      <rect
        x="29.5"
        y="13.2"
        width="7"
        height="11.6"
        rx="1.4"
        fill="#FDE68A"
        stroke="#4A331E"
        strokeWidth="1.4"
      />
      {/* Center featured frame with mountain & sun */}
      <rect
        x="16.5"
        y="12.5"
        width="11"
        height="13"
        rx="1.6"
        fill="#FFFDF7"
        stroke="#F59E0B"
        strokeWidth="1.6"
      />
      <circle cx="20" cy="16.4" r="1.6" fill="#F59E0B" />
      <path d="M 18 24 L 21.2 20 L 23.4 22 L 26 18.8 L 26.5 24 Z" fill="#6E9A3E" />
    </svg>
  );
}

export function PenNibIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 20l4.2-1 9.8-9.8a2.2 2.2 0 0 0-3.2-3.2L5 15.8 4 20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M13.5 7.5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MarkerTipIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M8 20H5v-3l9.5-9.5 3 3L8 20Z"
        fill="currentColor"
        fillOpacity="0.22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 7.5l2.5-2.5 3 3-2.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CrayonTipIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 19l2-5.5L16.5 4a2.1 2.1 0 0 1 3 3L10 16.5 5 19Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 7l3.5 3.5M8.5 12l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HighlighterTipIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 20h16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <path
        d="M6.5 16.5L15 8l3 3-8.5 8.5-3.5.5.5-3.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M15 8l2.5-2.5 3 3L18 11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TextToolIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 6h14M12 6v13M9 19h6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EraserBlockIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M7.5 19.5h11M4.5 14.5l7.8-7.8a2.2 2.2 0 0 1 3.1 0l3.9 3.9a2.2 2.2 0 0 1 0 3.1L13.5 19.5H7.8l-3.3-3.3a1.2 1.2 0 0 1 0-1.7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9.5 9.5l5 5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function UndoInkIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M9 7H4v5M4 7c2.5-2.5 6.8-3.2 10.2-1.2A7 7 0 0 1 14 18.5H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RedoInkIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M15 7h5v5M20 7c-2.5-2.5-6.8-3.2-10.2-1.2A7 7 0 0 0 10 18.5h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashSketchIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 7h16M9 7V4.8c0-.4.4-.8.8-.8h4.4c.4 0 .8.4.8.8V7M7 7l1 12.2c.1.9.8 1.8 1.8 1.8h4.4c1 0 1.7-.9 1.8-1.8L17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SaveBookmarkIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 4.5h9.5L19 8v11.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 4.5v5h6v-5M8.5 20.5v-6h7v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExportStorybookIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6.5 3.5h8.5L18.5 7v12a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v7m0 0-2.8-2.8M12 16l2.8-2.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronNavIcon({
  direction = "left",
  className,
  ...props
}: TraceIconProps & { direction?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-5", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseCrossIcon({ className, ...props }: TraceIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-4", className)}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
