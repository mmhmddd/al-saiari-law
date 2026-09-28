// Role-based authorization lives alongside authentication in
// auth.middleware.js (both need the same req.user contract).
// This file re-exports it so the project structure matches the spec
// and imports can read `require('../middleware/role.middleware')`.
const { authorize } = require('./auth.middleware');

module.exports = { authorize };
