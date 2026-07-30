// Section-specific logic — extend or override ../main.js behavior here
const toggle = document.getElementById('themeToggle');
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
    });