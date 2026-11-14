import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/skin.css";
import "./preview.css";
import { Preview } from "@preview/frame/preview";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Preview />
  </StrictMode>,
);
