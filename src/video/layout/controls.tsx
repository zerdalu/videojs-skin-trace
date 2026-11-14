/** @jsxImportSource react */

import { Controls, BufferingIndicator, Time, Tooltip } from "@videojs/react";
import type { ComponentProps, Ref } from "react";

import { cn } from "@/lib/resolve-class-name";
import type { TraceMode } from "@/lib/sketch-types";
import { AirPlayButton } from "@/ui/airplay-button";
import { Button } from "@/ui/button";
import { ButtonTooltip } from "@/ui/button-tooltip";
import { CaptionsButton } from "@/ui/captions-button";
import { CastButton } from "@/ui/cast-button";
import { FullscreenButton } from "@/ui/fullscreen-button";
import { StorybookFilmstripIcon, StorybookPenIcon } from "@/ui/icons/trace-icons";
import { PiPButton } from "@/ui/pip-button";
import { PlayButton } from "@/ui/play-button";
import { TimeSlider } from "@/ui/time-slider";
import { VolumePopover } from "@/ui/volume-popover";
import { VideoSettingsMenu } from "@/video/menus/settings-menu";

export interface NeutralVideoControlsProps {
  renderThumbnail?: NonNullable<ComponentProps<typeof TimeSlider>>["renderThumbnail"];
  mode?: TraceMode;
  sketchCount?: number;
  sketchTriggerRef?: Ref<HTMLButtonElement>;
  filmstripTriggerRef?: Ref<HTMLButtonElement>;
  onOpenSketch?: () => void;
  onOpenFilmstrip?: () => void;
}

