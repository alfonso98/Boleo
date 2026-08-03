(function () {
  'use strict';
    /* ── Theme Toggle ─────────────────────────────────────────── */
  const html       = document.documentElement;
  const themeBtn   = document.getElementById('themeToggle');
  const themeIcon  = document.getElementById('theme-icon');

  function applyTheme(dark) {
    if (dark) {
      html.classList.add('dark-mode');
      themeIcon.className = 'fas fa-sun';
    } else {
      html.classList.remove('dark-mode');
      themeIcon.className = 'fas fa-moon';
    }
  }

  function initTheme() {
    const saved = localStorage.getItem('boleo-theme');
    if (saved) {
      applyTheme(saved === 'dark');
    } else {
      applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }

  themeBtn && themeBtn.addEventListener('click', function () {
    const isDark = html.classList.contains('dark-mode');
    applyTheme(!isDark);
    localStorage.setItem('boleo-theme', isDark ? 'light' : 'dark');
  });

  initTheme();
})();