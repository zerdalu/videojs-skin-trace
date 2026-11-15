import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/skin.css";
import "@preview/landing/landing.css";
import { LandingApp } from "@preview/landing/landing-app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LandingApp />
  </StrictMode>,
);
