const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const logoutButton = document.querySelector('#logout-button');
const formMessage = document.querySelector('#form-message');
const page = document.body.dataset.page;
const isProtectedPage = document.body.dataset.protected === 'true';
const dashboardTitle = document.querySelector('#dashboard-title');
const dashboardSubtitle = document.querySelector('#dashboard-subtitle');
const accountRole = document.querySelector('#account-role');
const guideButtons = document.querySelectorAll('.open-guide');
const guideFrame = document.querySelector('#guide-frame');
const viewerTitle = document.querySelector('#viewer-title');
const viewerLink = document.querySelector('#viewer-link');

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    credentials: 'same-origin',
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }

  return data;
}

function showMessage(message, type = 'error') {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.dataset.state = type;
}

async function handleAuthState() {
  try {
    const data = await request('/api/auth/me', { method: 'GET' });
    const user = data.user;

    if (page === 'login' || page === 'register') {
      window.location.href = '/dashboard';
      return;
    }

    if (dashboardTitle) {
      dashboardTitle.textContent = `Welcome, ${user.username}.`;
    }
    if (dashboardSubtitle) {
      dashboardSubtitle.textContent = `${user.email} is signed in with ${user.role} access to the Shasi Technologies workspace.`;
    }
    if (accountRole) {
      accountRole.textContent = `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} access enabled`;
    }
  } catch (error) {
    if (isProtectedPage) {
      window.location.href = '/login';
    }
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage('');
    const formData = new FormData(loginForm);

    try {
      await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password')
        })
      });
      window.location.href = '/dashboard';
    } catch (error) {
      showMessage(error.message);
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage('');
    const formData = new FormData(registerForm);

    try {
      await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: formData.get('username'),
          email: formData.get('email'),
          password: formData.get('password')
        })
      });
      window.location.href = '/dashboard';
    } catch (error) {
      showMessage(error.message);
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', async () => {
    try {
      await request('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    } finally {
      window.location.href = '/login';
    }
  });
}

if (guideButtons.length && guideFrame) {
  const openGuide = (slug, title) => {
    const src = `/resources/guides/${slug}`;
    guideFrame.src = src;
    if (viewerTitle) viewerTitle.textContent = title;
    if (viewerLink) viewerLink.href = src;
  };

  guideButtons.forEach((button) => {
    button.addEventListener('click', () => openGuide(button.dataset.guide, button.dataset.title));
  });
}

handleAuthState();
