# PSPH Website - TODO List

**Generated:** January 29, 2026  
**Purpose:** Comprehensive list of issues, problems, and unfinished sections identified during code review

---

## 🔴 CRITICAL ISSUES (Fix Immediately)

### 1. Testimonials Content Mismatch ⚠️ HIGH SEVERITY
**Status:** 🔴 CRITICAL - Brand Credibility Risk  
**Location:** `assets/data/reviews.json`, testimonials carousel on index.html

**Problem:**
- One testimonial mentions "Rise North Capital" instead of "PSPH"
- Services mentioned (401k/403b rollovers) don't match PSPH's pension-focused offering
- Appears to be repurposed content from another company

**Example Found:**
- "Cal from Rise North Capital has been incredibly helpful for me over the last year or so..." (Alex Gautieri testimonial)

**Impact:**
- Severely damages credibility and trustworthiness
- Confuses visitors about who they're working with
- Legal/trademark concerns using another company's testimonials

**Action Required:**
1. Remove or replace the testimonial mentioning "Rise North Capital"
2. Source genuine PSPH testimonials from actual clients
3. If PSPH is affiliated with Rise North Capital, add clear disclosure
4. Update reviews.json with verified, accurate testimonials

---

### 2. Legal Pages Incomplete
**Status:** 🔴 CRITICAL - Legal/Compliance Risk  
**Location:** `privacy.html` and `terms.html`

**Problem:**
- Privacy Policy page states "currently being finalized"
- Terms of Service page states "currently being finalized"
- Only placeholder content, not actual legal documents

**Impact:**
- Legal compliance risk (GDPR, CCPA, state privacy laws)
- Cannot collect user data without proper privacy policy
- JotForm data collection may violate regulations

**Action Required:**
1. Draft comprehensive Privacy Policy including:
   - Data collection practices
   - How information is used and shared
   - User rights (access, deletion, opt-out)
   - Cookie policy
   - GDPR/CCPA compliance sections
2. Draft complete Terms of Service including:
   - Service description and limitations
   - User responsibilities
   - Liability disclaimers
   - Dispute resolution procedures
3. Consider consulting a legal professional for review
4. Add "Last Updated" dates to both documents

---

### 3. Missing Real Images
**Status:** 🔴 CRITICAL - Professional Appearance  
**Location:** All sections using `.icon-placeholder` class

**Problem:**
- All content uses Font Awesome icons instead of real images
- Hero section: Generic icon instead of professional photography
- Pension Basics section: Icon placeholder instead of infographic
- About section: Icon instead of team/credentials photo

**Impact:**
- Reduces professional appearance
- Lacks emotional connection with visitors
- Lower conversion rates

**Action Required:**
1. **Hero Section:**
   - Source/create professional photo of diverse K-12 educators
   - Suggested: Teacher consultation scene or group of educators
   - Format: WebP with PNG fallback, optimized for web
2. **Pension Basics Section:**
   - Create infographic showing pension timeline or benefits
   - Could be illustrated diagram or data visualization
3. **About Section:**
   - Add team photo or advisor headshots
   - Include credential badges/certifications if applicable

---

## 🟡 HIGH PRIORITY (Fix Soon)

### 4. Accessibility - Color Contrast Issues
**Status:** 🟡 HIGH - WCAG Compliance  
**Location:** Multiple locations in `styles/style.css`

**Problem:**
- Gray text (`--gray: #526391`) on white may not meet WCAG AA (4.5:1 ratio)
- Calendar "today" indicator (yellow background with primary text) needs verification
- Some secondary text colors may be too light

**Testing Needed:**
- Test all color combinations with contrast checker tool
- Verify minimum 4.5:1 for normal text, 3:1 for large text

**Action Required:**
1. Run automated color contrast audit (WAVE, aXe DevTools)
2. Darken `--gray` color to `#4a5d8a` or darker for better contrast
3. Verify `.calendar-cell.today` has sufficient contrast
4. Add high-contrast mode support if needed

---

### 5. Accessibility - Missing Skip Navigation
**Status:** 🟡 HIGH - WCAG Compliance  
**Location:** All HTML pages

**Problem:**
- No "Skip to main content" link for keyboard users
- Forces keyboard navigation through entire header/nav on every page

