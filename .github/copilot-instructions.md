# PSPH Website - Copilot Instructions

## Project Overview

Static marketing website for **Public School Pension Help (PSPH)** — free one-hour Zoom pension sessions for public school employees (K-12 and higher ed) in all 50 states. No build process; files served directly via Apache on `https://psph.org`.

**Critical:** JotForm handles all form logic (form ID: `251803846453157`)—never add custom validation, PHP, or backend code.

## File Structure

```
index.html              # Landing: hero, how-it-works timeline, booking calendar, FAQs, contact
schedule.html           # JotForm embed for appointment booking (fallback links below the form)
about.html              # About PSPH, including how PSPH is funded
pension-basics.html     # Plain-language pension education (advisor fact-check before edits ship)
privacy.html, terms.html # Legal pages with .legal-content section
404.html                # Custom not-found page (ErrorDocument in .htaccess)
sitemap.xml, robots.txt # Update sitemap.xml when adding or removing pages
styles/style.css        # Single CSS file with design tokens in :root
scripts/main.js         # IIFE module used by every page: mobile nav, booking calendar, footer year
assets/img/             # Logos, favicons, og-image.png, photos/ (free Unsplash license), illustrations/
.htaccess               # Clean URLs, HTTPS enforcement, 404 page, cache headers
tools/build_mirror.py   # Builds the k12*.org campaign-mirror variant (not deployed to psph.org)
```

## Developer Workflow

**Local testing:** Serve with any static server (e.g., `npx serve` or VS Code Live Server). Test CSP by checking browser console for violations.

**Adding pages:** Copy header/footer structure from `about.html` (skip link, header with nested `.mobile-nav`, canonical + Open Graph tags). Update both `.nav` and `.mobile-nav` links to match, add the page to `sitemap.xml`, and use clean URLs in links (`/schedule` not `/schedule.html`). Bump the `?v=` query on CSS/JS links when those files change.

## Campaign Mirrors (k12*.org)

The ~59 `k12*.org` folders on the same hosting account serve a **mirror** of this site: the booking page is the homepage (`/`), the regular homepage is `/home`, `/schedule` 301s to `/`, and every response carries `X-Robots-Tag: noindex,follow` (no canonical, `og:url`, or sitemap). Never edit mirror files by hand: change this repo, then run `python3 tools/build_mirror.py OUTPUT_DIR` and deploy that output to every mirror. Any change to psph.org should be followed by a mirror rebuild and deploy so the two never drift.

## CSS Design Tokens

All styling uses CSS custom properties in `styles/style.css`:

```css
--primary: #002169;      /* Navy - brand, headers, .cta.active */
--accent: #FFCD00;       /* Yellow - CTAs, .btn-primary */
--secondary: #334D87;    /* Body text, .gray aliases this */
--font-sans: 'Merriweather Sans'  /* Nav, buttons, body text */
```

**Never duplicate `:root`**—extend existing declarations.

## Button & CTA Classes

| Class | Usage |
|-------|-------|
| `.btn-primary` | Yellow background, dark text (main CTAs) |
| `.btn-secondary` | Outline style, primary border |
| `.cta` | Header CTA; add `.cta.active` + `aria-current="page"` on current page (inverts to navy/white) |

## JavaScript Patterns (`scripts/main.js`)

All code runs inside an IIFE with `'use strict'`. Key modules:

- **`initCalendar()`**: Renders `#calendarGrid`. Bookable days mirror the JotForm appointment field (`BOOKING` constant: Mon-Fri, 7 days' notice, 90 days ahead) and link to `/schedule`. Keep `BOOKING` in sync if the form's availability changes. Never hardcode dates.
- **`initMobileMenu()`**: `.mobile-menu-btn` toggles `.mobile-nav.active` and its own `aria-expanded`/`aria-label`. Both navs must mirror link order.
- **`initCurrentYear()`**: Fills `[data-current-year]` in the footer.

## URL & Navigation

`.htaccess` enforces clean URLs—always link to `/schedule`, never `/schedule.html`. Trailing slashes stripped. From subpages, link to homepage sections as `/#section-id`.

**Active states:**
- Nav links: `.active` or `aria-current="page"`
- Header CTA on schedule.html: `aria-current="page"`

## CSP & External Resources

CSP is intentionally **not** set in `.htaccess` (it broke JotForm embeds on school networks). If it is reintroduced, start from this allowlist:

| Directive | Allowed domains |
|-----------|-----------------|
| `script-src` | `'self'`, `form.jotform.com`, `cdn.jotfor.ms`, `js.jotform.com` |
| `style-src` | `'self'`, `'unsafe-inline'`, `fonts.googleapis.com`, `cdnjs.cloudflare.com` |
| `font-src` | `'self'`, `fonts.gstatic.com`, `cdnjs.cloudflare.com` |
| `connect-src` | `'self'`, `api.jotform.com` |
| `frame-src` | `form.jotform.com` |

To add new external resources: update the CSP in `.htaccess`, test in browser console for violations.

## Accessibility Requirements

- `aria-label` on icon-only buttons (calendar nav, mobile menu)
- `aria-current="page"` on active nav links
- Bookable calendar days are real `<a>` links with descriptive `aria-label`s
- Decorative `<i>` icons get `aria-hidden="true"`
- `<noscript>` fallbacks for calendar and JotForm
- Run axe-core on every page before shipping (no violations as of 2026-11)

## Brand Voice & Content Rules

Friendly, trustworthy, plain-language tone for public school employees:
- Facts to keep consistent everywhere: sessions are **free**, **one hour**, **on Zoom only**; clients get a **summary email** afterward; email replies **within 1 business day**; serving **all 50 states**.
- Funding: PSPH is paid by the firms that employ the pension professionals it matches clients with. Do not claim "no commissions" or "conflict-free".
- No phone number anywhere (the old 603 number was personal and is retired). Contact is hello@psph.org only.
- Never publish: product or investment recommendations, promised outcomes, "fiduciary" claims, advisor/founder names or photos, or testimonials (removed 2026-11 pending compliance wording).
- CTAs: "Book a Free Session", "Learn Pension Basics"
