/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { audioText } from "@videojs/core/i18n/text/menu";
import { Menu, Text as TextPrimitive } from "@videojs/react";
import { SpeechIcon as SpeechIconPrimitive } from "@videojs/react/icons/neutral";
import { AudioTrackRadioGroup } from "@videojs/react/ui/audio-track-radio-group";

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

export type AudioTrackMenuProps = Omit<Menu.RootProps, "children">;

export function AudioTrackMenu({ ...props }: AudioTrackMenuProps = {}) {
  return (
    <Menu.Root {...props}>
      <AudioTrackRadioGroup.Root>
        <Menu.Trigger className={MENU_TRIGGER_CLASS}>
          <SpeechIconPrimitive className={MENU_TRIGGER_ICON_CLASS} />
          <TextPrimitive token={audioText.key}>{audioText.text}</TextPrimitive>
          <span className={"ms-auto inline-flex min-w-0 items-center gap-1 ps-2"}>
            <AudioTrackRadioGroup.Value className={"max-w-24 truncate opacity-70"} />
            <MenuChevron />
          </span>
        </Menu.Trigger>
        <Menu.Content className={SUBMENU_CONTENT_CLASS}>
          <Menu.Item className={MENU_BACK_ITEM_CLASS}>
            <MenuChevron back />
            <TextPrimitive token={audioText.key}>{audioText.text}</TextPrimitive>
          </Menu.Item>
          <Menu.Separator className={MENU_SEPARATOR_CLASS} />
          <AudioTrackRadioGroup.Options
            className={MENU_OPTIONS_CLASS}
            renderItem={(props, item) => (
              <RadioItem {...props}>
                <span>{item.label}</span>
              </RadioItem>
            )}
          />
        </Menu.Content>
      </AudioTrackRadioGroup.Root>
    </Menu.Root>
  );
}
