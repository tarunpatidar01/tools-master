'use client';

import { useCallback, useSyncExternalStore } from 'react';
import en from '@/i18n/en.json';
import hi from '@/i18n/hi.json';

export type Language = 'en' | 'hi';

const DICTIONARIES = { en, hi } as const;

// English is the source of truth for the key set; Hindi mirrors its shape.
type Dictionary = typeof en;
type Section = keyof Dictionary;

const STORAGE_KEY = 'emi-tools:language';

/**
 * Resolves `section.key` against the chosen language, falling back to English
 * when a Hindi string is missing so a gap shows readable text instead of the
 * raw key. `{placeholders}` in the string are replaced from `vars`.
 */
export function translate(
  language: Language,
  path: string,
  vars?: Record<string, string | number>
): string {
  const [section, key] = path.split('.') as [Section, string];

  const lookup = (dict: Dictionary) =>
    (dict[section] as Record<string, string> | undefined)?.[key];

  const value = lookup(DICTIONARIES[language] as Dictionary) ?? lookup(en) ?? path;

  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
}

/** Translates a tool category name, falling back to the raw English label. */
export function translateCategory(language: Language, category: string): string {
  const map = (DICTIONARIES[language] as Dictionary).categories as Record<string, string>;
  return map[category] ?? category;
}

/**
 * Language state, persisted per browser and shared across every component that
 * reads it (including other open tabs).
 *
 * Note: this deliberately does not change <html lang>. Only the interface
 * chrome and tool names are translated — each tool's long-form article and FAQ
 * are still English, so flipping the document language would make screen
 * readers pronounce English prose with Hindi phonetics.
 *
 * Implemented with useSyncExternalStore rather than an effect that calls
 * setState: localStorage is external state, and reading it in an effect body
 * cascades an extra render on every mount. getServerSnapshot keeps the first
 * client render identical to the server HTML, so hydration stays clean.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // `storage` only fires in *other* tabs, so same-tab updates notify directly.
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
}

function getSnapshot(): Language {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'hi' ? 'hi' : 'en';
  } catch {
    // Private mode or blocked site data — English is a fine default.
    return 'en';
  }
}

const getServerSnapshot = (): Language => 'en';

export function useLanguage(): [Language, (next: Language) => void] {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = useCallback((next: Language) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persistence is a convenience; the UI still updates below.
    }
    listeners.forEach((l) => l());
  }, []);

  return [language, setLanguage];
}

/** Convenience hook: returns a bound `t()` for the given language. */
export function useTranslate(language: Language) {
  return useCallback(
    (path: string, vars?: Record<string, string | number>) => translate(language, path, vars),
    [language]
  );
}
