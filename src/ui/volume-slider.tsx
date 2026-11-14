/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { VolumeSlider as VolumeSliderPrimitive } from "@videojs/react";

import { cn, resolveClassName } from "@/lib/resolve-class-name";
import { SliderFill, SliderThumb, SliderTrack, type SliderThumbProps } from "@/ui/slider";
import { AcornThumbIcon } from "./icons/volume-icons";

export type VolumeSliderProps = Omit<VolumeSliderPrimitive.RootProps, "children">;

function VolumeSliderThumb(props: SliderThumbProps) {
  return (
    <SliderThumb {...props}>
      <AcornThumbIcon className="size-9" />
    </SliderThumb>
  );
}

export function VolumeSlider({ className, ...props }: VolumeSliderProps = {}) {
  return (
    <VolumeSliderPrimitive.Root
      className={(state) =>
        cn(
          "group/slider relative flex flex-1 cursor-pointer items-center justify-center outline-hidden",
          "data-disabled:pointer-events-none",
          "transition-[--media-slider-fill,--media-slider-buffer] duration-media-slider ease-out data-dragging:duration-0",
          "rounded-media-pill",
          "data-[orientation=horizontal]:h-9 data-[orientation=horizontal]:min-w-28",
          "data-[orientation=vertical]:h-28 data-[orientation=vertical]:w-9 data-[orientation=vertical]:min-w-0",
          "media-volume-slider",
          resolveClassName(className, state),
        )
      }
      thumbAlignment="edge"
      {...props}
    >
      <VolumeSliderPrimitive.Track render={<SliderTrack />}>
        <VolumeSliderPrimitive.Fill render={<SliderFill />} />
      </VolumeSliderPrimitive.Track>
      <VolumeSliderPrimitive.Thumb
        render={<VolumeSliderThumb />}
        className="scale-100 opacity-100"
      />
    </VolumeSliderPrimitive.Root>
  );
}
