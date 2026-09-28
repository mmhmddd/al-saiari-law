const mongoose = require('mongoose');

/**
 * Central place for all i18n constants and logic. Every bilingual
 * field in the database is stored as { en: String, ar: String } (or
 * { en: [...], ar: [...] } for arrays). This module is the ONLY place
 * that knows how to pick a language out of that shape and fall back
 * safely — controllers should never inline this logic themselves.
 */

const SUPPORTED_LANGUAGES = ['en', 'ar'];
const DEFAULT_LANGUAGE = 'en';

/**
 * Validates a language code against the supported list.
 * Anything unsupported (or missing) safely falls back to 'en'.
 */
function resolveLanguage(candidate) {
  if (!candidate) return DEFAULT_LANGUAGE;
  const normalized = String(candidate).toLowerCase().trim();
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : DEFAULT_LANGUAGE;
}

/**
 * True if `value` looks like a bilingual field, i.e. a plain object
 * whose only keys are (a subset of) the supported language codes.
 * Guards against matching ObjectIds, Dates, or arbitrary subdocuments.
 */
function isLocalizedField(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  if (value instanceof Date) return false;
  if (value instanceof mongoose.Types.ObjectId) return false;
  if (typeof value.toHexString === 'function') return false; // ObjectId-like

  const keys = Object.keys(value);
  if (keys.length === 0) return false;
  return keys.every((k) => SUPPORTED_LANGUAGES.includes(k));
}

/**
 * Extracts the value for `lang` out of a { en, ar } field, falling
 * back to English when the requested language is missing or empty
 * (empty string / empty array). Never returns null/undefined for a
 * field that has at least one populated language.
 */
function getLocalizedValue(value, lang = DEFAULT_LANGUAGE) {
  if (value === null || value === undefined) return value;
  if (!isLocalizedField(value)) return value; // not actually a localized field — pass through

  const safeLang = resolveLanguage(lang);
  const chosen = value[safeLang];
  const fallback = value[DEFAULT_LANGUAGE];

  if (Array.isArray(chosen)) {
    return chosen.length > 0 ? chosen : fallback || [];
  }
  if (typeof chosen === 'string') {
    return chosen.trim() !== '' ? chosen : fallback || '';
  }
  return chosen !== undefined && chosen !== null ? chosen : fallback;
}

/**
 * Deeply walks a plain object/array (the result of .toObject() or
 * .lean() on a Mongoose document) and replaces every bilingual field
 * with its localized value for `lang`. Non-localized fields (ids,
 * dates, booleans, numbers, shared strings, nested subdocuments) are
 * left untouched. This is what public controllers use to turn a
 * full bilingual document into the flat shape the Angular frontend
 * consumes directly (e.g. `service.title` instead of `service.title.en`).
 */
function localizeDocument(input, lang = DEFAULT_LANGUAGE) {
  const safeLang = resolveLanguage(lang);

  function walk(value) {
    if (value === null || value === undefined) return value;

    if (value instanceof mongoose.Types.ObjectId) return value.toString();
    if (value instanceof Date) return value;
    if (typeof value.toHexString === 'function') return value.toString();

    if (Array.isArray(value)) {
      return value.map((item) => walk(item));
    }

    if (typeof value === 'object') {
      if (isLocalizedField(value)) {
        return getLocalizedValue(value, safeLang);
      }
      const result = {};
      Object.keys(value).forEach((key) => {
        result[key] = walk(value[key]);
      });
      return result;
    }

    return value;
  }

  if (input === null || input === undefined) return input;

  // Accept Mongoose documents, plain objects, or arrays of either.
  const plain = typeof input.toObject === 'function' ? input.toObject() : input;
  if (Array.isArray(plain)) {
    return plain.map((doc) => walk(typeof doc.toObject === 'function' ? doc.toObject() : doc));
  }
  return walk(plain);
}

module.exports = {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  resolveLanguage,
  isLocalizedField,
  getLocalizedValue,
  localizeDocument,
};
