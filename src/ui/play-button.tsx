/** @jsxImportSource react */

"use client";

import { PlayButton as PlayButtonPrimitive } from "@videojs/react";
import type { ClassValue } from "cn";
import { Button } from "@/ui/button";
import { cn, resolveClassName } from "@/lib/resolve-class-name";
import {
  SunflowerRestartIcon,
  SunflowerPlayIcon,
  SunflowerPauseIcon,
} from "@/ui/icons/sunflower-icons";

export interface PlayButtonProps extends Omit<PlayButtonPrimitive.Props, "children"> {
  iconClassName?: ClassValue;
}

export function PlayButton({ className, iconClassName, ...props }: PlayButtonProps = {}) {
  return (
    <PlayButtonPrimitive
      render={<Button />}
      className={(state) =>
        cn(
          "group/play size-11! p-0! motion-safe:hover:scale-110 motion-safe:active:scale-95 transition-transform duration-media-base",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <SunflowerRestartIcon
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "scale-75 opacity-0 group-data-ended/play:scale-100 group-data-ended/play:opacity-100",
          iconClassName,
        )}
      />
      <SunflowerPlayIcon
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "scale-75 opacity-0",
          "group-not-data-ended/play:group-data-paused/play:opacity-100",
          "group-not-data-ended/play:group-data-paused/play:scale-100",
          "group-not-data-ended/play:group-not-data-started/play:opacity-100",
          "group-not-data-ended/play:group-not-data-started/play:scale-100",
          iconClassName,
        )}
      />
      <SunflowerPauseIcon
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "scale-75 opacity-0",
          "group-data-started/play:group-not-data-paused/play:group-not-data-ended/play:opacity-100",
          "group-data-started/play:group-not-data-paused/play:group-not-data-ended/play:scale-100",
          iconClassName,
        )}
      />
    </PlayButtonPrimitive>
  );
}
