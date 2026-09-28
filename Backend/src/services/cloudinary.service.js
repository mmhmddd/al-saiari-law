const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const AppError = require('../utils/AppError');

const DEFAULT_FOLDER = 'al-saiari-law';

/**
 * Uploads a file buffer (from multer memory storage) to Cloudinary.
 * @param {Buffer} buffer
 * @param {object} options - { folder }
 * @returns {Promise<{url: string, publicId: string}>}
 */
function uploadImage(buffer, { folder = DEFAULT_FOLDER } = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) {
          return reject(new AppError('Image upload to Cloudinary failed', 502));
        }
        return resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

/**
 * Deletes an image from Cloudinary by its publicId.
 * Never throws on "not found" — treats it as already deleted.
 */
async function deleteImage(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // Log but don't block the request — a stale Cloudinary asset
    // is not worth failing the user's operation over.
    // eslint-disable-next-line no-console
    console.error(`[Cloudinary] Failed to delete asset ${publicId}:`, error.message);
  }
}

/**
 * Replaces an existing image: uploads the new one, then deletes the old one.
 * @param {Buffer} buffer - new file buffer
 * @param {string|null} oldPublicId - publicId of the image being replaced
 * @param {object} options - { folder }
 */
async function replaceImage(buffer, oldPublicId, options = {}) {
  const uploaded = await uploadImage(buffer, options);
  if (oldPublicId) {
    await deleteImage(oldPublicId);
  }
  return uploaded;
}

module.exports = { uploadImage, deleteImage, replaceImage };
