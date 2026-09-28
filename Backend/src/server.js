const env = require('./config/environment');
const connectDatabase = require('./config/database');
const ensureAdminAccount = require('./services/admin-seed.service');
const app = require('./app');

let server;

async function start() {
  await connectDatabase();
  const admin = await ensureAdminAccount();
  // Never log the configured email or password at startup.
  console.log(`[Seed] Default admin ${admin.created ? 'created' : 'verified'} successfully.`);

  server = app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[Server] Al Saiari Law Backend running in ${env.nodeEnv} mode on port ${env.port}`);
  });
}

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('[Fatal] Unhandled Rejection:', err.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('[Fatal] Uncaught Exception:', err.message);
  process.exit(1);
});

start();
