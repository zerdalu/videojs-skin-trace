import { useEffect, useState } from "react";

import { PlayerStage } from "@preview/landing/player-stage";
import type { StageScheme } from "@preview/landing/stage-presets";
import { WoodlandShowcase } from "@preview/landing/woodland-showcase";
import { SunflowerPlayIcon } from "@/ui/icons/sunflower-icons";

export function LandingApp() {
  const [scheme, setScheme] = useState<StageScheme>("auto");

  useEffect(() => {
    const root = document.documentElement;
    if (scheme === "auto") {
      delete root.dataset.colorScheme;
      root.style.colorScheme = "";
    } else {
      root.dataset.colorScheme = scheme;
      root.style.colorScheme = scheme;
    }
  }, [scheme]);

  return (
    <div className="sb-page-shell">
      <div className="sb-book-sheet">
        <header className="sb-topbar">
          <a href="#interactive-stage" className="sb-brand">
            <span className="sb-brand-icon">
              <SunflowerPlayIcon />
            </span>
            <span className="sb-brand-name">Trace</span>
            <span className="sb-badge">Video.js v10 Skin</span>
          </a>

          <nav className="sb-nav-group" aria-label="Storybook sections">
            <div className="sb-nav-links">
              <a href="#interactive-stage" className="sb-nav-link">
                Player Stage
              </a>
              <a href="#woodland-controls" className="sb-nav-link">
                Woodland Cast
              </a>
              <a href="#design-notes" className="sb-nav-link">
                Design Notes
              </a>
            </div>

            <fieldset className="sb-segmented" aria-label="Page color theme">
              {(["auto", "light", "dark"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={scheme === item}
                  onClick={() => setScheme(item)}
                  className="sb-scheme-btn"
                >
                  {item === "auto" ? "Auto" : item === "light" ? "Day" : "Bedtime"}
                </button>
              ))}
            </fieldset>
          </nav>
        </header>

        <main>
          <section className="sb-hero" aria-labelledby="hero-title">
            <span className="sb-kicker">Chapter I · An Open Field Journal for Video</span>
            <h1 id="hero-title" className="sb-hero-title">
              A Children&apos;s Storybook Skin for Video.js v10
            </h1>
            <p className="sb-hero-lead">
              Trace dresses the Video.js v10 player in stitched parchment, animated woodland
              controls, and an interactive frame sketchbook. Resize the stage below to see every
              breakpoint in action.
            </p>
          </section>

          <PlayerStage scheme={scheme} onSchemeChange={setScheme} />
          <WoodlandShowcase />
        </main>

        <footer className="sb-footer">
          <span>
            Trace Skin · Apache License 2.0 · Film:{" "}
            <a
              href="https://video.blender.org/w/5ruRYckTcQMTMQvyqMnVsr"
              target="_blank"
              rel="noopener noreferrer"
              className="sb-inline-link"
            >
              Caminandes 3: Llamigos
            </a>{" "}
            (© Blender Foundation, CC BY 4.0)
          </span>

          <div className="sb-footer-links">
            <a href="./preview.html" className="sb-inline-link">
              Standalone Player Frame
            </a>
            <a href="#interactive-stage" className="sb-inline-link">
              Back to Player
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
