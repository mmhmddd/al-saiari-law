# Al Saiari Law Firm — Backend (CMS & REST API)

Production-ready backend for the Al Saiari Law Firm website and admin CMS. Built with Node.js, Express, MongoDB/Mongoose, JWT authentication, Cloudinary for media, and Gmail SMTP for transactional email. Fully bilingual (English/Arabic). Designed to be consumed by an Angular 17 frontend.

## 1. Project Overview

This backend powers:

- Public website content: services, articles/blog, homepage, site settings, SEO metadata — all bilingual (English + Arabic)
- Admin CMS: full CRUD for all content types, rich-text article management with independent per-language HTML sanitization, Cloudinary image management
- Lead capture: consultation bookings (linked to an actual Service record) and contact messages, with internal dashboard notifications and admin email alerts
- Authentication: JWT-based login, registration, forgot/reset password, change password
- Role-based authorization: `admin` and `user` roles

## 2. Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) authentication
- bcryptjs for password hashing
- Cloudinary for image/media storage
- Nodemailer (Gmail SMTP) for email
- express-validator for input validation
- isomorphic-dompurify for HTML sanitization (run independently per language)
- helmet, cors, express-rate-limit, express-mongo-sanitize for security

## 3. Internationalization (i18n)

The backend supports **English (`en`)** and **Arabic (`ar`)** as first-class content languages.

**How it works:**

- Every piece of translatable website content (service/article titles, descriptions, rich HTML content, SEO fields, homepage copy, site name, working-hour labels, system-generated notification text) is stored in MongoDB as a bilingual object: `{ en: "...", ar: "..." }` (or `{ en: [...], ar: [...] }` for lists like tags/keywords).
- Technical/system fields (`_id`, `createdAt`, `isActive`, `order`, `status`, `author`, image URLs, phone numbers, emails, social platform/url) are **not** duplicated — they remain plain, shared fields.
- A single reusable schema helper (`src/models/schemas/localized.schema.js`) defines the bilingual shape everywhere it's needed, instead of it being hand-written per model.
- A single reusable utility (`src/utils/localization.js`) is the only place that knows how to pick a language out of a bilingual field, with safe fallback — controllers never inline this logic.

**Requesting a language:**

- Primary mechanism: the `Accept-Language` HTTP header (e.g. `Accept-Language: ar`, or a full browser-style value like `ar-EG,ar;q=0.9,en;q=0.8` — only the first tag's base language is used).
- Fallback mechanism: a `?lang=ar` query parameter, used only if no valid `Accept-Language` header is present.
- Supported values: `en`, `ar`. Anything else (e.g. `fr`) safely falls back to `en` — it can never break the API or leak an error.
- Default language (no header, no query param): `en`.

**Public API response shape** — flattened and localized (ready to render directly, no `.en`/`.ar` mapping needed in Angular):

```json
GET /api/services
Accept-Language: ar

{
  "success": true,
  "data": {
    "items": [
      { "_id": "...", "title": "القانون التجاري", "shortDescription": "خدمات قانونية للشركات...", "slug": "القانون-التجاري" }
    ]
  }
}
```

**Admin API response shape** — always both languages, so the CMS can edit them independently:

```json
GET /api/admin/services/:id
(no language header needed — admin always gets both)

{
  "success": true,
  "data": {
    "service": {
      "title": { "en": "Corporate Law", "ar": "القانون التجاري" },
      "slug": { "en": "corporate-law", "ar": "القانون-التجاري" }
    }
  }
}
```

**Missing-translation fallback:** if a requested language's value is empty (e.g. `title.ar` hasn't been filled in yet), the **public** API automatically falls back to the English value rather than returning blank/broken content. The **admin** API never does this substitution — it always shows exactly what's stored (including the empty string), so the admin can see at a glance what still needs translating.

**Localized slugs:** services and articles have a separate slug per language (`slug.en`, `slug.ar`). Arabic slugs keep real Arabic Unicode characters (e.g. `القانون-التجاري`) rather than being transliterated into Latin — public detail endpoints (`GET /api/services/:slug`, `GET /api/articles/:slug`) resolve against either language's slug field.

**What is NOT bilingual (by design):**