**Action Required:**
1. Add skip link at the start of `<body>`:
```html
<a href="#main" class="skip-link">Skip to main content</a>
```
2. Add CSS for visually hidden/keyboard-visible:
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: var(--white);
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
```

---

### 6. Navigation - Active State Issues
**Status:** 🟡 HIGH - User Experience  
**Location:** `scripts/main.js` - `initNavHighlighting()` function

**Problem:**
- Uses deprecated `pageYOffset` instead of `window.scrollY`
- Arbitrary 100px offset instead of dynamic header height calculation
- Active highlighting may not work correctly on all viewport sizes

**Action Required:**
1. Replace `pageYOffset` with `window.scrollY`
2. Calculate header height dynamically:
```javascript
const headerHeight = document.querySelector('.header').offsetHeight;
if (window.scrollY >= (sectionTop - headerHeight - 20)) {
  current = section.getAttribute('id');
}
```

---

### 7. Scroll Offset for Anchor Links
**Status:** 🟡 HIGH - User Experience  
**Location:** `styles/style.css` - section anchor targeting

**Problem:**
- When clicking anchor links, content gets hidden under sticky header
- Current `scroll-padding-top: 80px` on `html` may not be sufficient
- Sticky header is approximately 74px tall but needs buffer

**Action Required:**
1. Verify header height across breakpoints
2. Adjust `scroll-padding-top` to account for header + buffer:
```css
html {
  scroll-padding-top: 90px;
}
```
3. Ensure `section[id]` has matching `scroll-margin-top: 90px;`

---

### 8. Mobile Calendar UX
**Status:** 🟡 HIGH - Touch Accessibility  
**Location:** `styles/style.css` - calendar grid at mobile breakpoint

**Problem:**
- Calendar cells at 576px breakpoint have `min-height: 44px` but `padding: 8px`
- With small font size, touch targets may not meet 44x44px minimum
- Gap reduced to 2px makes precision tapping difficult

**Action Required:**
1. Increase minimum cell size:
```css
@media (max-width: 576px) {
  .calendar-cell {
    min-height: 48px;
    min-width: 48px;
    padding: 10px;
  }
}
```
2. Test on actual mobile devices for tap accuracy

---

### 9. Schedule Page - Sparse Content
**Status:** 🟡 HIGH - Conversion Rate  
**Location:** `schedule.html`

**Problem:**
- Page only has title and JotForm embed
- No context about what to expect
- No trust indicators or reassurance
- No fallback if user changes mind

**Action Required:**
1. Add content above form:
   - "Book your complimentary 30-minute pension consultation"
   - What to expect in the session
   - What to bring/prepare
2. Add trust indicators:
   - "100% confidential"
   - "No obligation"
   - Icons for security/privacy
3. Add "Need more information?" link back to homepage
4. Consider adding FAQ or testimonial snippet

---

## 🟢 MEDIUM PRIORITY (Schedule for Future)

### 10. Commented-Out Code
**Status:** 🟢 MEDIUM - Code Maintenance  
**Location:** `index.html` lines 141-160

**Problem:**
- "Quick Links" section is commented out
- Unclear if this is intentional or temporary
- Makes HTML harder to maintain

**Action Required:**
1. Decide: implement the Quick Links section or remove it entirely
2. If keeping commented for future use, add clear comment explaining why:
```html
<!-- Quick Links section temporarily disabled pending design review - [DATE] -->
```

---

### 11. JotForm Loading State
**Status:** 🟢 MEDIUM - User Experience  
**Location:** `schedule.html` and `scripts/main.js` - `initJotFormLoading()`

**Problem:**
- Loading indicator exists but implementation could be improved
- No error handling if JotForm fails to load
- User sees blank page if JavaScript fails

**Action Required:**
1. Enhance loading state in `initJotFormLoading()`:
   - Add timeout detection (if not loaded after 15 seconds, show error)
   - Add error message with alternative contact methods
2. Improve fallback:
```javascript
setTimeout(() => {
  if (!formWrapper.classList.contains('loaded')) {
    formWrapper.innerHTML = `
      <div class="error-message">
        <p>Having trouble loading the form?</p>
        <p>Please email us at <a href="mailto:hello@psph.org">hello@psph.org</a> 
        or call (603) 960-4295</p>
      </div>
    `;
  }
}, 15000);
```

---

### 12. Testimonial Length Handling
**Status:** 🟢 MEDIUM - User Experience  
**Location:** `scripts/main.js` - testimonial carousel

**Problem:**
- Some testimonials are 200+ words (very long)
- Makes carousel cards inconsistent heights
- Difficult for users to scan quickly

**Action Required:**
1. Add character limit/truncation:
```javascript
const maxLength = 300;
let reviewText = review.review_text;
if (reviewText.length > maxLength) {
  reviewText = reviewText.substring(0, maxLength) + '...';
}
```
2. Or implement "Read more" expansion functionality
3. Consider showing only excerpt with full text on click

---

### 13. FAQ Content Depth
**Status:** 🟢 MEDIUM - Content Quality  
**Location:** `index.html` FAQs section

**Problem:**
- FAQ answers are only 1 sentence each
- Not enough information to be truly helpful
- Could provide more value to visitors

**Current Examples:**
- Q: "Is there a cost?" A: "Pricing or 'free' shown before booking."
- Q: "What should I bring?" A: "Recent pay stub, service credit info, your questions."

**Action Required:**
1. Expand each answer to 2-3 sentences with more detail
2. Example improvement:
```html
<div class="faq-item">
  <h3><i class="fas fa-clock"></i> Is there a cost? How long is the session?</h3>
  <p>Each session is 30 minutes long and conducted via video call or phone. 
  Pricing information is displayed when you select a time slot to book. 
  Many first-time consultations are offered complimentary to help you understand your pension options.</p>
