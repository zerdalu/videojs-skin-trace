import { MuxVideo } from "@videojs/react/media/mux-video";
import { VideoPlayer } from "@videojs/react/video";

import { VideoSkin, type VideoSkinProps } from "@/video/skin";

import type { PlaybackProps } from "../shell/params";

// What the preview plays. Change these to try the skin with your own media; any Mux or HLS URL works.
const PLAYBACK_ID = "00HVHb8300Ju8C2BIkemvdX00jWPsUwOjDi02EfrBA02R54s";
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=30`;
/** Chapters and captions tracks for the preview player, served from `apps/preview/public`. */
const CHAPTERS = "./llamigos-chapters.vtt";
const CAPTIONS = "./llamigos-captions.vtt";

export interface PlayerProps {
  media?: PlaybackProps;
  skinProps?: Omit<VideoSkinProps, "children">;
}

/** `media` carries the workbench's playback options: autoplay, muted, loop, and preload. */
export function Player({ media, skinProps }: PlayerProps) {
  return (
    <VideoPlayer poster={POSTER}>
      <VideoSkin {...skinProps}>
        <MuxVideo {...media} src={SRC} title="Caminandes 3: Llamigos" playsInline crossOrigin="">
          <track kind="chapters" label="English" srcLang="en" src={CHAPTERS} default />
          <track kind="captions" label="English" srcLang="en" src={CAPTIONS} default />
        </MuxVideo>
      </VideoSkin>
    </VideoPlayer>
  );
}
