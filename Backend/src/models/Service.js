const mongoose = require('mongoose');
const { localizedStringSchema, localizedTextSchema } = require('./schemas/localized.schema');

const serviceSchema = new mongoose.Schema(
  {
    // Bilingual content — both languages required for primary CMS fields.
    title: localizedStringSchema({ maxlength: 150, required: true }),
    // Localized so Arabic and English pages can have different,
    // human-readable URLs while resolving to the same service.
    slug: localizedStringSchema(),
    shortDescription: localizedStringSchema({ maxlength: 300, required: true }),
    description: localizedTextSchema(),
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    icon: {
      type: String,
      default: null,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    seo: {
      metaTitle: localizedStringSchema({ maxlength: 70 }),
      metaDescription: localizedStringSchema({ maxlength: 160 }),
    },
  },
  { timestamps: true },
);

serviceSchema.index({ 'slug.en': 1 }, { unique: true, sparse: true });
serviceSchema.index({ 'slug.ar': 1 }, { unique: true, sparse: true });
serviceSchema.index({ order: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({
  'title.en': 'text',
  'title.ar': 'text',
  'shortDescription.en': 'text',
  'shortDescription.ar': 'text',
});

module.exports = mongoose.model('Service', serviceSchema);
