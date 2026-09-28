/**
 * i18n migration script.
 * Usage: npm run migrate:i18n
 *
 * Converts pre-i18n flat string fields (e.g. `title: "Corporate Law"`)
 * into the new bilingual shape (`title: { en: "Corporate Law", ar: "" }`)
 * across services, articles, homepage, site settings, notifications,
 * and consultations.
 *
 * SAFE & IDEMPOTENT:
 *  - Every field is checked before writing: if it is already in the
 *    new { en, ar } shape, it is left untouched. Running this script
 *    multiple times (including against an already-migrated database)
 *    is a no-op.
 *  - No Arabic content is ever invented. Old string values always
 *    become the `en` value; `ar` is always left as an empty string
 *    for a human translator to fill in later via the admin CMS.
 *  - This script talks to MongoDB via the raw driver (not the
 *    Mongoose models), because the *current* Mongoose schemas expect
 *    the new bilingual shape and would fail to cast old flat-string
 *    documents. Using the raw collection avoids that entirely.
 */
const mongoose = require('mongoose');
const env = require('../config/environment');

function isAlreadyLocalized(value) {
  return (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ('en' in value || 'ar' in value)
  );
}

/** Wraps a legacy flat string (or leaves an already-bilingual value alone). */
function toLocalizedString(value) {
  if (value === undefined || value === null) return { en: '', ar: '' };
  if (isAlreadyLocalized(value)) return { en: value.en || '', ar: value.ar || '' };
  return { en: String(value), ar: '' };
}

/** Wraps a legacy flat string array (or leaves an already-bilingual value alone). */
function toLocalizedArray(value) {
  if (value === undefined || value === null) return { en: [], ar: [] };
  if (isAlreadyLocalized(value)) {
    return { en: Array.isArray(value.en) ? value.en : [], ar: Array.isArray(value.ar) ? value.ar : [] };
  }
  if (Array.isArray(value)) return { en: value, ar: [] };
  return { en: [], ar: [] };
}

async function migrateServices(db) {
  const col = db.collection('services');
  const docs = await col.find({}).toArray();
  let migrated = 0;

  for (const doc of docs) {
    const needsMigration =
      !isAlreadyLocalized(doc.title) ||
      !isAlreadyLocalized(doc.slug) ||
      !isAlreadyLocalized(doc.shortDescription) ||
      !isAlreadyLocalized(doc.description) ||
      (doc.seo && (!isAlreadyLocalized(doc.seo.metaTitle) || !isAlreadyLocalized(doc.seo.metaDescription)));

    if (!needsMigration) continue;

    const update = {
      title: toLocalizedString(doc.title),
      slug: toLocalizedString(doc.slug),
      shortDescription: toLocalizedString(doc.shortDescription),
      description: toLocalizedString(doc.description),
      seo: {
        metaTitle: toLocalizedString(doc.seo && doc.seo.metaTitle),
        metaDescription: toLocalizedString(doc.seo && doc.seo.metaDescription),
      },
    };

    // eslint-disable-next-line no-await-in-loop
    await col.updateOne({ _id: doc._id }, { $set: update });
    migrated += 1;
  }

  return { total: docs.length, migrated };
}

async function migrateArticles(db) {
  const col = db.collection('articles');
  const docs = await col.find({}).toArray();
  let migrated = 0;

  for (const doc of docs) {
    const needsMigration =
      !isAlreadyLocalized(doc.title) ||
      !isAlreadyLocalized(doc.slug) ||
      !isAlreadyLocalized(doc.excerpt) ||
      !isAlreadyLocalized(doc.content) ||
      !isAlreadyLocalized(doc.category) ||
      !isAlreadyLocalized(doc.tags) ||
      (doc.seo &&
        (!isAlreadyLocalized(doc.seo.metaTitle) ||
          !isAlreadyLocalized(doc.seo.metaDescription) ||
          !isAlreadyLocalized(doc.seo.keywords) ||
          !isAlreadyLocalized(doc.seo.canonicalUrl)));

    if (!needsMigration) continue;

    const update = {
      title: toLocalizedString(doc.title),
      slug: toLocalizedString(doc.slug),
      excerpt: toLocalizedString(doc.excerpt),
      content: toLocalizedString(doc.content),
      category: toLocalizedString(doc.category),
      tags: toLocalizedArray(doc.tags),
      seo: {
        metaTitle: toLocalizedString(doc.seo && doc.seo.metaTitle),
        metaDescription: toLocalizedString(doc.seo && doc.seo.metaDescription),
        keywords: toLocalizedArray(doc.seo && doc.seo.keywords),
        canonicalUrl: toLocalizedString(doc.seo && doc.seo.canonicalUrl),
      },
    };

    // eslint-disable-next-line no-await-in-loop
    await col.updateOne({ _id: doc._id }, { $set: update });
    migrated += 1;
  }

  return { total: docs.length, migrated };
}

