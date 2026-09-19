interface ClosestTarget {
  closest(selector: string): unknown;
}

export function isAnchorActivationTarget(target: unknown): boolean {
  if (!target || typeof target !== "object") return false;
  const closest = (target as Partial<ClosestTarget>).closest;
  return typeof closest === "function" && Boolean(closest.call(target, "a"));
}

export function setNavigationOpen(disclosure: HTMLDetailsElement | null, open: boolean): void {
  disclosure?.toggleAttribute("open", open);
}

export function shouldCloseForEscape(key: string, open: boolean): boolean {
  return key === "Escape" && open;
}

export function initializeNavigation(
  documentRoot: Document,
  matchMediaFn?: (query: string) => MediaQueryList
): boolean {
  const disclosure = documentRoot.querySelector<HTMLDetailsElement>(".nav-disclosure");
  if (!disclosure) return false;

  const toggle = disclosure.querySelector<HTMLElement>(".nav-toggle");
  const mobileNav = disclosure.querySelector<HTMLElement>(".site-nav-mobile");

  mobileNav?.addEventListener("click", (event) => {
    if (isAnchorActivationTarget(event.target)) setNavigationOpen(disclosure, false);
  });

  documentRoot.addEventListener("keydown", (event) => {
    if (!shouldCloseForEscape(event.key, disclosure.open)) return;
    setNavigationOpen(disclosure, false);
    toggle?.focus();
  });

  if (matchMediaFn) {
    const mobileNavigation = matchMediaFn("(max-width: 760px)");
    mobileNavigation.addEventListener?.("change", (event) => {
      if (!event.matches) setNavigationOpen(disclosure, false);
    });
  }

  return true;
}
