const nodemailer = require('nodemailer');
const env = require('../config/environment');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.secure,
    auth: {
      user: env.email.user,
      pass: env.email.password,
    },
  });

  return transporter;
}

/**
 * Generic send function. Never throws to the caller in a way that
 * would break a broader flow (e.g. consultation creation) — callers
 * that need "fire and forget" behavior should catch errors themselves.
 */
async function sendEmail({ to, subject, html, text }) {
  if (!env.email.user || !env.email.password) {
    // eslint-disable-next-line no-console
    console.warn('[Email] EMAIL_USER/EMAIL_PASSWORD not configured — skipping email send.');
    return { skipped: true };
  }

  const info = await getTransporter().sendMail({
    from: `"${env.email.fromName}" <${env.email.user}>`,
    to,
    subject,
    html,
    text,
  });

  return info;
}

function baseTemplate(title, bodyHtml) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
    <div style="background-color: #0b3d2e; padding: 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px;">${env.email.fromName}</h1>
    </div>
    <div style="padding: 24px; border: 1px solid #e5e5e5; border-top: none;">
      <h2 style="font-size: 18px; margin-top: 0;">${title}</h2>
      ${bodyHtml}
    </div>
    <p style="text-align: center; color: #999; font-size: 12px; margin-top: 16px;">
      This is an automated message from ${env.email.fromName}.
    </p>
  </div>`;
}

/**
 * Notifies the admin about a new consultation booking.
 * Fire-and-forget from the caller's perspective — errors are caught
 * internally and logged so a booking is never lost due to email failure.
 */
async function sendConsultationNotification(consultation) {
  if (!env.email.adminEmail) {
    // eslint-disable-next-line no-console
    console.warn('[Email] ADMIN_EMAIL not configured — skipping consultation notification email.');
    return;
  }

  const dashboardLink = `${env.clientUrl}/admin/consultations/${consultation._id}`;

  // `service` may be populated (a Service document with a bilingual
  // `title`), a bare ObjectId, or null — the admin email always shows
  // the English name (this internal email is not part of the public
  // bilingual CMS surface).
  const serviceLabel =
    consultation.service && consultation.service.title
      ? consultation.service.title.en || consultation.service.title.ar
      : 'Not specified';

  const html = baseTemplate(
    'New Consultation Request',
    `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr><td style="padding: 6px 0; font-weight: bold;">Name:</td><td>${escapeHtml(consultation.name)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${escapeHtml(consultation.phone)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Service:</td><td>${escapeHtml(serviceLabel)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Preferred Date:</td><td>${escapeHtml(consultation.preferredDate || 'Not specified')}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Preferred Time:</td><td>${escapeHtml(consultation.preferredTime || 'Not specified')}</td></tr>
      </table>
      <a href="${dashboardLink}" style="display: inline-block; padding: 10px 20px; background-color: #0b3d2e; color: #fff; text-decoration: none; border-radius: 4px;">View Consultation</a>
    `,
  );

  try {
    await sendEmail({
      to: env.email.adminEmail,
      subject: 'New Consultation Request',
      html,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Email] Failed to send consultation notification:', error.message);
  }
}

/**
 * Notifies the admin about a new contact message (optional, mirrors consultation flow).
 */
async function sendContactMessageNotification(contactMessage) {
  if (!env.email.adminEmail) return;

  const dashboardLink = `${env.clientUrl}/admin/contact/${contactMessage._id}`;

  const html = baseTemplate(
    'New Contact Message',
    `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
        <tr><td style="padding: 6px 0; font-weight: bold;">Name:</td><td>${escapeHtml(contactMessage.name)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Email:</td><td>${escapeHtml(contactMessage.email)}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${escapeHtml(contactMessage.phone || 'Not specified')}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Message:</td><td>${escapeHtml(contactMessage.message)}</td></tr>
      </table>
      <a href="${dashboardLink}" style="display: inline-block; padding: 10px 20px; background-color: #0b3d2e; color: #fff; text-decoration: none; border-radius: 4px;">View Message</a>
    `,
  );

  try {
    await sendEmail({
      to: env.email.adminEmail,
      subject: 'New Contact Message',
      html,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Email] Failed to send contact message notification:', error.message);
  }
}

/**
 * Sends the password reset email with a link to the Angular reset-password page.
 * This one DOES throw on failure — the caller (auth controller) should
 * decide how to respond (e.g. still return a generic success message).
 */
async function sendPasswordResetEmail(user, rawToken) {
  const resetLink = `${env.clientUrl}/reset-password/${rawToken}`;

  const html = baseTemplate(
    'Password Reset Request',
    `
      <p>Hello ${escapeHtml(user.name)},</p>
      <p>A password reset was requested for your account. If you did not request this, you can safely ignore this email.</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #0b3d2e; color: #fff; text-decoration: none; border-radius: 4px;">Reset Password</a>
      <p style="margin-top: 16px; font-size: 13px; color: #666;">This link will expire soon for your security.</p>
    `,
  );

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html,
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

module.exports = {
  sendEmail,
  sendConsultationNotification,
  sendContactMessageNotification,
  sendPasswordResetEmail,
};
