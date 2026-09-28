const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordResetTokenHash: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving whenever it's modified
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Generates a raw reset token, stores only its SHA-256 hash + expiry.
userSchema.methods.createPasswordResetToken = function createPasswordResetToken(expiresMinutes) {
  const rawToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  this.passwordResetExpires = new Date(Date.now() + expiresMinutes * 60 * 1000);
  return rawToken;
};

userSchema.methods.clearPasswordResetToken = function clearPasswordResetToken() {
  this.passwordResetTokenHash = undefined;
  this.passwordResetExpires = undefined;
};

userSchema.methods.changedPasswordAfter = function changedPasswordAfter(jwtIssuedAtSeconds) {
  if (!this.passwordChangedAt) return false;
  const changedSeconds = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return jwtIssuedAtSeconds < changedSeconds;
};

// Never leak sensitive fields even if accidentally selected
userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetTokenHash;
  delete obj.passwordResetExpires;
  delete obj.passwordChangedAt;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
