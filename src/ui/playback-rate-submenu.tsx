/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { speedText } from "@videojs/core/i18n/text/menu";
import { Menu, Text as TextPrimitive } from "@videojs/react";
import { SpeedIcon as SpeedIconPrimitive } from "@videojs/react/icons/neutral";
import { PlaybackRateRadioGroup } from "@videojs/react/ui/playback-rate-radio-group";

import { MenuChevron } from "@/ui/menu-chevron";
import {
  MENU_BACK_ITEM_CLASS,
  MENU_OPTIONS_CLASS,
  MENU_SEPARATOR_CLASS,
  MENU_TRIGGER_CLASS,
  MENU_TRIGGER_ICON_CLASS,
  SUBMENU_CONTENT_CLASS,
} from "@/ui/menu-styles";
import { RadioItem } from "@/ui/radio-item";

export type PlaybackRateSubmenuProps = Omit<Menu.RootProps, "children">;

export function PlaybackRateSubmenu({ ...props }: PlaybackRateSubmenuProps = {}) {
  return (
    <Menu.Root {...props}>
      <PlaybackRateRadioGroup.Root>
        <Menu.Trigger className={MENU_TRIGGER_CLASS}>
          <SpeedIconPrimitive className={MENU_TRIGGER_ICON_CLASS} />
          <TextPrimitive token={speedText.key}>{speedText.text}</TextPrimitive>
          <span className={"ms-auto inline-flex min-w-0 items-center gap-1 ps-2"}>
            <PlaybackRateRadioGroup.Value className={"max-w-24 truncate opacity-70"} />
            <MenuChevron />
          </span>
        </Menu.Trigger>
        <Menu.Content className={SUBMENU_CONTENT_CLASS}>
          <Menu.Item className={MENU_BACK_ITEM_CLASS}>
            <MenuChevron back />
            <TextPrimitive token={speedText.key}>{speedText.text}</TextPrimitive>
          </Menu.Item>
          <Menu.Separator className={MENU_SEPARATOR_CLASS} />
          <PlaybackRateRadioGroup.Options
            className={MENU_OPTIONS_CLASS}
            renderItem={(props, item) => (
              <RadioItem {...props}>
                <span>{item.label}</span>
              </RadioItem>
            )}
          />
        </Menu.Content>
      </PlaybackRateRadioGroup.Root>
    </Menu.Root>
  );
}
