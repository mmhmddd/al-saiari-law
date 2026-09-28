const mongoose = require('mongoose');
const {
  localizedStringSchema,
  localizedTextSchema,
  localizedArraySchema,
} = require('./schemas/localized.schema');

const articleSchema = new mongoose.Schema(
  {
    title: localizedStringSchema({ maxlength: 200, required: true }),
    slug: localizedStringSchema(),
    excerpt: localizedStringSchema({ maxlength: 400 }),
    // Sanitized HTML from the rich text editor, independently per language.
    content: localizedTextSchema(),
    // Content label, not a system enum — bilingual like title/excerpt.
    category: localizedStringSchema(),
    tags: localizedArraySchema(),
    featuredImage: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // draft | published — kept as a simple string enum so that
    // scheduled/archived can be added later without restructuring.
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    seo: {
      metaTitle: localizedStringSchema({ maxlength: 70 }),
      metaDescription: localizedStringSchema({ maxlength: 160 }),
      keywords: localizedArraySchema(),
      canonicalUrl: localizedStringSchema(),
    },
  },
  { timestamps: true },
);

articleSchema.index({ 'slug.en': 1 }, { unique: true, sparse: true });
articleSchema.index({ 'slug.ar': 1 }, { unique: true, sparse: true });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({
  'title.en': 'text',
  'title.ar': 'text',
  'excerpt.en': 'text',
  'excerpt.ar': 'text',
  'content.en': 'text',
  'content.ar': 'text',
});

module.exports = mongoose.model('Article', articleSchema);
