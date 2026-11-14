/** @jsxImportSource react */

"use client";

import { settingsText } from "@videojs/core/i18n/text/menu";
import { Menu, Text as TextPrimitive } from "@videojs/react";
import type { ClassValue } from "cn";
import { cn, resolveClassName } from "@/lib/resolve-class-name";
import { Button } from "@/ui/button";
import { ButtonTooltip } from "@/ui/button-tooltip";
import { WoodenGearSettingsIcon } from "@/ui/icons/chrome-icons";

export interface SettingsMenuProps extends Omit<Menu.RootProps, "children"> {
  className?: ClassValue;
  children?: Menu.ContentProps["children"];
}

export function SettingsMenu({ children, className, ...props }: SettingsMenuProps) {
  return (
    <Menu.Root side="top" align="center" {...props}>
      <ButtonTooltip
        label={<TextPrimitive token={settingsText.key}>{settingsText.text}</TextPrimitive>}
        side="top"
      >
        <Menu.Trigger
          render={<Button />}
          className={(state) =>
            cn(
              "group/settings size-10! p-1.5! motion-safe:hover:scale-110 motion-safe:active:scale-95 transition-transform duration-media-base",
              resolveClassName(className, state),
            )
          }
        >
          <WoodenGearSettingsIcon
            className={cn(
              "col-start-1 row-start-1 size-full transition-transform duration-media-slow ease-out",
              "motion-safe:group-aria-expanded/settings:rotate-90 motion-safe:group-hover/settings:rotate-45",
            )}
          />
          <TextPrimitive className="sr-only" token={settingsText.key}>
            {settingsText.text}
          </TextPrimitive>
        </Menu.Trigger>
      </ButtonTooltip>

      {/* Storybook Illustrated Parchment Menu Popup */}
      <Menu.Popup
        keepMounted
        className={cn(
          "m-0 min-w-52 max-w-xs overflow-y-auto overscroll-contain rounded-2xl p-2 font-media text-sm",
          "max-h-[min(var(--media-menu-available-height,18rem),18rem)]",
          "border-3 border-(--media-frame-border,#805D35) bg-(--media-popover,#FFFDF8) text-(--media-popover-foreground,#38281A)",
          "shadow-[0_8px_24px_rgba(80,50,20,0.22)] outline-hidden transition-all duration-media-fast",
          "media-transitioning:scale-95 media-transitioning:opacity-0",
          "data-starting-style:scale-95 data-starting-style:opacity-0",
          "data-ending-style:scale-95 data-ending-style:opacity-0",
        )}
      >
        <Menu.Content className="flex flex-col gap-1 data-child-open:gap-0">
          {children}
        </Menu.Content>
      </Menu.Popup>
    </Menu.Root>
  );
}
