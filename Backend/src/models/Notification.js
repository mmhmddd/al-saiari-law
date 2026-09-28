const mongoose = require('mongoose');
const { localizedStringSchema, localizedTextSchema } = require('./schemas/localized.schema');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['new_consultation', 'new_contact_message'],
      index: true,
    },
    // System-generated CMS-facing text — bilingual so the Angular
    // dashboard can display it in whichever language the admin is using.
    title: localizedStringSchema({ required: true }),
    message: localizedTextSchema(),
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    referenceType: {
      type: String,
      required: true,
      enum: ['consultation', 'contactMessage'],
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
