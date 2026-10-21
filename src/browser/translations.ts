import type { LanguagePreference } from "./preferences";

// Current visible portfolio text, labels, and page metadata, with no dead contact CTAs.
export const SPANISH_TRANSLATIONS = new Map<string, string>([
  ["Skip to main content", "Saltar al contenido principal"],
  ["WizardGang · Software, systems & integrations", "WizardGang · Software, sistemas e integraciones"],
  ["Services", "Servicios"],
  ["Integrations", "Integraciones"],
  ["About", "Acerca de"],
  ["INTEGRATION ENGINEERING / SELECTED WORK", "INGENIERÍA DE INTEGRACIÓN / TRABAJO DESTACADO"],
  ["Making complex systems work together.", "Hacemos que los sistemas complejos trabajen juntos."],
  ["A portfolio of enterprise integration, warehouse automation, software delivery and the operational problems behind them.", "Un portafolio de integraciones empresariales, automatización de almacenes, desarrollo de software y soluciones para retos operativos."],
  ["Explore integrations", "Ver integraciones"],
  ["View GitHub", "Ver GitHub"],
  ["CAPABILITIES", "CAPACIDADES"],
  ["Engineering focused on the systems behind everyday operations.", "Ingeniería centrada en los sistemas que hacen posible el trabajo diario."],
  ["System integration", "Integración de sistemas"],
  ["Connect enterprise applications, warehouses, carriers and equipment through APIs, EDI and reliable data exchange.", "Conectamos aplicaciones empresariales, almacenes, transportistas y equipos mediante API, EDI e intercambio fiable de datos."],
  ["Warehouse automation", "Automatización de almacenes"],
  ["Bring WMS, warehouse control systems, labels and conveyor decisions into one working flow.", "Unimos WMS, sistemas de control de almacenes, etiquetas y rutas de transportadores en un proceso operativo."],
  ["Data & reporting", "Datos e informes"],
  ["Turn operational SQL data into reconciliation, audit trails and reports that help people act.", "Convertimos datos SQL operativos en conciliaciones, auditorías e informes prácticos."],
  ["Regulated applications", "Aplicaciones reguladas"],
  ["Build, migrate and support software with testing, traceability and access controls in mind.", "Desarrollamos, migramos y mantenemos software con pruebas, trazabilidad y controles de acceso."],
  ["SELECTED IMPLEMENTATIONS", "IMPLEMENTACIONES DESTACADAS"],
  ["Selected platforms and systems from prior professional work.", "Plataformas y sistemas de mi experiencia profesional."],
  ["ERP & WMS", "ERP y SGA"],
  ["Commerce & fulfillment", "Comercio y preparación de pedidos"],
  ["Warehouse automation", "Automatización de almacenes"],
  ["Carriers", "Transportistas"],
  ["EDI & B2B", "EDI y B2B"],
  ["Warehouse hardware", "Equipos de almacén"],
  ["Development & workflow", "Desarrollo y flujos de trabajo"],
  ["Justice & legal", "Justicia y sistemas legales"],
  ["These integrations come from prior professional roles, not WizardGang client engagements.", "Estas integraciones proceden de empleos anteriores y no representan encargos de clientes de WizardGang."],
  ["BEHIND THE WORK", "DETRÁS DEL TRABAJO"],
  ["I'm an implementation consultant, software engineer and qualified project manager. My work connects operational needs to working systems, from discovery and integration through testing, cutover and support.", "Soy consultor de implementación, ingeniero de software y gestor de proyectos cualificado. Mi trabajo conecta las necesidades operativas con sistemas funcionales, desde el análisis y la integración hasta las pruebas, la transición y el soporte."],
  ["Explore the code on GitHub", "Explorar el código en GitHub"],
  ["WizardGang home", "Inicio de WizardGang"],
  ["Primary", "Principal"],
  ["Primary mobile", "Principal para móvil"],
  ["Build", "Compilación"],
  ["Menu", "Menú"],
  ["Preferences", "Preferencias"],
  ["Language", "Idioma"],
  ["Display and language preferences", "Preferencias de pantalla e idioma"],
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
  ["WizardGang — Integration engineering portfolio", "WizardGang — Portafolio de ingeniería de integración"],
  ["That route is no longer part of this site. Everything is on the home page.", "Esa ruta ya no forma parte de este sitio. Todo está en la página principal."],
  ["This WizardGang page does not exist. Return to the single-page portfolio for services, integrations and about.", "Esta página de WizardGang no existe. Regrese al portafolio para conocer servicios, integraciones e información general."]
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