async function migrateHomepage(db) {
  const col = db.collection('homepages');
  const docs = await col.find({}).toArray();
  let migrated = 0;

  for (const doc of docs) {
    const hero = doc.hero || {};
    const about = doc.about || {};
    const cta = doc.cta || {};

    const needsMigration =
      !isAlreadyLocalized(hero.title) ||
      !isAlreadyLocalized(hero.subtitle) ||
      !isAlreadyLocalized(hero.buttonText) ||
      !isAlreadyLocalized(about.title) ||
      !isAlreadyLocalized(about.description) ||
      !isAlreadyLocalized(cta.title) ||
      !isAlreadyLocalized(cta.description) ||
      !isAlreadyLocalized(cta.buttonText);

    if (!needsMigration) continue;

    const update = {
      hero: {
        ...hero,
        title: toLocalizedString(hero.title),
        subtitle: toLocalizedString(hero.subtitle),
        buttonText: toLocalizedString(hero.buttonText),
      },
      about: {
        ...about,
        title: toLocalizedString(about.title),
        description: toLocalizedString(about.description),
      },
      cta: {
        ...cta,
        title: toLocalizedString(cta.title),
        description: toLocalizedString(cta.description),
        buttonText: toLocalizedString(cta.buttonText),
      },
    };

    // eslint-disable-next-line no-await-in-loop
    await col.updateOne({ _id: doc._id }, { $set: update });
    migrated += 1;
  }

  return { total: docs.length, migrated };
}

async function migrateSiteSettings(db) {
  const col = db.collection('sitesettings');
  const docs = await col.find({}).toArray();
  let migrated = 0;

  for (const doc of docs) {
    const contact = doc.contact || {};
    const seo = doc.seo || {};
    const oldPhones = Array.isArray(contact.phones) ? contact.phones : [];
    const oldWorkingHours = Array.isArray(doc.workingHours) ? doc.workingHours : [];

    const phonesNeedMigration = oldPhones.some((p) => !isAlreadyLocalized(p.label));
    const hoursNeedMigration = oldWorkingHours.some((h) => !isAlreadyLocalized(h.day) || 'hours' in h);

    const needsMigration =
      !isAlreadyLocalized(doc.siteName) ||
      !isAlreadyLocalized(contact.address) ||
      !isAlreadyLocalized(seo.defaultTitle) ||
      !isAlreadyLocalized(seo.defaultDescription) ||
      phonesNeedMigration ||
      hoursNeedMigration;

    if (!needsMigration) continue;

    const migratedPhones = oldPhones.map((p) => ({
      _id: p._id,
      label: toLocalizedString(p.label),
      number: p.number,
    }));

    // Old shape was { day: String, hours: String }. The single free-text
    // `hours` string (e.g. "9:00 AM - 5:00 PM" or "Closed") cannot be
    // safely split into structured from/to values automatically, so it
    // is preserved verbatim in the new `from` field and `to` is left
    // empty for the admin to tidy up — no data is discarded.
    const migratedHours = oldWorkingHours.map((h) => ({
      day: toLocalizedString(h.day),
      from: h.from !== undefined ? h.from : h.hours || '',
      to: h.to !== undefined ? h.to : '',
    }));

    const update = {
      siteName: toLocalizedString(doc.siteName),
      contact: {
        ...contact,
        address: toLocalizedString(contact.address),
        phones: migratedPhones,
      },
      workingHours: migratedHours,
      seo: {
        defaultTitle: toLocalizedString(seo.defaultTitle),
        defaultDescription: toLocalizedString(seo.defaultDescription),
      },
    };

    // eslint-disable-next-line no-await-in-loop
    await col.updateOne({ _id: doc._id }, { $set: update });
    migrated += 1;
  }

  return { total: docs.length, migrated };
}

