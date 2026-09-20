export interface ExternalReference {
  name: string;
  url: string | null;
}

export interface DeploymentReference extends ExternalReference {
  url: string;
  /** What was delivered for this organization. */
  solution: string;
  /** The employer the work was performed under. Never WizardGang. */
  employer: string;
}

export interface ProfessionalIntegrationEvidenceGroup {
  title: string;
  items: readonly ExternalReference[];
}

export interface ProfessionalSystemEvidenceGroup {
  title: string;
  items: readonly string[];
}

// Canonical professional evidence for employer/customer systems, integrations, and deployments.
// Keep this file factual and attributed; it is not the WizardGang company-facing integration taxonomy.
// External references are intentionally centralized so links can be audited in one place.

export const deployments: readonly DeploymentReference[] = [
  { name: "SpartanNash", url: "https://www.spartannash.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Dot Foods", url: "https://www.dotfoods.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Snap-on Tools", url: "https://www.snapon.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "GNC", url: "https://www.gnc.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "IPSY", url: "https://www.ipsy.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Saddle Creek Logistics Services", url: "https://www.sclogistics.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Hybrid Apparel", url: "https://hybridapparel.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Solutions 2 GO", url: "https://www.solutions2go.ca/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Manhattan Beachwear", url: "https://www.mbwswim.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "BAMKO", url: "https://www.bamkousa.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Jerry Leigh", url: "https://www.jerryleigh.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Younique", url: "https://www.youniqueproducts.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "FamBrands", url: "https://www.fambrands.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Salon Service Group", url: "https://www.salonservicegroup.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "BuySeasons", url: "https://www.buyseasons.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "A Beka Book", url: "https://www.abeka.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Custom Integrated Designs", url: "https://www.cidresources.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Bulk Reef Supply", url: "https://www.bulkreefsupply.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Brixton", url: "https://www.brixton.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Waytek Wire", url: "https://www.waytekwire.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Obermeyer", url: "https://obermeyer.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Seeds 'N Such", url: "https://seedsnsuch.com/", solution: "Warehouse Management System (CIMS)", employer: "Supply Chain Technologies" },
  { name: "Torque King 4x4", url: "https://www.torqueking.com/", solution: "Order Fulfillment System", employer: "Fastfetch Corporation" },
  { name: "Amware", url: "https://www.amware.net/", solution: "Order Fulfillment System", employer: "Fastfetch Corporation" },
  { name: "Rocky Brands", url: "https://www.rockybrands.com/", solution: "Putwall Fulfillment System", employer: "Fastfetch Corporation" },
  { name: "Plexus Worldwide", url: "https://plexusworldwide.com/", solution: "Order Fulfillment System", employer: "Fastfetch Corporation" }
];

export const professionalIntegrationEvidence: readonly ProfessionalIntegrationEvidenceGroup[] = [
  {
    title: "ERP Integrations",
    items: [
      ["NetSuite", "https://www.netsuite.com/"],
      ["Microsoft Dynamics", "https://www.microsoft.com/en-us/dynamics-365"],
      ["Sage", "https://www.sage.com/"],
      ["Fishbowl", "https://www.fishbowlinventory.com/"],
      ["QuickBooks POS", "https://quickbooks.intuit.com/pos/"],
      ["RedPrairie", "https://blueyonder.com/"],
      ["Blue Yonder", "https://blueyonder.com/"],
      ["CIMS WMS", "https://cloudimsystems.com/"],
      // The exact public vendor identity for the historical Canbar integration is not
      // reliably resolvable today. Keep the experience visible rather than attaching
      // an unrelated modern company to it; add a URL only when the canonical identity
      // can be verified.
      "Canbar"
    ]
  },
  {
    title: "Commerce & Fulfillment",
    items: [
      ["Shopify", "https://www.shopify.com/"],
      ["Amazon Direct Fulfillment", "https://vendorcentral.amazon.com/"],
      ["ShipStation", "https://www.shipstation.com/"],
      ["Shipium", "https://www.shipium.com/"],
      ["ProShip", "https://www.proshipinc.com/"]
    ]
  },
  {
    title: "Warehouse Automation",
    items: [
      ["A360", "https://www.staciamericas.com/wms"],
      ["Locus", "https://www.locusrobotics.com/"],
      ["6 River Systems", "https://6river.com/"],
      ["AutoStore", "https://www.autostoresystem.com/"],
      ["Corvus", "https://www.corvus-robotics.com/"],
      ["Pendant", "https://pendantautomation.com/"]
    ]
  },
  {
    title: "Carrier Integrations",
    items: [
      ["USPS", "https://www.usps.com/"],
      ["UPS", "https://www.ups.com/"],
      ["FedEx", "https://www.fedex.com/"]
    ]
  },
  {
    title: "EDI & B2B",
    items: ["EDI Orders", "Acknowledgements", "ASNs", "Invoices", "Inventory & Fulfillment Flows"]
  },
  {
    title: "Warehouse Hardware",
    items: [
      ["Zebra", "https://www.zebra.com/"],
      ["Honeywell", "https://automation.honeywell.com/us/en/industries/logistics-and-warehouses"]
    ]
  },
  {
    title: "Development & Workflow",
    items: [
      ["GitHub", "https://github.com/"],
      ["Jira", "https://www.atlassian.com/software/jira"],
      ["Zapier", "https://zapier.com/"]
    ]
  },
  {
    title: "Justice & Legal",
    items: [
      ["Axon", "https://www.axon.com/"],
      ["LexisNexis", "https://www.lexisnexis.com/en-us/"]
    ]
  }
].map((group) => ({
  ...group,
  items: group.items.map((item): ExternalReference => Array.isArray(item)
    ? { name: String(item[0]), url: item[1] ? String(item[1]) : null }
    : { name: item, url: null })
}));

export const professionalSystemEvidence: readonly ProfessionalSystemEvidenceGroup[] = [
  {
    title: "Warehouse & Fulfillment",
    items: ["Fulfillment", "Inventory", "Lot Tracking", "Barcode Workflows", "Warehouse Automation", "Quality Control", "Shipping", "RMA"]
  },
  {
    title: "Logistics",
    items: ["Yard Management", "Truck & Trailer Workflows"]
  },
  {
    title: "Justice & Court Systems",
    items: ["Case Management", "Prosecutor Systems", "Public Defense Systems", "Probate Court Systems", "Public Inquiry"]
  },
  {
    title: "Public-Sector Workflows",
    items: ["Solicitation", "Tax Appeals"]
  },
  {
    title: "Enterprise & AI Infrastructure",
    items: ["ERP Integration", "MCP Servers"]
  }
];
