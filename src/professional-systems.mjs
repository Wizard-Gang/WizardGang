// Canonical homepage proof points for professional delivery.
// Keep this file factual: do not infer deployments, integrations, or capabilities.
// External references are intentionally centralized so links can be audited in one place.

export const deployments = [
  ["SpartanNash", "https://www.spartannash.com/"],
  ["Dot Foods", "https://www.dotfoods.com/"],
  ["Snap-on Tools", "https://www.snapon.com/"],
  ["GNC", "https://www.gnc.com/"],
  ["IPSY", "https://www.ipsy.com/"],
  ["Saddle Creek Logistics Services", "https://www.sclogistics.com/"],
  ["Hybrid Apparel", "https://hybridapparel.com/"],
  ["Solutions 2 GO", "https://www.solutions2go.ca/"],
  ["Manhattan Beachwear", "https://www.mbwswim.com/"],
  ["BAMKO", "https://www.bamkousa.com/"],
  ["Jerry Leigh", "https://www.jerryleigh.com/"],
  ["Younique", "https://www.youniqueproducts.com/"],
  ["FamBrands", "https://www.fambrands.com/"],
  ["Salon Service Group", "https://www.salonservicegroup.com/"],
  ["BuySeasons", "https://www.buyseasons.com/"],
  ["A Beka Book", "https://www.abeka.com/"],
  ["Custom Integrated Designs", "https://www.cidresources.com/"],
  ["Bulk Reef Supply", "https://www.bulkreefsupply.com/"],
  ["Brixton", "https://www.brixton.com/"],
  ["Waytek Wire", "https://www.waytekwire.com/"],
  ["Obermeyer", "https://obermeyer.com/"],
  ["Seeds 'N Such", "https://seedsnsuch.com/"]
].map(([name, url]) => ({ name, url }));

export const integrationGroups = [
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
    items: ["Axon", "LexisNexis"]
  }
].map((group) => ({
  ...group,
  items: group.items.map((item) => Array.isArray(item) ? { name: item[0], url: item[1] } : { name: item, url: null })
}));

export const systemGroups = [
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
