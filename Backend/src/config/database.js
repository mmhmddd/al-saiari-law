const mongoose = require('mongoose');
const env = require('./environment');

/**
 * Connects to MongoDB. Fails gracefully: logs a clear error and exits
 * the process rather than letting the app run without a database.
 */
let connectionPromise;

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    mongoose.set('strictQuery', true);
    connectionPromise = mongoose.connect(env.mongodbUri, {
      autoIndex: !env.isProduction,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    }).then((connection) => {
      // eslint-disable-next-line no-console
      console.log(`[MongoDB] Connected: ${mongoose.connection.host}`);
      mongoose.connection.on('error', (err) => console.error('[MongoDB] Connection error:', err.message));
      mongoose.connection.on('disconnected', () => console.warn('[MongoDB] Disconnected'));
      return connection;
    }).catch((error) => {
      connectionPromise = undefined;
      console.error('[MongoDB] Initial connection failed:', error.message);
      throw error;
    });
  }
  return connectionPromise;
}

module.exports = connectDatabase;
