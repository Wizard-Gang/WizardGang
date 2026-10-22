import { DEMO_URL } from "./site";

/* Homepage content. Capabilities are WizardGang's own and link to the live
   architecture demo. Industries, integrations and deployments come from prior
   professional roles and stay attributed to the employers named here; the
   deployment and integration inventory is the one documented at v1.3.1
   (src/data/professional-systems.ts at e7944ff21609d24d09e08df110bdd6aa3ac0383d). */

export interface DemoLink {
  name: string;
  detail: string;
  href: string;
}

export interface Capability {
  title: string;
  summary: string;
  /** Path data for a 24px, 1.6-stroke outline icon. */
  icon: string;
  demos: readonly DemoLink[];
}

const demo = (fragment: string) => `${DEMO_URL}/demos#${fragment}`;

export const CAPABILITIES: readonly Capability[] = [
  {
    title: "APIs & Integrations",
    summary: "Expose documented request surfaces through REST, OpenAPI and GraphQL, and deliver events with signed webhooks.",
    icon: "M8 4c-2 0-3 1-3 3v2c0 1.2-.8 2.4-2 3 1.2.6 2 1.8 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.2.8 2.4 2 3-1.2.6-2 1.8-2 3v2c0 2-1 3-3 3",
    demos: [
      { name: "REST / OpenAPI", detail: "Described and executable", href: demo("rest") },
      { name: "GraphQL", detail: "Schema and live queries", href: demo("graphql") },
      { name: "Signed webhooks", detail: "Signature verification", href: demo("webhooks") }
    ]
  },
  {
    title: "Data & Infrastructure",
    summary: "Keep relational data and object storage apart, and run application logic and coordinated state on Workers.",
    icon: "M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3zM5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3",
    demos: [
      { name: "D1", detail: "Relational state", href: demo("d1") },
      { name: "R2", detail: "Object storage", href: demo("r2") },
      { name: "Workers", detail: "Application mediation", href: demo("workers") },
      { name: "Durable Objects", detail: "Coordinated state", href: demo("durable-objects") }
    ]
  },
  {
    title: "Identity & Access",
    summary: "Federate sign-in with OAuth, OpenID Connect and SAML, and hold the authorization boundary behind it.",
    icon: "M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V8a4 4 0 0 1 8 0v3M12 15v2",
    demos: [{ name: "OAuth / OIDC / SAML", detail: "Callback behavior", href: demo("identity") }]
  },
  {
    title: "AI & MCP",
    summary: "Give agents real tools through Model Context Protocol endpoints they can connect to and call.",
    icon: "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 9V5M12 15v4M9 12H5M15 12h4M12 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 19a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM3.5 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM20.5 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z",
    demos: [{ name: "MCP endpoint", detail: "Tools and executable proof", href: demo("mcp") }]
  },
  {
    title: "Accessible Interfaces",
    summary: "Treat accessibility and language handling as contracts, from WCAG 2.2 behavior to internationalized copy.",
    icon: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9M12 3c-2.5 2.5-3.5 5.5-3.5 9s1 6.5 3.5 9",
    demos: [
      { name: "Accessibility", detail: "WCAG 2.2 behavior", href: demo("accessibility") },
      { name: "Internationalization", detail: "Language handling", href: demo("i18n") }
    ]
  },
  {
    title: "Assurance & Security",
    summary: "Record framework assessments with their gaps, aligned rather than certified, and state how to report a vulnerability.",
    icon: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4",
    demos: [
      { name: "ISO 27001 · ISO 42001 · WCAG 2.2", detail: "Assessment records", href: `${DEMO_URL}/assurance` },
      { name: "Vulnerability reporting", detail: "Advisory boundary", href: `${DEMO_URL}/security` }
    ]
  }
];

export interface Industry {
  title: string;
  items: readonly string[];
  wide?: boolean;
}

export const INDUSTRIES: readonly Industry[] = [
  { title: "Warehouse & Fulfillment", wide: true, items: ["Inventory", "Lot tracking", "Barcode workflows", "Automation", "Quality control", "Shipping", "Returns"] },
  { title: "Logistics", items: ["Yard management", "Truck and trailer workflows"] },
  { title: "Justice & Courts", items: ["Case management", "Prosecutor systems", "Public defense", "Probate", "Public inquiry"] },
  { title: "Public Sector", items: ["Solicitation", "Tax appeals"] },
  { title: "Enterprise Systems", items: ["ERP integration", "AI infrastructure"] }
];

export interface Platform {
  name: string;
  /** Self-hosted vendor mark; absent where none was found, which shows the WizardGang mark. */
  logo?: string;
}

export interface IntegrationGroup {
  category: string;
  platforms: readonly Platform[];
}

const vendor = (name: string, file?: string): Platform => (file ? { name, logo: `/logos/vendors/${file}` } : { name });

