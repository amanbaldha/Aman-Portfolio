(() => {
  'use strict';

  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  const updateNavbar = () => navbar.classList.toggle('scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.mob-link').forEach((link) => link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }));

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) navLinks.forEach((link) => link.classList.toggle('active', link.dataset.section === target.id));
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => navObserver.observe(section));

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth > 520) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }

  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const EMAILJS_PUBLIC_KEY = '9EGX5N_lzjY18OTOM';
  const EMAILJS_SERVICE_ID = 'service_gvlr6zi';
  const EMAILJS_TEMPLATE_ID = 'template_tval6me';

  let emailClient;
  const loadEmailClient = () => {
    if (emailClient) return emailClient;
    emailClient = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); resolve(window.emailjs); };
      script.onerror = () => reject(new Error('Email service unavailable'));
      document.head.append(script);
    });
    return emailClient;
  };

  contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !message) return showToast('Please complete all fields.', 'error');
    if (!/^\S+@\S+\.\S+$/.test(email)) return showToast('Please enter a valid email address.', 'error');
    const label = submitBtn.querySelector('span');
    label.textContent = 'Sending…';
    submitBtn.disabled = true;
    try {
      const emailjs = await loadEmailClient();
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { name, from_name: name, from_email: email, message, reply_to: email, title: 'Portfolio Contact' });
      contactForm.reset();
      showToast('Message sent — thank you!', 'success');
    } catch {
      showToast('Could not send that message. Please email me directly.', 'error');
    } finally {
      label.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
  });

  function showToast(message, type) {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    Object.assign(toast.style, { position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: '20', padding: '11px 16px', borderRadius: '8px', color: '#fff', background: type === 'success' ? '#18733c' : '#a53030', fontSize: '.85rem', boxShadow: '0 8px 24px rgba(0,0,0,.2)' });
    document.body.append(toast);
    setTimeout(() => toast.remove(), 3800);
  }
})();
