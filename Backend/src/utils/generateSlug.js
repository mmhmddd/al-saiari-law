const slugify = require('slugify');

// Arabic script Unicode block (covers standard Arabic letters + Arabic-Indic digits).
const ARABIC_RANGE = /[\u0600-\u06FF]/;

/**
 * Turns a title into a URL-safe slug.
 *
 * English/Latin titles use the `slugify` library as usual (lowercased,
 * hyphenated, punctuation stripped).
 *
 * Arabic titles are handled with a dedicated path: the `slugify`
 * library's default character map TRANSLITERATES Arabic into Latin
 * (e.g. "القانون التجاري" -> "alqanwn-altjary"), which is exactly the
 * "forcing English slugs for Arabic pages" behavior the spec forbids.
 * Instead, Arabic slugs keep the actual Arabic Unicode characters —
 * whitespace is collapsed to hyphens and punctuation is stripped, but
 * the Arabic letters themselves are preserved untouched.
 */
function slugifyTitle(title) {
  if (!title || typeof title !== 'string') return '';

  if (ARABIC_RANGE.test(title)) {
    return title
      .trim()
      // Strip anything that isn't a letter (Arabic or Latin), digit,
      // whitespace, or hyphen — this removes punctuation like "،", "؟", etc.
      // \p{L} matches letters in any script (including Arabic) with the 'u' flag.
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }

  return slugify(title, {
    lower: true,
    strict: true, // strips special chars
    trim: true,
  });
}

/**
 * Generates a unique slug for a Mongoose model's LOCALIZED slug field
 * (`slug.en` or `slug.ar`), appending -2, -3, ... until free.
 *
 * @param {import('mongoose').Model} Model
 * @param {string} title - source title (in the given language) to slugify
 * @param {'en'|'ar'} lang - which language's slug field to check uniqueness against
 * @param {string} [excludeId] - document id to exclude (for updates)
 */
async function generateUniqueSlug(Model, title, lang, excludeId = null) {
  const base = slugifyTitle(title) || 'item';
  const field = `slug.${lang}`;
  let slug = base;
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { [field]: slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    // eslint-disable-next-line no-await-in-loop
    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) {
      return slug;
    }
    slug = `${base}-${counter}`;
    counter += 1;
  }
}

module.exports = { slugifyTitle, generateUniqueSlug };
