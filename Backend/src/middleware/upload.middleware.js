const multer = require('multer');
const AppError = require('../utils/AppError');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new AppError('Only JPEG, PNG, WEBP, and GIF image formats are allowed.', 400));
  }
  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

// Wraps multer's single-file middleware so file-size / type errors
// flow through the central error handler with our standard format.
function uploadSingleImage(fieldName) {
  const handler = upload.single(fieldName);
  return (req, res, next) => {
    handler(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('Image file is too large. Maximum size is 5MB.', 400));
        }
        return next(new AppError(`Upload error: ${err.message}`, 400));
      }
      if (err) return next(err);
      // Multipart fields arrive as strings. CMS clients send nested
      // localized fields as JSON strings alongside the uploaded image.
      for (const [key, value] of Object.entries(req.body || {})) {
        if (typeof value !== 'string') continue;
        const trimmed = value.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try { req.body[key] = JSON.parse(trimmed); } catch { /* Keep malformed values for normal validation. */ }
        }
      }
      return next();
    });
  };
}

module.exports = { uploadSingleImage };
