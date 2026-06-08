const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./auth');
const { requireAuth, requirePageAuth } = require('./middleware');

const app = express();
const bundledPublicDir = path.join(__dirname, 'public');
const sourcePublicDir = path.join(__dirname, '..', 'src');
const publicDir = fs.existsSync(bundledPublicDir) ? bundledPublicDir : sourcePublicDir;
const guideDir = path.join(publicDir, 'guides');

function sendPage(page) {
  return (req, res) => res.sendFile(path.join(publicDir, page));
}

function sendGuide(req, res) {
  const slug = String(req.params.slug || '').replace(/[^a-z0-9-]/g, '');
  const guideFile = path.join(guideDir, `${slug}.html`);

  if (!slug || !fs.existsSync(guideFile)) {
    return res.status(404).send('Guide not found');
  }

  return res.sendFile(guideFile);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.get('/', sendPage('index.html'));
app.get('/login', sendPage('login.html'));
app.get('/register', sendPage('register.html'));

app.get(['/dashboard', '/dashboard.html'], requirePageAuth, sendPage('dashboard.html'));
app.get(['/resources', '/resources/', '/resources.html', '/resources/guides', '/resources/guides/'], requirePageAuth, sendPage('resources.html'));
app.get(['/resources/guides/:slug', '/resources/guides/:slug.html', '/guides/:slug.html'], requirePageAuth, sendGuide);

app.use(express.static(publicDir));

app.get(/.*/, sendPage('index.html'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Shasi Technologies running on port ${PORT}`);
});
