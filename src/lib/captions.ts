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

  const result: ActiveCaptionCue[] = [];
  for (let t = 0; t < trackList.length; t += 1) {
    const track = trackList[t];
    if (!track || !isCaptionTrack(track) || track.mode !== "showing") continue;

    const active = track.activeCues;
    if (!active) continue;

    for (let c = 0; c < active.length; c += 1) {
      const cue = active[c];
      if (!cue) continue;

      const { nodes, rawText } = parseCueNodes(cue);
      if (!hasVisibleText(nodes)) continue;

      const signature = `${t}:${c}:${cue.id}:${cue.startTime}:${cue.endTime}:${rawText}`;
      result.push({
        key: `${t}-${c}-${cue.id || `${cue.startTime}-${cue.endTime}`}`,
        signature,
        nodes,
      });
    }
  }

  return result;
}
