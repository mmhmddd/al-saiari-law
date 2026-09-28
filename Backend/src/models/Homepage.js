const mongoose = require('mongoose');
const { localizedStringSchema, localizedTextSchema } = require('./schemas/localized.schema');

const homepageSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: 'homepage',
      unique: true,
    },
    hero: {
      title: localizedStringSchema(),
      subtitle: localizedTextSchema(),
      // Image and link are the same regardless of language.
      image: {
        url: { type: String, default: null },
        publicId: { type: String, default: null },
      },
      buttonText: localizedStringSchema(),
      buttonLink: { type: String, trim: true, default: '' },
    },
    about: {
      title: localizedStringSchema(),
      description: localizedTextSchema(),
      image: {
        url: { type: String, default: null },
        publicId: { type: String, default: null },
      },
    },
    featuredServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    cta: {
      title: localizedStringSchema(),
      description: localizedTextSchema(),
      buttonText: localizedStringSchema(),
      buttonLink: { type: String, trim: true, default: '' },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Homepage', homepageSchema);
