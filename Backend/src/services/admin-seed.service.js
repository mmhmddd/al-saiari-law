const env = require('../config/environment');
const User = require('../models/User');
const { normalizeEmail } = require('validator');

/** Ensure the configured bootstrap administrator exists after Mongo connects. */
async function ensureAdminAccount() {
  const { name, email, password } = env.adminSeed;

  if (!name || !email || !password) {
    throw new Error('ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be configured to seed the administrator.');
  }
  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD must be at least 8 characters.');
  }

  // Match express-validator's normalizeEmail() used by registration/login.
  const normalizedEmail = normalizeEmail(email) || email.trim().toLowerCase();
  const existing = await User.findOne({
    email: { $in: [normalizedEmail, email.trim().toLowerCase()] },
  }).select('+password');
  if (existing) {
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
    if (changed) await existing.save();
    return { created: false };
  }

  await User.create({ name, email: normalizedEmail, password, role: 'admin', isActive: true });
  return { created: true };
}

module.exports = ensureAdminAccount;
