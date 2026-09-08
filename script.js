/* ============================================
   CINEMATIC PORTFOLIO — SCRIPT
   ============================================ */

(function () {
  'use strict';

  // ── Custom Cursor ────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll(
      'a, button, .project-card, .skill-category, .edu-card, .timeline-content'
    );
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  // ── Navbar scroll effect ────────────────────
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll direction
    if (scrollY > lastScrollY && scrollY > 300) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollY = scrollY;
  });

  // ── Active nav link tracking ─────────────────
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -60% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));

  // ── Reveal on scroll ─────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Stagger children reveals in grids/timelines
  document.querySelectorAll('.skills-grid, .projects-grid, .education-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      if (child.classList.contains('reveal')) {
        child.dataset.delay = i * 80;
      }
    });
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Hero reveal on load ──────────────────────
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero-content .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 300 + i * 200);
    });
  });

  // ── Mobile menu ──────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const bars = hamburger.querySelectorAll('span');
    const isOpen = mobileMenu.classList.contains('open');
    bars[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    bars[1].style.opacity = isOpen ? '0' : '1';
    bars[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '1';
      });
    });
  });

  // ── Smooth scroll ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── EmailJS Configuration ─────────────────────
  // ⚠️  Replace these three values after setting up EmailJS (see README)
  const EMAILJS_PUBLIC_KEY = '9EGX5N_lzjY18OTOM';   // from Account → API Keys
  const EMAILJS_SERVICE_ID = 'service_gvlr6zi';   // e.g. 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'template_tval6me';  // e.g. 'template_xyz789'

  // Initialise EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  // ── Contact form ─────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }

      const span = submitBtn.querySelector('span');
      span.textContent = 'Sending…';
      submitBtn.disabled = true;

      // Keys are configured — proceed to send
      if (typeof emailjs === 'undefined') {
        showToast('EmailJS failed to load. Check your internet connection.', 'error');
        span.textContent = 'Send Message';
        submitBtn.disabled = false;
        return;
      }

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          name:       name,        // matches {{name}} in template body
          from_name:  name,        // matches {{from_name}} in From Name field
          from_email: email,       // matches {{from_email}} in subject/body
          message:    message,     // matches {{message}} in template body
          reply_to:   email,       // matches {{reply_to}} — NOT {{message}}!
          title:      'Portfolio Contact',  // matches {{title}} in subject
        });

        span.textContent = '✓ Sent!';
        submitBtn.style.background = '#68d391';
        showToast('Message sent! I\'ll get back to you soon 🚀', 'success');
        contactForm.reset();

        setTimeout(() => {
          span.textContent = 'Send Message';
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 4000);

      } catch (err) {
        console.error('EmailJS error:', err);
        showToast('Failed to send. Please email me directly at amanbaldha01@gmail.com', 'error');
        span.textContent = 'Send Message';
        submitBtn.disabled = false;
      }
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showToast(msg, type) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: ${type === 'success' ? '#1a2f1a' : '#2f1a1a'};
      color: ${type === 'success' ? '#68d391' : '#fc8181'};
      border: 1px solid ${type === 'success' ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'};
      padding: 14px 28px;
      border-radius: 40px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.875rem;
      z-index: 9998;
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease;
      opacity: 0;
      pointer-events: none;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(80px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // ── Parallax on hero background ──────────────
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBgImg.style.transform = `scale(1.08) translateY(${scrolled * 0.15}px)`;
      }
    });
  }

  // ── Typing effect for hero tagline ───────────
  // Project card tilt effect
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Skill category tilt ──────────────────────
  document.querySelectorAll('.skill-category').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

})();
