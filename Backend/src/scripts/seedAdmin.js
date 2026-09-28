/**
 * Secure admin seed script.
 * Usage: npm run seed:admin
 *
 * Reads ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD from environment
 * variables (.env) — never hardcode credentials here. If an admin
 * with that email already exists, no duplicate is created.
 */
const mongoose = require('mongoose');
const env = require('../config/environment');
const User = require('../models/User');
const { normalizeEmail } = require('validator');

async function seedAdmin() {
  const { name, email, password } = env.adminSeed;

  if (!name || !email || !password) {
    // eslint-disable-next-line no-console
    console.error(
      '[Seed] Missing ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD in your .env file. Aborting.',
    );
    process.exit(1);
  }

  if (password.length < 8) {
    // eslint-disable-next-line no-console
    console.error('[Seed] ADMIN_PASSWORD must be at least 8 characters. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(env.mongodbUri);

  const normalizedEmail = normalizeEmail(email) || email.trim().toLowerCase();
  const existing = await User.findOne({
    email: { $in: [normalizedEmail, email.trim().toLowerCase()] },
  }).select('+password');
  if (existing) {
    // eslint-disable-next-line no-console
    console.log(`[Seed] A user with email "${email}" already exists. No duplicate created.`);
    let changed = false;
    if (existing.email !== normalizedEmail) {
      existing.email = normalizedEmail;
      changed = true;
    }
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      changed = true;
    }
    if (!existing.isActive) {
      existing.isActive = true;
      changed = true;
    }
    if (!(await existing.comparePassword(password))) {
      existing.password = password;
      changed = true;
    }
    if (changed) {
      await existing.save();
      // eslint-disable-next-line no-console
      console.log('[Seed] Existing account was updated to the configured active admin account.');
    }
    await mongoose.disconnect();
    return;
  }

  await User.create({
    name,
    email: normalizedEmail,
    password,
    role: 'admin',
    isActive: true,
  });

  // eslint-disable-next-line no-console
  console.log(`[Seed] Admin account created successfully for ${email}.`);
  await mongoose.disconnect();
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('[Seed] Failed to seed admin:', err.message);
    process.exit(1);
  });
