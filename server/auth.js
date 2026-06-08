const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserById } = require('./db');
const { COOKIE_NAME, JWT_SECRET, requireAuth } = require('./middleware');

const router = express.Router();

function issueSession(res, user) {
  const token = jwt.sign(
    { email: user.email, role: user.role },
    JWT_SECRET,
    { subject: String(user.id), expiresIn: '7d' }
  );

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
}

function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    created_at: user.created_at
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/register', async (req, res) => {
  try {
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (username.length < 3 || username.length > 40) {
      return res.status(400).json({ error: 'Username must be between 3 and 40 characters.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Enter a valid email address.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    if (findUserByEmail(email)) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const user = createUser({ username, email, password_hash });
    issueSession(res, user);

    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to register at the moment.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const user = findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    issueSession(res, user);
    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to sign in at the moment.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  return res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  const user = findUserById(req.user.id);
  return res.json({ user: sanitizeUser(user) });
});

module.exports = router;
