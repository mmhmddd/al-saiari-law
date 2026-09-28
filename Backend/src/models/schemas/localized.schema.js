const mongoose = require('mongoose');
const { SUPPORTED_LANGUAGES } = require('../../utils/localization');

/**
 * Reusable bilingual field schemas. Use these instead of manually
 * redefining { en, ar } sub-schemas on every model.
 *
 * IMPORTANT Mongoose quirk these functions account for: a single
 * nested subdocument path (e.g. `title: someSchema`) is left fully
 * `undefined` by Mongoose unless the PARENT path itself is given a
 * default — the child fields' own `default: ''` never kicks in on
 * their own, and validators (like `required`) never even run against
 * an undefined subdocument. Every helper below therefore returns
 * `{ type: schema, default: () => ({}) }` rather than a bare schema,
 * so the subdocument always exists and its per-language fields (and
 * their `required` checks) behave as expected.
 *
 * localizedStringSchema(options) -> { en: String, ar: String }
 * localizedTextSchema()          -> like above, no maxlength, for long/HTML content
 * localizedArraySchema()         -> { en: [String], ar: [String] } (e.g. keywords/tags)
 */

function localizedStringSchema({ maxlength, required = false } = {}) {
  const fieldDef = {
    type: String,
    trim: true,
    default: '',
  };
  if (maxlength) fieldDef.maxlength = maxlength;

  const schemaDef = {};
  SUPPORTED_LANGUAGES.forEach((lang) => {
    schemaDef[lang] = { ...fieldDef };
    if (required) {
      schemaDef[lang].required = [true, `${lang.toUpperCase()} value is required`];
    }
  });

  const schema = new mongoose.Schema(schemaDef, { _id: false });
  return { type: schema, default: () => ({}) };
}

function localizedTextSchema() {
  const schemaDef = {};
  SUPPORTED_LANGUAGES.forEach((lang) => {
    schemaDef[lang] = { type: String, default: '' };
  });
  const schema = new mongoose.Schema(schemaDef, { _id: false });
  return { type: schema, default: () => ({}) };
}

function localizedArraySchema() {
  const schemaDef = {};
  SUPPORTED_LANGUAGES.forEach((lang) => {
    schemaDef[lang] = { type: [String], default: [] };
  });
  const schema = new mongoose.Schema(schemaDef, { _id: false });
  return { type: schema, default: () => ({}) };
}

module.exports = { localizedStringSchema, localizedTextSchema, localizedArraySchema };
