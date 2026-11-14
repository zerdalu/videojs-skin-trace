/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { Menu } from "@videojs/react";
import { CheckIcon as CheckIconPrimitive } from "@videojs/react/icons/neutral";

import { cn, resolveClassName } from "@/lib/resolve-class-name";

export interface RadioItemProps extends Omit<Menu.RadioItemProps, "children"> {
  children?: Menu.RadioItemProps["children"];
}

export function RadioItem({ children, className, ...props }: RadioItemProps) {
  return (
    <Menu.RadioItem
      className={(state) =>
        cn(
          "group/menu-radio-item",
          "relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-2.5 py-1.5 text-start whitespace-nowrap text-sm font-medium",
          "text-(--media-popover-foreground,#38281A)",
          "hover:bg-(--media-accent,#F4E8D0) hover:text-(--media-accent-foreground,#38281A)",
          "media-highlighted:bg-(--media-accent,#F4E8D0) media-highlighted:text-(--media-accent-foreground,#38281A)",
          "focus-visible:outline-2 focus-visible:outline-media-ring focus-visible:outline-offset-1",
          "transition-[background-color,color] duration-media-fast ease-in-out",
          "justify-between tabular-nums",
          "data-[availability=unavailable]:hidden data-[availability=unsupported]:hidden",
          "aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
          "data-custom:italic",
          resolveClassName(className, state),
        )
      }
      {...props}
    >
      {children}
      <Menu.ItemIndicator
        forceMount
        className={
          "ms-auto -me-1 shrink-0 opacity-0 group-aria-checked/menu-radio-item:opacity-100"
        }
      >
        <CheckIconPrimitive
          className={cn(
            "shrink-0 text-(--media-primary,#78350F) size-5 font-bold",
            "group-media-highlighted/menu-radio-item:text-(--media-primary,#78350F)",
          )}
        />
      </Menu.ItemIndicator>
    </Menu.RadioItem>
  );
}
