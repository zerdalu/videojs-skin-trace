/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { qualityText } from "@videojs/core/i18n/text/menu";
import { Menu, Text as TextPrimitive } from "@videojs/react";
import { SwitchesIcon as SwitchesIconPrimitive } from "@videojs/react/icons/neutral";
import { QualityRadioGroup } from "@videojs/react/ui/quality-radio-group";

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

export type QualityMenuProps = Omit<Menu.RootProps, "children">;

export function QualityMenu({ ...props }: QualityMenuProps = {}) {
  return (
    <Menu.Root {...props}>
      <QualityRadioGroup.Root>
        <Menu.Trigger className={MENU_TRIGGER_CLASS}>
          <SwitchesIconPrimitive className={MENU_TRIGGER_ICON_CLASS} />
          <TextPrimitive token={qualityText.key}>{qualityText.text}</TextPrimitive>
          <span className={"ms-auto inline-flex min-w-0 items-center gap-1 ps-2"}>
            <QualityRadioGroup.Value className={"max-w-24 truncate opacity-70"} />
            <MenuChevron />
          </span>
        </Menu.Trigger>
        <Menu.Content className={SUBMENU_CONTENT_CLASS}>
          <Menu.Item className={MENU_BACK_ITEM_CLASS}>
            <MenuChevron back />
            <TextPrimitive token={qualityText.key}>{qualityText.text}</TextPrimitive>
          </Menu.Item>
          <Menu.Separator className={MENU_SEPARATOR_CLASS} />
          <QualityRadioGroup.Options
            className={MENU_OPTIONS_CLASS}
            renderItem={(props, item) => (
              <RadioItem {...props}>
                <span>
                  <span>{item.label}</span>
                  {item.tier ? (
                    <sup
                      className={"ps-0.5 pt-px text-media-xs font-semibold leading-none opacity-70"}
                    >
                      {item.tier}
                    </sup>
                  ) : null}
                </span>
                {item.badge ? (
                  <span
                    className={
                      "rounded-media-control bg-media-accent px-1.5 text-media-xs font-semibold"
                    }
                  >
                    {item.badge}
                  </span>
                ) : null}
              </RadioItem>
            )}
          />
        </Menu.Content>
      </QualityRadioGroup.Root>
    </Menu.Root>
  );
}