async function migrateNotifications(db) {
  const col = db.collection('notifications');
  const docs = await col.find({}).toArray();
  let migrated = 0;

  for (const doc of docs) {
    const needsMigration = !isAlreadyLocalized(doc.title) || !isAlreadyLocalized(doc.message);
    if (!needsMigration) continue;

    const update = {
      title: toLocalizedString(doc.title),
      message: toLocalizedString(doc.message),
    };

    // eslint-disable-next-line no-await-in-loop
    await col.updateOne({ _id: doc._id }, { $set: update });
    migrated += 1;
  }

  return { total: docs.length, migrated };
}

/**
 * Consultations previously stored `service` as a free-text string
 * (e.g. "Corporate Law"). The new schema references an actual Service
 * document by ObjectId. A free-text name cannot be safely/automatically
 * matched to the right Service in every case, so this migration:
 *   1. Tries an exact, case-insensitive match against Service.title.en
 *      (and .ar, in case the old text happened to be Arabic).
 *   2. If a match is found, replaces `service` with that Service's
 *      ObjectId.
 *   3. If NO match is found, sets `service` to null (matching the new
 *      schema's default) and preserves the original text verbatim in
 *      a new `serviceLegacyText` field so nothing is silently lost —
 *      an admin can review and re-link it manually if needed. This
 *      field is intentionally outside the Mongoose schema (it is a
 *      migration safety net, not a feature) and can be removed later
 *      once reviewed.
 */
async function migrateConsultations(db) {
  const consultationsCol = db.collection('consultations');
  const servicesCol = db.collection('services');

  const [consultationDocs, serviceDocs] = await Promise.all([
    consultationsCol.find({}).toArray(),
    servicesCol.find({}).toArray(),
  ]);

  let migrated = 0;
  let unmatched = 0;

  for (const doc of consultationDocs) {
    if (typeof doc.service !== 'string') continue; // already migrated (ObjectId/null) — skip

    const text = doc.service.trim().toLowerCase();
    const match = serviceDocs.find((s) => {
      const en = s.title && isAlreadyLocalized(s.title) ? String(s.title.en || '').toLowerCase() : '';
      const ar = s.title && isAlreadyLocalized(s.title) ? String(s.title.ar || '').toLowerCase() : '';
      return en === text || ar === text;
    });

    let update;
    if (match) {
      update = { service: match._id };
      migrated += 1;
    } else {
      update = { service: null, serviceLegacyText: doc.service };
      unmatched += 1;
    }

    // eslint-disable-next-line no-await-in-loop
    await consultationsCol.updateOne({ _id: doc._id }, { $set: update });
  }

  return { total: consultationDocs.length, migrated, unmatched };
}

async function run() {
  await mongoose.connect(env.mongodbUri);
  const db = mongoose.connection.db;

  // eslint-disable-next-line no-console
  console.log('[Migrate i18n] Starting migration...\n');

  const results = {
    services: await migrateServices(db),
    articles: await migrateArticles(db),
    homepage: await migrateHomepage(db),
    siteSettings: await migrateSiteSettings(db),
    notifications: await migrateNotifications(db),
    consultations: await migrateConsultations(db),
  };

  // eslint-disable-next-line no-console
  console.log('===== i18n Migration Results =====');
  Object.entries(results).forEach(([name, result]) => {
    // eslint-disable-next-line no-console
    console.log(
      `${name}: ${result.migrated}/${result.total} document(s) migrated` +
        (result.unmatched !== undefined ? ` (${result.unmatched} consultation(s) left unlinked — see serviceLegacyText)` : ''),
    );
  });
  // eslint-disable-next-line no-console
  console.log('\n[Migrate i18n] Done. Safe to re-run at any time.');

  await mongoose.disconnect();
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('[Migrate i18n] Failed:', err.message);
    process.exit(1);
  });
