/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { ErrorDialog as ErrorDialogPrimitive } from "@videojs/react";

import { Button } from "@/ui/button";
import { cn } from "@/lib/resolve-class-name";

export function ErrorDialog() {
  return (
    <ErrorDialogPrimitive.Root>
      <ErrorDialogPrimitive.Backdrop
        className={cn(
          "absolute inset-0 z-40 bg-media-backdrop/40 opacity-100 backdrop-filter-media-dialog rounded-[inherit]",
          "not-data-open:hidden transition-opacity delay-media-dialog duration-media-dialog ease-out",
          "media-transitioning:opacity-0 data-ending-style:delay-0",
          "data-[scope=document]:fixed data-[scope=document]:rounded-none",
          "data-ending-style:duration-media-instant",
        )}
      />
      <ErrorDialogPrimitive.Popup
        className={cn(
          "absolute top-1/2 left-1/2 z-50 flex w-media-dialog-width max-w-media-dialog max-h-[calc(100%-0.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-2xl border-3 border-(--media-frame-border,#805D35) bg-media-popover p-5 text-media-popover-foreground shadow-[0_12px_36px_rgba(80,50,20,0.3)] outline-hidden not-data-open:hidden",
          "transition-[opacity,scale] delay-media-dialog duration-media-dialog ease-out",
          "media-transitioning:scale-media-hidden-popup media-transitioning:opacity-0 data-ending-style:delay-0",
          "data-[scope=document]:fixed data-[scope=document]:max-h-[calc(100dvh-1rem)]",
          "data-ending-style:duration-media-instant",
        )}
      >
        <div className={cn("flex min-h-0 flex-col gap-2 overflow-y-auto", "py-1.5")}>
          <ErrorDialogPrimitive.Title
            className={"m-0 text-media-lg font-bold text-media-primary leading-tight"}
          />
          <ErrorDialogPrimitive.Description
            className={"m-0 text-sm text-media-muted-foreground wrap-anywhere"}
          />
        </div>
        <div className={"flex shrink-0 gap-2"}>
          <ErrorDialogPrimitive.Close
            render={<Button />}
            className={
              "h-media-control w-full flex-1 rounded-xl border-2 border-(--media-frame-border,#805D35) bg-media-primary! px-4 py-2 font-bold text-media-primary-foreground! hover:opacity-90 motion-safe:active:scale-95 transition-all shadow-md"
            }
          />
        </div>
      </ErrorDialogPrimitive.Popup>
    </ErrorDialogPrimitive.Root>
  );
}
