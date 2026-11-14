/** @jsxImportSource react */

"use client";

import type { VolumeSliderProps as CoreVolumeSliderProps } from "@videojs/core";
import { VolumePopover as VolumePopoverPrimitive } from "@videojs/react";
import type { ClassValue } from "cn";
import { cn } from "@/lib/resolve-class-name";
import { ButtonTooltip } from "@/ui/button-tooltip";
import { MuteButton } from "@/ui/mute-button";
import { VolumeSlider } from "@/ui/volume-slider";

export interface VolumePopoverProps extends Omit<VolumePopoverPrimitive.RootProps, "children"> {
  className?: ClassValue;
  orientation?: CoreVolumeSliderProps["orientation"];
  showTooltip?: boolean;
}

export function VolumePopover({
  className,
  showTooltip = false,
  side = "top",
  orientation = "vertical",
  ...props
}: VolumePopoverProps = {}) {
  return (
    <VolumePopoverPrimitive.Root openOnHover delay={0} closeDelay={150} side={side} {...props}>
      <ButtonTooltip delay={0} disabled={!showTooltip} sticky side="top">
        <VolumePopoverPrimitive.Trigger render={<MuteButton className={cn(className)} />} />
      </ButtonTooltip>
      <VolumePopoverPrimitive.Popup
        className={cn(
          "m-0 z-40 overflow-visible outline-hidden",
          "rounded-full border-2 border-(--media-frame-border,#805D35) bg-media-popover text-media-popover-foreground shadow-[0_6px_20px_rgba(80,50,20,0.22)]",
          "[--media-popover-side-offset:0.5rem]",
          "data-[side=top]:px-1.5 data-[side=top]:py-2",
          "data-[side=bottom]:px-1.5 data-[side=bottom]:py-2",
          "data-[side=left]:px-2 data-[side=left]:py-1.5",
          "data-[side=right]:px-2 data-[side=right]:py-1.5",
          "before:pointer-events-auto before:absolute",
          "data-[side=top]:before:inset-x-0 data-[side=top]:before:top-full data-[side=top]:before:h-3",
          "data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:bottom-full data-[side=bottom]:before:h-3",
          "data-[side=left]:before:inset-y-0 data-[side=left]:before:left-full data-[side=left]:before:w-3",
          "data-[side=right]:before:inset-y-0 data-[side=right]:before:right-full data-[side=right]:before:w-3",
          "transition-[opacity,scale,transform] duration-media-fast ease-out",
          "media-transitioning:opacity-0 media-transitioning:scale-95",
          "data-starting-style:opacity-0 data-starting-style:scale-95 data-[side=top]:data-starting-style:translate-y-1",
          "data-ending-style:opacity-0 data-ending-style:scale-95 data-[side=top]:data-ending-style:translate-y-1",
        )}
      >
        <VolumeSlider orientation={orientation} />
      </VolumePopoverPrimitive.Popup>
    </VolumePopoverPrimitive.Root>
  );
}
