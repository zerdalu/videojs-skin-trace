import { I18nProvider } from "@videojs/react/i18n";
import { type CSSProperties, useEffect, useState } from "react";

import { initialParams, onParamsChange } from "@preview/frame/frame";
import { Player } from "@preview/frame/player";
import { playbackProps, playerStyles } from "@preview/shell/params";

export function Preview() {
  const [params, setParams] = useState(initialParams);

  useEffect(() => onParamsChange(setParams), []);

  return (
    // The provider loads Video.js's built-in translations for the selected language.
    <I18nProvider locale={params.locale}>
      <div className="preview-player" style={playerStyles(params) as CSSProperties}>
        <Player media={playbackProps(params)} />
      </div>
    </I18nProvider>
  );
}
