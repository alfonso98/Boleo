/* ============================================================
   BOLEO ADMINISTRADORA — main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Theme Toggle ─────────────────────────────────────────── */
  const html       = document.documentElement;
  const themeBtn   = document.getElementById('theme-toggle');
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

  /* ── Mobile Nav ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger && hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks && navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ── Header scroll shadow ─────────────────────────────────── */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', function () {
    header && header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ── Active nav link on scroll (Intersection Observer) ────── */
  const sections  = document.querySelectorAll('main section[id]');
  const navItems  = document.querySelectorAll('.nav-link');

  const observerOptions = {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(function (item) {
          item.classList.toggle('active', item.getAttribute('href') === '#' + id);
        });
      }
    });
  }, observerOptions);

  sections.forEach(function (section) { sectionObserver.observe(section); });

  /* ── Multi-step Cotizador Form ────────────────────────────── */
  const form       = document.getElementById('cotizador-form');
  const stepEls    = document.querySelectorAll('.form-step');
  const indicators = document.querySelectorAll('.form-steps .step');
  const stepLines  = document.querySelectorAll('.step-line');

  function showStep(num) {
    stepEls.forEach(function (el) { el.classList.remove('active'); });
    const target = document.getElementById('step-' + num);
    if (target) target.classList.add('active');

    indicators.forEach(function (ind) {
      const n = parseInt(ind.dataset.step, 10);
      ind.classList.toggle('active', n === num);
      ind.classList.toggle('completed', n < num);
    });

    stepLines.forEach(function (line, i) {
      line.classList.toggle('completed', i < num - 1);
    });
  }

  function validateStep(stepNum) {
    const step = document.getElementById('step-' + stepNum);
    if (!step) return true;

    let valid = true;

    if (stepNum === 1) {
      const dept = step.querySelector('#departamentos');
      const segRadios = step.querySelectorAll('input[name="seguridad"]');
      const limRadios = step.querySelectorAll('input[name="limpieza"]');

      if (!dept.value) {
        dept.classList.add('error');
        valid = false;
      } else {
        dept.classList.remove('error');
      }

      if (![...segRadios].some(r => r.checked)) valid = false;
      if (![...limRadios].some(r => r.checked)) valid = false;
    }

    if (stepNum === 3) {
      const nombre   = step.querySelector('#nombre');
      const email    = step.querySelector('#email');
      const telefono = step.querySelector('#telefono');

      [nombre, email, telefono].forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        } else {
          field.classList.remove('error');
        }
      });

      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.classList.add('error');
        valid = false;
      }
    }

    return valid;
  }

  document.querySelectorAll('.btn-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const current = parseInt(this.closest('.form-step').id.replace('step-', ''), 10);
      if (!validateStep(current)) {
        shakeForm();
        return;
      }
      showStep(parseInt(this.dataset.next, 10));
      scrollToForm();
    });
  });

  document.querySelectorAll('.btn-prev').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showStep(parseInt(this.dataset.prev, 10));
      scrollToForm();
    });
  });

  form && form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(3)) { shakeForm(); return; }
    stepEls.forEach(function (el) { el.classList.remove('active'); });
    const success = document.getElementById('step-success');
    if (success) success.classList.add('active');
    document.querySelector('.form-steps') && (document.querySelector('.form-steps').style.display = 'none');
    scrollToForm();
  });

  function scrollToForm() {
    const wrapper = document.querySelector('.cotizador-form-wrapper');
    if (wrapper) {
      const top = wrapper.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function shakeForm() {
    const wrapper = document.querySelector('.cotizador-form-wrapper');
    if (!wrapper) return;
    wrapper.style.animation = 'none';
    wrapper.offsetHeight;
    wrapper.style.animation = 'shake 0.4s ease';
    setTimeout(function () { wrapper.style.animation = ''; }, 400);
  }

  const shakeKeyframes = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX(6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX(4px); }
    }
  `;
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shakeKeyframes;
  document.head.appendChild(styleSheet);

  /* ── Nosotros image slideshow ─────────────────────────────── */
  const slideshowImgs = document.querySelectorAll('.nosotros-slideshow img');
  if (slideshowImgs.length > 1) {
    let current = 0;
    setInterval(function () {
      slideshowImgs[current].classList.remove('active');
      current = (current + 1) % slideshowImgs.length;
      slideshowImgs[current].classList.add('active');
    }, 15000);
  }

  /* ── Remove error state on input ──────────────────────────── */
  form && form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('input', function () { this.classList.remove('error'); });
    field.addEventListener('change', function () { this.classList.remove('error'); });
  });

})();
