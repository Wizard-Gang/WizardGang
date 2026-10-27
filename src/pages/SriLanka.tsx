import type { ReactPageDefinition } from "../app/contracts";
import { SriLankaSlides } from "./SriLankaSlides";

/* The owner's "What to Do in Sri Lanka" deck as one continuous scroll. The slides are
   generated in SriLankaSlides.tsx; the photos are served from R2 at /sl/media/. */
export const SRI_LANKA_PAGE: ReactPageDefinition = {
  relative: "sl/index.html",
  metadata: {
    title: "What to Do in Sri Lanka — WizardGang",
    description: "A photo guide to Sri Lanka from our two trips: the basics, roadside stops, food, wildlife and every place we went.",
    path: "/sl/",
    noIndex: true,
    socialImage: "/og.jpg"
  },
  hideSiteHeader: true,
  hideSiteFooter: true,
  body: (
    <main className="site-main sl-deck" id="main" tabIndex={-1} data-sl-deck="">
      <SriLankaSlides />
    </main>
  )
};
