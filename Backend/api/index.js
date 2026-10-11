const app = require('../src/app');
const connectDatabase = require('../src/config/database');
const ensureAdminAccount = require('../src/services/admin-seed.service');
const ensureWebsiteServices = require('../src/services/website-service-seed.service');

let initialization;

async function initialize() {
  if (!initialization) {
    initialization = connectDatabase()
      .then(async () => {
        await ensureAdminAccount();
        await ensureWebsiteServices();
      })
      .catch((error) => {
        initialization = undefined;
        throw error;
      });
  }
  await initialization;
}

module.exports = async (req, res) => {
  try {
    await initialize();
    return app(req, res);
  } catch (error) {
    console.error('[Vercel] API initialization failed:', error.message);
    return res.status(503).json({ success: false, message: 'API is temporarily unavailable.' });
  }
};
