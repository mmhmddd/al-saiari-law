const Homepage = require('../models/Homepage');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const cloudinaryService = require('../services/cloudinary.service');
const { localizeDocument } = require('../utils/localization');

const SINGLETON_FILTER = { singletonKey: 'homepage' };

async function getOrCreateHomepage() {
  let homepage = await Homepage.findOne(SINGLETON_FILTER);
  if (!homepage) {
    homepage = await Homepage.create({});
  }
  return homepage;
}

/**
 * GET /api/homepage (public)
 * Returns flattened, localized content based on req.lang.
 */
exports.getPublicHomepage = catchAsync(async (req, res) => {
  const homepage = await getOrCreateHomepage().then((doc) => doc.populate('featuredServices'));
  const localized = localizeDocument(homepage, req.lang);
  return success(res, { message: 'Homepage content retrieved successfully', data: { homepage: localized } });
});

/**
 * GET /api/admin/homepage
 * Admin always receives both languages in full.
 */
exports.getHomepage = catchAsync(async (req, res) => {
  const homepage = await getOrCreateHomepage().then((doc) => doc.populate('featuredServices'));
  return success(res, { message: 'Homepage content retrieved successfully', data: { homepage } });
});

/**
 * PUT /api/admin/homepage
 * Accepts JSON body sections with bilingual objects for title/
 * subtitle/description/buttonText; buttonLink and images are shared
 * across languages and updated separately (images via the dedicated
 * multipart endpoints below).
 */
exports.updateHomepage = catchAsync(async (req, res) => {
  const homepage = await getOrCreateHomepage();
  const { hero, about, featuredServices, cta } = req.body;

  if (hero) {
    if (hero.title) {
      if (hero.title.en !== undefined) homepage.hero.title.en = hero.title.en;
      if (hero.title.ar !== undefined) homepage.hero.title.ar = hero.title.ar;
    }
    if (hero.subtitle) {
      if (hero.subtitle.en !== undefined) homepage.hero.subtitle.en = hero.subtitle.en;
      if (hero.subtitle.ar !== undefined) homepage.hero.subtitle.ar = hero.subtitle.ar;
    }
    if (hero.buttonText) {
      if (hero.buttonText.en !== undefined) homepage.hero.buttonText.en = hero.buttonText.en;
      if (hero.buttonText.ar !== undefined) homepage.hero.buttonText.ar = hero.buttonText.ar;
    }
    if (hero.buttonLink !== undefined) homepage.hero.buttonLink = hero.buttonLink;
  }

  if (about) {
    if (about.title) {
      if (about.title.en !== undefined) homepage.about.title.en = about.title.en;
      if (about.title.ar !== undefined) homepage.about.title.ar = about.title.ar;
    }
    if (about.description) {
      if (about.description.en !== undefined) homepage.about.description.en = about.description.en;
      if (about.description.ar !== undefined) homepage.about.description.ar = about.description.ar;
    }
  }

  if (featuredServices !== undefined) homepage.featuredServices = featuredServices;

  if (cta) {
    if (cta.title) {
      if (cta.title.en !== undefined) homepage.cta.title.en = cta.title.en;
      if (cta.title.ar !== undefined) homepage.cta.title.ar = cta.title.ar;
    }
    if (cta.description) {
      if (cta.description.en !== undefined) homepage.cta.description.en = cta.description.en;
      if (cta.description.ar !== undefined) homepage.cta.description.ar = cta.description.ar;
    }
    if (cta.buttonText) {
      if (cta.buttonText.en !== undefined) homepage.cta.buttonText.en = cta.buttonText.en;
      if (cta.buttonText.ar !== undefined) homepage.cta.buttonText.ar = cta.buttonText.ar;
    }
    if (cta.buttonLink !== undefined) homepage.cta.buttonLink = cta.buttonLink;
  }

  await homepage.save();

  return success(res, { message: 'Homepage content updated successfully', data: { homepage } });
});

/**
 * PUT /api/admin/homepage/hero-image (multipart, field: image)
 */
exports.updateHeroImage = catchAsync(async (req, res, next) => {
  const homepage = await getOrCreateHomepage();

  if (!req.file) {
    return next(new AppError('No image file provided.', 400));
  }

  const newImage = await cloudinaryService.replaceImage(req.file.buffer, homepage.hero?.image?.publicId, {
    folder: 'al-saiari-law/homepage',
  });
  homepage.hero.image = newImage;
  await homepage.save();

  return success(res, { message: 'Hero image updated successfully', data: { homepage } });
});

/**
 * PUT /api/admin/homepage/about-image (multipart, field: image)
 */
exports.updateAboutImage = catchAsync(async (req, res, next) => {
  const homepage = await getOrCreateHomepage();

  if (!req.file) {
    return next(new AppError('No image file provided.', 400));
  }

  const newImage = await cloudinaryService.replaceImage(req.file.buffer, homepage.about?.image?.publicId, {
    folder: 'al-saiari-law/homepage',
  });
  homepage.about.image = newImage;
  await homepage.save();

  return success(res, { message: 'About image updated successfully', data: { homepage } });
});
