import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./styles/tokens.css";
import "./styles/global.css";
import { App } from "./app/App";

// Respect deep links: never let the browser restore an old scroll position over them.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
