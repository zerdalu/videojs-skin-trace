import { I18nProvider } from "@videojs/react/i18n";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

import { Player } from "@preview/frame/player";
import {
  describeContainerTier,
  formatCssAspectRatio,
  getVisibleWidthPresets,
  STAGE_BREAKPOINT_TICKS,
  STAGE_RATIOS,
  STAGE_WIDTH_BOUNDS,
  type StageDirection,
  type StageRatio,
  type StageScheme,
} from "@preview/landing/stage-presets";
import { StorybookFilmstripIcon, StorybookPenIcon } from "@/ui/icons/trace-icons";

export interface PlayerStageProps {
  scheme: StageScheme;
  onSchemeChange: (scheme: StageScheme) => void;
}

const MOBILE_STAGE_QUERY = "(max-width: 639px), ((pointer: coarse) and (max-height: 500px))";
const MIN_MULTI_PRESET_WIDTH = 460;

export function PlayerStage({ scheme, onSchemeChange }: PlayerStageProps) {
  const sliderId = useId();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [targetWidth, setTargetWidth] = useState<number>(STAGE_WIDTH_BOUNDS.default);
  const [availableWidth, setAvailableWidth] = useState<number | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(STAGE_WIDTH_BOUNDS.default);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.matchMedia(MOBILE_STAGE_QUERY).matches : false,
  );
  const [ratio, setRatio] = useState<StageRatio>("16:9");
  const [direction, setDirection] = useState<StageDirection>("ltr");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(MOBILE_STAGE_QUERY);
    const update = () => setIsMobileViewport(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;

    const observers: ResizeObserver[] = [];

    if (viewportRef.current) {
      const viewportEl = viewportRef.current;
      const updateViewport = () => {
        const next = Math.floor(viewportEl.getBoundingClientRect().width);
        if (next > 0) {
          setAvailableWidth((prev) => (prev === next ? prev : next));
        }
      };
      updateViewport();
      const observer = new ResizeObserver(updateViewport);
      observer.observe(viewportEl);
      observers.push(observer);
    }

    if (stageRef.current) {
      const stageEl = stageRef.current;
      const updateStage = () => {
        const next = Math.round(stageEl.getBoundingClientRect().width);
        if (next > 0) {
          setMeasuredWidth((prev) => (prev === next ? prev : next));
        }
      };
      updateStage();
      const observer = new ResizeObserver(updateStage);
      observer.observe(stageEl);
      observers.push(observer);
    }

    return () => {
      for (const observer of observers) observer.disconnect();
    };
  }, []);

  const showWidthControls =
    !isMobileViewport && (availableWidth === null || availableWidth >= MIN_MULTI_PRESET_WIDTH);

  const sliderMax =
    availableWidth !== null
      ? Math.max(STAGE_WIDTH_BOUNDS.min, Math.min(STAGE_WIDTH_BOUNDS.max, availableWidth))
      : STAGE_WIDTH_BOUNDS.max;

  const clampedTargetWidth = Math.min(Math.max(STAGE_WIDTH_BOUNDS.min, targetWidth), sliderMax);
  const visiblePresets = showWidthControls ? getVisibleWidthPresets(sliderMax) : [];
  const visibleTicks = STAGE_BREAKPOINT_TICKS.filter(
    (tick) => tick >= STAGE_WIDTH_BOUNDS.min && tick <= sliderMax,
  );
  const tickSpan = Math.max(1, sliderMax - STAGE_WIDTH_BOUNDS.min);

  const effectiveWidth = measuredWidth > 0 ? measuredWidth : clampedTargetWidth;
  const isCompactFrame = effectiveWidth <= 480;

  const skinSchemeProps =
    scheme === "auto"
      ? undefined
      : {
          "data-color-scheme": scheme,
          style: { colorScheme: scheme } as CSSProperties,
        };

  const stageStyle = {
    "--stage-width": showWidthControls ? `${clampedTargetWidth}px` : "100%",
    "--landing-player-ratio": formatCssAspectRatio(ratio),
  } as CSSProperties;

  return (
    <section
      id="interactive-stage"
      aria-label="Interactive Trace video player stage"
      className="sb-stage-section"
    >
      {/* Storybook Sizing & Palette Controls */}
      <div className="sb-sizing-dock">
        <div className="sb-dock-top">
          {showWidthControls && visiblePresets.length > 0 && (
            <fieldset className="sb-presets-row sb-width-control" aria-label="Player width presets">
              {visiblePresets.map((preset) => {
                const active = clampedTargetWidth === preset.width;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTargetWidth(preset.width)}
                    className="sb-pill-btn"
                  >
                    <span>{preset.label}</span>
                    <span className="sb-pill-sub">{preset.caption}</span>
                  </button>
                );
              })}
            </fieldset>
          )}

          <div className="sb-dock-meta">
            <span className="sb-readout-pill">
              <span>Layout:</span>
              <span>{describeContainerTier(effectiveWidth)}</span>
            </span>
            <span className="sb-readout-pill sb-mono-num">{effectiveWidth}px</span>
          </div>
        </div>

        <div
          className={
            showWidthControls
              ? "sb-dock-controls-grid"
              : "sb-dock-controls-grid sb-dock-controls-compact"
          }
        >
          {showWidthControls && (
            <div className="sb-slider-box sb-width-control">
              <div className="sb-slider-header">
                <label htmlFor={sliderId}>Resize player container width</label>
                <span className="sb-mono-num">{clampedTargetWidth} px</span>
              </div>
              <input
                id={sliderId}
                type="range"
                min={STAGE_WIDTH_BOUNDS.min}
                max={sliderMax}
                step={4}
                value={clampedTargetWidth}
                onChange={(event) => setTargetWidth(Number(event.target.value))}
                aria-valuetext={`${clampedTargetWidth} pixels, ${describeContainerTier(effectiveWidth)}`}
                className="sb-width-range"
              />
              {visibleTicks.length > 0 && (
                <div className="sb-tick-track" aria-hidden="true">
                  {visibleTicks.map((tick) => {
                    const percent = ((tick - STAGE_WIDTH_BOUNDS.min) / tickSpan) * 100;
                    return (
                      <span key={tick} className="sb-tick-mark" style={{ left: `${percent}%` }}>
                        <span className="sb-tick-line" />
                        <span>{tick}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="sb-stage-toggles">
            <div className="sb-toggle-item">
              <span className="sb-toggle-label">Palette</span>
              <fieldset className="sb-segmented" aria-label="Storybook color palette">
                {(["auto", "light", "dark"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={scheme === item}
                    onClick={() => onSchemeChange(item)}
                    className="sb-scheme-btn"
                  >
                    {item === "auto" ? "Auto" : item === "light" ? "Daylight" : "Bedtime"}
                  </button>
                ))}
              </fieldset>
            </div>

            <div className="sb-toggle-item">
              <span className="sb-toggle-label">Ratio</span>
              <fieldset className="sb-segmented" aria-label="Player aspect ratio">
                {STAGE_RATIOS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={ratio === item}
                    onClick={() => setRatio(item)}
                    className="sb-scheme-btn sb-mono-num"
                  >
                    {item}
                  </button>
                ))}
              </fieldset>
            </div>

            <div className="sb-toggle-item">
              <span className="sb-toggle-label">Dir</span>
              <fieldset className="sb-segmented" aria-label="Player reading direction">
                {(["ltr", "rtl"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={direction === item}
                    onClick={() => setDirection(item)}
                    className="sb-scheme-btn"
                  >
                    {item.toUpperCase()}
                  </button>
                ))}
              </fieldset>
            </div>
          </div>
        </div>
      </div>

      {/* Live Video.js v10 Player with Trace Skin */}
      <div ref={viewportRef} className="landing-stage-viewport">
        <div
          ref={stageRef}
          dir={direction}
          data-compact={isCompactFrame ? "true" : undefined}
          style={stageStyle}
          className="landing-player-stage"
        >
          <div className="sb-stage-ruler-bar" aria-hidden="true">
            <span className="sb-mono-num">{effectiveWidth} px</span>
            <span className="sb-stage-ruler-line" />
            <span>
              {ratio} · {direction.toUpperCase()}
            </span>
          </div>

          <I18nProvider locale="en">
            <Player
              media={{
                autoPlay: false,
                muted: false,
                loop: false,
                preload: "metadata",
              }}
              skinProps={skinSchemeProps}
            />
          </I18nProvider>
        </div>
      </div>

      {/* Quick Judge Exploration Strip */}
      <div className="sb-try-strip" aria-label="Interactive features to try">
        <span className="sb-try-item">
          <StorybookPenIcon className="size-5 shrink-0" />
          <span>Click the top-right pen to draw on any paused frame</span>
        </span>
        <span className="sb-try-item">
          <StorybookFilmstripIcon className="size-5 shrink-0" />
          <span>Collect frames in the filmstrip &amp; export a storybook PNG</span>
        </span>
        <span className="sb-try-item">
          <kbd className="sb-kbd">Space</kbd>
          <span>Play/Pause</span>
          <kbd className="sb-kbd">C</kbd>
          <span>Captions</span>
          <kbd className="sb-kbd">F</kbd>
          <span>Fullscreen</span>
        </span>
      </div>
    </section>
  );
}
