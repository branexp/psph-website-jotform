# PSPH Website - Copilot Instructions

## Project Overview

Static marketing website for **Public School Pension Help (PSPH)** — pension guidance for K-12 educators. No build process; files served directly via Apache on `https://psph.org`.

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | Landing page with hero, how-it-works, testimonials carousel, FAQs, dynamic calendar |
| `schedule.html` | JotForm embed (form ID: `251803846453157`) for appointment booking |
| `styles/style.css` | Single CSS file with design tokens in `:root` |
| `.htaccess` | Clean URLs, HTTPS/canonical enforcement, CSP headers |

**Critical:** JotForm handles all form logic—never add custom validation, PHP, or backend code.

## CSS Design Tokens

All styling uses CSS custom properties in `styles/style.css`:
```css
--primary: #002169;      /* Navy - brand, headers */
--accent: #FFCD00;       /* Yellow - CTAs, .btn-primary */
--secondary: #334D87;    /* Body text */
--font-sans: 'Merriweather Sans'  /* Nav, buttons, body */
```

**Never duplicate `:root`**—extend existing declarations only.

## Button Classes
- `.btn-primary` — Yellow background, dark text (CTAs)
- `.btn-secondary` — Outline style, primary border
- `.cta` — Header CTA; add `.cta.active` on current page (inverts to navy/white)

## JavaScript Patterns (index.html)

**Dynamic Calendar:** Renders in `#calendarGrid`. Future weekdays (Mon-Sat) get `.available` class and link to `/schedule`. Never hardcode dates.

**Testimonial Carousel:** Fetches `/assets/data/reviews.json`, creates cards dynamically using `textContent` (not innerHTML) to prevent XSS. Auto-rotates every 6 seconds with touch swipe support.

**Mobile Navigation:** `.mobile-menu-btn` toggles `.mobile-nav.active`. Both navs must mirror link order.

## Data: reviews.json

```json
{
  "reviews": [{
    "reviewer": "Jonathan",      // First name only
    "review_text": "...",
    "state": "New Hampshire",
    "school_district": "Nashua School District",
    "job_title": "High School Mathematics Teacher",
    "time_posted": "4 months ago"
  }]
}
```
Include all fields—`state` and `job_title` display in carousel; `school_district` adds context.

## URL & Linking Rules

`.htaccess` enforces clean URLs. Always link to `/schedule`, never `/schedule.html`. Trailing slashes are stripped.

## Active State Pattern
- Nav links: add `.active` or `aria-current="page"`
- On schedule.html: CTA gets `.cta.active` + `aria-current="page"`

## External Dependencies

- Google Fonts: Merriweather, Merriweather Sans (preconnect required)
- Font Awesome 6.4.0: CDN via cdnjs.cloudflare.com
- JotForm: Embedded script from `form.jotform.com/jsform/251803846453157`

## CSP & Adding External Scripts

`.htaccess` enforces a strict Content-Security-Policy. To add new external resources:
1. Identify the domain (e.g., `https://analytics.example.com`)
2. Update the CSP header in `.htaccess` under the appropriate directive:
   - `script-src` for JavaScript
   - `connect-src` for fetch/XHR endpoints
   - `img-src` for images/pixels
3. Test locally—CSP violations appear in browser console

## Image Assets

Current hero/section images are SVG placeholders. When adding real assets:
- Place in `assets/img/`
- Use descriptive filenames: `hero-educators.webp`, `pension-diagram.svg`
- Prefer WebP for photos, SVG for icons/illustrations
- Update `alt` text to be meaningful (not "placeholder")
- Favicons: SVG primary (`favicon.svg`), with PNG/ICO fallbacks

## Accessibility Patterns

Maintain these conventions throughout:
- Interactive elements: `aria-label` for icon-only buttons (calendar nav, carousel controls)
- Current page: `aria-current="page"` on active nav links
- Dynamic content: `aria-live="polite"` on carousel track for screen reader announcements
- Keyboard navigation: `.available` calendar cells have `tabindex="0"` and `role="button"`
- `<noscript>` fallbacks for calendar and JotForm embed

## Brand Voice

Friendly, trustworthy tone for K-12 educators. Key phrases:
- "independent & conflict-free", "privacy first", "no products, no commissions"
- CTAs: "Schedule an Appointment", "Learn About Your Pension"