</div>
```
3. Consider adding more FAQs covering common concerns

---

### 14. Missing Value Proposition Details
**Status:** 🟢 MEDIUM - Content/Marketing  
**Location:** Hero and About sections

**Problem:**
- "Independent & conflict-free" is mentioned but not explained
- No specific differentiators from other pension advisors
- Missing key value propositions

**Action Required:**
1. Expand badge group with specific differentiators:
```html
<div class="badge-group">
  <span class="badge">No products or commissions</span>
  <span class="badge">Independent advisors</span>
  <span class="badge">K-12 pension specialists</span>
</div>
```
2. Add "Why PSPH?" section with bullet points:
   - "Specialized in public school pension systems"
   - "No sales quotas or product pitches"
   - "Experienced educators as advisors"

---

### 15. Mobile Menu UX Improvements
**Status:** 🟢 MEDIUM - User Experience  
**Location:** `styles/style.css` mobile navigation

**Problem:**
- Mobile menu opens without backdrop overlay
- No visual "close" indicator besides hamburger animation
- Could be more intuitive

**Action Required:**
1. Add backdrop overlay:
```css
.mobile-nav-backdrop {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 98;
}
.mobile-nav-backdrop.active {
  display: block;
}
```
2. Add JavaScript to create/toggle backdrop
3. Consider adding "✕ Close Menu" text in mobile nav

---

### 16. Focus Styles Missing
**Status:** 🟢 MEDIUM - Accessibility  
**Location:** `styles/style.css` - all interactive elements

**Problem:**
- No custom focus styles defined
- Relies on browser defaults which may not be consistent
- Could be more visible for keyboard users

**Action Required:**
1. Add global focus style:
```css
a:focus,
button:focus,
input:focus,
[tabindex="0"]:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```
2. Add specific focus styles for buttons:
```css
.btn:focus {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}
```

---

### 17. Calendar Interaction Clarity
**Status:** 🟢 MEDIUM - User Experience  
**Location:** Calendar section on `index.html`

**Problem:**
- No indication that dates are clickable until hover
- Users might not realize they can click dates
- Missing instructional text

**Action Required:**
1. Add instructional text above calendar:
```html
<p style="text-align: center; color: var(--gray); margin-bottom: 1rem;">
  <i class="fas fa-hand-pointer"></i> Click any highlighted date to view available times
</p>
```
2. Ensure `.calendar-cell.available` has `cursor: pointer` (already has it)
3. Consider adding subtle pulse animation to available dates

---

### 18. Performance - External Dependencies
**Status:** 🟢 MEDIUM - Performance  
**Location:** All HTML pages - `<head>` section

**Problem:**
- Font Awesome loads entire library (5000+ icons) for ~15 icons used
- Multiple Google Fonts weights may not all be needed
- External dependencies increase load time

**Action Required:**
1. Replace Font Awesome with inline SVG icons for only icons used
2. Audit Google Fonts usage:
   - Currently loads: 400, 600, 700 weights
   - Verify all weights are actually used
3. Consider self-hosting fonts for better caching control
4. Add resource hints:
```html
<link rel="dns-prefetch" href="https://form.jotform.com">
<link rel="dns-prefetch" href="https://api.jotform.com">
```

---

### 19. Hero Heading Responsive Size
**Status:** 🟢 MEDIUM - Mobile UX  
**Location:** UI_AUDIT_REPORT.md identifies this, `styles/style.css` line 256

**Problem:**
- Hero h1 at 2.8rem is too large on mobile screens
- Global responsive rule doesn't override `.hero h1` specific rule
- Text may wrap awkwardly on small screens

**Action Required:**
1. Add mobile-specific override:
```css
@media (max-width: 576px) {
  .hero h1 {
    font-size: 1.8rem;
  }
}
```

---

## 🔵 LOW PRIORITY (Nice to Have)

### 20. Back to Top Button
**Status:** 🔵 LOW - Enhancement  
**Location:** All pages

**Problem:**
- Long page with no easy way to return to top
- User must scroll back up manually

**Action Required:**
1. Add floating back-to-top button:
```html
<button id="backToTop" class="back-to-top" aria-label="Back to top">
  <i class="fas fa-arrow-up"></i>
