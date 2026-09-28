const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

const env = require('./config/environment');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const detectLanguage = require('./middleware/language.middleware');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const serviceRoutes = require('./routes/service.routes');
const articleRoutes = require('./routes/article.routes');
const consultationRoutes = require('./routes/consultation.routes');
const contactRoutes = require('./routes/contact.routes');
const notificationRoutes = require('./routes/notification.routes');
const settingsRoutes = require('./routes/settings.routes');
const homepageRoutes = require('./routes/homepage.routes');

const app = express();

// Security headers
app.use(helmet());

// CORS — locked to the configured Angular frontend origin, never "*" in production
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS.'));
    },
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Prevent NoSQL injection via query/body operator keys
app.use(mongoSanitize());

// Request logging
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// Global rate limiting
app.use('/api', generalLimiter);

// Detects the requested language (Accept-Language header, then ?lang=)
// and attaches req.lang ('en' | 'ar'). Used by public controllers to
// return flattened, localized content; admin controllers ignore it
// and always return both languages.
app.use('/api', detectLanguage);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', data: { timestamp: new Date().toISOString() } });
});

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', userRoutes);

app.use('/api/services', serviceRoutes.publicRouter);
app.use('/api/admin/services', serviceRoutes.adminRouter);

app.use('/api/articles', articleRoutes.publicRouter);
app.use('/api/admin/articles', articleRoutes.adminRouter);

app.use('/api/consultations', consultationRoutes.publicRouter);
app.use('/api/admin/consultations', consultationRoutes.adminRouter);

app.use('/api/contact', contactRoutes.publicRouter);
app.use('/api/admin/contact', contactRoutes.adminRouter);

app.use('/api/admin/notifications', notificationRoutes);

app.use('/api/settings', settingsRoutes.publicRouter);
app.use('/api/admin/settings', settingsRoutes.adminRouter);

app.use('/api/homepage', homepageRoutes.publicRouter);
app.use('/api/admin/homepage', homepageRoutes.adminRouter);

// 404 + centralized error handling (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
