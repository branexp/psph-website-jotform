# PSPH Website - Copilot Instructions

## Project Overview

Static marketing website for **Public School Pension Help (PSPH)** — a service providing K-12 educators with pension guidance. The site is migrating from a custom PHP scheduler to an embedded JotForm solution.

**Key pages:**
- [index.html](../index.html) — Landing page with sections: hero, how-it-works, testimonials, FAQs
- [schedule.html](../schedule.html) — Appointment scheduling (JotForm embed in progress)

## Architecture & Migration Context

This site is undergoing a **JotForm migration** documented in [MIGRATION_JOTFORM.md](../MIGRATION_JOTFORM.md). The old PHP/JS scheduler is being replaced with JotForm form ID `251803846453157`.

**Current state:**
- Form fields still exist in `schedule.html` but will be replaced by JotForm script embed
- Backend files (`send-email.php`, `src/PHPMailer`) have been removed
- JSON data files in `assets/data/` are empty placeholders (district/school data moved to JotForm)

## CSS Design System

All styling uses CSS custom properties defined in [styles/style.css](../styles/style.css):

```css
--primary: #002169;        /* Navy blue - headers, brand */
--accent: #FFCD00;         /* Yellow - CTAs, buttons */
--secondary: #334D87;      /* Body text */
--font-serif: 'Merriweather'    /* Headings, body */
--font-sans: 'Merriweather Sans' /* Navigation, buttons */
```

**Button conventions:**
- `.btn-primary` — Yellow accent background
- `.btn-secondary` — Outline style
- `.cta` — Header call-to-action (yellow)

## File Structure Conventions

| Directory | Purpose |
|-----------|---------|
| `assets/data/` | JSON data files (reviews, districts, schools) |
| `assets/img/` | Favicons, logos, manifest |
| `styles/` | CSS stylesheets (main: `style.css`) |
| `tools/` | Internal utilities (CSV parser for data extraction) |

## Testimonials Data

Reviews are stored in [assets/data/reviews.json](../assets/data/reviews.json) with this structure:
```json
{
  "reviewer": "Name",
  "review_text": "...",
  "state": "New Hampshire",
  "school_district": "...",
  "job_title": "High School Teacher"
}
```

## Development Notes

- **No build process** — Static HTML/CSS/JS served directly
- **External CDNs used:** Font Awesome 6.4.0, Google Fonts
- **Mobile navigation:** Toggle via `.mobile-menu-btn` → `.mobile-nav.active`
- **Parser tool:** [tools/parser.html](../tools/parser.html) uses PapaParse to extract unique names from CSV files for district/school data

## When Modifying Forms

The scheduling form is transitioning to JotForm. Do NOT add custom form validation or PHP processing. The embed will handle:
- Field validation
- Email notifications (autoresponder + admin)
- Thank-you page display
- Spam protection

## Brand Voice

- Friendly, trustworthy tone for K-12 educators
- Emphasize: "independent & conflict-free", "privacy first"
- Action-oriented CTAs: "Schedule an Appointment", "Learn About Your Pension"
