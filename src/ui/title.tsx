/** @jsxImportSource react */

"use client";

import "../styles/themes/neutral.css";
import "../styles/base.css";
import "../styles/audio/theme.css";
import "../styles/video/captions.css";
import "../styles/video/theme.css";
import { Title as TitlePrimitive } from "@videojs/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { findMediaElements } from "@/lib/media-element";
import { cn, resolveClassName } from "@/lib/resolve-class-name";

export interface TitleProps extends Omit<TitlePrimitive.Props, "children"> {
  containerEl?: HTMLElement | null;
  fallbackTitle?: string;
}

const TITLE_PILL_CLASS =
  "inline-block max-w-full truncate rounded-lg media-md:rounded-xl border-2 border-(--media-frame-border,#805D35) bg-media-popover/95 px-2.5 py-0.5 media-md:px-3.5 media-md:py-1 text-xs media-md:text-sm font-bold tracking-tight text-media-popover-foreground shadow-[0_2px_8px_rgba(80,50,20,0.18)] empty:hidden";

export function Title({ className, containerEl, fallbackTitle, ...props }: TitleProps = {}) {
  const probeRef = useRef<HTMLDivElement | null>(null);
  const [mediaTitle, setMediaTitle] = useState<string | undefined>(undefined);

  const syncTitle = useCallback(() => {
    const resolvedContainer =
      containerEl ?? (probeRef.current?.closest(".media-skin") as HTMLElement | null);
    if (!resolvedContainer) {
      setMediaTitle(undefined);
      return;
    }

    const { media, video } = findMediaElements(resolvedContainer);
    const nextTitle =
      media?.getAttribute("title")?.trim() || video?.getAttribute("title")?.trim() || undefined;
    setMediaTitle((prev) => (prev === nextTitle ? prev : nextTitle));
  }, [containerEl]);

  useEffect(() => {
    const resolvedContainer =
      containerEl ?? (probeRef.current?.closest(".media-skin") as HTMLElement | null);
    if (!resolvedContainer) return;

    syncTitle();

    const observer =
      typeof MutationObserver !== "undefined" ? new MutationObserver(syncTitle) : null;
    observer?.observe(resolvedContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["title"],
    });

    return () => observer?.disconnect();
  }, [containerEl, syncTitle]);

  const resolvedTitle = fallbackTitle?.trim() || mediaTitle;

  return (
    <div
      ref={probeRef}
      className={cn(
        "storybook-title-overlay pointer-events-none absolute top-1.5 inset-s-1.5 inset-e-23 z-20 isolate flex items-start",
        "media-md:top-3.5 media-md:inset-s-3.5 media-md:inset-e-20 media-max-2xs:hidden",
      )}
    >
      {resolvedTitle ? (
        <div
          className={cn(TITLE_PILL_CLASS, typeof className === "string" ? className : undefined)}
        >
          {resolvedTitle}
        </div>
      ) : (
        <TitlePrimitive
          className={(state) => cn(TITLE_PILL_CLASS, resolveClassName(className, state))}
          {...props}
        />
      )}
    </div>
  );
}
