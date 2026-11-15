import type { MediaHostLike } from "@/lib/media-element";

export type CueInlineNode =
  | { kind: "text"; value: string }
  | { kind: "br" }
  | { kind: "bold" | "italic" | "underline" | "ruby" | "rt"; children: CueInlineNode[] };

export interface ActiveCaptionCue {
  key: string;
  signature: string;
  nodes: CueInlineNode[];
}

const NATIVE_CAPTION_STYLE_ATTR = "data-trace-hide-native-captions";

const NATIVE_CAPTION_SUPPRESSION_CSS = `
video::-webkit-media-text-track-container,
video::-webkit-media-text-track-display,
video::-webkit-media-text-track-display-backdrop,
video::-webkit-media-text-track-region,
video::-webkit-media-text-track-region-container {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

video::cue {
  color: transparent !important;
  background: transparent !important;
  text-shadow: none !important;
  opacity: 0 !important;
}
`;

function injectSuppressionStyle(root: ShadowRoot | null | undefined): void {
  if (!root) return;
  if (root.querySelector(`style[${NATIVE_CAPTION_STYLE_ATTR}]`)) return;

  const style = document.createElement("style");
  style.setAttribute(NATIVE_CAPTION_STYLE_ATTR, "");
  style.textContent = NATIVE_CAPTION_SUPPRESSION_CSS;
  root.appendChild(style);
}

export function suppressNativeVideoCaptions(
  video: HTMLVideoElement | null,
  media: MediaHostLike | null,
): void {
  const videoRoot = video?.getRootNode();
  if (typeof ShadowRoot !== "undefined" && videoRoot instanceof ShadowRoot) {
    injectSuppressionStyle(videoRoot);
  }
  if (media?.shadowRoot && media.shadowRoot !== videoRoot) {
    injectSuppressionStyle(media.shadowRoot);
  }
}

function splitLinesToNodes(text: string): CueInlineNode[] {
  if (!text) return [];
  const parts = text.split(/\r?\n/);
  const nodes: CueInlineNode[] = [];

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i]!;
    if (part.length > 0) {
      nodes.push({ kind: "text", value: part });
    }
    if (i < parts.length - 1) {
      nodes.push({ kind: "br" });
    }
  }
  return nodes;
}

function domNodeToCueNodes(node: Node): CueInlineNode[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return splitLinesToNodes(node.textContent ?? "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = node as Element;
  const tag = element.tagName.toUpperCase();
  if (tag === "BR") {
    return [{ kind: "br" }];
  }

  const children: CueInlineNode[] = [];
  for (const child of element.childNodes) {
    children.push(...domNodeToCueNodes(child));
  }

  if (children.length === 0) return [];

  if (tag === "B" || tag === "STRONG") {
    return [{ kind: "bold", children }];
  }
  if (tag === "I" || tag === "EM") {
    return [{ kind: "italic", children }];
  }
  if (tag === "U") {
    return [{ kind: "underline", children }];
  }
  if (tag === "RUBY") {
    return [{ kind: "ruby", children }];
  }
  if (tag === "RT") {
    return [{ kind: "rt", children }];
  }

  return children;
}

function hasVisibleText(nodes: ReadonlyArray<CueInlineNode>): boolean {
  for (const node of nodes) {
    if (node.kind === "text" && node.value.trim().length > 0) return true;
    if ("children" in node && hasVisibleText(node.children)) return true;
  }
  return false;
}

function parseCueNodes(cue: TextTrackCue): { nodes: CueInlineNode[]; rawText: string } {
  const rawText = "text" in cue && typeof cue.text === "string" ? cue.text : "";

  if ("getCueAsHTML" in cue && typeof (cue as VTTCue).getCueAsHTML === "function") {
    try {
      const fragment = (cue as VTTCue).getCueAsHTML();
      const parsed: CueInlineNode[] = [];
      for (const child of fragment.childNodes) {
        parsed.push(...domNodeToCueNodes(child));
      }
      if (hasVisibleText(parsed)) {
        return { nodes: parsed, rawText: fragment.textContent ?? rawText };
      }
    } catch {
      // Fall back to plain cue text if fragment parsing is unavailable.
    }
  }

  return { nodes: splitLinesToNodes(rawText), rawText };
}

export function resolveTextTrackList(
  video: HTMLVideoElement | null,
  media: MediaHostLike | null,
): TextTrackList | null {
  if (video?.textTracks) return video.textTracks;
  if (media && "textTracks" in media) {
    const candidate = (media as unknown as { textTracks?: TextTrackList }).textTracks;
    if (candidate) return candidate;
  }
  return null;
}

export function isCaptionTrack(track: TextTrack): boolean {
  return track.kind === "captions" || track.kind === "subtitles";
}

export function readActiveCaptionCues(trackList: TextTrackList | null): ActiveCaptionCue[] {
  if (!trackList) return [];

  for (let t = 0; t < trackList.length; t += 1) {
    const track = trackList[t];
    if (!track || !isCaptionTrack(track) || track.mode !== "showing") continue;

    const active = track.activeCues;
    if (!active || active.length === 0) continue;

    let chosenCue: TextTrackCue | null = null;
    let chosenNodes: CueInlineNode[] = [];
    let chosenRawText = "";

    for (let c = 0; c < active.length; c += 1) {
      const cue = active[c];
      if (!cue) continue;

      const { nodes, rawText } = parseCueNodes(cue);
      if (!hasVisibleText(nodes)) continue;

      if (!chosenCue || cue.startTime >= chosenCue.startTime) {
        chosenCue = cue;
        chosenNodes = nodes;
        chosenRawText = rawText;
      }
    }

    if (chosenCue) {
      const cueIdPart = chosenCue.id || `${chosenCue.startTime}-${chosenCue.endTime}`;
      return [
        {
          key: `${t}-${cueIdPart}`,
          signature: `${t}:${chosenCue.id}:${chosenCue.startTime}:${chosenCue.endTime}:${chosenRawText}`,
          nodes: chosenNodes,
        },
      ];
    }
  }

  return [];
}
