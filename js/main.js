/* ============================================================
   ZINGARA RESTAURANT — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAVBAR SCROLL SHRINK + SCROLL-TO-TOP ── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const onScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── MOBILE NAV ── */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const navOverlay = document.getElementById('navOverlay');
  const navClose = document.getElementById('navClose');

  const openNav = () => {
    mobileNav?.classList.add('open');
    navOverlay?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    navClose?.focus?.();
  };
  const closeNav = () => {
    mobileNav?.classList.remove('open');
    navOverlay?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger?.focus?.();
  };

  hamburger?.addEventListener('click', openNav);
  navClose?.addEventListener('click', closeNav);
  navOverlay?.addEventListener('click', closeNav);
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', closeNav));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('open')) closeNav();
  });

  /* ── HERO CAROUSEL ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0;
  let timer    = null;

  const goToSlide = (n) => {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
  };

  const startCarousel = () => {
    timer = setInterval(() => goToSlide(current + 1), 4500);
  };

  if (slides.length) {
    goToSlide(0);
    startCarousel();
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(timer);
        goToSlide(i);
        startCarousel();
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  /* ── MENU TABS ── */
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target)?.classList.add('active');
    });
  });

  /* ── MENU ACCORDION (full menu page) ── */
  document.querySelectorAll('.menu-cat-header').forEach(header => {
    header.addEventListener('click', () => {
      const isOpen = header.classList.contains('open');
      // Close all
      document.querySelectorAll('.menu-cat-header').forEach(h => h.classList.remove('open'));
      document.querySelectorAll('.menu-cat-body').forEach(b => b.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) {
        header.classList.add('open');
        header.nextElementSibling?.classList.add('open');
      }
    });
  });

  /* ── IMAGE LAZY LOADING ── */
  // All images with data-src get native lazy loading enhancement
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    img.loading = 'lazy';
    img.decoding = 'async';
  });

  /* ── SMOOTH EXTERNAL LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── ACTIVE NAV LINK HIGHLIGHTING (SPA-style per page) ── */
  const normalizePath = (path) => {
    if (!path) return 'index';
    const cleaned = path.split('?')[0].split('#')[0];
    const last = cleaned.split('/').filter(Boolean).pop() || 'index';
    return last.replace(/\.html$/i, '') || 'index';
  };

  const currentSlug = normalizePath(window.location.pathname);
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const hrefSlug = normalizePath(href);
    if (hrefSlug === currentSlug) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  document.querySelectorAll('.mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const hrefSlug = normalizePath(href);
    if (hrefSlug === currentSlug) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

});

/* ── IMAGE PLACEHOLDER FALLBACK ── */
// When an image fails to load, show a styled placeholder
window.addEventListener('load', () => {
  document.querySelectorAll('img').forEach(img => {
    if (!img.complete || img.naturalHeight === 0) {
      img.style.background = '#1a0a0a';
      img.style.opacity = '0.5';
    }
  });
});
