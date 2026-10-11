const Service = require('../models/Service');
const defaultServiceCatalog = require('../data/defaultServiceCatalog');

/**
 * Adds the built-in public website offerings to the CMS collection when they
 * are missing. Existing matching records, including admin edits, are preserved.
 */
async function ensureWebsiteServices() {
  let created = 0;

  for (const item of defaultServiceCatalog) {
    try {
      const result = await Service.updateOne(
        { $or: [{ 'slug.en': item.id }, { 'slug.ar': item.id }] },
        {
          $setOnInsert: {
            title: item.title,
            slug: { en: item.id, ar: item.id },
            shortDescription: item.shortDescription,
            description: item.description,
            image: { url: item.image, publicId: null },
            order: item.order,
            isActive: true,
          },
        },
        { upsert: true },
      );
      created += result.upsertedCount || 0;
    } catch (error) {
      // Another server instance may insert the same unique slug at startup.
      if (error.code !== 11000) throw error;
    }
  }

  if (created) console.log(`[Seed] Added ${created} built-in website services.`);
  return created;
}

module.exports = ensureWebsiteServices;
