/* Fits the /sl deck's slides to the viewport width. Slides are designed at 1920px and
   reflow at 1000px in narrow upright viewports; without script the stylesheet's stepped
   zoom applies instead. Both zooms follow every resize, including a phone's rotation, so
   the stylesheet can switch between the reflow and the composition as it turns. */
const DESIGN_WIDTH = 1920;
const NARROW_WIDTH = 1000;

export function initializeDeck(documentRoot: Document, browserWindow: Window): boolean {
  const deck = documentRoot.querySelector<HTMLElement>("[data-sl-deck]");
  if (!deck) return false;
  const fit = () => {
    const width = documentRoot.documentElement.clientWidth || browserWindow.innerWidth;
    deck.style.setProperty("--sl-zoom", String(Math.min(1, width / DESIGN_WIDTH)));
    deck.style.setProperty("--sl-zoom-narrow", String(width / NARROW_WIDTH));
  };
  fit();
  browserWindow.addEventListener("resize", fit, { passive: true });
  return true;
}
