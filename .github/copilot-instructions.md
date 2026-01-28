# PSPH Website - Copilot Instructions

## Project Overview

Static marketing website for **Public School Pension Help (PSPH)** — pension guidance for K-12 educators. No build process; files served directly via Apache.

**Production URL:** `https://psph.org` (enforced via `.htaccess` canonical redirects)

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | Landing page: hero, how-it-works, testimonials, FAQs, dynamic calendar |
| `schedule.html` | JotForm embed (form ID: `251803846453157`) |
| `styles/style.css` | Single CSS file with design tokens in `:root` |
| `.htaccess` | URL rewrites (clean URLs), security headers, HTTPS enforcement |
| `tools/parser.html` | Internal utility for CSV→JSON district/school extraction |

**JotForm Integration:** Scheduling uses an embedded JotForm script—do NOT add custom form validation, PHP, or backend logic. JotForm handles validation, notifications, and spam protection.

## CSS Design System

All styling uses CSS custom properties in [styles/style.css](../styles/style.css):

```css
--primary: #002169;        /* Navy blue - headers, brand */
--accent: #FFCD00;         /* Yellow - CTAs, buttons */
--secondary: #334D87;      /* Body text */
--font-serif: 'Merriweather'    /* Headings, body */
--font-sans: 'Merriweather Sans' /* Navigation, buttons */
```

**Critical:** Never duplicate `:root` declarations—this caused a prior bug ([UI-AUDIT-FINDINGS.md](../UI-AUDIT-FINDINGS.md)).

**Button classes:** `.btn-primary` (yellow), `.btn-secondary` (outline), `.cta` (header CTA)

## Key Patterns

**Dynamic Calendar (index.html):** JavaScript generates calendar grid in `#calendarGrid`. Weekdays in the future get `.available` class and link to schedule page. Avoid static date markup.

**Mobile Navigation:** Toggle via `.mobile-menu-btn` → `.mobile-nav.active`. Both navs must have identical link order and destinations.

**Active State Convention:** 
- Nav links: `.active` or `aria-current="page"`
- CTA button on current page: `.cta.active` (inverts to primary/white)

## Data Files

| File | Purpose |
|------|---------|
| `assets/data/reviews.json` | Testimonials displayed on homepage |
| `assets/img/` | Favicons (SVG primary), logos, PWA manifest |

**reviews.json structure:**
```json
{
  "reviews": [
    {
      "reviewer": "Jonathan",           // First name only (privacy)
      "time_posted": "4 months ago",    // Relative time string
      "review_text": "Full testimonial text...",
      "state": "New Hampshire",         // Used for geographic relevance
      "school_district": "Nashua School District",
      "job_title": "High School Mathematics Teacher"
    }
  ]
}
```
Reviews are wrapped in a `reviews` array. When adding new testimonials, include all fields—`state` and `school_district` help visitors identify educators in similar roles.

## External Dependencies

- **Google Fonts:** Merriweather, Merriweather Sans (preconnect to `fonts.googleapis.com`)
- **Font Awesome 6.4.0:** CDN via `cdnjs.cloudflare.com`
- **JotForm:** Embedded via `form.jotform.com/jsform/251803846453157`

## URL Structure

`.htaccess` enforces clean URLs—link to `/schedule` not `/schedule.html`. Test links work with and without trailing slash.

## Brand Voice

- Friendly, trustworthy tone for K-12 educators
- Key phrases: "independent & conflict-free", "privacy first", "no products, no commissions"
- CTAs: "Schedule an Appointment", "Learn About Your Pension"
