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
  ["Systems I've connected, shipped and supported in real operations.", "Sistemas que he conectado, implementado y mantenido en operaciones reales."],
  ["SHIPPING / CONTROLS", "ENVÍOS / CONTROLES"],
  ["Shipping compliance & dock routing", "Cumplimiento de envíos y rutas de muelles"],
  ["Professional warehouse integration work", "Trabajo profesional de integración de almacenes"],
  ["Built a Shipium integration that evaluated package contents, lot and expiry dates, ship-by limits, destination rules and eligible shipping methods. It selected ground, air or sea transport, generated labels and directed print-and-apply equipment and conveyor PLCs through the warehouse management and control systems.", "Desarrollé una integración con Shipium que evaluaba el contenido del paquete, los lotes, las fechas de caducidad, los plazos de envío, las normas del destino y los métodos permitidos. Elegía transporte terrestre, aéreo o marítimo, generaba etiquetas y controlaba las impresoras y los PLC de los transportadores mediante los sistemas de gestión y control del almacén."],
  ["ERP / WAREHOUSE", "ERP / ALMACÉN"],
  ["Enterprise ERP and WMS cutovers", "Transiciones de ERP y WMS empresariales"],
  ["Connected order, inventory and financial records across NetSuite, Sage and warehouse systems. Planned the integration and cutover so daily warehouse work could continue while the systems changed.", "Conecté datos de pedidos, inventario y finanzas entre NetSuite, Sage y sistemas de almacén. Planifiqué la integración y la transición para mantener las operaciones diarias durante el cambio."],
  ["FULFILLMENT / CARRIERS", "PREPARACIÓN / TRANSPORTISTAS"],
  ["Carrier and fulfillment integrations", "Integraciones de transportistas y preparación de pedidos"],
  ["Built fulfillment and warehouse-connected services that exchanged shipment and tracking data with carrier systems. Supported warehouse migrations, high-volume data flows and operational continuity across North American sites.", "Desarrollé servicios de preparación y almacén que intercambiaban datos de envío y seguimiento con transportistas. Apoyé migraciones de almacenes, flujos de datos de alto volumen y continuidad operativa en centros de Norteamérica."],
  ["DATA / RECONCILIATION", "DATOS / CONCILIACIÓN"],
  ["Inventory and financial reconciliation", "Conciliación de inventario y finanzas"],
  ["Built SQL and audit-reporting workflows to compare inventory movements and financial records across connected enterprise systems. The work helped resolve more than $10 million in recorded variances without interrupting operations.", "Desarrollé procesos SQL e informes de auditoría para comparar movimientos de inventario y registros financieros entre sistemas empresariales. El trabajo ayudó a resolver diferencias registradas superiores a diez millones de dólares sin interrumpir las operaciones."],
  ["PUBLIC SECTOR / CJIS", "SECTOR PÚBLICO / CJIS"],
  ["Regulated case management and reporting", "Gestión de casos e informes regulados"],
  ["Built case-management workflows, historical data migrations and SQL reporting for a state attorney environment. Supported testing and production readiness under CJIS requirements.", "Desarrollé procesos de gestión de casos, migraciones de datos históricos e informes SQL para una fiscalía estatal. Apoyé pruebas y preparación de producción conforme a requisitos CJIS."],
  ["Platforms", "Plataformas"],
  ["These implementations come from prior professional roles, not WizardGang client engagements.", "Estas implementaciones proceden de empleos anteriores y no representan encargos de clientes de WizardGang."],
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
