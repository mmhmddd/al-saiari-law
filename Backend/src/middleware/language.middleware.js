const { resolveLanguage } = require('../utils/localization');

/**
 * Detects the requested language and attaches it as req.lang.
 * Priority: Accept-Language header (primary) -> ?lang= query param -> default 'en'.
 * Any unsupported/invalid value safely falls back to 'en' — this
 * never throws and never lets an arbitrary language code through.
 */
function detectLanguage(req, res, next) {
  let lang = null;

  const acceptHeader = req.headers['accept-language'];
  if (acceptHeader) {
    // Accept-Language can be a list like "ar-EG,ar;q=0.9,en;q=0.8" —
    // take the first (highest-priority) tag and its base language.
    const primaryTag = acceptHeader.split(',')[0].trim().split(';')[0].split('-')[0].toLowerCase();
    if (primaryTag === 'en' || primaryTag === 'ar') {
      lang = primaryTag;
    }
  }

  if (!lang && req.query.lang) {
    const queryLang = String(req.query.lang).toLowerCase();
    if (queryLang === 'en' || queryLang === 'ar') {
      lang = queryLang;
    }
  }

  req.lang = resolveLanguage(lang);
  next();
}

module.exports = detectLanguage;
