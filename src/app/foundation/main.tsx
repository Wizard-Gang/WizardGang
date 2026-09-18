import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../styles/globals.css";
import foundationMarkUrl from "./foundation-mark.svg";
import { FoundationProbe } from "./foundation";

const mount = document.getElementById("root");

if (!mount) {
  throw new Error("Frontend foundation mount point is missing.");
}

createRoot(mount).render(
  <StrictMode>
    <FoundationProbe markUrl={foundationMarkUrl} />
  </StrictMode>
);