export const INTEGRATION_GROUPS: readonly IntegrationGroup[] = [
  {
    category: "ERP & warehouse systems",
    platforms: [
      vendor("NetSuite", "netsuite.png"), vendor("Microsoft Dynamics", "microsoft-dynamics.png"),
      vendor("Sage", "sage.svg"), vendor("Fishbowl", "fishbowl.ico"), vendor("QuickBooks POS", "quickbooks-pos.svg"),
      vendor("RedPrairie", "redprairie.ico"), vendor("Blue Yonder", "blue-yonder.ico"),
      vendor("CIMS WMS", "cims-wms.ico"), vendor("Canbar")
    ]
  },
  {
    category: "Commerce & fulfillment",
    platforms: [
      vendor("Shopify", "shopify.png"), vendor("Amazon Direct Fulfillment", "amazon-direct-fulfillment.ico"),
      vendor("ShipStation", "shipstation.png"), vendor("Shipium", "shipium.png"), vendor("ProShip", "proship.png")
    ]
  },
  {
    category: "Warehouse automation",
    platforms: [
      vendor("A360", "a360.ico"), vendor("Locus", "locus.png"), vendor("6 River Systems"),
      vendor("AutoStore", "autostore.ico"), vendor("Corvus", "corvus.ico"), vendor("Pendant")
    ]
  },
  { category: "Carriers", platforms: [vendor("USPS", "usps.ico"), vendor("UPS", "ups.ico"), vendor("FedEx", "fedex.svg")] },
  {
    category: "EDI & B2B",
    platforms: ["Orders", "Acknowledgements", "ASNs", "Invoices", "Inventory & fulfillment flows"].map((name) => vendor(name))
  },
  { category: "Warehouse hardware", platforms: [vendor("Zebra", "zebra.ico"), vendor("Honeywell", "honeywell.svg")] },
  {
    category: "Development & workflow",
    platforms: [vendor("GitHub", "github.png"), vendor("Jira", "jira.png"), vendor("Zapier", "zapier.ico")]
  },
  { category: "Justice & legal", platforms: [vendor("Axon", "axon.png"), vendor("LexisNexis", "lexisnexis.ico")] }
];

export interface Deployment {
  name: string;
  /** Organization website, or a map search for a court; absent where none is known. */
  href?: string;
  solution: string;
}

export interface Employer {
  name: string;
  scope: string;
  logo?: string;
  deployments: readonly Deployment[];
}

const onMap = (place: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place).replace(/%20/g, "+")}`;
const cims = "Warehouse Management System (CIMS)";
const probate = "Probate Case Management";
const fulfillment = "Order Fulfillment System";
const court = (name: string, solution = probate): Deployment => ({ name, href: onMap(name), solution });

export const EMPLOYERS: readonly Employer[] = [
  {
    name: "Supply Chain Technologies",
    scope: "Warehouse management implementations and integrations.",
    logo: "/logos/cims-wms.png",
    deployments: [
      { name: "BAMKO", href: "https://www.bamkousa.com/", solution: cims },
      { name: "Brixton", href: "https://www.brixton.com/", solution: cims },
      { name: "Custom Integrated Designs", href: "https://www.cidresources.com/", solution: cims },
      { name: "FamBrands", href: "https://www.fambrands.com/", solution: cims },
      { name: "GNC", href: "https://www.gnc.com/", solution: cims },
      { name: "Hybrid Apparel", href: "https://hybridapparel.com/", solution: cims },
      { name: "Jerry Leigh", href: "https://www.jerryleigh.com/", solution: cims },
      { name: "Manhattan Beachwear", href: "https://www.mbwswim.com/", solution: cims },
      { name: "Obermeyer", href: "https://obermeyer.com/", solution: cims },
      { name: "Saddle Creek Logistics Services", href: "https://www.sclogistics.com/", solution: cims },
      { name: "Solutions 2 GO", href: "https://www.solutions2go.ca/", solution: cims }
    ]
  },
  {
    name: "Spartan Technology Solutions",
    scope: "Court and prosecutor case-management systems.",
    logo: "/logos/spartan.png",
    deployments: [
      court("Anderson County Probate Court"),
      court("Beaufort County Probate Court"),
      court("Berkeley County Probate Court"),
      court("Florida State Attorney's Office", "Prosecutor Case Management"),
      court("Greenville County Probate Court"),
      court("Horry County Probate Court"),
      court("Spartanburg County Probate Court")
    ]
  },
  {
    name: "Fastfetch Corporation",
    scope: "Fulfillment, picking and shipping systems.",
    logo: "/logos/fastfetch.png",
    deployments: [
      { name: "A Beka Book", href: "https://www.abeka.com/", solution: fulfillment },
      { name: "Amware", solution: fulfillment },
      { name: "Bulk Reef Supply", href: "https://www.bulkreefsupply.com/", solution: fulfillment },
      { name: "BuySeasons", solution: fulfillment },
      { name: "Dot Foods", href: "https://www.dotfoods.com/", solution: fulfillment },
      { name: "IPSY", href: "https://www.ipsy.com/", solution: fulfillment },
      { name: "Plexus Worldwide", href: "https://plexusworldwide.com/", solution: fulfillment },
      { name: "Rocky Brands", href: "https://www.rockybrands.com/", solution: "Putwall Fulfillment System" },
      { name: "Salon Service Group", href: "https://www.salonservicegroup.com/", solution: fulfillment },
      { name: "Seeds 'N Such", href: "https://seedsnsuch.com/", solution: fulfillment },
      { name: "Snap-on Tools", href: "https://www.snapon.com/", solution: fulfillment },
      { name: "SpartanNash", href: "https://www.spartannash.com/", solution: fulfillment },
      { name: "Torque King 4x4", href: "https://www.torqueking.com/", solution: fulfillment },
      { name: "Waytek Wire", href: "https://www.waytekwire.com/", solution: fulfillment },
      { name: "Younique", href: "https://www.youniqueproducts.com/", solution: fulfillment }
    ]
  }
];
