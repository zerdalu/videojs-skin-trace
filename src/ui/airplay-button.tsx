/** @jsxImportSource react */

"use client";

import { AirPlayButton as AirPlayButtonPrimitive } from "@videojs/react";
import { Button } from "@/ui/button";
import { cn, resolveClassName } from "@/lib/resolve-class-name";
import { RusticCastIcon } from "@/ui/icons/feature-icons";

export type AirPlayButtonProps = Omit<AirPlayButtonPrimitive.Props, "children">;

export function AirPlayButton({ className, ...props }: AirPlayButtonProps = {}) {
  return (
    <AirPlayButtonPrimitive
      render={<Button />}
      className={(state) =>
        cn(
          "group/airplay size-10! p-0.5! motion-safe:hover:scale-110 motion-safe:active:scale-95 transition-transform duration-media-base",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <RusticCastIcon
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "group-data-[airplay-state=connected]/airplay:scale-105",
        )}
      />
    </AirPlayButtonPrimitive>
  );
}
