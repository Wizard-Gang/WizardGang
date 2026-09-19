export interface ServicePackage {
  name: string;
  price: string;
  pages: string;
  description: string;
  features: readonly string[];
}

export const WEBSITE_PACKAGES = [
  {
    name: "Starter",
    price: "$95",
    pages: "Up to 3 pages",
    description: "A focused site for a small business that needs a credible home, clear services, and a direct contact path.",
    features: ["Responsive design", "Home, services, and contact routes", "Direct email and contact details", "Owner-controlled source and deployment"]
  },
  {
    name: "Business",
    price: "$195",
    pages: "Up to 5 pages",
    description: "A broader business site with room to show the work, establish trust, and collect useful customer inquiries.",
    features: ["Everything in Starter", "Gallery and testimonial sections", "Service-area content", "First-party contact form"]
  },
  {
    name: "Owner+",
    price: "$350",
    pages: "Up to 8 pages",
    description: "A complete site with dedicated pages, stored contact requests, and documentation for future maintenance.",
    features: ["Everything in Business", "FAQ and expanded content routes", "Stored contact submissions", "AI-ready documentation and automated deployment"]
  }
] as const satisfies readonly ServicePackage[];
