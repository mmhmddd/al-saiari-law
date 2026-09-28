const mongoose = require('mongoose');
const env = require('./environment');

/**
 * Connects to MongoDB. Fails gracefully: logs a clear error and exits
 * the process rather than letting the app run without a database.
 */
async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(env.mongodbUri, {
      // Modern Mongoose (6+/8+) does not need most legacy options,
      // but these are harmless and explicit about intent.
      autoIndex: !env.isProduction,
    });

    // eslint-disable-next-line no-console
    console.log(`[MongoDB] Connected: ${mongoose.connection.host}`);

    mongoose.connection.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('[MongoDB] Connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      // eslint-disable-next-line no-console
      console.warn('[MongoDB] Disconnected');
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[MongoDB] Initial connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
