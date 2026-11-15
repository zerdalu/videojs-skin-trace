import { resolveTextTrackList } from "@/lib/captions";
import { renderSketchOperations } from "@/lib/sketch-renderer";
import type { DrawOperation, SavedSketch } from "@/lib/sketch-types";

export interface MediaHostLike extends HTMLElement {
  paused: boolean;
  currentTime: number;
  duration: number;
  currentSrc?: string;
  nativeEl?: unknown;
  play: () => Promise<void> | void;
  pause: () => void;
}

export interface ResolvedMediaElements {
  media: MediaHostLike | null;
  video: HTMLVideoElement | null;
  poster: HTMLImageElement | null;
}

export interface VideoContentRect {
  left: number;
  top: number;
  width: number;
  height: number;
  aspectRatio: number;
}

const STORAGE_PREFIX = "trace-sketches:v1:";
const MAX_STORED_SKETCHES = 24;

function isMediaHost(element: Element): element is MediaHostLike {
  if (element.localName.startsWith("media-")) return false;
  return (
    "paused" in element &&
    "play" in element &&
    "pause" in element &&
    typeof (element as MediaHostLike).play === "function" &&
    typeof (element as MediaHostLike).pause === "function"
  );
}

function collectElements(root: ParentNode, result: Element[] = []): Element[] {
  for (const child of root.children) {
    result.push(child);
    if (child instanceof HTMLElement && child.shadowRoot) {
      collectElements(child.shadowRoot, result);
    }
    collectElements(child, result);
  }
  return result;
}

export function findMediaElements(container: HTMLElement | null): ResolvedMediaElements {
  if (!container) {
    return { media: null, video: null, poster: null };
  }

  const elements = collectElements(container);
  let media: MediaHostLike | null = null;
  let video: HTMLVideoElement | null = null;
  let poster: HTMLImageElement | null = null;

  for (const element of elements) {
    if (!video && element instanceof HTMLVideoElement) {
      video = element;
    }
    if (!media && isMediaHost(element)) {
      media = element;
      const nativeEl = element.nativeEl;
      if (!video && nativeEl instanceof HTMLVideoElement) {
        video = nativeEl;
      }
    }
    if (!poster && element instanceof HTMLImageElement && element.closest("media-poster")) {
      poster = element;
    }
  }

  if (!poster) {
    for (const element of elements) {
      if (element instanceof HTMLImageElement && element.naturalWidth > 0) {
        poster = element;
        break;
      }
    }
  }

  return { media, video: video ?? (media instanceof HTMLVideoElement ? media : null), poster };
}

export function readActiveChapterTitle(
  video: HTMLVideoElement | null,
  media: MediaHostLike | null = null,
): string | undefined {
  const tracks = resolveTextTrackList(video, media);
  if (!tracks) return undefined;

  const rawTime = video?.currentTime ?? media?.currentTime;
  const currentTime = typeof rawTime === "number" && Number.isFinite(rawTime) ? rawTime : 0;

  for (let i = 0; i < tracks.length; i += 1) {
    const track = tracks[i];
    if (!track || track.kind !== "chapters") continue;

    const active = track.activeCues?.[0];
    if (active && "text" in active && typeof active.text === "string" && active.text.trim()) {
      return active.text.trim();
    }

    if (track.cues && track.cues.length > 0) {
      for (let c = 0; c < track.cues.length; c += 1) {
        const cue = track.cues[c];
        if (!cue) continue;
        const isLast = c === track.cues.length - 1;
        if (
          currentTime >= cue.startTime &&
          (currentTime < cue.endTime || (isLast && currentTime <= cue.endTime)) &&
          "text" in cue &&
          typeof cue.text === "string" &&
          cue.text.trim()
        ) {
          return cue.text.trim();
        }
      }
    }
  }
  return undefined;
}

export function computeVideoContentRect(
  container: HTMLElement,
  video: HTMLVideoElement | null,
  poster: HTMLImageElement | null,
): VideoContentRect {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  if (cw <= 0 || ch <= 0) {
    return { left: 0, top: 0, width: 1, height: 1, aspectRatio: 16 / 9 };
  }

  let naturalW = 0;
  let naturalH = 0;
  if (video && video.videoWidth > 0 && video.videoHeight > 0) {
    naturalW = video.videoWidth;
    naturalH = video.videoHeight;
  } else if (poster && poster.naturalWidth > 0 && poster.naturalHeight > 0) {
    naturalW = poster.naturalWidth;
    naturalH = poster.naturalHeight;
  }

  if (naturalW <= 0 || naturalH <= 0) {
    return { left: 0, top: 0, width: cw, height: ch, aspectRatio: cw / ch };
  }

  const objectFit = video ? getComputedStyle(video).objectFit : "contain";
  if (objectFit === "fill" || objectFit === "cover") {
    return { left: 0, top: 0, width: cw, height: ch, aspectRatio: cw / ch };
  }

  const scale = Math.min(cw / naturalW, ch / naturalH);
  const width = naturalW * scale;
  const height = naturalH * scale;
  return {
    left: (cw - width) / 2,
    top: (ch - height) / 2,
    width,
    height,
    aspectRatio: width / height,
  };
}

function loadCorsImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function loadLocalImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function drawPosterBackground(
  ctx: CanvasRenderingContext2D,
  poster: HTMLImageElement | null,
  width: number,
  height: number,
): Promise<boolean> {
  if (!poster?.src) return false;
  const corsPoster = await loadCorsImage(poster.currentSrc || poster.src);
  if (corsPoster) {
    ctx.drawImage(corsPoster, 0, 0, width, height);
    return true;
  }
  if (poster.complete && poster.naturalWidth > 0) {
    try {
      ctx.drawImage(poster, 0, 0, width, height);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function captureCompositeSketch(options: {
  video: HTMLVideoElement | null;
  poster: HTMLImageElement | null;
  aspectRatio: number;
  operations: DrawOperation[];
  preferPoster?: boolean;
  backdropImageUrl?: string;
}): Promise<string> {
  const {
    video,
    poster,
    aspectRatio,
    operations,
    preferPoster = false,
    backdropImageUrl,
  } = options;
  const safeRatio = Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 16 / 9;
  const baseWidth =
    video && video.videoWidth > 0 ? Math.min(1600, Math.max(1280, video.videoWidth)) : 1280;
  const outWidth = Math.round(baseWidth);
  const outHeight = Math.max(1, Math.round(outWidth / safeRatio));

  const composite = document.createElement("canvas");
  composite.width = outWidth;
  composite.height = outHeight;
  const ctx = composite.getContext("2d");

  if (!ctx) {
    return "";
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#20170E";
  ctx.fillRect(0, 0, outWidth, outHeight);

  let drewBackground = false;
  if (backdropImageUrl) {
    const backdropImg = await loadLocalImage(backdropImageUrl);
    if (backdropImg && backdropImg.naturalWidth > 0) {
      try {
        ctx.drawImage(backdropImg, 0, 0, outWidth, outHeight);
        drewBackground = true;
      } catch {
        drewBackground = false;
      }
    }
  }

  if (!drewBackground && preferPoster) {
    drewBackground = await drawPosterBackground(ctx, poster, outWidth, outHeight);
  }

  if (!drewBackground && video && video.readyState >= 2 && video.videoWidth > 0) {
    try {
      ctx.drawImage(video, 0, 0, outWidth, outHeight);
      drewBackground = true;
    } catch {
      drewBackground = false;
    }
  }

  if (!drewBackground && !preferPoster) {
    drewBackground = await drawPosterBackground(ctx, poster, outWidth, outHeight);
  }

  if (!drewBackground) {
    const grad = ctx.createLinearGradient(0, 0, outWidth, outHeight);
    grad.addColorStop(0, "#3D2B1A");
    grad.addColorStop(1, "#1F160D");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, outWidth, outHeight);
  }

  const sketchLayer = document.createElement("canvas");
  sketchLayer.width = outWidth;
  sketchLayer.height = outHeight;
  const sketchCtx = sketchLayer.getContext("2d");
  if (sketchCtx) {
    renderSketchOperations(sketchCtx, outWidth, outHeight, operations);
    ctx.drawImage(sketchLayer, 0, 0, outWidth, outHeight);
  }

  try {
    return composite.toDataURL("image/jpeg", 0.94);
  } catch {
    // Fallback if the underlying video source does not permit CORS canvas pixel readback.
    ctx.fillStyle = "#2A1F14";
    ctx.fillRect(0, 0, outWidth, outHeight);
    if (sketchCtx) {
      ctx.drawImage(sketchLayer, 0, 0, outWidth, outHeight);
    }
    return composite.toDataURL("image/png");
  }
}

export function resolveStorageKey(media: MediaHostLike | null): string {
  const source = media?.currentSrc || media?.getAttribute("src") || "default";
  return `${STORAGE_PREFIX}${source}`;
}

export function loadStoredSketches(storageKey: string): SavedSketch[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedSketch[]) : [];
  } catch {
    return [];
  }
}

export function saveStoredSketches(storageKey: string, sketches: SavedSketch[]): void {
  const trimmed = sketches.slice(-MAX_STORED_SKETCHES);
  if (trimmed.length === 0) {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures when clearing.
    }
    return;
  }

  while (trimmed.length > 0) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(trimmed));
      return;
    } catch {
      // Drop oldest entry if storage quota is tight so the latest sketch still persists.
      trimmed.shift();
    }
  }
}
