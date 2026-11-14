/** @jsxImportSource react */

"use client";

import { PiPButton as PiPButtonPrimitive } from "@videojs/react";
import { Button } from "@/ui/button";
import { cn, resolveClassName } from "@/lib/resolve-class-name";
import { RusticPipIcon } from "@/ui/icons/feature-icons";

export type PiPButtonProps = Omit<PiPButtonPrimitive.Props, "children">;

export function PiPButton({ className, ...props }: PiPButtonProps = {}) {
  return (
    <PiPButtonPrimitive
      render={<Button />}
      className={(state) =>
        cn(
          "group/pip size-10! p-0.5! motion-safe:hover:scale-110 motion-safe:active:scale-95 transition-transform duration-media-base",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <RusticPipIcon
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "group-data-pip/pip:scale-105",
        )}
      />
    </PiPButtonPrimitive>
  );
}
