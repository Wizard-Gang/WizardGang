// Canonical homepage proof points for professional delivery.
// Keep this file factual: do not infer deployments, integrations, or capabilities.
// External references are intentionally centralized so links can be audited in one place.

export const deployments = [
  ["A Beka Book", "https://www.abeka.com/"],
  ["BAMKO", "https://www.bamkousa.com/"],
  ["Brixton", "https://www.brixton.com/"],
  ["Bulk Reef Supply", "https://www.bulkreefsupply.com/"],
  ["BuySeasons", "https://www.buyseasons.com/"],
  ["Custom Integrated Designs", "https://b2b.cidresources.com/"],
  ["Dot Foods", "https://www.dotfoods.com/"],
  ["FamBrands", "https://www.fambrands.com/"],
  ["GNC", "https://www.gnc.com/"],
  ["Hybrid Apparel", "https://hybridapparel.com/"],
  ["IPSY", "https://www.ipsy.com/"],
  ["Jerry Leigh", "https://www.jerryleigh.com/"],
  ["Manhattan Beachwear", "https://www.mbwswim.com/"],
  ["Obermeyer", "https://obermeyer.com/"],
  ["Saddle Creek Logistics Services", "https://www.sclogistics.com/"],
  ["Salon Service Group", "https://www.salonservicegroup.com/"],
  ["Seeds 'N Such", "https://seedsnsuch.com/"],
  ["Snap-on Tools", "https://www.snapon.com/"],
  ["Solutions 2 GO", "https://www.solutions2go.ca/"],
  ["SpartanNash", "https://www.spartannash.com/"],
  ["Waytek Wire", "https://www.waytekwire.com/"],
  ["Younique", "https://www.youniqueproducts.com/"]
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
      ["Canbar", "https://www.rtscompaniesinc.com/what-we-do"]
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
