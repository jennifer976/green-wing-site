# Design & platform recommendations

This document explains how we kept Green Wing's visual identity while implementing the new content spec — and what optional upgrades are worth considering.

## What we preserved (brand)

| Element | Value |
|---------|--------|
| Primary green | `#1f3317` |
| Accent lime | `#99cc33` |
| Headings | Montserrat |
| Body | Roboto Slab |
| Logo | SVG full-colour + white variants |
| Hero video | `Resize-video-project.mp4` with poster fallback |
| Client logos | Original assets from Green Wing Assets folder |

**Recommendation:** Do not adopt a third-party theme wholesale — your live site identity is distinctive. Borrow *patterns*, not * palettes*.

---

## Hero video (now implemented)

The live WordPress site used a background video on the homepage. This is restored in `index.html`:

- Video: `assets/images/Resize-video-project.mp4`
- Poster fallback: `hm-pg-bkgrd-img.jpg`
- Respects `prefers-reduced-motion` (video hidden, static overlay)

---

## Open-source resources worth borrowing (not replacing)

These are MIT-licensed or similar — use individual components, not full themes:

| Resource | URL | Use for |
|----------|-----|---------|
| **Start Bootstrap — Modern Business** | [github.com/StartBootstrap/startbootstrap-modern-business](https://github.com/StartBootstrap/startbootstrap-modern-business) | FAQ accordion patterns, footer column layout reference |
| **Corporio** | [github.com/AminZibayi/Corporio](https://github.com/AminZibayi/Corporio) | SEO meta patterns, security headers, sitemap approach |
| **Alpine.js** (15 KB) | [alpinejs.dev](https://alpinejs.dev) | Optional: richer mobile nav dropdowns without React |
| **Lite YouTube Embed** | [github.com/paulirish/lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed) | If you add video content to Insights later |

**Not recommended:** Dropping in ThemeWagon/Mailler-style templates — they would fight your established green/navy brand and Themify spacing.

---

## SEO checklist (implemented)

- [x] Unique `<title>` and `meta description` per page
- [x] Canonical URLs on all pages
- [x] Open Graph tags on homepage
- [x] JSON-LD `ProfessionalService` schema on homepage
- [x] JSON-LD `Article` schema on insight posts
- [x] `sitemap.xml` and `robots.txt`
- [x] Semantic HTML (`main`, `article`, `nav`, heading hierarchy)
- [x] `alt` text on images
- [x] Clean URL redirects via `netlify.toml`

**Before launch:**
- [ ] Replace `YOUR_FORM_ID` in forms and `js/site-config.js`
- [ ] Submit sitemap to Google Search Console
- [ ] Confirm `[CHECK]` items in content spec (founding year, logo permissions, Groundwork accreditation)
- [ ] Add GA4 or privacy-friendly analytics if needed
- [ ] Add cookie consent banner (lightweight: [Osano](https://www.osano.com) or [Klaro](https://github.com/kiprotect/klaro))

---

## Future upgrade path (when you're ready)

| Stage | Approach | Why |
|-------|----------|-----|
| **Now** | Static HTML (current) | Simple, fast, no WordPress, easy to host |
| **Next** | [Astro](https://astro.build) or [11ty](https://www.11ty.dev) | Reusable components, still static output, easier Insights/blog |
| **Later** | Headless CMS (Sanity, TinaCMS) | Non-developers edit copy without touching HTML |

Corporio (Hugo + TinaCMS) is the best fit if you want a CMS soon without returning to WordPress.

---

## Items marked [CHECK] in your spec

Confirm before publishing:

1. **Founding year 2009** — used in stats bar
2. **25+ technologies** — used in stats bar  
3. **Client logo display rights** — logos included from existing site assets
4. **Groundwork accreditation** — still active; block included on Services
5. **Address** — footer uses Bournemouth (Patch at Bobby's); old Poole address removed from primary contact
6. **Independence claim** — copy reflects assess-first approach; confirm given supplier relationships
7. **Case study names** — currently anonymised until client permission obtained
8. **Social URLs** — placeholders in `site-config.js`; update with real profiles

---

## Editing content going forward

| What to change | Where |
|----------------|--------|
| Phone, email, address, CTAs | `js/site-config.js` |
| Navigation | `js/main.js` → `NAV_ITEMS` |
| Page copy | Individual `.html` files |
| Colours/fonts | `css/styles.css` → `:root` variables |
| New blog post | Copy `insights/refrigeration-runs-24-7.html` as template |
