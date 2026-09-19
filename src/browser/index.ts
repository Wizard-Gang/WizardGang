import { initializeNavigation } from "./navigation";
import {
  applyPreferenceControls,
  findPreferenceControls,
  preferencesFromControls,
  readPreferences,
  resolveInitialPreferences,
  writePreferences,
  type LanguagePreference
} from "./preferences";
import { translateDynamic, translateText } from "./translations";

interface TextRecord {
  node: Text;
  english: string | null;
}

interface AttributeRecord {
  element: Element;
  name: "aria-label" | "title" | "placeholder";
  english: string;
}

function safeLocalStorage(browserWindow: Window): Storage | null {
  try {
    return browserWindow.localStorage;
  } catch {
    return null;
  }
}

function captureTranslationRecords(documentRoot: Document): {
  textRecords: TextRecord[];
  attributeRecords: AttributeRecord[];
  englishTitle: string;
} {
  const textRecords: TextRecord[] = [];
  const attributeRecords: AttributeRecord[] = [];
  const walker = documentRoot.createTreeWalker(documentRoot.body, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.parentElement?.closest("script, style")) continue;
    textRecords.push({ node, english: node.nodeValue });
  }

  for (const element of documentRoot.querySelectorAll("[aria-label], [title], [placeholder]")) {
    for (const name of ["aria-label", "title", "placeholder"] as const) {
      const english = element.getAttribute(name);
      if (english !== null) attributeRecords.push({ element, name, english });
    }
  }

  return { textRecords, attributeRecords, englishTitle: documentRoot.title };
}

export function initializePreferences(documentRoot: Document, browserWindow: Window): boolean {
  const controls = findPreferenceControls(documentRoot);
  if (!controls) return false;

  const translations = captureTranslationRecords(documentRoot);
  const storage = safeLocalStorage(browserWindow);
  const saved = readPreferences(storage);
  const initial = resolveInitialPreferences(saved, browserWindow.navigator?.language ?? "");
  let motionExplicit = initial.motionExplicit;

  applyPreferenceControls(controls, initial);

  const applyLocale = (locale: LanguagePreference): void => {
    documentRoot.documentElement.lang = locale;
    controls.language.value = locale;

    for (const record of translations.textRecords) {
      record.node.nodeValue = translateText(record.english, locale);
    }
    for (const record of translations.attributeRecords) {
      record.element.setAttribute(
        record.name,
        locale === "es" ? translateDynamic(record.english) : record.english
      );
    }
    documentRoot.title = locale === "es"
      ? translateDynamic(translations.englishTitle)
      : translations.englishTitle;
  };

  const persist = (): void => {
    writePreferences(storage, preferencesFromControls(controls, motionExplicit));
  };

  applyLocale(initial.language);

  controls.language.addEventListener("change", () => {
    const locale: LanguagePreference = controls.language.value === "es" ? "es" : "en";
    applyLocale(locale);
    persist();
  });

  for (const control of [controls.dark, controls.light, controls.reading, controls.text]) {
    control.addEventListener("change", persist);
  }

  controls.motion.addEventListener("change", () => {
    motionExplicit = true;
    persist();
  });

  return true;
}

export function initializeBrowserBehavior(documentRoot: Document, browserWindow: Window): void {
  initializeNavigation(
    documentRoot,
    typeof browserWindow.matchMedia === "function"
      ? browserWindow.matchMedia.bind(browserWindow)
      : undefined
  );
  initializePreferences(documentRoot, browserWindow);
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  initializeBrowserBehavior(document, window);
}
