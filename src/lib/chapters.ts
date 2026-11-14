import { resolveTextTrackList } from "@/lib/captions";
import type { MediaHostLike } from "@/lib/media-element";

export interface ChapterDivider {
  key: string;
  percent: number;
}

export interface ChapterSegment {
  key: string;
  startPercent: number;
  endPercent: number;
  spanPercent: number;
  spanRatio: number;
  isFirst: boolean;
  isLast: boolean;
}

export function findTrackElements(
  container: HTMLElement | null,
  media: MediaHostLike | null,
): HTMLTrackElement[] {
  const tracks: HTMLTrackElement[] = [];
  if (container) {
    tracks.push(...Array.from(container.querySelectorAll("track")));
  }
  if (media?.shadowRoot) {
    tracks.push(...Array.from(media.shadowRoot.querySelectorAll("track")));
  }
  return tracks;
}

export function resolveMediaDuration(
  video: HTMLVideoElement | null,
  media: MediaHostLike | null,
): number {
  if (video && Number.isFinite(video.duration) && video.duration > 0) {
    return video.duration;
  }
  if (media) {
    const mediaDuration = (media as unknown as { duration?: number }).duration;
    if (typeof mediaDuration === "number" && Number.isFinite(mediaDuration) && mediaDuration > 0) {
      return mediaDuration;
    }
  }
  return 0;
}

function selectChapterTrack(trackList: TextTrackList | null): TextTrack | null {
  if (!trackList) return null;

  let chosenTrack: TextTrack | null = null;
  for (let i = 0; i < trackList.length; i += 1) {
    const track = trackList[i];
    if (!track || track.kind !== "chapters") continue;
    if (track.cues && track.cues.length > 0) {
      chosenTrack = track;
      if (track.mode !== "disabled") break;
    }
  }
  return chosenTrack;
}

export function readActiveChapterIndex(
  video: HTMLVideoElement | null,
  media: MediaHostLike | null,
  currentTime?: number,
): number | null {
  const trackList = resolveTextTrackList(video, media);
  const chosenTrack = selectChapterTrack(trackList);
  const cues = chosenTrack?.cues;
  if (!cues || cues.length === 0) return null;

  const rawTime = currentTime ?? video?.currentTime ?? media?.currentTime;
  if (typeof rawTime !== "number" || !Number.isFinite(rawTime)) return null;

  const sortedCues = Array.from(cues).sort((a, b) => a.startTime - b.startTime);
  for (let i = sortedCues.length - 1; i >= 0; i -= 1) {
    if (rawTime >= sortedCues[i]!.startTime) {
      return i;
    }
  }

  return -1;
}

function readChapterBoundaryTimes(
  video: HTMLVideoElement | null,
  media: MediaHostLike | null,
  duration: number,
): number[] {
  const trackList = resolveTextTrackList(video, media);
  const chosenTrack = selectChapterTrack(trackList);

  const cues = chosenTrack?.cues;
  if (!cues || cues.length === 0) return [];

  const minEdge = 0.25;
  const maxEdge = duration - 0.25;
  const boundaries: number[] = [];

  for (let i = 0; i < cues.length; i += 1) {
    const cue = cues[i];
    if (!cue) continue;
    if (cue.startTime > minEdge && cue.startTime < maxEdge) {
      boundaries.push(cue.startTime);
    }
    if (cue.endTime > minEdge && cue.endTime < maxEdge) {
      boundaries.push(cue.endTime);
    }
  }

  boundaries.sort((a, b) => a - b);

  const uniqueTimes: number[] = [];
  for (const time of boundaries) {
    const prev = uniqueTimes[uniqueTimes.length - 1];
    if (prev === undefined || Math.abs(time - prev) >= 0.2) {
      uniqueTimes.push(time);
    }
  }
  return uniqueTimes;
}

export function readChapterDividers(
  video: HTMLVideoElement | null,
  media: MediaHostLike | null,
): ChapterDivider[] {
  const duration = resolveMediaDuration(video, media);
  if (duration <= 0) return [];

  return readChapterBoundaryTimes(video, media, duration).map((time, index) => ({
    key: `chapter-${index}-${time.toFixed(2)}`,
    percent: (time / duration) * 100,
  }));
}

export function readChapterSegments(
  video: HTMLVideoElement | null,
  media: MediaHostLike | null,
): ChapterSegment[] {
  const duration = resolveMediaDuration(video, media);
  const boundaryPercents =
    duration > 0
      ? readChapterBoundaryTimes(video, media, duration).map((time) => (time / duration) * 100)
      : [];

  const points = [0, ...boundaryPercents, 100];
  const segments: ChapterSegment[] = [];

  for (let i = 0; i < points.length - 1; i += 1) {
    const startPercent = points[i]!;
    const endPercent = points[i + 1]!;
    const spanPercent = Math.max(0.01, endPercent - startPercent);
    segments.push({
      key: `segment-${i}-${startPercent.toFixed(2)}-${endPercent.toFixed(2)}`,
      startPercent,
      endPercent,
      spanPercent,
      spanRatio: spanPercent / 100,
      isFirst: i === 0,
      isLast: i === points.length - 2,
    });
  }

  return segments;
}

export function chapterDividersEqual(
  a: ReadonlyArray<ChapterDivider>,
  b: ReadonlyArray<ChapterDivider>,
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (Math.abs(a[i]!.percent - b[i]!.percent) > 0.01) return false;
  }
  return true;
}

export function chapterSegmentsEqual(
  a: ReadonlyArray<ChapterSegment>,
  b: ReadonlyArray<ChapterSegment>,
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (
      Math.abs(a[i]!.startPercent - b[i]!.startPercent) > 0.01 ||
      Math.abs(a[i]!.endPercent - b[i]!.endPercent) > 0.01
    ) {
      return false;
    }
  }
  return true;
}
