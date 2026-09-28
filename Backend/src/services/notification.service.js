const Notification = require('../models/Notification');

/**
 * Creates an internal dashboard notification. Never throws in a way
 * that would break the caller's primary flow (e.g. saving a
 * consultation) — errors are caught and logged only.
 *
 * `title` and `message` are bilingual objects: { en, ar }. The
 * boilerplate wording itself is authored in both languages here
 * (system copy) — user-submitted data embedded within it (a name,
 * a service title already stored bilingually) is inserted as-is,
 * never auto-translated.
 */
async function createNotification({ type, title, message, referenceId, referenceType }) {
  try {
    return await Notification.create({ type, title, message, referenceId, referenceType });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Notification] Failed to create notification:', error.message);
    return null;
  }
}

/**
 * @param {object} consultation - a Consultation document, ideally with
 *   `service` populated (at least `title`) so the notification text
 *   can name the requested service in both languages.
 */
async function notifyNewConsultation(consultation) {
  const serviceTitleEn = consultation.service && consultation.service.title ? consultation.service.title.en : null;
  const serviceTitleAr = consultation.service && consultation.service.title ? consultation.service.title.ar : null;

  return createNotification({
    type: 'new_consultation',
    title: {
      en: 'New Consultation Request',
      ar: 'طلب استشارة جديد',
    },
    message: {
      en: `${consultation.name} requested a consultation${serviceTitleEn ? ` for ${serviceTitleEn}` : ''}.`,
      ar: `قام ${consultation.name} بطلب استشارة${serviceTitleAr ? ` بخصوص ${serviceTitleAr}` : ''}.`,
    },
    referenceId: consultation._id,
    referenceType: 'consultation',
  });
}

async function notifyNewContactMessage(contactMessage) {
  return createNotification({
    type: 'new_contact_message',
    title: {
      en: 'New Contact Message',
      ar: 'رسالة تواصل جديدة',
    },
    message: {
      en: `${contactMessage.name} sent a new contact message.`,
      ar: `أرسل ${contactMessage.name} رسالة تواصل جديدة.`,
    },
    referenceId: contactMessage._id,
    referenceType: 'contactMessage',
  });
}

module.exports = { createNotification, notifyNewConsultation, notifyNewContactMessage };
