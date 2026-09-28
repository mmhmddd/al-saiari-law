const mongoose = require('mongoose');
const { localizedStringSchema } = require('./schemas/localized.schema');

const phoneSchema = new mongoose.Schema(
  {
    // Visible label ("Main Office" / "المكتب الرئيسي") — bilingual.
    label: localizedStringSchema({ maxlength: 60 }),
    // The number itself is shared — it doesn't change per language.
    number: { type: String, required: true, trim: true },
  },
  { _id: true },
);

const socialLinkSchema = new mongoose.Schema(
  {
    // Technical/system value — shared, not translated.
    platform: {
      type: String,
      required: true,
      enum: ['facebook', 'instagram', 'linkedin', 'youtube', 'x', 'tiktok', 'snapchat'],
    },
    url: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { _id: true },
);

const workingHourSchema = new mongoose.Schema(
  {
    // Visible label ("Sunday" / "الأحد") — bilingual.
    day: localizedStringSchema({ maxlength: 40, required: true }),
    // Times are not translatable content — shared, plain strings.
    from: { type: String, trim: true, default: '' },
    to: { type: String, trim: true, default: '' },
  },
  { _id: false },
);

const siteSettingsSchema = new mongoose.Schema(
  {
    // Singleton guard — always the same fixed value.
    singletonKey: {
      type: String,
      default: 'site_settings',
      unique: true,
    },
    siteName: localizedStringSchema({ maxlength: 150 }),
    logo: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    contact: {
      // Visible content — bilingual.
      address: localizedStringSchema({ maxlength: 300 }),
      // Technical/contact values — shared, not translated.
      phones: { type: [phoneSchema], default: [] },
      email: { type: String, trim: true, default: '' },
      whatsapp: { type: String, trim: true, default: '' },
    },
    workingHours: { type: [workingHourSchema], default: [] },
    socialLinks: { type: [socialLinkSchema], default: [] },
    seo: {
      defaultTitle: localizedStringSchema({ maxlength: 70 }),
      defaultDescription: localizedStringSchema({ maxlength: 160 }),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
