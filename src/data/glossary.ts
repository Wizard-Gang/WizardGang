export type GlossaryEntry = readonly [term: string, definition: string];

export const GLOSSARY = [
  ["Artificial intelligence (AI)", "Software that can produce or analyze content from learned patterns. On this site, AI mainly describes how code was created or how a work system is used."],
  ["Application programming interface (API)", "A defined way for two software systems to request information or actions from each other."],
  ["Command-line interface (CLI)", "A program controlled by typed commands instead of on-screen buttons."],
  ["Continuous integration and continuous delivery (CI/CD)", "Automated checks and release steps that help teams test and publish software safely."],
  ["Data mapping", "Matching a field in one system, such as an order number, to the corresponding field in another system."],
  ["Deterministic simulation", "A simulation that produces the same result whenever it starts with the same data and actions."],
  ["Electronic data interchange (EDI)", "A standard way for businesses to exchange documents such as orders and shipping notices."],
  ["Enterprise resource planning (ERP)", "Business software used to manage areas such as orders, finance, inventory, and purchasing."],
  ["Extract, transform, and load (ETL)", "A process that reads data, reshapes or checks it, and writes it into another system."],
  ["International Electrotechnical Commission (IEC)", "An organization that develops international standards for electrical, electronic, and related technologies."],
  ["International Organization for Standardization (ISO)", "An organization that publishes international standards for management, technology, safety, and other fields."],
  ["Quality assurance (QA)", "Planned checking used to find problems and confirm that software meets its requirements."],
  ["Rollback architecture", "A game design that can restore an earlier state and calculate the same events again, which helps players stay synchronized online."],
  ["R2 object storage", "A Cloudflare service used to store files and backup copies."],
  ["System monitoring and observability", "Logs, measurements, and status information that help an operator understand what a running system is doing."],
  ["Web Content Accessibility Guidelines (WCAG)", "A published set of testable requirements for making web content more accessible to people with disabilities."],
  ["Warehouse management system (WMS)", "Software used to manage inventory and work inside a warehouse."],
  ["Content addressing", "Identifying a file by a digital fingerprint made from its contents rather than only by its name or location."],
  ["Billable cloud action", "An application action that uses a measured online service and can add to its operating cost."]
] as const satisfies readonly GlossaryEntry[];
