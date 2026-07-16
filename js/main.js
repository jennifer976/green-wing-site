(function () {
  'use strict';

  const S = () => window.GW_SITE || {};

  const NAV_ITEMS = [
    { href: 'index.html', label: 'Home' },
    { href: 'services.html', label: 'Services' },
    { href: 'solutions.html', label: 'Solutions' },
    { href: 'case-studies.html', label: 'Results' },
    { href: 'about.html', label: 'About' },
    { href: 'insights.html', label: 'Insights' },
    { href: 'contact.html', label: 'Contact' },
  ];

  function assetBase() {
    return window.location.pathname.includes('/insights/') ? '../' : '';
  }

  function pageHref(href) {
    return `${assetBase()}${href}`;
  }

  function currentPage() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === 'about-us.html') return 'about.html';
    return path === '' ? 'index.html' : path;
  }

  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;
    const site = S();
    const page = currentPage();
    const base = assetBase();
    const navLinks = NAV_ITEMS.map(
      (item) =>
        `<li><a href="${pageHref(item.href)}"${page === item.href ? ' aria-current="page" class="active"' : ''}>${item.label}</a></li>`
    ).join('');

    el.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <div class="container header-inner">
        <a class="site-logo" href="${pageHref('index.html')}">
          <img src="${base}assets/images/green-wing-logo-full-colour.svg" alt="${site.name}" width="175" height="58">
        </a>
        <nav class="main-nav" aria-label="Main navigation">
          <ul>${navLinks}</ul>
        </nav>
        <div class="header-actions">
          <a class="btn btn-solid header-cta" href="${pageHref('contact.html')}">${site.ctaPrimary || 'Arrange an Energy Review'}</a>
          <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" type="button">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>`;

    const toggle = el.querySelector('.nav-toggle');
    const nav = el.querySelector('.main-nav');
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  const SOCIAL_ICONS = {
    linkedin: {
      label: 'LinkedIn',
      viewBox: '0 0 24 24',
      path: 'M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.64c0-1.11 0-2.53-1.54-2.53-1.54 0-1.78 1.2-1.78 2.44V19h-3v-9h2.89v1.23h.04a3.17 3.17 0 012.86-1.57c3.06 0 3.63 2.01 3.63 4.63V19z',
    },
    facebook: {
      label: 'Facebook',
      viewBox: '0 0 24 24',
      path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
    },
    instagram: {
      label: 'Instagram',
      viewBox: '0 0 24 24',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    },
  };

  function socialLinksHtml(site) {
    const social = site.social || {};
    const links = Object.keys(SOCIAL_ICONS)
      .filter((key) => social[key])
      .map((key) => {
        const icon = SOCIAL_ICONS[key];
        return `<a href="${social[key]}" class="footer-social-link" aria-label="${site.name} on ${icon.label}" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="${icon.viewBox}" aria-hidden="true" focusable="false">
                <path d="${icon.path}"/>
              </svg>
            </a>`;
      })
      .join('');

    if (!links) return '';

    return `<div class="footer-social" aria-label="Social media">${links}</div>`;
  }

  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    const site = S();

    const base = assetBase();
    el.innerHTML = `
      <div class="container footer-slim">
        <div class="footer-slim-main">
          <a class="footer-logo" href="${pageHref('index.html')}">
            <img src="${base}assets/images/green-wing-logo-white.svg" alt="${site.name}" width="120" height="38">
          </a>
          <nav class="footer-links-inline" aria-label="Footer">
            <a href="${pageHref('onsite-discovery-assessment.html')}">Discovery</a>
            <a href="${pageHref('discovery-roadmap.html')}">Discovery Assessment Report and Roadmap</a>
            <a href="${pageHref('eoaas.html')}">EOaaS</a>
            <span class="footer-sep" aria-hidden="true">·</span>
            <a href="${pageHref('about.html')}">About</a>
            <a href="${pageHref('case-studies.html')}">Results</a>
            <a href="${pageHref('insights.html')}">Insights</a>
            <a href="${pageHref('contact.html')}">Contact</a>
            <span class="footer-sep" aria-hidden="true">·</span>
            <a href="${pageHref('terms-and-policies.html')}">Terms</a>
          </nav>
          <div class="footer-contact-group">
            <p class="footer-contact-inline">
              <a href="tel:${site.phoneTel || site.phone}">${site.phone}</a>
              <a href="mailto:${site.email}">${site.email}</a>
            </p>
            ${socialLinksHtml(site)}
          </div>
        </div>
        <div class="footer-slim-bottom">
          <p>© ${new Date().getFullYear()} Green Wing Energy Solutions · Co. <a href="${site.companiesHouseUrl || '#'}" target="_blank" rel="noopener noreferrer">${site.companyNumber}</a><br><span class="footer-registered">Registered office: ${site.registeredOffice}</span></p>
          <p class="footer-direct-contact"><a href="mailto:${site.email}">Contact us today</a></p>
        </div>
      </div>`;
  }

  function motionAllowed() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const REVEAL_SELECTORS = [
    '.proof-card',
    '.client-quote',
    '.case-card',
    '.service-stack-card',
    '.service-featured',
    '.journey-timeline .journey-step',
    '.sector-tile',
    '.insight-card',
    '.insight-featured',
    '.scope-infographic',
    '.contact-steps-step',
    '.problem-split > *',
    '.roadmap-split > *',
    '.solution-block',
    '.founder-block',
    '.value-card',
  ].join(',');

  function initScrollReveal() {
    const targets = document.querySelectorAll(REVEAL_SELECTORS);
    if (!targets.length) return;

    targets.forEach((el) => el.classList.add('reveal'));

    document.documentElement.classList.add('has-reveal');

    if (!motionAllowed()) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    targets.forEach((el) => observer.observe(el));
  }

  function initLightbox() {
    let modal = document.getElementById('gw-lightbox');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gw-lightbox';
      modal.className = 'lightbox';
      modal.hidden = true;
      modal.innerHTML = `
        <div class="lightbox-backdrop" data-lightbox-close tabindex="-1"></div>
        <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Document preview">
          <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close preview">&times;</button>
          <img class="lightbox-image" src="" alt="">
        </div>`;
      document.body.appendChild(modal);
    }

    const image = modal.querySelector('.lightbox-image');
    let lastFocus = null;

    const close = () => {
      modal.hidden = true;
      document.body.classList.remove('lightbox-open');
      image.removeAttribute('src');
      if (lastFocus) lastFocus.focus();
    };

    const open = (trigger) => {
      const src = trigger.dataset.lightbox;
      if (!src) return;
      lastFocus = trigger;
      const base = assetBase();
      image.src = src.startsWith('http') ? src : `${base}${src}`;
      image.alt = trigger.dataset.lightboxAlt || 'Preview';
      modal.hidden = false;
      document.body.classList.add('lightbox-open');
      modal.querySelector('.lightbox-close').focus();
    };

    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-lightbox]');
      if (trigger) {
        e.preventDefault();
        open(trigger);
        return;
      }
      if (e.target.closest('[data-lightbox-close]')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  }

  function initFaq() {
    document.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const open = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', open);
      });
    });
  }

  function initVideoHero() {
    const video = document.querySelector('.hero-bg-video');
    if (!video) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      video.removeAttribute('autoplay');
      video.pause();
      return;
    }

    video.play().catch(() => {
      video.style.display = 'none';
    });
  }

  function initLogoMarquee() {
    const marquee = document.querySelector('.logo-marquee');
    if (!marquee) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      marquee.classList.add('logo-marquee--manual');
    }
  }

  function initArticleShare() {
    document.addEventListener('click', async (e) => {
      const button = e.target.closest('[data-copy-link]');
      if (!button) return;

      const url = button.dataset.copyLink || window.location.href;
      const share = button.closest('.article-share');
      const status = share?.querySelector('.article-share-status');

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const input = document.createElement('input');
          input.value = url;
          input.setAttribute('readonly', '');
          input.style.position = 'absolute';
          input.style.left = '-9999px';
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          input.remove();
        }
        if (status) status.textContent = 'Link copied.';
      } catch (error) {
        if (status) status.textContent = 'Could not copy automatically. Please copy the address from your browser.';
      }
    });
  }

  function initContactInfo() {
    const site = S();
    const addressEl = document.getElementById('contact-address');
    if (addressEl) {
      addressEl.innerHTML = site.addressHtml || site.address;
    }

    const mapEl = document.getElementById('contact-map');
    const mapLink = document.getElementById('contact-map-link');
    if (mapEl && site.mapsQuery) {
      mapEl.src = `https://maps.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&hl=en&z=16&output=embed`;
    }
    if (mapLink && site.mapsUrl) {
      mapLink.href = site.mapsUrl;
    }
  }

  function injectSeoMeta() {
    const site = S();
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const pageKey = pathParts.length > 1 && pathParts[pathParts.length - 2] === 'insights'
      ? `insights/${pathParts[pathParts.length - 1]}`
      : pathParts[pathParts.length - 1] || 'index.html';
    const meta = site.seo && site.seo[pageKey];
    if (!meta) return;

    const setMeta = (attr, key, value) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const image = meta.image.startsWith('http') ? meta.image : `${site.url}${meta.image}`;
    const url = `${site.url}${meta.path}`;

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'robots', 'index, follow');
  }

  function initContactModal() {
    if (document.getElementById('gw-contact-modal')) return;

    const site = S();
    const base = assetBase();
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.id = 'gw-contact-modal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="contact-modal-backdrop" data-contact-close></div>
      <div class="contact-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
        <button class="contact-modal-close" type="button" aria-label="Close enquiry form" data-contact-close>&times;</button>
        <div class="contact-modal-brand">
          <span class="contact-modal-logo-wrap">
            <img src="${base}assets/images/green-wing-logo-full-colour.svg" alt="${site.name}" width="154" height="51">
          </span>
          <span class="contact-modal-brand-copy">${site.tagline || 'Energy saving solutions that do not cost the Earth.'}</span>
        </div>
        <div class="contact-modal-heading">
          <p class="content-label">Contact us today</p>
          <h2 id="contact-modal-title">Tell us what you want to understand.</h2>
          <p class="contact-modal-intro">Share a few details and Green Wing will come back to arrange the right next step. You can also email <a href="mailto:${site.email}">${site.email}</a>.</p>
        </div>
        <form class="contact-modal-form" id="gw-contact-form">
          <input type="text" name="companyWebsite" tabindex="-1" autocomplete="off" class="contact-modal-honeypot" aria-hidden="true">
          <input type="hidden" name="submittedAt" value="">
          <input type="hidden" name="page" value="">
          <div class="form-group">
            <label for="contact-modal-name">Name *</label>
            <input type="text" id="contact-modal-name" name="name" required autocomplete="name">
          </div>
          <div class="form-group">
            <label for="contact-modal-email">Email *</label>
            <input type="email" id="contact-modal-email" name="email" required autocomplete="email">
          </div>
          <div class="form-group">
            <label for="contact-modal-phone">Phone</label>
            <input type="tel" id="contact-modal-phone" name="phone" autocomplete="tel">
          </div>
          <div class="form-group">
            <label for="contact-modal-company">Company</label>
            <input type="text" id="contact-modal-company" name="company" autocomplete="organization">
          </div>
          <div class="form-group">
            <label for="contact-modal-estate">Number of sites / estate size</label>
            <input type="text" id="contact-modal-estate" name="estateSize" placeholder="e.g. 12 sites across the South West">
          </div>
          <div class="form-group">
            <label for="contact-modal-type">What are you enquiring about?</label>
            <select id="contact-modal-type" name="enquiryType">
              <option>Energy review enquiry</option>
              <option>Sample Discovery Assessment Report and Roadmap request</option>
              <option>Onsite Discovery Assessment</option>
              <option>EOaaS</option>
              <option>General enquiry</option>
            </select>
          </div>
          <div class="form-group">
            <label for="contact-modal-message">Message *</label>
            <textarea id="contact-modal-message" name="message" required placeholder="Tell us a little about the site, issue or opportunity."></textarea>
          </div>
          <button type="submit" class="btn btn-solid btn-arrow">Send enquiry</button>
          <p class="contact-modal-status" role="status"></p>
        </form>
      </div>`;

    document.body.appendChild(modal);

    const form = modal.querySelector('#gw-contact-form');
    const status = modal.querySelector('.contact-modal-status');
    const firstField = modal.querySelector('#contact-modal-name');
    let previousFocus = null;

    const normaliseEnquiryType = (value) => {
      const label = String(value || '').toLowerCase();
      if (label.includes('sample')) return 'Sample Discovery Assessment Report and Roadmap request';
      if (label.includes('energy review') || label.includes('arrange')) return 'Energy review enquiry';
      if (label.includes('onsite')) return 'Onsite Discovery Assessment';
      if (label.includes('eoaas')) return 'EOaaS';
      return 'General enquiry';
    };

    const openModal = (enquiryType) => {
      previousFocus = document.activeElement;
      form.reset();
      status.textContent = '';
      status.className = 'contact-modal-status';
      form.elements.submittedAt.value = String(Date.now());
      form.elements.page.value = window.location.href;
      form.elements.enquiryType.value = normaliseEnquiryType(enquiryType);
      modal.hidden = false;
      document.documentElement.classList.add('modal-open');
      setTimeout(() => firstField.focus(), 0);
    };

    const closeModal = () => {
      modal.hidden = true;
      document.documentElement.classList.remove('modal-open');
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
    };

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-contact-modal], a.header-cta[href*="contact"], a.btn[href$="contact.html"], .footer-direct-contact a');
      if (!trigger) return;
      event.preventDefault();
      openModal(trigger.dataset.enquiryType || trigger.textContent.trim() || 'Website enquiry');
    });

    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-contact-close]')) closeModal();
    });

    document.addEventListener('keydown', (event) => {
      if (!modal.hidden && event.key === 'Escape') closeModal();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      const endpoint = site.contactEndpoint || '/.netlify/functions/contact';
      const data = Object.fromEntries(new FormData(form).entries());

      submit.disabled = true;
      status.textContent = 'Sending...';
      status.className = 'contact-modal-status is-pending';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || 'Submit failed');

        const links = result.sampleLinks;
        if (links && (links.assessment || links.roadmap)) {
          const parts = [
            result.message || 'Thank you. Your sample documents are ready.',
            '<span class="contact-modal-sample-links">',
            links.assessment
              ? `<a href="${links.assessment}" target="_blank" rel="noopener noreferrer">Download Assessment Report (PDF)</a>`
              : '',
            links.roadmap
              ? `<a href="${links.roadmap}" target="_blank" rel="noopener noreferrer">Download Roadmap (PDF)</a>`
              : '',
            '</span>',
          ].filter(Boolean);
          status.innerHTML = parts.join(' ');
        } else {
          status.textContent = result.message || 'Thank you. We will be in touch shortly.';
        }
        status.className = 'contact-modal-status is-success';
        form.reset();
      } catch (error) {
        status.innerHTML = `${error.message || 'There was a problem sending the enquiry.'} Please email <a href="mailto:${site.email}">${site.email}</a> directly.`;
        status.className = 'contact-modal-status is-error';
      } finally {
        submit.disabled = false;
      }
    });
  }

  function initPageSections() {
    const main = document.getElementById('main-content');
    if (!main || main.dataset.sectionsDecorated === 'true') return;
    main.dataset.sectionsDecorated = 'true';

    const isHomepage = currentPage() === 'index.html';

    // Mostly plain sections; lines texture occasionally; wing watermark rarely
    const MOTIF_CYCLE = ['none', 'none', 'lines', 'none', 'none', 'wing'];
    const sections = [...main.querySelectorAll(':scope > section')];
    let cycleIndex = 0;

    const isDecoratable = (section) =>
      section.classList.contains('section-light') ||
      section.classList.contains('page-section') ||
      section.classList.contains('page-section--compact');

    const applyMotif = (section, type) => {
      if (type === 'none') return;
      section.classList.add('section-has-motif');
      if (type === 'lines') section.classList.add('section-has-motif--lines');
    };

    sections.forEach((section) => {
      if (section.classList.contains('cta-band')) return;
      if (section.classList.contains('hero') || section.classList.contains('hero-video')) return;
      if (isHomepage) return;

      if (section.classList.contains('page-hero')) {
        applyMotif(section, 'wing');
        return;
      }

      if (section.classList.contains('section-has-motif')) {
        cycleIndex += 1;
        return;
      }

      if (!isDecoratable(section)) return;

      const type = MOTIF_CYCLE[cycleIndex % MOTIF_CYCLE.length];
      cycleIndex += 1;
      applyMotif(section, type);
    });

    let dividersSinceLast = Infinity;

    for (let i = sections.length - 1; i > 0; i -= 1) {
      const section = sections[i];
      const prev = sections[i - 1];

      if (isHomepage) continue;

      if (section.classList.contains('cta-band') || prev.classList.contains('cta-band')) continue;
      if (prev.classList.contains('hero') || prev.classList.contains('hero-video')) continue;

      const prevSibling = section.previousElementSibling;
      if (
        prevSibling?.classList.contains('section-divider-band') ||
        prevSibling?.classList.contains('section-divider-wave')
      ) {
        continue;
      }

      if (prev.classList.contains('page-hero')) {
        prev.insertAdjacentHTML(
          'afterend',
          '<div class="section-divider-wave section-divider-wave--to-light" aria-hidden="true"></div>'
        );
        dividersSinceLast = 0;
        continue;
      }

      const prevIsLight = prev.classList.contains('section-light');
      const currIsLight = section.classList.contains('section-light');
      if (prevIsLight === currIsLight) continue;

      // At most one green rule divider every three section transitions
      dividersSinceLast += 1;
      if (dividersSinceLast < 3) continue;

      const bandBg = currIsLight ? 'section-divider-band--light' : 'section-divider-band--white';
      const ruleClass = currIsLight
        ? 'section-divider-rule section-divider-rule--on-light'
        : 'section-divider-rule';

      section.insertAdjacentHTML(
        'beforebegin',
        `<div class="section-divider-band ${bandBg}" aria-hidden="true"><div class="${ruleClass}"></div></div>`
      );
      dividersSinceLast = 0;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectSeoMeta();
    renderHeader();
    renderFooter();
    initContactModal();
    initContactInfo();
    initPageSections();
    initFaq();
    initVideoHero();
    initLogoMarquee();
    initArticleShare();
    initHeaderScroll();
    initScrollReveal();
    initLightbox();
  });
})();