export function NeutralVideoControls({
  renderThumbnail,
  mode = "playback",
  sketchCount = 0,
  sketchTriggerRef,
  filmstripTriggerRef,
  onOpenSketch,
  onOpenFilmstrip,
}: NeutralVideoControlsProps = {}) {
  const hiddenByMode = mode !== "playback";

  return (
    <Controls.Root>
      {/* Top-Right Sketching & Filmstrip Controls Container */}
      <Controls.Group
        aria-hidden={hiddenByMode || undefined}
        className={cn(
          "group/sketch-controls text-media-controls-foreground text-shadow-media",
          "absolute top-2.5 inset-e-2.5 z-30 flex flex-row media-md:flex-col items-center gap-1 media-md:top-3.5 media-md:inset-e-3.5",
          "rounded-2xl bg-media-popover/95 border-2 border-(--media-frame-border,#805D35) px-1.5 py-1 media-md:py-1.5 shadow-[0_4px_16px_rgba(80,50,20,0.18)]",
          "origin-top-right transition-[filter,opacity,translate] duration-media-controls-enter ease-out",
          "not-data-visible:pointer-events-none not-data-visible:opacity-0 not-data-visible:duration-media-controls",
          "pointer-fine:not-data-visible:blur-media-hidden",
          "not-data-visible:-translate-y-2",
          "media-max-5xs:hidden!",
          hiddenByMode && "hidden!",
        )}
      >
        <Tooltip.Provider>
          <ButtonTooltip label="Sketch on frame" side="left">
            <Button
              ref={sketchTriggerRef}
              type="button"
              onClick={onOpenSketch}
              aria-label="Sketch on video frame"
              className={cn(
                "size-10! pointer-coarse:size-11! media-max-3xs:size-8! media-max-3xs:pointer-coarse:size-9! p-0.5! motion-safe:hover:scale-110 motion-safe:active:scale-95 transition-transform duration-media-base",
                "group-not-data-visible/sketch-controls:pointer-events-none",
              )}
            >
              <StorybookPenIcon className="size-full" />
            </Button>
          </ButtonTooltip>

          <ButtonTooltip label={`Sketch filmstrip (${sketchCount})`} side="left">
            <Button
              ref={filmstripTriggerRef}
              type="button"
              onClick={onOpenFilmstrip}
              aria-label="Open saved sketches filmstrip"
              className={cn(
                "relative size-10! pointer-coarse:size-11! media-max-3xs:size-8! media-max-3xs:pointer-coarse:size-9! p-0.5! motion-safe:hover:scale-110 motion-safe:active:scale-95 transition-transform duration-media-base",
                "group-not-data-visible/sketch-controls:pointer-events-none",
              )}
            >
              <StorybookFilmstripIcon className="size-full" />
              {sketchCount > 0 && (
                <span
                  aria-hidden="true"
                  className="storybook-tabular-nums absolute -top-0.5 -inset-e-0.5 grid min-w-4 h-4 place-items-center rounded-full border border-[#3F2D1C] bg-[#F59E0B] px-1 text-[10px] font-extrabold leading-none text-[#2B2118] shadow-xs tabular-nums"
                >
                  {sketchCount}
                </span>
              )}
            </Button>
          </ButtonTooltip>
        </Tooltip.Provider>
      </Controls.Group>

      {/* Center Sunflower Play Button */}
      <BufferingIndicator className={"group/buffering contents"}>
        <Controls.Group
          aria-hidden={hiddenByMode || undefined}
          className={cn(
            "group/center pointer-events-none absolute top-1/2 left-1/2 z-30 flex -translate-1/2 items-center rtl:flex-row-reverse gap-6",
            "transition-[filter,opacity,scale] duration-media-controls-enter ease-out",
            "not-data-visible:opacity-0 not-data-visible:scale-media-hidden not-data-visible:duration-media-controls",
            "pointer-fine:not-data-visible:blur-media-hidden",
            "group-data-visible/buffering:hidden",
            "media-max-5xs:[--media-center-play-started-opacity:1]",
            "media-max-5xs:[--media-center-play-started-pointer-events:auto]",
            hiddenByMode && "hidden!",
          )}
        >
          <PlayButton
            className={cn(
              "pointer-events-auto group-not-data-visible/center:pointer-events-none",
              "size-28! media-max-sm:size-20! media-max-3xs:size-14! rounded-full!",
              "data-started:not-focus-visible:opacity-(--media-center-play-started-opacity,0)!",
              "data-started:not-focus-visible:[pointer-events:var(--media-center-play-started-pointer-events,none)]!",
            )}
            iconClassName={"size-full!"}
          />
        </Controls.Group>
      </BufferingIndicator>

      {/* Warm Parchment Scrim */}
      <Controls.Backdrop
        aria-hidden={hiddenByMode || undefined}
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-28 z-10 rounded-b-[22px]",
          "bg-linear-to-t from-media-background/90 via-media-background/50 to-transparent",
          "transition-opacity duration-media-controls ease-out not-data-visible:opacity-0",
          "not-data-started:[visibility:var(--media-controls-before-start,hidden)]",
          "media-max-5xs:hidden!",
          hiddenByMode && "hidden!",
        )}
      />

      {/* Responsive In-Player Control Bar */}
      <Controls.Content
        aria-hidden={hiddenByMode || undefined}
        className={cn(
          "video-controls",
          "group/controls text-media-controls-foreground text-shadow-media",
          "duration-media-controls-enter ease-out",
          "not-data-started:[visibility:var(--media-controls-before-start,hidden)]",
          "absolute inset-x-2 bottom-2 z-30 flex flex-nowrap items-center rtl:flex-row-reverse gap-x-2 rounded-2xl bg-media-popover/95 border-2 border-(--media-frame-border,#805D35) px-2.5 py-1.5 shadow-[0_4px_16px_rgba(80,50,20,0.18)]",
          "media-max-xl:flex-wrap media-max-xl:justify-between media-max-xl:gap-y-0.5 media-max-xl:px-2",
          "transition-[filter,opacity,translate]",
          "not-data-visible:pointer-events-none not-data-visible:opacity-0",
          "not-data-visible:duration-media-controls",
          "not-data-visible:translate-y-media-hidden-offset pointer-fine:not-data-visible:blur-media-hidden",
          hiddenByMode && "hidden!",
        )}
      >
        <Tooltip.Provider>
          {/* Left Controls: Play Button & Time Readouts */}
          <Controls.Group className={"flex items-center rtl:flex-row-reverse gap-3 shrink-0"}>
            <ButtonTooltip side="top">
              <PlayButton className={"size-10! media-max-5xs:hidden!"} />
            </ButtonTooltip>

            {/* High-contrast duration and progress numbers */}
            <Time.Group
              className={cn(
                "storybook-tabular-nums tabular-nums flex items-center rtl:flex-row-reverse gap-1 font-bold text-xs tracking-normal whitespace-nowrap text-media-muted-foreground",
                "pe-1 media-max-5xs:hidden!",
              )}
            >
              <Time.Value
                className={cn(
                  "storybook-tabular-nums cursor-pointer rounded-sm tabular-nums text-media-primary font-bold",
                  "outline-2 outline-transparent focus-visible:outline-media-ring focus-visible:outline-offset-2",
                  "aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                )}
                type="current"
                toggle
              />
              <Time.Separator className={"text-media-muted-foreground font-bold"}>/</Time.Separator>
              <Time.Value
                className={
                  "storybook-tabular-nums tabular-nums text-media-muted-foreground font-bold"
                }
                type="duration"
              />
            </Time.Group>
          </Controls.Group>

          {/* Middle (Top row on compact players): Vine Seek Bar with Ladybug Thumb */}
          <Controls.Group
            className={cn(
              "@container/video-time-controls flex min-w-0 flex-1 items-center px-2",
              "media-max-xl:order-first media-max-xl:basis-full media-max-xl:px-1",
              "[--media-slider-height:--spacing(6)]",
            )}
          >
            <TimeSlider previewOverflow="clamp" renderThumbnail={renderThumbnail} />
          </Controls.Group>

          {/* Right Controls: Vertical Volume Popover, CC, Helm Settings, Cast, AirPlay, PiP, Fullscreen */}
          <Controls.Group
            className={"flex items-center rtl:flex-row-reverse justify-end gap-1 shrink-0"}
          >
            <VolumePopover className={"media-max-5xs:hidden"} side="top" orientation="vertical" />

            <ButtonTooltip side="top">
              <CaptionsButton className={"media-max-sm:hidden"} />
            </ButtonTooltip>

            <VideoSettingsMenu className={"media-max-2xs:hidden"} />

            <Controls.Group className={"flex items-center rtl:flex-row-reverse gap-1"}>
              <ButtonTooltip side="top">
                <CastButton className={"media-max-lg:hidden"} />
              </ButtonTooltip>
              <ButtonTooltip side="top">
                <AirPlayButton className={"media-max-lg:hidden"} />
              </ButtonTooltip>
              <ButtonTooltip side="top">
                <PiPButton className={"media-max-md:hidden"} />
              </ButtonTooltip>
              <ButtonTooltip side="top">
                <FullscreenButton className={"media-max-4xs:hidden"} />
              </ButtonTooltip>
            </Controls.Group>
          </Controls.Group>
        </Tooltip.Provider>
      </Controls.Content>
    </Controls.Root>
  );
}
