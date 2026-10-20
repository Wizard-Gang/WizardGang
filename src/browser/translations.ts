import type { LanguagePreference } from "./preferences";

// Only strings used by the current single-page site and its noindex fallback.
export const SPANISH_TRANSLATIONS = new Map<string, string>([
  ["Skip to main content", "Saltar al contenido principal"],
  ["WizardGang · Software, systems & integrations", "WizardGang · Software, sistemas e integraciones"],
  ["About", "Acerca de"],
  ["Services", "Servicios"],
  ["Experience", "Experiencia"],
  ["Contact", "Contacto"],
  ["Software that works with your business.", "Software que se adapta a su negocio."],
  ["Custom applications, integrations, reporting, and automation built around the systems your team already relies on.", "Aplicaciones a medida, integraciones, informes y automatización que funcionan con los sistemas que su equipo ya utiliza."],
  ["Discuss a project", "Hablemos de su proyecto"],
  ["See services", "Ver servicios"],
  ["Practical engineering for the work your team does every day.", "Ingeniería práctica para las tareas cotidianas de su equipo."],
  ["Custom software", "Software a medida"],
  ["Focused applications and internal tools that fit how your team actually works.", "Aplicaciones y herramientas internas adaptadas al trabajo real de su equipo."],
  ["System integrations", "Integraciones de sistemas"],
  ["Connect ERP, warehouse, carrier, and business systems without repeated data entry.", "Conectamos sistemas ERP, almacenes, transportistas y herramientas empresariales sin volver a introducir los datos."],
  ["Data & reporting", "Datos e informes"],
  ["Turn SQL data and operational records into clear reports people can use.", "Convertimos datos SQL y registros operativos en informes claros y útiles."],
  ["Workflow automation", "Automatización de procesos"],
  ["Reduce manual handoffs with reliable automation and tested processes.", "Reducimos las tareas manuales mediante automatización fiable y procesos probados."],
  ["Enterprise systems where reliability matters.", "Sistemas empresariales donde la fiabilidad importa."],
  ["Warehouse & fulfillment", "Almacenes y preparación de pedidos"],
  ["WMS/WCS operations, inventory controls, conveyor routing, and shipping integrations.", "Operaciones WMS/WCS, control de inventario, rutas de transportadores e integraciones de envío."],
  ["Enterprise integrations", "Integraciones empresariales"],
  ["ERP, EDI, REST APIs, SQL Server, and reporting across connected systems.", "ERP, EDI, API REST, SQL Server e informes entre sistemas conectados."],
  ["Public-sector applications", "Aplicaciones del sector público"],
  ["Case management, reporting, migrations, and production support for regulated workflows.", "Gestión de casos, informes, migraciones y soporte para procesos regulados."],
  ["This experience comes from prior professional roles, not WizardGang client engagements.", "Esta experiencia procede de empleos anteriores, no de proyectos de clientes de WizardGang."],
  ["Small practice. Clear ownership.", "Equipo pequeño. Titularidad clara."],
  ["WizardGang builds software for real operating needs. We focus on understanding the workflow, connecting the right systems, testing what matters, and making the result straightforward to maintain.", "WizardGang desarrolla software para necesidades operativas reales. Nos centramos en comprender los procesos, conectar los sistemas adecuados, probar lo importante y facilitar el mantenimiento."],
  ["Tell us what you're building.", "Cuéntenos qué quiere crear."],
  ["A short email is enough to get started.", "Basta un correo breve para empezar."],
  ["Menu", "Menú"],
  ["Preferences", "Preferencias"],
  ["Language", "Idioma"],
  ["Language and display preferences", "Preferencias de idioma y visualización"],
  ["English", "Inglés"],
  ["Español", "Español"],
  ["Theme", "Tema"],
  ["Dark", "Oscuro"],
  ["Light", "Claro"],
  ["Readable layout", "Diseño legible"],
  ["200% text", "Texto al 200 %"],
  ["LinkedIn", "LinkedIn"],
  ["WizardGang.ai ·", "WizardGang.ai ·"],
  ["Not Found — WizardGang", "Página no encontrada — WizardGang"],
  ["Nothing here.", "No hay nada aquí."],
  ["404 / Route not found", "404 / Ruta no encontrada"],
  ["Home", "Inicio"],
  ["WizardGang — Custom software and integrations", "WizardGang — Software e integraciones a medida"],
  ["That route is no longer part of this site. Everything is on the home page.", "Esa ruta ya no forma parte de este sitio. Todo está en la página principal."],
  ["This WizardGang page does not exist. Return to the single-page site for services, experience and contact.", "Esta página de WizardGang no existe. Regrese a la página principal para ver servicios, experiencia y contacto."],
]);

export function translateDynamic(value: string): string {
  if (value === "Visit WizardGang on GitHub") return "Visitar WizardGang en GitHub";
  return SPANISH_TRANSLATIONS.get(value) ?? value;
}

export function translateText(value: string | null, locale: LanguagePreference): string | null {
  if (locale !== "es" || !value?.trim()) return value;
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const key = value.trim().replace(/\s+/g, " ");
  return `${leading}${translateDynamic(key)}${trailing}`;
}