</button>
```
2. Add CSS for positioning and show/hide
3. Add JavaScript to show after scrolling down 300px

---

### 21. Analytics Implementation
**Status:** 🔵 LOW - Business Intelligence  
**Location:** All pages

**Problem:**
- No analytics tracking visible
- Cannot measure user behavior or conversion rates
- No way to optimize based on data

**Action Required:**
1. Add Google Analytics 4 or similar
2. Track key events:
   - CTA button clicks
   - Calendar interactions
   - Form views/submissions
   - Scroll depth
3. Set up conversion goals for appointment bookings

---

### 22. Meta Tags Enhancement
**Status:** 🔵 LOW - SEO  
**Location:** All HTML pages `<head>` sections

**Problem:**
- Basic meta tags present but could be enhanced
- Missing Open Graph tags for social sharing
- Missing Twitter Card tags

**Action Required:**
1. Add Open Graph tags:
```html
<meta property="og:title" content="PSPH - K-12 Pension Guidance">
<meta property="og:description" content="Independent, conflict-free pension guidance for K-12 educators.">
<meta property="og:image" content="/assets/img/og-image.jpg">
<meta property="og:url" content="https://psph.org">
```
2. Add Twitter Card tags
3. Create social sharing image (og-image.jpg)

---

### 23. Form Accessibility Enhancement
**Status:** 🔵 LOW - Accessibility  
**Location:** `schedule.html` JotForm embed

**Problem:**
- JotForm accessibility depends on their implementation
- Cannot control form structure directly

**Action Required:**
1. Test JotForm with screen reader (NVDA or JAWS)
2. Contact JotForm support if issues found
3. Ensure JotForm account has accessibility features enabled
4. Consider adding custom form if JotForm accessibility is inadequate

---

### 24. Structured Data / Schema Markup
**Status:** 🔵 LOW - SEO  
**Location:** All pages

**Problem:**
- No structured data markup for search engines
- Missing opportunity for rich snippets in search results

**Action Required:**
1. Add Organization schema to footer:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Public School Pension Help",
  "url": "https://psph.org",
  "telephone": "+1-603-960-4295",
  "email": "hello@psph.org"
}
</script>
```
2. Add Service schema for pension consultation services
3. Add Review schema for testimonials (once verified)

---

### 25. Progressive Web App Enhancement
**Status:** 🔵 LOW - Enhancement  
**Location:** Root directory, `site.webmanifest`

**Problem:**
- Basic manifest exists but PWA features not fully implemented
- No service worker for offline functionality
- No add-to-home-screen prompt customization

**Action Required:**
1. Review and enhance `site.webmanifest`:
   - Verify all icon sizes are available
   - Add `description`, `categories`, `screenshots`
2. Consider adding service worker for basic offline functionality
3. Add install prompt for mobile users

---

### 26. CSS Variables Documentation
**Status:** 🔵 LOW - Maintenance  
**Location:** `styles/style.css` - `:root` section

**Problem:**
- CSS custom properties are well-organized but not documented
- New developers might not understand usage conventions

**Action Required:**
1. Add comments to CSS variables:
```css
:root {
  /* Brand Colors */
  --primary: #002169;      /* Navy - Primary brand color, headers, CTAs */
  --accent: #FFCD00;       /* Yellow - Accent color, buttons, highlights */
  
  /* Semantic Colors */
  --secondary: #334D87;    /* Body text, secondary elements */
  --gray: #526391;         /* Helper text, captions */
  
  /* Typography */
  --font-sans: 'Merriweather Sans', sans-serif;  /* UI elements, body */
  --font-serif: 'Merriweather', serif;           /* Not currently used */
}
```

---

### 27. Image Optimization Strategy
**Status:** 🔵 LOW - Performance  
**Location:** Future image assets

**Problem:**
- When real images are added, need optimization strategy
- Should use modern formats and responsive images

**Action Required:**
1. Document image optimization process:
   - Primary format: WebP with fallback
   - Use `<picture>` element for art direction
   - Implement lazy loading: `loading="lazy"`
