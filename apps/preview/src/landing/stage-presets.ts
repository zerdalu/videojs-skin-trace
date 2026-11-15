export type StageRatio = "16:9" | "4:3" | "1:1" | "21:9";
export type StageScheme = "auto" | "light" | "dark";
export type StageDirection = "ltr" | "rtl";

export interface WidthPreset {
  id: string;
  label: string;
  width: number;
  caption: string;
}

export const STAGE_WIDTH_BOUNDS = {
  min: 260,
  max: 1160,
  default: 896,
} as const;

export const WIDTH_PRESETS: readonly WidthPreset[] = [
  { id: "pocket", label: "Pocket", width: 300, caption: "300px" },
  { id: "phone", label: "Phone", width: 400, caption: "400px" },
  { id: "tablet", label: "Tablet", width: 520, caption: "520px" },
  { id: "storybook", label: "Storybook", width: 896, caption: "896px" },
  { id: "theater", label: "Theater", width: 1120, caption: "1120px" },
] as const;

export const STAGE_BREAKPOINT_TICKS = [320, 448, 576, 896] as const;

export const STAGE_RATIOS: readonly StageRatio[] = ["16:9", "4:3", "1:1", "21:9"] as const;

export function getVisibleWidthPresets(maxWidth: number): WidthPreset[] {
  const fitting = WIDTH_PRESETS.filter((preset) => preset.width <= maxWidth);
  if (fitting.length === WIDTH_PRESETS.length) {
    return fitting;
  }

  const largestFitting = fitting[fitting.length - 1]?.width ?? 0;
  if (maxWidth - largestFitting >= 32 && maxWidth >= STAGE_WIDTH_BOUNDS.min) {
    return [
      ...fitting,
      {
        id: "full",
        label: "Full",
        width: maxWidth,
        caption: `${maxWidth}px`,
      },
    ];
  }

  return fitting;
}

export function describeContainerTier(widthPx: number): string {
  if (widthPx < 320) return "Pocket (< 320px)";
  if (widthPx < 448) return "Phone (< 448px)";
  if (widthPx < 576) return "Wrapped Bar (< 576px)";
  return "Full Journal (≥ 576px)";
}

export function formatCssAspectRatio(ratio: StageRatio): string {
  return ratio.replace(":", " / ");
}
