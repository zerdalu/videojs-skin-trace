import { useState } from "react";

import { LadybugThumbIcon } from "@/ui/icons/ladybug-icon";
import { SunflowerPauseIcon, SunflowerPlayIcon } from "@/ui/icons/sunflower-icons";
import { StorybookFilmstripIcon, StorybookPenIcon } from "@/ui/icons/trace-icons";
import { AcornThumbIcon, SongbirdVolumeIcon } from "@/ui/icons/volume-icons";

type LadybugDemoState = "playing" | "paused" | "wings";

export function WoodlandShowcase() {
  const [ladybugState, setLadybugState] = useState<LadybugDemoState>("playing");

  return (
    <>
      {/* Chapter II: Woodland Controls */}
      <section id="woodland-controls" aria-labelledby="woodland-heading">
        <div className="sb-chapter-divider">
          <span className="sb-chapter-rule" aria-hidden="true" />
          <span className="sb-chapter-tag">Chapter II · Field Notes</span>
          <span className="sb-chapter-rule" aria-hidden="true" />
        </div>

        <h2 id="woodland-heading" className="sb-section-heading">
          Meet the Woodland Controls
        </h2>
        <p className="sb-section-sub">
          Every button and slider inside Trace is hand-illustrated in SVG and responds playfully to
          playback, chapters, audio, and pauses.
        </p>

        <div className="sb-card-grid">
          <article className="sb-field-card">
            <div className="sb-specimen-tray">
              <div className="sb-specimen-box">
                <SunflowerPlayIcon />
              </div>
              <div className="sb-specimen-box">
                <SunflowerPauseIcon />
              </div>
            </div>
            <h3 className="sb-card-title">Sunflower Medallion</h3>
            <p className="sb-card-text">
              A warm golden sunflower anchors play, pause, and replay with chunky oak-ink shapes and
              springy feedback.
            </p>
          </article>

          <article className="sb-field-card">
            <div className="sb-specimen-tray">
              <div className="sb-specimen-wide">
                <LadybugThumbIcon
                  playing={ladybugState === "playing"}
                  paused={ladybugState === "paused"}
                  wingsOpen={ladybugState === "wings"}
                />
              </div>
            </div>
            <h3 className="sb-card-title">Ladybug Chapter Seeker</h3>
            <p className="sb-card-text">
              She walks along a divided garden vine, peeks around curiously when paused, and spreads
              her spotted wings across chapter hops.
            </p>
            <fieldset className="sb-state-switcher" aria-label="Preview ladybug animation">
              {(
                [
                  ["playing", "Walking"],
                  ["paused", "Peeking"],
                  ["wings", "Wings Open"],
                ] as const
              ).map(([state, label]) => (
                <button
                  key={state}
                  type="button"
                  aria-pressed={ladybugState === state}
                  onClick={() => setLadybugState(state)}
                  className="sb-mini-chip"
                >
                  {label}
                </button>
              ))}
            </fieldset>
          </article>

          <article className="sb-field-card">
            <div className="sb-specimen-tray">
              <div className="group/mute sb-specimen-wide" data-volume-level="high">
                <SongbirdVolumeIcon level="high" />
              </div>
              <div className="sb-specimen-box">
                <AcornThumbIcon />
              </div>
              <div className="group/mute sb-specimen-wide" data-muted="">
                <SongbirdVolumeIcon level="off" />
              </div>
            </div>
            <h3 className="sb-card-title">Songbird &amp; Acorn Volume</h3>
            <p className="sb-card-text">
              A perched robin sings musical notes with an acorn slider thumb, rests when paused, and
              snoozes with floating Zzz when muted.
            </p>
          </article>

          <article className="sb-field-card">
            <div className="sb-specimen-tray">
              <div className="sb-specimen-box">
                <StorybookPenIcon />
              </div>
              <div className="sb-specimen-box">
                <StorybookFilmstripIcon />
              </div>
            </div>
            <h3 className="sb-card-title">Sketchbook &amp; Filmstrip</h3>
            <p className="sb-card-text">
              Pause any scene to draw with pen, marker, textured crayon, highlighter, text, or
              eraser—then export your keepsake PNG scroll.
            </p>
          </article>
        </div>
      </section>

      {/* Chapter III: Design Thinking & Craft */}
      <section id="design-notes" aria-labelledby="design-heading">
        <div className="sb-chapter-divider">
          <span className="sb-chapter-rule" aria-hidden="true" />
          <span className="sb-chapter-tag">Chapter III · Design Thinking</span>
          <span className="sb-chapter-rule" aria-hidden="true" />
        </div>

        <h2 id="design-heading" className="sb-section-heading">
          Crafted for Curiosity &amp; Accessibility
        </h2>
        <p className="sb-section-sub">
          Trace turns a conventional video bar into an open illustrated field journal without
          sacrificing clarity, keyboard flow, or responsiveness.
        </p>

        <div className="sb-notes-grid">
          <article className="sb-note-plaque">
            <div className="sb-note-head">
              <span className="sb-note-num" aria-hidden="true">
                1
              </span>
              <h3 className="sb-card-title">Readable Over Snow &amp; Starlight</h3>
            </div>
            <p className="sb-card-text">
              Opaque and vellum cream parchment plaques framed in oak-ink borders keep controls,
              sliders, settings menus, and custom WebVTT captions legible over bright ice trails and
              twilight ocean cliffs alike—plus automatic Day &amp; Bedtime palettes.
            </p>
          </article>

          <article className="sb-note-plaque">
            <div className="sb-note-head">
              <span className="sb-note-num" aria-hidden="true">
                2
              </span>
              <h3 className="sb-card-title">Responsive by Container Query</h3>
            </div>
            <p className="sb-card-text">
              Built on Video.js v10 headless React primitives, Tailwind v4, and{" "}
              <code className="sb-mono-num">@container/media-root</code> breakpoints, Trace reshapes
              its seek bar, caption plaques, and toolbar smoothly from pocket widths up to
              widescreen.
            </p>
          </article>

          <article className="sb-note-plaque">
            <div className="sb-note-head">
              <span className="sb-note-num" aria-hidden="true">
                3
              </span>
              <h3 className="sb-card-title">Keyboard, Touch &amp; Focus Ready</h3>
            </div>
            <p className="sb-card-text">
              All controls expose visible oak-ink focus rings, expanded hit areas for{" "}
              <code className="sb-mono-num">pointer: coarse</code> touch screens, native Video.js
              shortcuts, and focus-trapped Escape-dismissible dialogs for Sketch and Filmstrip
              modes.
            </p>
          </article>

          <article className="sb-note-plaque">
            <div className="sb-note-head">
              <span className="sb-note-num" aria-hidden="true">
                4
              </span>
              <h3 className="sb-card-title">Calm on Request</h3>
            </div>
            <p className="sb-card-text">
              When <code className="sb-mono-num">prefers-reduced-motion: reduce</code> or{" "}
              <code className="sb-mono-num">prefers-contrast: more</code> is active, walking
              animations, floating notes, and blurred transitions settle into instant, crisp states.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
