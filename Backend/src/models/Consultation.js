const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    // User-entered — kept exactly as submitted, never translated.
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      maxlength: 30,
    },
    // References the actual Service document rather than storing a
    // translated string, so the Angular frontend can display
    // service.title.en or service.title.ar depending on the active
    // language without risking duplicated/inconsistent service names.
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      default: null,
    },
    preferredDate: {
      type: String, // stored as provided (YYYY-MM-DD) — validated at the API layer
      trim: true,
      default: null,
    },
    preferredTime: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'completed', 'cancelled'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true },
);

consultationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Consultation', consultationSchema);
