const terminalOutput = document.querySelector('#terminal-output');
const terminalCursor = document.querySelector('.terminal-cursor');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealElements = document.querySelectorAll('.reveal');
const skillMeters = document.querySelectorAll('.skill-meter');
const yearNode = document.querySelector('#year');

const terminalScript = [
  'Welcome to shasi-cloud.dev',
  '',
  'login: shasidhar',
  'password: ********',
  '',
  'Last login: Sun Jun 8 09:46:46 2026',
  '[shasidhar@cloud ~]$ whoami',
  'Cloud & DevOps Engineer | 7+ Years | Microsoft',
  '[shasidhar@cloud ~]$ skills --top',
  'AWS Azure GCP Kubernetes Terraform Linux CI/CD',
  '[shasidhar@cloud ~]$ echo "Building modern cloud platforms"'
].join('\n');

function typeTerminal(text, index = 0) {
  if (!terminalOutput) return;

  if (index < text.length) {
    terminalOutput.textContent += text.charAt(index);
    const delay = text.charAt(index) === '\n' ? 120 : 30;
    window.setTimeout(() => typeTerminal(text, index + 1), delay);
  } else if (terminalCursor) {
    terminalCursor.style.opacity = '1';
  }
}

function setMobileMenu(open) {
  if (!navToggle || !siteNav) return;

  navToggle.setAttribute('aria-expanded', String(open));
  siteNav.classList.toggle('is-open', open);
  document.body.classList.toggle('nav-open', open);
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    setMobileMenu(!expanded);
  });

  navLinks.forEach((link) => link.addEventListener('click', () => setMobileMenu(false)));
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const meter = entry.target;
      const bar = meter.querySelector('i');

      if (bar) {
        bar.style.width = `${meter.dataset.level || 0}%`;
      }

      skillObserver.unobserve(meter);
    });
  },
  { threshold: 0.4 }
);

skillMeters.forEach((meter) => skillObserver.observe(meter));

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

window.addEventListener('load', () => {
  window.setTimeout(() => typeTerminal(terminalScript), 350);
});
