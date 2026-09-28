# API Documentation — Al Saiari Law Firm Backend

Base URL: `http://localhost:5000` (or your configured `PORT`)
All endpoints are prefixed with `/api`.

## Response Format

Success:
```json
{ "success": true, "message": "Operation completed successfully", "data": {} }
```

Error:
```json
{ "success": false, "message": "Something went wrong", "errors": [] }
```

Paginated list responses return:
```json
{
  "success": true,
  "message": "...",
  "data": {
    "items": [],
    "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
  }
}
```

## Authentication

Send the JWT in the `Authorization` header: `Authorization: Bearer <token>`

---

## Language Handling (i18n)

Supported languages: **`en`** (English), **`ar`** (Arabic). Default: **`en`**.

**How the language is chosen, per request:**
1. `Accept-Language` header (primary) — e.g. `Accept-Language: ar`, or a full value like `Accept-Language: ar-EG,ar;q=0.9,en;q=0.8` (only the first tag's base language is read).
2. `?lang=ar` query parameter (fallback, used only if no valid header is present).
3. Defaults to `en` if neither is present or valid.

Any unsupported code (`fr`, `de`, etc., from either mechanism) **safely falls back to `en`** — it never causes an error.

**Public endpoints** (no `/admin/` in the path) return content **flattened and localized** to the resolved language — ready to render directly in Angular with no `.en`/`.ar` mapping needed:

```http
GET /api/services
Accept-Language: ar
```
```json
{
  "success": true,
  "data": {
    "items": [
      { "_id": "...", "title": "القانون التجاري", "shortDescription": "خدمات قانونية للشركات...", "slug": "القانون-التجاري", "isActive": true, "order": 1 }
    ]
  }
}
```
```http
GET /api/services
Accept-Language: en
```
```json
{
  "success": true,
  "data": {
    "items": [
      { "_id": "...", "title": "Corporate Law", "shortDescription": "Legal services for businesses...", "slug": "corporate-law", "isActive": true, "order": 1 }
    ]
  }
}
```

**Fallback behavior:** if the resolved language's value is empty (e.g. no Arabic translation entered yet), the public API automatically returns the English value instead of blank content — content is never silently broken.

**Admin endpoints** (`/api/admin/...`) always return **both languages in full**, regardless of `Accept-Language`, so the CMS can edit `en` and `ar` independently:

```json
{
  "title": { "en": "Corporate Law", "ar": "القانون التجاري" },
  "slug": { "en": "corporate-law", "ar": "القانون-التجاري" }
}
```

The one exception is **notifications**: since these are read-only, system-generated dashboard messages (never edited by the admin), the admin notifications endpoints also localize to the resolved language rather than returning both — so the Angular admin dashboard's notification bell shows the message in whichever language the dashboard is currently using.

**Bilingual request bodies:** when creating/updating localized content, send the nested shape:
```json
{ "title": { "en": "Corporate Law", "ar": "القانون التجاري" } }
```
Primary CMS content (`title`, `shortDescription` on services; `title` on articles) requires **both** languages on create. Optional fields (`description`, SEO fields) allow either language to be empty.

**Localized slugs:** services and articles store a separate slug per language. Public detail endpoints resolve against *either* language's slug:
```
GET /api/articles/corporate-law              (matches slug.en)
GET /api/articles/القانون-التجاري            (matches slug.ar)
```
Both resolve to the same article; the response is still localized based on `Accept-Language`/`?lang=`, independent of which slug matched.

---

## 1. Auth — `/api/auth`

*(Not part of the bilingual CMS surface — request/response bodies here are unchanged by i18n.)*

### POST /api/auth/register
Auth: No
Body:
```json
{ "name": "John Doe", "email": "john@example.com", "password": "Password123", "passwordConfirm": "Password123" }
```
Response: `201` — `{ token, user }`. Always creates `role: "user"`.
Errors: `409` email already exists, `422` validation.

### POST /api/auth/login
Auth: No
Body: `{ "email": "admin@example.com", "password": "password123" }`
Response: `200` — `{ token, user }`
Errors: `401` invalid credentials, `403` account deactivated, `422` validation.

### POST /api/auth/logout
Auth: Yes
Response: `200` — logout confirmation (stateless JWT; client discards token).

### GET /api/auth/me
Auth: Yes
Response: `200` — `{ user }`

### PUT /api/auth/profile
Auth: Yes
Body: `{ "name"?: string, "email"?: string }`
Response: `200` — `{ user }`
Errors: `409` email in use.

### PUT /api/auth/change-password
Auth: Yes
Body: `{ "currentPassword", "newPassword", "confirmNewPassword" }`
Response: `200` — `{ token }` (new token issued)
Errors: `401` current password incorrect.

### POST /api/auth/forgot-password
Auth: No
Body: `{ "email" }`
Response: `200` — generic message, always the same regardless of whether the email exists.

### POST /api/auth/reset-password/:token
Auth: No
Body: `{ "password", "passwordConfirm" }`
Response: `200` — success message.
Errors: `400` invalid/expired token, `422` validation.

---

## 2. User Management (Admin) — `/api/admin/users`
All routes require: Auth Yes, Role: `admin`. Not part of the bilingual CMS surface.

### GET /api/admin/users
Query: `page`, `limit`, `search`, `role` (`admin`|`user`), `status` (`active`|`inactive`)
Response: `200` — paginated `{ items, pagination }`

### GET /api/admin/users/:id
Response: `200` — `{ user }` | `404`

### POST /api/admin/users
Body: `{ "name", "email", "password", "role"?, "isActive"? }`
Response: `201` — `{ user }`. Admins may create accounts with `role: "admin"`.

### PUT /api/admin/users/:id
Body: `{ "name"?, "email"?, "role"?, "isActive"? }`
Response: `200` — `{ user }`
Errors: `400` would remove last active admin, `409` email in use.

### DELETE /api/admin/users/:id
Response: `200` — success message.
Errors: `400` cannot delete self / would remove last active admin.

### PATCH /api/admin/users/:id/status
Body: `{ "isActive": boolean }`
Response: `200` — `{ user }`

### PATCH /api/admin/users/:id/role
Body: `{ "role": "admin" | "user" }`
Response: `200` — `{ user }`

---

## 3. Services — bilingual

### Public

**GET /api/services** — Auth: No. Returns active services, flattened + localized, sorted by `order`.
**GET /api/services/:slug** — Auth: No. `:slug` matches either `slug.en` or `slug.ar`. Returns one active service, localized. `404` if not found/inactive.

### Admin — `/api/admin/services` (Role: admin) — always both languages

**GET /api/admin/services** — Query: `page`, `limit`, `search`, `status` (`active`|`inactive`)

**POST /api/admin/services** — multipart/form-data, field `image` optional.
Body:
```json
{
  "title": { "en": "Corporate Law", "ar": "القانون التجاري" },
  "shortDescription": { "en": "Legal services for businesses.", "ar": "خدمات قانونية للشركات." },
  "description": { "en": "<p>...</p>", "ar": "<p>...</p>" },
  "icon": "gavel",
  "order": 1,
  "isActive": true,
  "seo": {
    "metaTitle": { "en": "...", "ar": "..." },
    "metaDescription": { "en": "...", "ar": "..." }
  }
}
```
`title.en`/`title.ar` and `shortDescription.en`/`shortDescription.ar` are **required**. A slug is generated independently per language from that language's title (Arabic slugs keep real Arabic characters). Response: `201` — `{ service }` (both languages).

**GET /api/admin/services/:id**

**PUT /api/admin/services/:id** — multipart/form-data, same fields (all optional), `image` optional (replaces existing, shared across languages). Only the language(s) you send are updated; the other is left untouched. A language's slug is only regenerated if that language's title changed.

**DELETE /api/admin/services/:id** — also removes the Cloudinary image.

**PATCH /api/admin/services/:id/status** — Body: `{ "isActive": boolean }`

**PATCH /api/admin/services/reorder** — Body: `{ "order": [{ "id": "...", "order": 1 }, ...] }` (technical field, not translated)

---

## 4. Articles / Blog — bilingual

### Public

**GET /api/articles** — Auth: No. Query: `page`, `limit`, `category`, `search`. Published only, flattened + localized. `category` filter matches either language's stored category value.
**GET /api/articles/:slug** — Auth: No. `:slug` matches either `slug.en` or `slug.ar`. `404` if not found/not published.

### Admin — `/api/admin/articles` (Role: admin) — always both languages

**GET /api/admin/articles** — Query: `page`, `limit`, `search`, `status`, `category`

**POST /api/admin/articles** — multipart/form-data, field `featuredImage` optional.
Body:
```json
{
  "title": { "en": "Understanding Corporate Law", "ar": "فهم القانون التجاري" },
  "excerpt": { "en": "A practical overview...", "ar": "نظرة عملية على..." },
  "content": { "en": "<h2>Heading</h2><p>...</p>", "ar": "<h2>عنوان</h2><p>...</p>" },
  "category": { "en": "Corporate Law", "ar": "القانون التجاري" },
  "tags": { "en": ["law", "corporate"], "ar": ["قانون", "تجاري"] },
  "status": "draft",
  "seo": {
    "metaTitle": { "en": "...", "ar": "..." },
    "metaDescription": { "en": "...", "ar": "..." },
    "keywords": { "en": ["..."], "ar": ["..."] },
    "canonicalUrl": { "en": "https://...", "ar": "https://..." }
  }
}
```
`title.en`/`title.ar` are **required**; everything else is optional per language. **Both `content.en` and `content.ar` are sanitized server-side independently** before saving — Arabic text itself is never altered, only unsafe tags/scripts/attributes are stripped from whichever language(s) you send. Response: `201` — `{ article }`.

**POST /api/admin/articles/upload-content-image** — multipart/form-data, field `image`. Uploads an image (shared across languages) to Cloudinary for use *inside* the article body in either language's editor pane. Returns `{ url, publicId }`.

**GET /api/admin/articles/:id**

**PUT /api/admin/articles/:id** — multipart/form-data, field `featuredImage` optional. Same body fields as create, all optional; only the language(s) sent are updated, and only `content` fields you send are re-sanitized.

**DELETE /api/admin/articles/:id** — also removes the featured image from Cloudinary.

**PATCH /api/admin/articles/:id/status** — Body: `{ "status": "draft"|"published"|"scheduled"|"archived" }` (technical field, not translated). Sets `publishedAt` the first time it becomes `published`.

---

## 5. Consultations

`service` is now a **reference to an actual Service document** (not free text), so the requested service is always consistent with the CMS and displayable in either language.

### POST /api/consultations (Public)
Body:
```json
{
  "name": "Jane Doe",
  "phone": "+201234567890",
  "service": "652f1f77bcf86cd799439011",
  "preferredDate": "2026-10-01",
  "preferredTime": "10:00 AM"
}
```
`name`, `phone`, `preferredDate`, `preferredTime` are user-submitted — stored exactly as entered, never translated. `service` is optional but, if provided, must be a valid Service `_id`.
Response: `201` — `{ consultation }`. Always saved to MongoDB first; a dashboard notification and admin email are dispatched afterward and never block or fail this response.

### Admin — `/api/admin/consultations` (Role: admin)

**GET /api/admin/consultations** — Query: `page`, `limit`, `status`, `service` (Service `_id`), `date`. `service` is populated with its bilingual `title` so the dashboard can render it in either language.
**GET /api/admin/consultations/:id** — `service` populated the same way.
**PATCH /api/admin/consultations/:id/status** — Body: `{ "status": "new"|"contacted"|"completed"|"cancelled" }`
**DELETE /api/admin/consultations/:id**

---

## 6. Contact Messages — not bilingual (user-generated content)

`name`, `email`, `phone`, `message` are stored and returned exactly as submitted, in whichever language the visitor wrote them — never duplicated or auto-translated.

### POST /api/contact (Public)
Body: `{ "name", "email", "phone"?, "message" }`
Response: `201` — `{ contactMessage }`

### Admin — `/api/admin/contact` (Role: admin)

**GET /api/admin/contact** — Query: `page`, `limit`, `status`, `search`
**GET /api/admin/contact/:id**
**PATCH /api/admin/contact/:id/status** — Body: `{ "status": "new"|"read"|"archived" }`
**DELETE /api/admin/contact/:id**

---

## 7. Notifications (Admin) — `/api/admin/notifications`
All routes: Auth Yes, Role: admin. **Localized** (not both-languages) based on `Accept-Language`/`?lang=`, since these are read-only system messages, never edited.

**GET /api/admin/notifications** — Query: `page`, `limit`, `isRead` (`true`|`false`). Returns flattened `title`/`message` in the resolved language.
**GET /api/admin/notifications/unread-count** — Response: `{ count }`
**PATCH /api/admin/notifications/:id/read** — Marks one notification read; returns it localized.
**PATCH /api/admin/notifications/read-all** — Marks all notifications read.
**DELETE /api/admin/notifications/:id**

Each notification includes `referenceId` and `referenceType` (`consultation` | `contactMessage`) so the Angular dashboard can navigate directly to the related record when clicked.

Example:
```http
GET /api/admin/notifications
Accept-Language: ar
```
```json
{ "title": "طلب استشارة جديد", "message": "قام Jane Doe بطلب استشارة بخصوص القانون التجاري." }
```

---

## 8. Site Settings — bilingual (partially)

### GET /api/settings (Public)
Returns the singleton settings document, flattened + localized (`siteName`, `contact.address`, phone `label`s, working-hour `day`s, `seo.defaultTitle/defaultDescription`). Phone numbers, email, WhatsApp number, and social URLs are shared/unchanged.

### Admin — `/api/admin/settings` (Role: admin) — always both languages

**GET /api/admin/settings**

**PUT /api/admin/settings** — multipart/form-data, field `logo` optional (shared, not per-language).
Body (all optional, merged per-section):
```json
{
  "siteName": { "en": "Al Saiari Law Firm", "ar": "مكتب السياري للمحاماة" },
  "contact": {
    "address": { "en": "Cairo, Egypt", "ar": "القاهرة، مصر" },
    "phones": [
      { "label": { "en": "Main Office", "ar": "المكتب الرئيسي" }, "number": "+20..." },
      { "label": { "en": "WhatsApp", "ar": "واتساب" }, "number": "+20..." }
    ],
    "email": "info@alsaiari.com",
    "whatsapp": "+20..."
  },
  "workingHours": [
    { "day": { "en": "Sunday", "ar": "الأحد" }, "from": "09:00", "to": "17:00" }
  ],
  "socialLinks": [{ "platform": "facebook", "url": "https://facebook.com/...", "isActive": true }],
  "seo": {
    "defaultTitle": { "en": "...", "ar": "..." },
    "defaultDescription": { "en": "...", "ar": "..." }
  }
}
```
`phones` and `workingHours` are replaced wholesale when provided. Supported `platform` values: `facebook`, `instagram`, `linkedin`, `youtube`, `x`, `tiktok`, `snapchat` (shared/technical, not translated). Phone numbers, email, whatsapp, and platform/url are shared across languages; only `label`/`address`/`day`/`siteName`/`seo.default*` are bilingual.

---

## 9. Homepage — bilingual (partially)

### GET /api/homepage (Public)
Returns the singleton homepage document, flattened + localized, with `featuredServices` populated and also localized (each service's own bilingual fields are flattened too).

### Admin — `/api/admin/homepage` (Role: admin) — always both languages

**GET /api/admin/homepage**

**PUT /api/admin/homepage** — JSON body (no file upload). Any of:
```json
{
  "hero": {
    "title": { "en": "Trusted Legal Representation", "ar": "تمثيل قانوني موثوق" },
    "subtitle": { "en": "...", "ar": "..." },
    "buttonText": { "en": "Book a Consultation", "ar": "احجز استشارة" },
    "buttonLink": "/consultation"
  },
  "about": {
    "title": { "en": "...", "ar": "..." },
    "description": { "en": "...", "ar": "..." }
  },
  "featuredServices": ["<serviceId>", "<serviceId>"],
  "cta": {
    "title": { "en": "...", "ar": "..." },
    "description": { "en": "...", "ar": "..." },
    "buttonText": { "en": "...", "ar": "..." },
    "buttonLink": "..."
  }
}
```
`buttonLink` and images are shared across languages (images updated via the dedicated endpoints below).

**PUT /api/admin/homepage/hero-image** — multipart/form-data, field `image`. Replaces the hero image on Cloudinary (shared, not per-language).
**PUT /api/admin/homepage/about-image** — multipart/form-data, field `image`. Replaces the about image on Cloudinary (shared, not per-language).

---

## 10. Health Check

### GET /api/health
Auth: No. Returns `200` with a timestamp — useful for uptime monitors and deployment checks. Not affected by language handling.

---

## Error Reference

| Status | Meaning |
|---|---|
| 400 | Bad request / business rule violation (e.g. last admin guard) |
| 401 | Missing/invalid/expired token, or invalid credentials |
| 403 | Authenticated but not authorized (wrong role, or account deactivated) |
| 404 | Resource or route not found |
| 409 | Conflict (duplicate email, duplicate field) |
| 422 | Validation failed — `errors` array contains `{ field, message }` per issue (e.g. `title.ar` missing) |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error (message is generic in production) |
| 502 | Upstream service failure (e.g. Cloudinary upload) |

Note: an unsupported `Accept-Language` value is **never** an error — it silently falls back to `en`.
