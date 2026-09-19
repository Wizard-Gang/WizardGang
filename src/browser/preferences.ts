export const STORAGE_KEY = "wizardgang.preferences.v1";

export type LanguagePreference = "en" | "es";
export type ThemePreference = "dark" | "light";
export type ReadableLayoutPreference = boolean;
export type TextSizePreference = boolean;
export type PreviewMotionPreference = boolean;

export interface StoredPreferences {
  language?: LanguagePreference;
  theme?: ThemePreference;
  reading?: ReadableLayoutPreference;
  text?: TextSizePreference;
  motion?: PreviewMotionPreference;
  motionExplicit?: boolean;
}

export interface BrowserPreferences {
  language: LanguagePreference;
  theme: ThemePreference;
  reading: ReadableLayoutPreference;
  text: TextSizePreference;
  motion: PreviewMotionPreference;
  motionExplicit: boolean;
}

export interface PreferenceControls {
  language: HTMLSelectElement;
  dark: HTMLInputElement;
  light: HTMLInputElement;
  reading: HTMLInputElement;
  text: HTMLInputElement;
  motion: HTMLInputElement;
}

interface QueryRoot {
  querySelector<E extends Element = Element>(selectors: string): E | null;
}

interface ReadableStorage {
  getItem(key: string): string | null;
}

interface WritableStorage {
  setItem(key: string, value: string): void;
}

const isLanguage = (value: unknown): value is LanguagePreference => value === "en" || value === "es";
const isTheme = (value: unknown): value is ThemePreference => value === "dark" || value === "light";

export function parseStoredPreferences(raw: string | null): StoredPreferences {
  if (!raw) return {};

  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const record = value as Record<string, unknown>;
    const preferences: StoredPreferences = {};

    if (isLanguage(record.language)) preferences.language = record.language;
    if (isTheme(record.theme)) preferences.theme = record.theme;
    if (typeof record.reading === "boolean") preferences.reading = record.reading;
    if (typeof record.text === "boolean") preferences.text = record.text;
    if (typeof record.motion === "boolean") preferences.motion = record.motion;
    if (typeof record.motionExplicit === "boolean") preferences.motionExplicit = record.motionExplicit;

    return preferences;
  } catch {
    return {};
  }
}

export function readPreferences(storage: ReadableStorage | null): StoredPreferences {
  if (!storage) return {};
  try {
    return parseStoredPreferences(storage.getItem(STORAGE_KEY));
  } catch {
    return {};
  }
}

export function writePreferences(storage: WritableStorage | null, preferences: BrowserPreferences): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    return true;
  } catch {
    return false;
  }
}

export function resolveInitialPreferences(saved: StoredPreferences, navigatorLanguage = ""): BrowserPreferences {
  // Earlier builds stored the old paused default whenever any setting changed, so a
  // saved false did not necessarily mean the visitor had chosen to pause previews.
  // Only an explicit motion-control change (or a saved true from the legacy format)
  // makes the stored motion value authoritative.
  const motionExplicit = saved.motionExplicit === true || saved.motion === true;

  return {
    language: saved.language ?? (navigatorLanguage.toLowerCase().startsWith("es") ? "es" : "en"),
    theme: saved.theme ?? "dark",
    reading: saved.reading ?? true,
    text: saved.text ?? false,
    motion: motionExplicit && typeof saved.motion === "boolean" ? saved.motion : true,
    motionExplicit
  };
}

export function findPreferenceControls(root: QueryRoot): PreferenceControls | null {
  const language = root.querySelector<HTMLSelectElement>("#page-language");
  const dark = root.querySelector<HTMLInputElement>("#theme-dark");
  const light = root.querySelector<HTMLInputElement>("#theme-light");
  const reading = root.querySelector<HTMLInputElement>("#reading-layout");
  const text = root.querySelector<HTMLInputElement>("#text-size-200");
  const motion = root.querySelector<HTMLInputElement>("#play-previews");

  if (!language || !dark || !light || !reading || !text || !motion) return null;
  return { language, dark, light, reading, text, motion };
}

export function applyPreferenceControls(controls: PreferenceControls, preferences: BrowserPreferences): void {
  controls.language.value = preferences.language;
  controls.dark.checked = preferences.theme === "dark";
  controls.light.checked = preferences.theme === "light";
  controls.reading.checked = preferences.reading;
  controls.text.checked = preferences.text;
  controls.motion.checked = preferences.motion;
}

export function preferencesFromControls(
  controls: PreferenceControls,
  motionExplicit: boolean
): BrowserPreferences {
  return {
    language: controls.language.value === "es" ? "es" : "en",
    theme: controls.light.checked ? "light" : "dark",
    reading: controls.reading.checked,
    text: controls.text.checked,
    motion: controls.motion.checked,
    motionExplicit
  };
}
