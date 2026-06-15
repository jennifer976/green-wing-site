# Green Wing Energy Solutions — Static Website

Standalone rebuild of [greenwingenergysolutions.com](https://greenwingenergysolutions.com) — **no WordPress**. Plain HTML, CSS, and JavaScript.

## Preview

```powershell
cd "c:\Users\markj\OneDrive\Desktop\greenwing-site"
npm install
npm run build
npx serve _site
```

Open **http://localhost:3000** (or use `npm run dev` for live reload during development).

## Content admin (blog, solutions, results)

See **[CMS-SETUP.md](CMS-SETUP.md)** — edit at `/admin` via Decap CMS (Netlify + GitHub).

```powershell
npm run dev    # site at :8080
npm run cms    # local admin backend (second terminal)
```

## Pages

| Page | File |
|------|------|
| Home (video hero) | `index.html` |
| Services | `services.html` |
| Solutions | `solutions.html` |
| Onsite Discovery Assessment | `onsite-discovery-assessment.html` |
| Energy Opportunity Roadmap | `discovery-roadmap.html` |
| EOaaS | `eoaas.html` |
| Results / Case Studies | `case-studies.html` |
| About | `about.html` |
| Contact | `contact.html` |
| Insights | `insights.html` |
| Terms & Policies | `terms-and-policies.html` |

## Edit global settings

**`js/site-config.js`** — phone, email, address, CTAs, Formspree URL, social links.

## Before launch

1. Set Formspree ID in `js/site-config.js` and form `data-endpoint` attributes
2. Confirm `[CHECK]` items in `DESIGN-NOTES.md`
3. Deploy to Netlify — build command `npm run build`, publish `_site` (see `CMS-SETUP.md`)
4. Submit `sitemap.xml` to Google Search Console

See **`DESIGN-NOTES.md`** for SEO checklist, brand guidelines, and optional upgrade paths.