- User accounts, contact messages, and consultation `name`/`phone`/`preferredDate`/`preferredTime` are user-submitted data — stored and returned exactly as entered, never auto-translated or duplicated.
- Consultation `service` is a reference (`ObjectId`) to the actual Service document, not a translated string — this guarantees the requested service name is always consistent with the CMS and can be rendered in whichever language the frontend is currently using (`service.title` in the localized populated response).
- Cloudinary images, phone numbers, emails, WhatsApp numbers, and URLs are shared across languages.

**Frontend responsibility:** static UI strings (buttons, navigation, "Login", "Submit", "Read More", etc.) are translated entirely within Angular using its own i18n system. This backend is only responsible for **dynamic CMS content** (services, articles, homepage, site settings, SEO, notifications).

**Migrating existing data:** see [§11 Admin Seed & Migration](#11-admin-seed--migration) below — `npm run migrate:i18n` safely converts any pre-i18n records (flat strings) into the new bilingual shape without inventing Arabic translations or touching already-migrated data.

## 4. Requirements

- Node.js 18+
- npm
- A MongoDB database (local or Atlas)
- A Cloudinary account
- A Gmail account with an **App Password** (not your regular Gmail password)

## 5. Installation

```bash
npm install
```

## 6. Environment Setup

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

Environment variables:

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port the server listens on |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `RESET_TOKEN_EXPIRES_MINUTES` | Password reset token expiry in minutes |
| `EMAIL_HOST` | SMTP host, default `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port, default `465` |
| `EMAIL_SECURE` | `true` for port 465 |
| `EMAIL_USER` | Gmail address used to send email |
| `EMAIL_PASSWORD` | Gmail **App Password** |
| `EMAIL_FROM_NAME` | Display name on outgoing emails |
| `ADMIN_EMAIL` | Address that receives consultation/contact notifications (also used as the seeded admin's login email) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Angular frontend origin (used for CORS and email links) |
| `RATE_LIMIT_WINDOW_MINUTES` | Rate-limit window |
| `RATE_LIMIT_MAX` | Max requests per window per IP |
| `ADMIN_NAME` | Used only by `npm run seed:admin` |
| `ADMIN_PASSWORD` | Used only by `npm run seed:admin` |

**Never commit `.env`.** It is already excluded via `.gitignore`.

## 7. MongoDB Setup

- Local: install MongoDB Community Server and use `mongodb://127.0.0.1:27017/al_saiari_law`
- Atlas: create a free cluster, create a database user, whitelist your IP, and copy the connection string into `MONGODB_URI`

The app will fail to start with a clear error if `MONGODB_URI` is missing, and will exit gracefully if the initial connection fails.

## 8. Cloudinary Setup

1. Create a free account at cloudinary.com
2. From the dashboard, copy **Cloud Name**, **API Key**, and **API Secret** into `.env`
3. No further configuration is required — the backend uploads directly via the Cloudinary SDK using in-memory file buffers (no local disk storage of uploads). Images are shared across languages (not duplicated per language).

## 9. Email Setup (Gmail)

1. Enable 2-Step Verification on the Gmail account
2. Generate an **App Password**: Google Account → Security → App Passwords
3. Set `EMAIL_USER` to the Gmail address and `EMAIL_PASSWORD` to the generated App Password
4. Set `ADMIN_EMAIL` to the address that should receive consultation/contact alerts

If email credentials are not configured, the server will still run — email sending is skipped with a warning logged, and the primary action (e.g. saving a consultation) always still succeeds.

## 10. Running the Server

Development (auto-restart on file changes):

```bash
npm run dev
```

Production:

```bash
npm start
```

## Deploying to Vercel

Deploy the frontend and backend as two Vercel projects from this repository:

1. Create the frontend project with **Root Directory** `Frontend`. Keep the build command `npm run build` and output directory `dist/al-saiari/browser` (these are also set in `Frontend/vercel.json`). Production builds use the production API URL in `Frontend/src/environments/environment.prod.ts`.
2. Create the backend project with **Root Directory** `Backend`. `Backend/api/index.js` exposes the Express app as a Vercel Function and `Backend/vercel.json` routes requests to it.
3. Add the variables from `Backend/.env.example` to the backend project's Vercel environment settings. Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` at minimum. Add Cloudinary credentials for image uploads and SMTP credentials for email notifications.
4. Set `CLIENT_URL` to `https://al-saiari-law.vercel.app`. To support preview deployments, add their exact origins as a comma-separated `CLIENT_URLS` value.
5. Redeploy both projects after changing environment variables.

The MongoDB Atlas network access rules must allow connections from Vercel. The API's health endpoint is `/api/health`.

## 11. Admin Seed & Migration

Create the first admin account (reads `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` from `.env`):

```bash
npm run seed:admin
```

Safe to re-run — it will not create a duplicate if an account with that email already exists (and will promote it to `admin` if it isn't already).

**If you have existing data from before bilingual support was added**, run the i18n migration once:

```bash
npm run migrate:i18n
```

This converts old flat-string fields (e.g. `title: "Corporate Law"`) into the new bilingual shape (`title: { en: "Corporate Law", ar: "" }`) across services, articles, homepage, site settings, and notifications. It never invents Arabic content — `ar` is always left empty for a human translator to fill in via the CMS. Consultations' old free-text `service` field is matched against existing services by exact name where possible; unmatched values are preserved verbatim in a `serviceLegacyText` field rather than being discarded. **The migration is idempotent** — already-migrated documents are left untouched, so it is always safe to run again.

## 12. API Documentation

See [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) for every endpoint: method, URL, auth requirements, request/response shapes, language handling, and errors.

Quick reference of top-level API groups:

```
/api/auth
/api/admin/users
/api/services            (public)      /api/admin/services       (admin)
/api/articles             (public)      /api/admin/articles       (admin)
/api/consultations        (public POST) /api/admin/consultations  (admin)
/api/contact              (public POST) /api/admin/contact        (admin)
/api/admin/notifications  (admin)
/api/settings             (public)      /api/admin/settings       (admin)
/api/homepage             (public)      /api/admin/homepage       (admin)
/api/health
```

## 13. Project Structure

```
al-saiari-law-backend/
├── src/
│   ├── config/            # environment, database, cloudinary
│   ├── models/
│   │   ├── schemas/        # reusable localized (bilingual) sub-schemas
│   │   └── *.js             # Mongoose schemas
│   ├── controllers/        # request handlers
│   ├── routes/              # Express routers
│   ├── middleware/         # auth, roles, validation, upload, errors, rate limiting, language detection
│   ├── services/            # cloudinary, email, auth (JWT), notifications
│   ├── validators/          # express-validator rule sets (bilingual-aware)
│   ├── utils/                # apiResponse, AppError, catchAsync, slugs, sanitization, localization
│   ├── scripts/
│   │   ├── seedAdmin.js
│   │   └── migrateI18n.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── API_DOCUMENTATION.md
```

## 14. Security Notes

- All secrets are read from environment variables — nothing is hardcoded
- Passwords are hashed with bcrypt (cost factor 12); plain-text passwords are never stored or logged
- JWTs are required for all admin endpoints; role checks prevent `user` accounts from reaching admin-only routes
- Public registration always creates `role: user` — admin accounts can only be created by an existing admin (via `/api/admin/users`) or the seed script
- Password reset tokens are stored as SHA-256 hashes with an expiry; the raw token is only ever emailed, never persisted
- `forgot-password` always returns a generic response regardless of whether the email exists
- Article HTML content is sanitized server-side with DOMPurify **independently for both `content.en` and `content.ar`** before being stored — scripts, event handlers, and disallowed tags/attributes are stripped from both; Arabic Unicode text itself is never altered or destroyed
- An unsupported `Accept-Language` value can never break the API — it is validated against a strict allow-list (`en`, `ar`) and safely falls back to `en`
- Helmet sets standard security headers; CORS is restricted to `CLIENT_URL` (never `*`); `express-mongo-sanitize` strips Mongo operator injection attempts from input
- Rate limiting is applied globally, with a stricter limiter on login/forgot-password
- Centralized error handling never leaks stack traces or internal details when `NODE_ENV=production`
- Deleting/demoting/deactivating the last active admin account is blocked
