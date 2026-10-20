export const STORAGE_KEY = "wizardgang.preferences.v1";

export type LanguagePreference = "en" | "es";
export type ThemePreference = "dark" | "light";

export interface StoredPreferences {
  language?: LanguagePreference;
  theme?: ThemePreference;
  reading?: boolean;
  text?: boolean;
}

export interface BrowserPreferences {
  language: LanguagePreference;
  theme: ThemePreference;
  reading: boolean;
  text: boolean;
}

export interface PreferenceControls {
  language: HTMLSelectElement;
  dark: HTMLInputElement;
  light: HTMLInputElement;
  reading: HTMLInputElement;
  text: HTMLInputElement;
}

interface QueryRoot {
  querySelector<E extends Element = Element>(selectors: string): E | null;
}

interface ReadableStorage { getItem(key: string): string | null; }
interface WritableStorage { setItem(key: string, value: string): void; }

const isLanguage = (v: unknown): v is LanguagePreference => v === "en" || v === "es";
const isTheme = (v: unknown): v is ThemePreference => v === "dark" || v === "light";

export function parseStoredPreferences(raw: string | null): StoredPreferences {
  if (!raw) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const record = value as Record<string, unknown>;
    const result: StoredPreferences = {};
    if (isLanguage(record.language)) result.language = record.language;
    if (isTheme(record.theme)) result.theme = record.theme;
    if (typeof record.reading === "boolean") result.reading = record.reading;
    if (typeof record.text === "boolean") result.text = record.text;
    // Legacy preview-motion keys are ignored, not migrated to the new UI.
    return result;
  } catch { return {}; }
}

export function readPreferences(storage: ReadableStorage | null): StoredPreferences {
  if (!storage) return {};
  try { return parseStoredPreferences(storage.getItem(STORAGE_KEY)); }
  catch { return {}; }
}

export function writePreferences(storage: WritableStorage | null, value: BrowserPreferences): boolean {
  if (!storage) return false;
  try { storage.setItem(STORAGE_KEY, JSON.stringify(value)); return true; }
  catch { return false; }
}

export function resolveInitialPreferences(saved: StoredPreferences, navigatorLanguage = ""): BrowserPreferences {
  return {
    language: saved.language ?? (navigatorLanguage.toLowerCase().startsWith("es") ? "es" : "en"),
    theme: saved.theme ?? "dark",
    reading: saved.reading ?? true,
    text: saved.text ?? false
  };
}

export function findPreferenceControls(root: QueryRoot): PreferenceControls | null {
  const language = root.querySelector<HTMLSelectElement>("#page-language");
  const dark = root.querySelector<HTMLInputElement>("#theme-dark");
  const light = root.querySelector<HTMLInputElement>("#theme-light");
  const reading = root.querySelector<HTMLInputElement>("#reading-layout");
  const text = root.querySelector<HTMLInputElement>("#text-size-200");
  if (!language || !dark || !light || !reading || !text) return null;
  return { language, dark, light, reading, text };
}

export function applyPreferenceControls(controls: PreferenceControls, value: BrowserPreferences): void {
  controls.language.value = value.language;
  controls.dark.checked = value.theme === "dark";
  controls.light.checked = value.theme === "light";
  controls.reading.checked = value.reading;
  controls.text.checked = value.text;
}

export function preferencesFromControls(controls: PreferenceControls): BrowserPreferences {
  return {
    language: controls.language.value === "es" ? "es" : "en",
    theme: controls.light.checked ? "light" : "dark",
    reading: controls.reading.checked,
    text: controls.text.checked
  };
}
