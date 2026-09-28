const SiteSettings = require('../models/SiteSettings');
const catchAsync = require('../utils/catchAsync');
const { success } = require('../utils/apiResponse');
const cloudinaryService = require('../services/cloudinary.service');
const { localizeDocument } = require('../utils/localization');

const SINGLETON_FILTER = { singletonKey: 'site_settings' };

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne(SINGLETON_FILTER);
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return settings;
}

/**
 * GET /api/settings (public)
 * Returns flattened, localized content. Shared/technical fields
 * (phone numbers, email, whatsapp, urls) pass through unchanged.
 */
exports.getPublicSettings = catchAsync(async (req, res) => {
  const settings = await getOrCreateSettings();
  const localized = localizeDocument(settings, req.lang);
  return success(res, { message: 'Site settings retrieved successfully', data: { settings: localized } });
});

/**
 * GET /api/admin/settings
 * Admin always receives both languages in full.
 */
exports.getSettings = catchAsync(async (req, res) => {
  const settings = await getOrCreateSettings();
  return success(res, { message: 'Site settings retrieved successfully', data: { settings } });
});

/**
 * PUT /api/admin/settings
 * siteName and seo.defaultTitle/defaultDescription are bilingual.
 * contact.address is bilingual; phones/email/whatsapp remain shared,
 * though each phone's `label` is bilingual. workingHours entries have
 * a bilingual `day` plus shared `from`/`to` times. socialLinks are
 * fully shared/technical (platform + url).
 */
exports.updateSettings = catchAsync(async (req, res) => {
  const settings = await getOrCreateSettings();
  const { siteName, contact, workingHours, socialLinks, seo } = req.body;

  if (siteName) {
    if (siteName.en !== undefined) settings.siteName.en = siteName.en;
    if (siteName.ar !== undefined) settings.siteName.ar = siteName.ar;
  }

  if (contact) {
    if (contact.address) {
      if (contact.address.en !== undefined) settings.contact.address.en = contact.address.en;
      if (contact.address.ar !== undefined) settings.contact.address.ar = contact.address.ar;
    }
    // Phones are replaced wholesale when provided — each item may
    // include a bilingual `label` and a shared `number`.
    if (contact.phones !== undefined) settings.contact.phones = contact.phones;
    if (contact.email !== undefined) settings.contact.email = contact.email;
    if (contact.whatsapp !== undefined) settings.contact.whatsapp = contact.whatsapp;
  }

  // Working hours are replaced wholesale when provided — each entry
  // has a bilingual `day` plus shared `from`/`to`.
  if (workingHours !== undefined) settings.workingHours = workingHours;

  if (socialLinks !== undefined) settings.socialLinks = socialLinks;

  if (seo) {
    if (seo.defaultTitle) {
      if (seo.defaultTitle.en !== undefined) settings.seo.defaultTitle.en = seo.defaultTitle.en;
      if (seo.defaultTitle.ar !== undefined) settings.seo.defaultTitle.ar = seo.defaultTitle.ar;
    }
    if (seo.defaultDescription) {
      if (seo.defaultDescription.en !== undefined) settings.seo.defaultDescription.en = seo.defaultDescription.en;
      if (seo.defaultDescription.ar !== undefined) settings.seo.defaultDescription.ar = seo.defaultDescription.ar;
    }
  }

  if (req.file) {
    const newLogo = await cloudinaryService.replaceImage(req.file.buffer, settings.logo?.publicId, {
      folder: 'al-saiari-law/settings',
    });
    settings.logo = newLogo;
  }

  await settings.save();

  return success(res, { message: 'Site settings updated successfully', data: { settings } });
});
