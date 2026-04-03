/* ============================================================
   ZINGARA — SHARED COMPONENTS (navbar + footer)
   ============================================================ */

/* ── RENDER SHARED NAVBAR ── */
(function injectNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="index.html">
        <img src="images/logo.png" alt="" class="nav-logo-img" aria-hidden="true">ZINGARA
      </a>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="biryani.html">Biryani</a>
        <a href="menu.html">Menu</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
      </nav>
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-controls="mobileNav" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;
})();

/* ── RENDER MOBILE DRAWER ── */
(function injectMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  nav.innerHTML = `
    <button class="mobile-nav-close" id="navClose" aria-label="Close menu">✕</button>
    <a href="index.html">Home</a>
    <a href="biryani.html">Biryani</a>
    <a href="menu.html">Full Menu</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
  `;
})();

/* ── RENDER SCROLL-TO-TOP BUTTON ── */
(function injectScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top-btn';
  btn.id = 'scrollTopBtn';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);
})();

/* ── RENDER FOOTER ── */
(function injectFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="index.html" class="footer-brand-link">
            <img src="images/logo.png" alt="Zingara Restaurant" class="footer-logo">
            <div class="footer-brand-name">ZINGARA</div>
          </a>
          <p class="footer-tagline">Bangalore's most addictive biryani.<br>Hot. Spicy. Loaded. Ready in minutes.</p>
          <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
            <a href="https://www.swiggy.com/direct/brand/230006?source=swiggy-direct&subSource=google" target="_blank" rel="noopener" class="btn btn-primary" style="padding:10px 20px;font-size:0.75rem;">Swiggy</a>
            <a href="https://link.zomato.com/xqzv/rshare?id=133623290305633fe" target="_blank" rel="noopener" class="btn btn-primary" style="padding:10px 20px;font-size:0.75rem;">Zomato</a>
          </div>
          <div style="margin-top:16px;display:flex;gap:14px;align-items:center;">
            <a href="https://www.instagram.com/zingararestaurant_/" target="_blank" rel="noopener" class="footer-social-link" aria-label="Zingara on Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Instagram
            </a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Pages</h4>
          <a href="index.html">Home</a>
          <a href="biryani.html">Biryani</a>
          <a href="menu.html">Full Menu</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Find Us</h4>
          <p>Jayanti Nagar Main Rd<br>Horamavu, Bengaluru – 560043</p>
          <a href="tel:+919187103005">+91 91871 03005</a>
          <a href="https://maps.app.goo.gl/2zYzayMaxCLqLi6e7" target="_blank" rel="noopener">Google Maps ↗</a>
          <p style="margin-top:12px;">Mon – Sun<br>11:00 AM – 11:00 PM</p>
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-copy">© 2026 Zingara Restaurant. All rights reserved.</span>
        <span class="footer-gst">Prices exclusive of GST. No service charge. Subject to availability.</span>
      </div>
    </div>
  `;
})();
