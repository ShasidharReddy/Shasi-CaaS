const root = document.documentElement;
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealElements = document.querySelectorAll('.reveal');
const terminalOutput = document.querySelector('#terminal-output');
const terminalCursor = document.querySelector('.terminal-cursor');
const yearNode = document.querySelector('#year');

const defaultTheme = localStorage.getItem('shasi-theme') || 'dark';
const terminalScript = [
  'booting shasi-technologies.platform',
  '',
  '[init] theme=macos-dark',
  '[init] modules=cloud,devops,infrastructure',
  '[auth] secure workspace ready',
  '',
  '$ platform capabilities --top',
  'cloud architecture | ci/cd automation | kubernetes | sre',
  '$ guides status',
  '6 document viewers available behind authenticated access',
  '$ echo "Operate beautifully."'
].join('\n');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('shasi-theme', theme);
}

applyTheme(defaultTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

function setMobileMenu(open) {
  if (!navToggle || !siteNav) return;
  navToggle.setAttribute('aria-expanded', String(open));
  siteNav.classList.toggle('is-open', open);
  body.classList.toggle('nav-open', open);
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    setMobileMenu(!expanded);
  });
  navLinks.forEach((link) => link.addEventListener('click', () => setMobileMenu(false)));
}

if (revealElements.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((element) => {
    if (element.classList.contains('visible')) return;
    revealObserver.observe(element);
  });
}

function typeTerminal(text, index = 0) {
  if (!terminalOutput) return;
  if (index < text.length) {
    terminalOutput.textContent += text.charAt(index);
    const delay = text.charAt(index) === '\n' ? 120 : 22;
    window.setTimeout(() => typeTerminal(text, index + 1), delay);
  } else if (terminalCursor) {
    terminalCursor.style.opacity = '1';
  }
}

window.addEventListener('load', () => {
  if (terminalOutput) {
    window.setTimeout(() => typeTerminal(terminalScript), 250);
  }
});

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}
