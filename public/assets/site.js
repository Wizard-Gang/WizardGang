(() => {
  "use strict";

  const storageKey = "wizardgang.preferences.v1";
  const spanish = new Map([
    ["Skip to main content", "Saltar al contenido principal"],
    ["Projects", "Proyectos"],
    ["Work", "Trayectoria"],
    ["Services", "Servicios"],
    ["About", "Acerca de"],
    ["Contact", "Contacto"],
    ["Website services", "Servicios web"],
    ["Security", "Seguridad"],
    ["Accessibility", "Accesibilidad"],
    ["Glossary", "Glosario"],
    ["Menu", "Menú"],
    ["Preferences", "Preferencias"],
    ["Language", "Idioma"],
    ["English", "Inglés"],
    ["Español", "Español"],
    ["Theme", "Tema"],
    ["Dark", "Oscuro"],
    ["Light", "Claro"],
    ["Readable layout", "Diseño legible"],
    ["200% text", "Texto al 200 %"],
    ["Play previews", "Reproducir vistas previas"],
    ["Language, display, and motion preferences", "Preferencias de idioma, visualización y movimiento"],
    ["Previews play by default. Turn this off to pause them; reduced-motion preferences are always respected.", "Las vistas previas se reproducen de forma predeterminada. Desactiva esta opción para pausarlas; las preferencias de movimiento reducido siempre se respetan."],
    ["Play", "Jugar"],
    ["Case study", "Caso de estudio"],
    ["Evidence", "Evidencia"],
    ["Home", "Inicio"],
    ["View projects", "Ver proyectos"],
    ["All projects", "Todos los proyectos"],
    ["Professional portfolio", "Trayectoria profesional"],
    ["View services", "Ver servicios"],
    ["About Jacob", "Acerca de Jacob"],
    ["Get in touch", "Contactar"],
    ["Professional work", "Trabajo profesional"],
    ["Jacob Yongue · Software engineering portfolio", "Jacob Yongue · Portafolio de ingeniería de software"],
    ["LinkedIn", "LinkedIn"],
    ["WizardGang.ai ·", "WizardGang.ai ·"],
    ["I build systems that ship.", "Construyo sistemas que llegan a producción."],
    ["Software engineer · Systems · Project delivery", "Ingeniero de software · Sistemas · Entrega de proyectos"],
    ["I design, build, connect, and launch software, then help teams keep it working in production.", "Diseño, construyo, conecto y lanzo software; después ayudo a los equipos a mantenerlo funcionando en producción."],
    ["Selected projects", "Proyectos seleccionados"],
    ["Independent systems, shipped.", "Sistemas independientes, puestos en producción."],
    ["Selected work", "Experiencia seleccionada"],
    ["Systems delivered in real operations.", "Sistemas entregados en operaciones reales."],
    ["Your website. Your code. Your infrastructure.", "Tu sitio web. Tu código. Tu infraestructura."],
    ["Capabilities", "Capacidades"],
    ["From idea to production.", "De la idea a producción."],
    ["Practical systems. Full ownership.", "Sistemas prácticos. Responsabilidad completa."],
    ["Need someone who can move from requirements to a working system?", "¿Necesitas a alguien que lleve los requisitos hasta un sistema funcional?"],
    ["I don’t sell you a website subscription. I build you a small piece of software and hand you the keys: source code, repository, deployment, and domain.", "No te vendo una suscripción a un sitio web. Te construyo una pequeña pieza de software y te entrego las llaves: código fuente, repositorio, despliegue y dominio."],
    ["See how the example works", "Ver cómo funciona el ejemplo"],
    ["Starter", "Inicial"],
    ["Business", "Negocio"],
    ["Up to 3 pages", "Hasta 3 páginas"],
    ["Up to 5 pages", "Hasta 5 páginas"],
    ["Up to 8 pages", "Hasta 8 páginas"],
    ["A focused site for a small business that needs a credible home, clear services, and a direct contact path.", "Un sitio enfocado para una pequeña empresa que necesita una presencia confiable, servicios claros y una vía directa de contacto."],
    ["A broader business site with room to show the work, establish trust, and collect useful customer inquiries.", "Un sitio empresarial más amplio para mostrar el trabajo, generar confianza y recibir consultas útiles de clientes."],
    ["A complete site with dedicated pages, stored contact requests, and documentation for future maintenance.", "Un sitio completo con páginas dedicadas, solicitudes de contacto guardadas y documentación para el mantenimiento futuro."],
    ["Build the software", "Construyo el software"],
    ["Connect the systems", "Conecto los sistemas"],
    ["Put it into use", "Lo pongo en funcionamiento"],
    ["Lead the work", "Lidero el trabajo"],
    ["Keep it running", "Lo mantengo funcionando"],
    ["I turn requirements into applications, APIs, data tools, and automation.", "Convierto requisitos en aplicaciones, API, herramientas de datos y automatización."],
    ["I make business systems share the right data at the right time.", "Hago que los sistemas empresariales compartan los datos correctos en el momento adecuado."],
    ["I move data, configure workflows, test, train users, and support launch.", "Migro datos, configuro flujos de trabajo, pruebo, capacito a usuarios y apoyo el lanzamiento."],
    ["I keep scope, owners, risks, and releases clear.", "Mantengo claros el alcance, los responsables, los riesgos y los lanzamientos."],
    ["I monitor production, respond to incidents, improve recovery, and document changes.", "Superviso producción, respondo a incidentes, mejoro la recuperación y documento los cambios."],
    ["I’m a software engineer and implementation lead who works comfortably across code, operations, and delivery. I learn unfamiliar domains quickly, make system boundaries explicit, and stay with the work through production.", "Soy ingeniero de software y líder de implementación. Trabajo con comodidad entre código, operaciones y entrega. Aprendo rápido los dominios desconocidos, hago explícitos los límites del sistema y acompaño el trabajo hasta producción."],
    ["A live multiplayer shark game built entirely with code created by artificial intelligence (AI), with measured cloud costs, accessible interfaces, and built-in security, reliability, and operating controls.", "Un juego multijugador de tiburones construido por completo con código creado por inteligencia artificial (IA), con costos de nube medidos, interfaces accesibles y controles integrados de seguridad, confiabilidad y operación."],
    ["A browser fighting game where every hit has one repeatable result. It includes accessible controls, training tools, replays, computer players, and a foundation for future online play.", "Un juego de lucha en el navegador donde cada golpe produce un resultado repetible. Incluye controles accesibles, herramientas de entrenamiento, repeticiones, jugadores controlados por computadora y una base para futuro juego en línea."],
    ["An offline comic and book library that turns mixed files into a checked, portable reader and can safely continue after a crash or interrupted copy.", "Una biblioteca sin conexión de cómics y libros que convierte archivos diversos en un lector verificado y portátil, y que puede continuar de forma segura después de un fallo o una copia interrumpida."],
    ["Points", "Puntos"],
    ["Rank", "Rango"],
    ["Size", "Tamaño"],
    ["Top Sharks", "Mejores tiburones"],
    ["Dash", "Impulso"],
    ["Rocket", "Cohete"],
    ["Hit confirmed", "Golpe confirmado"],
    ["Move timeline / event-derived", "Cronología del movimiento / derivada de eventos"],
    ["Frame", "Cuadro"],
    ["Phase", "Fase"],
    ["Hit", "Golpe"],
    ["Cancel", "Cancelar"],
    ["Format", "Formato"],
    ["All formats", "Todos los formatos"],
    ["Genre", "Género"],
    ["All genres", "Todos los géneros"],
    ["Series", "Series"],
    ["Chapters", "Capítulos"],
    ["6 sample series", "6 series de muestra"],
    ["Search series, title, year", "Buscar serie, título o año"],
    ["Alphabetical", "Alfabético"],
    ["Artificial-intelligence-developed multiplayer game", "Juego multijugador desarrollado con inteligencia artificial"],
    ["Multiplayer game", "Juego multijugador"],
    ["ISO/IEC 27001 aligned", "Alineado con ISO/IEC 27001"],
    ["ISO/IEC 42001 aligned", "Alineado con ISO/IEC 42001"],
    ["Built-in cost controls", "Controles de costos integrados"],
    ["WCAG 2.0 AA interfaces", "Interfaces WCAG 2.0 AA"],
    ["Deterministic systems", "Sistemas deterministas"],
    ["Portable media pipeline", "Canalización portátil de medios"],
    ["Building practical systems that use artificial intelligence (AI) at the University of Georgia.", "Construyo sistemas prácticos que utilizan inteligencia artificial (IA) en la Universidad de Georgia."],
    ["Led distributed delivery for enterprise warehouse management system (WMS) implementations, integrations, releases, and production support.", "Lideré la entrega distribuida de implementaciones, integraciones, lanzamientos y soporte de producción para sistemas empresariales de gestión de almacenes (WMS)."],
    ["Led .NET case-management delivery, continuous integration and continuous delivery (CI/CD), production support, and migration planning for public-sector systems.", "Lideré la entrega de gestión de casos en .NET, la integración y entrega continuas (CI/CD), el soporte de producción y la planificación de migraciones para sistemas del sector público."],
    ["Run a seasonal short-term rental every year, owning licensing, pricing, bookings, guest service, compliance, and closeout.", "Opero cada año un alquiler estacional de corta duración y soy responsable de licencias, precios, reservas, atención a huéspedes, cumplimiento y cierre."],
    ["Built and supported .NET fulfillment systems, extract-transform-load (ETL) data pipelines, warehouse management system (WMS) integrations, and migrations without planned downtime.", "Construí y mantuve sistemas de cumplimiento en .NET, canalizaciones de extracción, transformación y carga (ETL), integraciones con sistemas de gestión de almacenes (WMS) y migraciones sin tiempo de inactividad planificado."],
    ["AI Engineer", "Ingeniero de IA"],
    ["Consultant / Technical Lead", "Consultor / Líder técnico"],
    ["Lead Developer", "Desarrollador principal"],
    ["Founder / operator", "Fundador / operador"],
    ["Senior Software Engineer", "Ingeniero de software sénior"],
    ["Built to be", "Hechos para ser"],
    ["inspected.", "inspeccionados."],
    ["Independent software projects with a clear path from concise overview to technical case study, running application, and source evidence.", "Proyectos de software independientes con un recorrido claro desde un resumen conciso hasta el caso de estudio técnico, la aplicación en funcionamiento y la evidencia del código fuente."],
    ["Go deeper", "Profundizar"],
    ["Overview first. Evidence when you want it.", "Primero el resumen. La evidencia cuando la necesites."],
    ["What it is", "Qué es"],
    ["Why I built it", "Por qué lo construí"],
    ["A complete working system.", "Un sistema completo y funcional."],
    ["The engineering question.", "La pregunta de ingeniería."],
    ["Engineering highlights", "Aspectos destacados de ingeniería"],
    ["What the project demonstrates.", "Lo que demuestra el proyecto."],
    ["Production work.", "Trabajo en producción."],
    ["Operational stakes.", "Impacto operativo."],
    ["Work / professional portfolio", "Trayectoria / portafolio profesional"],
    ["Career history", "Historial profesional"],
    ["Roles across the delivery path.", "Funciones a lo largo del proceso de entrega."],
    ["Systems delivered", "Sistemas entregados"],
    ["Real systems in real operations.", "Sistemas reales en operaciones reales."],
    ["Integrations", "Integraciones"],
    ["Connected business operations.", "Operaciones empresariales conectadas."],
    ["Deployments", "Despliegues"],
    ["Organizations and environments.", "Organizaciones y entornos."],
    ["Core skills", "Habilidades principales"],
    ["The delivery stack.", "Tecnologías para la entrega."],
    ["Launch the site.", "Lanza el sitio."],
    ["Keep the keys.", "Conserva las llaves."],
    ["Start a project", "Iniciar un proyecto"],
    ["See how it works", "Ver cómo funciona"],
    ["Website packages", "Paquetes de sitios web"],
    ["Choose the scope that fits.", "Elige el alcance adecuado."],
    ["The website is yours.", "El sitio web es tuyo."],
    ["Built to be handed over.", "Construido para ser entregado."],
    ["Delivery", "Entrega"],
    ["From business details to a working site.", "De los datos del negocio a un sitio funcional."],
    ["Start small, grow for a reason", "Empieza con poco y crece con una razón"],
    ["Add infrastructure when the business needs it.", "Añade infraestructura cuando el negocio la necesite."],
    ["Scope", "Alcance"],
    ["Clear package boundaries.", "Límites claros para cada paquete."],
    ["Ready to own the website you pay for?", "¿Listo para ser dueño del sitio web que pagas?"],
    ["About Jacob Yongue", "Acerca de Jacob Yongue"],
    ["Build the whole path.", "Construye el recorrido completo."],
    ["Own the outcome.", "Asume el resultado."],
    ["Approach", "Enfoque"],
    ["Practical systems over isolated artifacts.", "Sistemas prácticos por encima de piezas aisladas."],
    ["Systems thinking", "Pensamiento sistémico"],
    ["Implementation depth", "Profundidad de implementación"],
    ["Project ownership", "Responsabilidad del proyecto"],
    ["Learning velocity", "Velocidad de aprendizaje"],
    ["Small surface.", "Superficie reducida."],
    ["Clear reporting.", "Reportes claros."],
    ["This portfolio is intentionally static and keeps application services, customer data, and product administration outside its boundary.", "Este portafolio es intencionalmente estático y mantiene fuera de sus límites los servicios de aplicaciones, los datos de clientes y la administración de productos."],
    ["Site design", "Diseño del sitio"],
    ["Reduce what can go wrong.", "Reducir lo que puede salir mal."],
    ["The portfolio serves generated HTML, CSS, a small first-party preferences script, and media files through Cloudflare. It does not accept passwords, payments, uploads, or account sessions.", "El portafolio sirve HTML y CSS generados, un pequeño script propio de preferencias y archivos multimedia mediante Cloudflare. No acepta contraseñas, pagos, cargas de archivos ni sesiones de cuenta."],
    ["Strict content security and browser-permission headers", "Encabezados estrictos de seguridad de contenido y permisos del navegador"],
    ["No third-party advertising, tracking pixels, or embedded account widgets", "Sin publicidad de terceros, píxeles de seguimiento ni widgets de cuentas incrustados"],
    ["Separate boundaries for portfolio pages and live project applications", "Límites separados para las páginas del portafolio y las aplicaciones de proyectos en vivo"],
    ["Automated checks for routes, metadata, redirects, and private information", "Comprobaciones automatizadas de rutas, metadatos, redirecciones e información privada"],
    ["Report a problem", "Informar de un problema"],
    ["Send security details privately.", "Envía los detalles de seguridad de forma privada."],
    ["Reports are reviewed before public discussion. This page describes the portfolio boundary; each live project publishes its own operating and security evidence where applicable.", "Los informes se revisan antes de cualquier conversación pública. Esta página describe el límite del portafolio; cada proyecto en vivo publica su propia evidencia operativa y de seguridad cuando corresponde."],
    ["Project evidence", "Evidencia del proyecto"],
    ["Inspect the live controls.", "Inspecciona los controles en vivo."],
    ["SharkTank publishes the clearest example of this work: security controls, change records, uptime, cost limits, backup checks, and incident evidence beside the running game.", "SharkTank publica el ejemplo más claro de este trabajo: controles de seguridad, registros de cambios, disponibilidad, límites de costos, comprobaciones de copias de seguridad y evidencia de incidentes junto al juego en funcionamiento."],
    ["Use the site.", "Usa el sitio."],
    ["Understand the words.", "Comprende las palabras."],
    ["This page explains the accessibility target, the preferences available on every page, and the technical glossary used throughout the portfolio.", "Esta página explica el objetivo de accesibilidad, las preferencias disponibles en cada página y el glosario técnico utilizado en todo el portafolio."],
    ["Commitment", "Compromiso"],
    ["A WCAG 2.2 AA testing target, with honest status.", "Un objetivo de pruebas WCAG 2.2 AA, con un estado transparente."],
    ["WizardGang targets the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA for its main portfolio pages. The site uses semantic HTML, keyboard navigation, visible focus, high-contrast text, user-controlled preview motion, decorative preview isolation, and plain-language help.", "WizardGang tiene como objetivo el nivel AA de las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2 en las páginas principales del portafolio. El sitio utiliza HTML semántico, navegación por teclado, foco visible, texto de alto contraste, movimiento de vistas previas controlado por el usuario, aislamiento de vistas previas decorativas y ayuda clara."],
    ["This is a design and testing target, not a certification claim. Browser, screen-reader, zoom, and flashing checks must remain part of every release.", "Este es un objetivo de diseño y pruebas, no una afirmación de certificación. Las comprobaciones de navegador, lector de pantalla, ampliación y destellos deben formar parte de cada versión."],
    ["Choose language, display, and motion.", "Elige idioma, visualización y movimiento."],
    ["Open Preferences near the top of any page. You can use the site in English or Spanish, choose a dark or light high-contrast theme, increase text to 200%, apply a readable layout, and play or pause project preview animations. Preferences are saved in this browser. Project previews play by default; pause them with the Play previews control.", "Abre Preferencias cerca de la parte superior de cualquier página. Puedes usar el sitio en inglés o español, elegir un tema oscuro o claro de alto contraste, aumentar el texto al 200 %, aplicar un diseño legible y reproducir o pausar las animaciones de vista previa. Las preferencias se guardan en este navegador. Las vistas previas de proyectos se reproducen de forma predeterminada; páusalas con el control Reproducir vistas previas."],
    ["Plain-language glossary", "Glosario en lenguaje claro"],
    ["Technical terms used on this site.", "Términos técnicos utilizados en este sitio."],
    ["Feedback", "Comentarios"],
    ["Report an accessibility problem.", "Informar de un problema de accesibilidad."],
    ["Technical terms.", "Términos técnicos."],
    ["Clear definitions.", "Definiciones claras."],
    ["Definitions for the specialized language used throughout the portfolio.", "Definiciones del lenguaje especializado utilizado en todo el portafolio."],
    ["Terms used on this site.", "Términos utilizados en este sitio."],
    ["May 2026 - Current", "may. 2026 - actualidad"],
    ["Sep 2024 - Apr 2026", "sept. 2024 - abr. 2026"],
    ["Jun 2023 - Aug 2024", "jun. 2023 - ago. 2024"],
    ["Aug 2023 - Current", "ago. 2023 - actualidad"],
    ["Jul 2019 - May 2023", "jul. 2019 - may. 2023"],
    ["Glossary — WizardGang", "Glosario — WizardGang"],
    ["Work — Jacob Yongue | Professional Portfolio", "Trayectoria — Jacob Yongue | Portafolio profesional"],
    ["Website Services — Jacob Yongue | WizardGang", "Servicios web — Jacob Yongue | WizardGang"],
    ["About Jacob Yongue — Software Engineer", "Acerca de Jacob Yongue — Ingeniero de software"],
    ["Not Found — WizardGang", "Página no encontrada — WizardGang"],
    ["Nothing here.", "No hay nada aquí."],
    ["404 / Route not found", "404 / Ruta no encontrada"],
    ["Return to Jacob Yongue’s portfolio or inspect the project index.", "Vuelve al portafolio de Jacob Yongue o consulta el índice de proyectos."]
  ]);

  const textRecords = [];
  const attributeRecords = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement?.closest("script, style")) continue;
    textRecords.push({ node, english: node.nodeValue });
  }
  for (const element of document.querySelectorAll("[aria-label], [title], [placeholder]")) {
    for (const name of ["aria-label", "title", "placeholder"]) {
      if (element.hasAttribute(name)) attributeRecords.push({ element, name, english: element.getAttribute(name) });
    }
  }
  const englishTitle = document.title;

  function translateDynamic(value) {
    const rules = [
      [/^Play (.+)$/, "Jugar a $1"],
      [/^Read the (.+) case study$/, "Leer el caso de estudio de $1"],
      [/^View (.+) source code on GitHub$/, "Ver el código fuente de $1 en GitHub"],
      [/^View (.+) operating evidence$/, "Ver la evidencia operativa de $1"],
      [/^View (.+) operations$/, "Ver las operaciones de $1"],
      [/^Visit WizardGang on GitHub$/, "Visitar WizardGang en GitHub"],
      [/^← Projects$/, "← Proyectos"],
      [/^← (.+) overview$/, "← Resumen de $1"],
      [/^(.+) overview$/, "Resumen de $1"],
      [/^(\d+) — (.+)$/, (_, number, label) => `${number} — ${spanish.get(label) || label}`],
      [/^(\d+) \/ (.+)$/, (_, number, label) => `${number} / ${spanish.get(label) || label}`],
      [/^Level (A|AA|AAA)$/, "Nivel $1"],
      [/^Level A · Level AA$/, "Nivel A · Nivel AA"],
      [/^Level A · Level AA · Level AAA$/, "Nivel A · Nivel AA · Nivel AAA"],
      [/^(\d+) units$/, "$1 unidades"],
      [/^(\d+) damage · ([\d.]+) pushback · (\d+) frames active$/, "$1 de daño · $2 de empuje · $3 fotogramas activos"],
      [/^(\d+) fictional series · (\d+) chapters · Original demo artwork$/, "$1 series ficticias · $2 capítulos · Arte original de demostración"],
      [/^(\d+) sample series$/, "$1 series de muestra"],
      [/^(Comic|Manga|Webtoon|Webtoons) · (.+)$/, (_, genre, issue) => `${spanish.get(genre) || genre} · ${issue}`],
      [/^(.+) — Project by Jacob Yongue$/, "$1 — Proyecto de Jacob Yongue"],
      [/^✓ (\d+) met$/, "✓ $1 cumplidos"],
      [/^◐ (\d+) partial$/, "◐ $1 parciales"],
      [/^! (\d+) gap$/, "! $1 pendientes"]
    ];
    for (const [pattern, replacement] of rules) if (pattern.test(value)) return value.replace(pattern, replacement);
    return spanish.get(value) || value;
  }

  function translateText(value, locale) {
    if (locale !== "es" || !value?.trim()) return value;
    const leading = value.match(/^\s*/)[0];
    const trailing = value.match(/\s*$/)[0];
    const key = value.trim().replace(/\s+/g, " ");
    return `${leading}${translateDynamic(key)}${trailing}`;
  }

  function readPreferences() {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); }
    catch { return {}; }
  }

  function writePreferences(preferences) {
    try { localStorage.setItem(storageKey, JSON.stringify(preferences)); }
    catch { /* Preferences still work for the current page. */ }
  }

  const controls = {
    language: document.querySelector("#page-language"),
    dark: document.querySelector("#theme-dark"),
    light: document.querySelector("#theme-light"),
    reading: document.querySelector("#reading-layout"),
    text: document.querySelector("#text-size-200"),
    motion: document.querySelector("#play-previews")
  };
  const navDisclosure = document.querySelector(".nav-disclosure");
  const navToggle = navDisclosure?.querySelector(".nav-toggle");
  const siteNav = navDisclosure?.querySelector(".site-nav-mobile");

  function setNavigationOpen(open) {
    if (!navDisclosure) return;
    navDisclosure.toggleAttribute("open", open);
  }

  siteNav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setNavigationOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navDisclosure?.open) {
      setNavigationOpen(false);
      navToggle?.focus();
    }
  });
  const mobileNavigation = matchMedia("(max-width: 760px)");
  mobileNavigation.addEventListener("change", (event) => {
    if (!event.matches) setNavigationOpen(false);
  });

  const saved = readPreferences();
  // Earlier builds stored the old paused default whenever any setting changed, so a
  // saved `false` did not necessarily mean the visitor had chosen to pause previews.
  // From this release onward, only an explicit motion-control change is authoritative.
  let motionExplicit = saved.motionExplicit === true || saved.motion === true;
  const initialLocale = saved.language || (navigator.language?.toLowerCase().startsWith("es") ? "es" : "en");

  function applyLocale(locale) {
    document.documentElement.lang = locale;
    controls.language.value = locale;
    for (const record of textRecords) record.node.nodeValue = translateText(record.english, locale);
    for (const record of attributeRecords) record.element.setAttribute(record.name, locale === "es" ? translateDynamic(record.english) : record.english);
    document.title = locale === "es" ? translateDynamic(englishTitle) : englishTitle;
  }

  if (saved.theme === "light") controls.light.checked = true;
  else if (saved.theme === "dark") controls.dark.checked = true;
  if (typeof saved.reading === "boolean") controls.reading.checked = saved.reading;
  if (typeof saved.text === "boolean") controls.text.checked = saved.text;
  if (motionExplicit && typeof saved.motion === "boolean") controls.motion.checked = saved.motion;
  applyLocale(initialLocale);

  function persist() {
    writePreferences({
      language: controls.language.value,
      theme: controls.light.checked ? "light" : "dark",
      reading: controls.reading.checked,
      text: controls.text.checked,
      motion: controls.motion.checked,
      motionExplicit
    });
  }

  controls.language.addEventListener("change", () => { applyLocale(controls.language.value); persist(); });
  for (const control of [controls.dark, controls.light, controls.reading, controls.text]) {
    control.addEventListener("change", persist);
  }
  controls.motion.addEventListener("change", () => { motionExplicit = true; persist(); });
})();
