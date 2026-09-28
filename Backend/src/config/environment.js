require('dotenv').config();

/**
 * Central place for reading and validating environment variables.
 * No other file should read process.env directly for these values —
 * import them from here instead, so misconfiguration fails fast and loudly.
 */

const required = [
  'MONGODB_URI',
  'JWT_SECRET',
];

const missing = required.filter((key) => !process.env[key] || process.env[key].trim() === '');

if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line no-console
  console.error(
    `\n[FATAL] Missing required environment variables: ${missing.join(', ')}\n` +
      'Copy .env.example to .env and fill in real values before starting the server.\n',
  );
  process.exit(1);
}

const defaultClientUrl = process.env.CLIENT_URL || (process.env.NODE_ENV === 'production'
  ? 'https://al-saiari-law.vercel.app'
  : 'http://localhost:4200');
const productionFrontendOrigin = 'https://al-saiari-law.vercel.app';
function normalizeOrigin(value) {
  try { return new URL(value.trim()).origin; } catch { return null; }
}
const clientUrls = [...new Set([
  defaultClientUrl,
  productionFrontendOrigin,
  ...(process.env.CLIENT_URLS || '').split(',').map((url) => url.trim()).filter(Boolean),
].map(normalizeOrigin).filter(Boolean))];

function isAllowedClientOrigin(origin) {
  const normalized = normalizeOrigin(origin);
  if (clientUrls.includes(normalized)) return true;

  // Permit preview URLs belonging to this frontend's Vercel project only.
  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === 'https:' && hostname.startsWith('al-saiari-law-') && hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,

  mongodbUri: process.env.MONGODB_URI,

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  resetTokenExpiresMinutes: parseInt(process.env.RESET_TOKEN_EXPIRES_MINUTES, 10) || 30,

  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 465,
    secure: process.env.EMAIL_SECURE !== 'false',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    fromName: process.env.EMAIL_FROM_NAME || 'Al Saiari Law Firm',
    adminEmail: process.env.ADMIN_EMAIL,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  clientUrl: defaultClientUrl,
  clientUrls,
  isAllowedClientOrigin,

  rateLimit: {
    windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 15,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
  },

  adminSeed: {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },

  isProduction: process.env.NODE_ENV === 'production',
};
