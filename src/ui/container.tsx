/** @jsxImportSource react */

"use client";

import { Container as ContainerPrimitive } from "@videojs/react";
import { cn } from "@/lib/resolve-class-name";

export interface ContainerProps extends Omit<ContainerPrimitive.Props, "children"> {
  children?: ContainerPrimitive.Props["children"];
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <ContainerPrimitive
      className={cn(
        "media-skin storybook-stitched-frame",
        "relative isolate block h-full w-full overflow-hidden @container/media-root",
        "font-media text-media leading-normal subpixel-antialiased",
        "bg-media-background text-media-foreground shadow-[0_10px_35px_-5px_rgba(80,50,20,0.25)]",
        "outline-2 -outline-offset-4 outline-transparent transition-all duration-media-fast",
        "focus-visible:outline-media-ring focus-visible:-outline-offset-4",
        className,
      )}
      {...props}
    >
      {children}
    </ContainerPrimitive>
  );
}
