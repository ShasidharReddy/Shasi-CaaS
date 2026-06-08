const jwt = require('jsonwebtoken');
const { findUserById } = require('./db');

const COOKIE_NAME = 'st_auth';
const JWT_SECRET = process.env.JWT_SECRET || 'shasi-technologies-dev-secret';

function readToken(req) {
  return req.cookies?.[COOKIE_NAME];
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function optionalAuth(req, res, next) {
  const token = readToken(req);
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = verifyToken(token);
    req.user = findUserById(payload.sub) || null;
  } catch (error) {
    req.user = null;
  }

  return next();
}

function resolveUser(req) {
  const token = readToken(req);
  if (!token) {
    return { error: 'Authentication required.' };
  }

  try {
    const payload = verifyToken(token);
    const user = findUserById(payload.sub);

    if (!user) {
      return { error: 'Invalid session.' };
    }

    return { user };
  } catch (error) {
    return { error: 'Session expired. Please sign in again.' };
  }
}

function requireAuth(req, res, next) {
  const result = resolveUser(req);
  if (result.error) {
    return res.status(401).json({ error: result.error });
  }

  req.user = result.user;
  return next();
}

function requirePageAuth(req, res, next) {
  const result = resolveUser(req);
  if (result.error) {
    return res.redirect('/login');
  }

  req.user = result.user;
  return next();
}

module.exports = {
  COOKIE_NAME,
  JWT_SECRET,
  optionalAuth,
  requireAuth,
  requirePageAuth
};
