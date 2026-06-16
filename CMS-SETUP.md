# Green Wing — Content admin (Decap CMS)

Edit **Insights**, **Solutions**, **Results / case studies**, and **images** in a browser at `/admin` — no HTML editing required.

## How it works

| Layer | Role |
|-------|------|
| **Decap CMS** (`/admin`) | Edit forms in the browser |
| **Markdown / JSON** (`content/`, `_data/`) | Content stored in the repo |
| **Eleventy** (`npm run build`) | Builds the live HTML site into `_site/` |
| **Netlify** | Hosts `_site/` and runs the build on every publish |

Homepage, Services, About, Contact, etc. stay as normal HTML files (developer-edited). CMS-managed areas: blog, solutions, case studies.

---

## One-time setup (Netlify + GitHub)

1. **Put the site in a GitHub repository** (if it is not already).

2. **Connect the repo to Netlify**  
   - Build command: `npm run build`  
   - Publish directory: `_site`

3. **Enable Netlify Identity** (Site settings → Identity → Enable)  
   - Registration: **Invite only** (recommended)

4. **Enable Git Gateway** (Identity → Services → Git Gateway → Enable)

5. **Invite editors** (Identity → Invite users) — e.g. Jennifer for blog posts

6. **Deploy** — after deploy, open `https://yoursite.com/admin`

7. **Log in** with the invited Netlify Identity account

---

## Local editing (before GitHub is wired)

```powershell
cd "c:\Users\markj\OneDrive\Desktop\greenwing-site"
npm install
npm run dev
```

In a **second terminal**:

```powershell
npm run cms
```

Open **http://localhost:8080/admin** — Decap uses the local backend (no login). Changes write to `content/` and `assets/images/`.

Run `npm run build` to preview the full site in `_site/`.

---

## What you can edit in `/admin`

| Section | What it controls |
|---------|------------------|
| **Blog articles** | New posts, dates, images, body copy; optional “feature on hub” and Scope infographic toggle |
| **Homepage images** | Main homepage visuals and square sector tile images |
| **Other page images** | Services, About, individual service pages and Terms/Policies images |
| **Solutions / technologies** | Each technology block — title, category, image, description |
| **Results / case studies** | Each result card + stats strip at top |
| **Page text / reviews** | Solutions intro text; Results page trust text and reviews |
| **Media** | Upload images to `assets/images/` (use in any collection) |

---

## Adding a new blog post

1. Admin → **Blog articles** → **New Blog article**
2. Fill title, date, excerpt, description, image
3. Write body in Markdown
4. Publish — Netlify rebuilds the site (1–2 minutes)

The post appears on `/insights` and at `/insights/your-slug.html`.

---

## Adding or changing a solution

1. Admin → **Solutions / technologies** → edit or **New Solution**
2. Pick **category** (controls which group it appears under)
3. Set **sort order** (lower = higher in the list)
4. Upload **image** and write description (Markdown)

---

## Changing homepage images

1. Admin → **Homepage images** → **Edit homepage images**
2. Replace the image in the section you want to change
3. Keep the alt text short and descriptive
4. Publish — Netlify rebuilds the site (1–2 minutes)

This controls the main editable homepage images only, not the homepage copy or layout.

---

## Changing images on other pages

1. Admin → **Other page images** → **Edit other page images**
2. Find the page/section image you want to replace
3. Upload or choose the replacement image
4. Keep the alt text short and descriptive
5. Publish — Netlify rebuilds the site (1–2 minutes)

Solutions, Results/case studies and Insights/blog images are edited inside their own collections.

---

## Technical notes

- **Do not** edit `solutions.html`, `case-studies.html`, `insights.html`, or files in `insights/` by hand — they are generated at build time.
- **Do** edit `index.html` and other static pages as before, or ask a developer.
- Old static copies of those pages are ignored by the build (see `.eleventyignore`).
- Sitemap is generated from `sitemap.njk` on each build.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Admin blank / login loop | Enable Identity + Git Gateway; redeploy |
| Build fails on Netlify | Check build log; run `npm run build` locally |
| Image not showing | Re-upload in admin; path should be under `assets/images/` |
| Post not on hub | Set **Feature on Insights hub** or use the newest date |

For developer help: `README.md` and `js/site-config.js` for global phone/email/social.
