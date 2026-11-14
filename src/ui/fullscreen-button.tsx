/** @jsxImportSource react */

"use client";

import { FullscreenButton as FullscreenButtonPrimitive } from "@videojs/react";
import { Button } from "@/ui/button";
import { cn, resolveClassName } from "@/lib/resolve-class-name";
import { TwigFullscreenIcon } from "@/ui/icons/chrome-icons";

export type FullscreenButtonProps = Omit<FullscreenButtonPrimitive.Props, "children">;

export function FullscreenButton({ className, ...props }: FullscreenButtonProps = {}) {
  return (
    <FullscreenButtonPrimitive
      render={<Button />}
      className={(state) =>
        cn(
          "group/fullscreen size-10! p-0.5! motion-safe:hover:scale-110 motion-safe:active:scale-95 transition-transform duration-media-base",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <TwigFullscreenIcon
        exit={false}
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "opacity-0 scale-85 group-not-data-fullscreen/fullscreen:scale-100 group-not-data-fullscreen/fullscreen:opacity-100",
        )}
      />
      <TwigFullscreenIcon
        exit={true}
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "opacity-0 scale-85 group-data-fullscreen/fullscreen:scale-100 group-data-fullscreen/fullscreen:opacity-100",
        )}
      />
    </FullscreenButtonPrimitive>
  );
}
