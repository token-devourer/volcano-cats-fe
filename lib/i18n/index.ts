// ============================================================
// VOLCANO CATS — i18n ENTRY POINT
// ============================================================
// Tiny lookup layer over the per-locale string tables. Default locale is
// Indonesian ('id'). The shape is a `locales` record keyed by locale code
// so an 'en' table can be dropped in later without touching call sites —
// only 'id' is implemented now.
// ============================================================

import type { CardType, CARD_SPECS as CardSpecs, GameEvent } from "@/lib/shared";
import { CARD_SPECS } from "@/lib/shared";
import { strings as idStrings, formatEvent as idFormatEvent, type NameResolver } from "./id";

export type { NameResolver };

export type Locale = "id";

interface LocaleBundle {
  strings: Record<string, string>;
  formatEvent: (event: GameEvent, nameOf: NameResolver) => string;
}

/** Registry of locale bundles. Add 'en' here when its table exists. */
const locales: Record<Locale, LocaleBundle> = {
  id: { strings: idStrings, formatEvent: idFormatEvent },
};

const DEFAULT_LOCALE: Locale = "id";

/**
 * Active locale. Kept as a module-level setting (the app is single-locale
 * per session); swap via `setLocale` once more tables exist.
 */
let activeLocale: Locale = DEFAULT_LOCALE;

export function setLocale(locale: Locale): void {
  if (locales[locale]) activeLocale = locale;
}

export function getLocale(): Locale {
  return activeLocale;
}

/**
 * Look up a string by key, with optional `{placeholder}` interpolation.
 * Falls back to the raw key when missing so a missing string is visible
 * (and greppable) rather than silently empty.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const table = locales[activeLocale].strings;
  let value = table[key];
  if (value === undefined) {
    // Fall back to the default locale, then to the key itself.
    value = locales[DEFAULT_LOCALE].strings[key] ?? key;
  }
  if (params) {
    value = value.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in params ? String(params[name]) : match,
    );
  }
  return value;
}

/** Render a structured game event as a localized line. */
export function formatEvent(event: GameEvent, nameOf: NameResolver): string {
  return locales[activeLocale].formatEvent(event, nameOf);
}

// ------------------------------------------------------------
// CARD COPY HELPERS — resolve catalog i18nKey → localized text.
// ------------------------------------------------------------

/** i18nKey base for a card type (e.g. "card.lavaCat"), from the shared catalog. */
function cardKey(type: CardType): string {
  const spec: (typeof CardSpecs)[CardType] | undefined = CARD_SPECS[type];
  return spec?.i18nKey ?? `card.${type}`;
}

export function cardName(type: CardType): string {
  return t(`${cardKey(type)}.name`);
}

export function cardDesc(type: CardType): string {
  return t(`${cardKey(type)}.desc`);
}

export function cardFlavor(type: CardType): string {
  return t(`${cardKey(type)}.flavor`);
}
