const jwt = require('jsonwebtoken');
const env = require('../config/environment');

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn },
  );
}

function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = { signToken, verifyToken };
