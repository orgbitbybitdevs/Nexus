import { defaultLang, type UiLanguage } from './config';

// ─── Dynamic glob import of all message JSON files ────────────────────────────
// Astro resolves these at build time. Path must be a literal for the glob.
const allMessages = import.meta.glob('../messages/**/*.json', { eager: true });

function getNamespace(lang: string, ns: string): Record<string, any> {
  const key = `../messages/${lang}/${ns}.json`;
  const mod = allMessages[key] as { default: Record<string, any> } | undefined;
  return mod?.default ?? {};
}

export type Namespace = 'common' | 'home' | 'platform' | 'projects' | 'mentors' | 'next' | 'nextResources' | 'certifiedTech';

// ─── Deep key access (dot-notation) ──────────────────────────────────────────
function deepGet(obj: Record<string, any>, path: string): string | undefined {
  const val = path.split('.').reduce((acc, key) => acc?.[key], obj);
  return typeof val === 'string' ? val : undefined;
}

// ─── ICU-lite replacer ────────────────────────────────────────────────────────
// Handles {variable} and {count, plural, one {…} other {…}} without any dep.
function icuFormat(template: string, values?: Record<string, any>): string {
  if (!values) return template;

  return template
    .replace(
      /\{(\w+),\s*plural,\s*one\s*\{([^}]*)\}\s*other\s*\{([^}]*)\}\}/g,
      (_, key, one, other) => {
        const count = values[key] ?? 0;
        return (count === 1 ? one : other).replace('#', String(count));
      }
    )
    .replace(/\{(\w+)\}/g, (_, key) =>
      values[key] !== undefined ? String(values[key]) : `{${key}}`
    );
}

// ─── useTranslations ─────────────────────────────────────────────────────────
/**
 * Returns a `t()` function for the given language and namespace.
 * Falls back to `defaultLang` (es) on any missing key.
 *
 * @example
 *   const t = useTranslations('en', 'home');
 *   t('hero.title')
 *   t('areas.projectsCount', { count: 3 })
 */
export function useTranslations(lang: UiLanguage, namespace: Namespace) {
  const langMessages     = getNamespace(lang, namespace);
  const fallbackMessages = getNamespace(defaultLang, namespace);

  return function t(key: string, values?: Record<string, any>): string {
    const raw =
      deepGet(langMessages, key) ??
      deepGet(fallbackMessages, key);

    if (raw === undefined) {
      if (import.meta.env.DEV) {
        console.warn(`[i18n] Missing key: ${namespace}.${key} (${lang})`);
      }
      return key;
    }

    return icuFormat(raw, values);
  };
}

// ─── Intl helpers ─────────────────────────────────────────────────────────────
/**
 * Format a date using the user's locale.
 * @example formatDate(new Date(), 'es') // "29/03/2026"
 */
export function formatDate(
  date: Date,
  lang: UiLanguage,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(lang, options).format(date);
}

/**
 * Format a number using the user's locale.
 * @example formatNumber(1234.56, 'es') // "1.234,56"
 */
export function formatNumber(
  num: number,
  lang: UiLanguage,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(lang, options).format(num);
}

// ─── getLangFromUrl ───────────────────────────────────────────────────────────
/**
 * Extracts the locale from a URL pathname.
 * Falls back to defaultLang if no valid locale is found.
 *
 * @example
 *   getLangFromUrl(new URL('https://x.com/en/platform')) // 'en'
 *   getLangFromUrl(new URL('https://x.com/plataforma'))  // 'es'
 */
export function getLangFromUrl(url: URL): UiLanguage {
  const [, lang] = url.pathname.split('/');
  if (lang === 'es' || lang === 'en' || lang === 'zh') return lang as UiLanguage;
  return defaultLang;
}