2. Create image guidelines:
   - Hero images: Max 1920x1080, optimized to <200KB
   - Icons/logos: Use SVG when possible
   - Photos: Compress to 80% quality
3. Example implementation:
```html
<picture>
  <source srcset="hero.webp" type="image/webp">
  <source srcset="hero.jpg" type="image/jpeg">
  <img src="hero.jpg" alt="Description" loading="lazy">
</picture>
```

---

### 28. Error Pages (404, 500)
**Status:** 🔵 LOW - User Experience  
**Location:** Missing

**Problem:**
- No custom 404 or 500 error pages
- Users see generic server error pages
- Missed opportunity to guide users back to site

**Action Required:**
1. Create `404.html` with:
   - Friendly "Page not found" message
   - Search functionality or sitemap
   - Links to main sections
   - Contact information
2. Update `.htaccess` to use custom error pages:
```apache
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
```

---

### 29. Print Stylesheet
**Status:** 🔵 LOW - Accessibility  
**Location:** Missing

**Problem:**
- No print-specific styles
- Page might not print well

**Action Required:**
1. Add print media query at end of `style.css`:
```css
@media print {
  .header,
  .mobile-nav,
  .cta-section,
  .footer {
    display: none;
  }
  
  body {
    background: white;
    color: black;
  }
  
  a {
    text-decoration: none;
    color: black;
  }
  
  a[href^="http"]:after {
    content: " (" attr(href) ")";
  }
}
```

---

### 30. Code Documentation
**Status:** 🔵 LOW - Maintenance  
**Location:** `scripts/main.js`

**Problem:**
- JavaScript has section comments but could be more detailed
- No JSDoc comments for functions
- Makes maintenance harder for new developers

**Action Required:**
1. Add JSDoc comments to functions:
```javascript
/**
 * Initializes the testimonial carousel
 * Fetches reviews from JSON, creates carousel cards,
 * sets up navigation and auto-rotation
 * @returns {Promise<void>}
 */
async function loadTestimonials() {
  // ...
}
```

---

## 📋 SUGGESTED FUTURE ENHANCEMENTS

### 31. Enhanced Calendar Integration
- Direct calendar booking instead of redirect to schedule page
- Show time slots for selected date
- Real-time availability from booking system
- Google Calendar / Outlook integration

### 32. Live Chat or Chatbot
- Add live chat for immediate questions
- AI chatbot for common pension questions
- Integration with scheduling system

### 33. Blog or Resources Section
- Pension education articles
- State-specific pension guides
- FAQ database with search
- Downloadable pension checklists

### 34. Client Portal
- Secure login for clients
- View session notes and action plans
- Upload documents securely
- Message advisor

### 35. Multi-language Support
- Spanish language option (common in K-12)
- Language switcher in header
- Translated content for major sections

---

## 🔄 ONGOING MAINTENANCE TASKS

### Regular Updates
- [ ] Update testimonials quarterly (after verifying authenticity)
- [ ] Review and update FAQ based on common questions
- [ ] Update footer copyright year annually
- [ ] Monitor and update browser compatibility

### Performance Monitoring
- [ ] Run Lighthouse audit monthly
- [ ] Check Core Web Vitals (LCP, FID, CLS)
- [ ] Monitor external dependency uptime
- [ ] Review analytics for user behavior insights

### Security
- [ ] Review and update CSP headers as needed
- [ ] Keep external dependencies updated
- [ ] Monitor for security vulnerabilities
- [ ] Review JotForm security settings

### Accessibility
- [ ] Run automated accessibility tests monthly
- [ ] Test with actual assistive technologies
- [ ] Review WCAG guidelines for updates
- [ ] Gather feedback from users with disabilities

---

## 📝 NOTES

### Technical Debt
- Consider migrating from inline scripts to external JS files for better CSP
- Evaluate if Font Awesome is worth the bundle size
- Review if all CSS is being used (potential for optimization)

### Design System
- Document component patterns for consistency
- Create style guide for future content
- Define spacing scale and document usage

### Testing Checklist
Before launch or major updates, test:
- [ ] All links work (internal and external)
- [ ] Forms submit correctly
- [ ] Mobile navigation works on all devices
- [ ] Calendar displays correctly in all timezones
- [ ] Images load and have proper alt text
- [ ] Page loads in under 3 seconds
- [ ] Works in Chrome, Firefox, Safari, Edge
- [ ] Works on iOS and Android
- [ ] Keyboard navigation works completely
- [ ] Screen reader announces content properly

---

**End of TODO List**  
*Last Updated: January 29, 2026*  
*Review this list monthly and update priorities as needed.*
