/** @jsxImportSource react */

"use client";

import { CaptionsButton as CaptionsButtonPrimitive } from "@videojs/react";
import { Button } from "@/ui/button";
import { cn, resolveClassName } from "@/lib/resolve-class-name";
import { SpeechBubbleCcIcon } from "@/ui/icons/feature-icons";

export type CaptionsButtonProps = Omit<CaptionsButtonPrimitive.Props, "children">;

export function CaptionsButton({ className, ...props }: CaptionsButtonProps = {}) {
  return (
    <CaptionsButtonPrimitive
      render={<Button />}
      className={(state) =>
        cn(
          "group/captions size-10! p-0.5! motion-safe:hover:scale-110 motion-safe:active:scale-95 transition-transform duration-media-base",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      <SpeechBubbleCcIcon
        active={false}
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "opacity-0 scale-85 group-not-data-active/captions:scale-100 group-not-data-active/captions:opacity-100",
        )}
      />
      <SpeechBubbleCcIcon
        active={true}
        className={cn(
          "col-start-1 row-start-1 size-full transition-all duration-media-base ease-out",
          "opacity-0 scale-85 group-data-active/captions:scale-100 group-data-active/captions:opacity-100",
        )}
      />
    </CaptionsButtonPrimitive>
  );
}
