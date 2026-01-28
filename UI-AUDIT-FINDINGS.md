# PSPH Website - UI Audit Findings

**Audit Date:** January 28, 2026  
**Pages Reviewed:** index.html, schedule.html  
**Testing Scope:** Desktop (1920x1080), Mobile (375x667), Tablet responsiveness

---

## Executive Summary

This audit identified **16 UI/UX issues** across the PSPH website, ranging from critical functional problems to minor polish opportunities. The findings are categorized by severity and organized to prioritize user experience impact.

---

## 🔴 Critical Issues (Must Fix)

### 1. Duplicate CSS Styles Causing Inconsistency
**Location:** `/styles/style.css` (lines 1-617, then 618-1516)  
**Issue:** The entire CSS ruleset is duplicated with conflicting color values:
- First declaration: `--primary: #002169` (Navy blue - matches brand)
- Second declaration: `--primary: #150070` (Purple - conflicts with brand)

**Impact:** Unpredictable styling behavior, potential browser inconsistencies  
**Recommendation:** Remove duplicate styles (lines 618-1516) and consolidate into single ruleset

**Evidence:**
```css
/* Lines 8-24 - First definition */
:root {
  --primary: #002169;        /* Navy - correct brand color */
  --accent: #FFCD00;         /* Yellow */
  /* ... */
}

/* Lines 625-637 - Duplicate conflicting definition */
:root {
  --primary: #150070;        /* Purple - wrong! */
  --accent: #ff6b35;         /* Orange - wrong! */
  /* ... */
}
```

---

### 2. Outdated Calendar Display
**Location:** `index.html` - Calendar section (lines 112-177)  
**Issue:** Static calendar shows "October 2023" which is 27+ months outdated  
**Impact:** Damages credibility, suggests website is unmaintained  
**Recommendation:** Update to current month dynamically with JavaScript

---

### 3. Non-Functional Calendar Interactions
**Location:** `index.html` - Calendar section  
**Issue:** 
- Calendar navigation buttons (prev/next month) have no functionality
- "Available" dates are clickable but do nothing
- No integration with actual scheduling system

**Impact:** Creates user frustration, broken user journey  
**Recommendation:** Have the calendar bring users to the scheduling form.

---

### 4. Placeholder Contact Information
**Location:** `index.html` - Contact Us section (line 339)  
**Issue:** Phone number displays as "(555) 123-4567" - a universally recognized placeholder  
**Impact:** Users cannot actually contact the business, appears unprofessional  
**Recommendation:** Replace with (603) 960-4295

---

## 🟡 High Priority Issues (Should Fix)

### 5. Footer Navigation Links Lead Nowhere
**Location:** Both `index.html` (lines 367-369) and `schedule.html` (lines 90-92)  
**Issue:** All footer links have `href="#"` (Disclaimer, Privacy Policy, Terms of Service)  
**Impact:** Legal compliance concerns, unprofessional appearance  
**Recommendation:** 
- Create actual policy pages or link to hosted versions
- At minimum, remove dead links until pages are ready

```html
<!-- Current (broken) -->
<a href="#">Disclaimer</a>
<a href="#">Privacy Policy</a>
<a href="#">Terms of Service</a>
```

---

### 6. Circular/Broken Internal Links
**Location:** `index.html`  
**Issues:**
1. "Read More Educator Stories" (line 216) links to `#testimonials` - same section it's in
2. "Learn More" about PSPH (line 227) links to `#about` - same section
3. "Explore Pension Basics" (line 254) links to `#pension-basics` - same section
4. "View All FAQs" (line 291) links to `#faqs` - same section

**Impact:** Confusing user experience, links appear broken  
**Recommendation:** Either create dedicated pages for these sections or remove the links

---

### 7. Inconsistent Navigation Order Between Desktop/Mobile
**Location:** `index.html` navigation (lines 31-37 vs 50-54)  
**Issue:** Menu items appear in different order:
- **Desktop:** How it works, Stories, About, Pension Basics, FAQs
- **Mobile:** How it works, Pension Basics, About, Stories, (Schedule)

**Impact:** Confusing for users switching between devices  
**Recommendation:** Standardize order across both menus

---

### 8. Missing FAQ Link in Mobile Navigation
**Location:** `index.html` - Mobile navigation (lines 50-54)  
**Issue:** Desktop nav includes "FAQs" link, mobile nav omits it  
**Impact:** Mobile users cannot easily jump to FAQ section  
**Recommendation:** Add FAQ link to mobile menu for consistency

```html
<!-- Current mobile nav -->
<div class="mobile-nav">
  <a href="#how-it-works">How it works</a>
  <a href="#pension-basics">Pension Basics</a>
  <a href="#about">About</a>
  <a href="#testimonials">Stories</a>
  <a href="schedule.html">Schedule an Appointment</a>
  <!-- Missing: FAQs link -->
</div>
```

---

## 🟢 Medium Priority Issues (Nice to Fix)

### 9. Missing SEO Meta Descriptions
**Location:** Both HTML pages  
**Issue:** No `<meta name="description">` tags for search engine optimization  
**Impact:** Poor search engine visibility, missing social media preview descriptions  
**Recommendation:** Add descriptive meta tags:

```html
<meta name="description" content="PSPH provides independent, conflict-free pension guidance for K-12 educators. Schedule a complimentary 30-minute consultation to understand your pension options.">
```

---

### 10. Placeholder Images Throughout Site
**Location:** Multiple sections (hero, about, pension basics)  
**Issue:** All images are SVG placeholders with text like "Illustration of educators"  
**Impact:** Unprofessional appearance, reduced visual engagement  
**Recommendation:** Replace with:
- Stock photos of educators
- Custom illustrations
- Infographics for pension concepts

---

### 11. Generic Testimonials Without Names
**Location:** `index.html` - Testimonials section (lines 207-214)  
**Issue:** Testimonials only show job titles, no names or initials  
**Impact:** Reduced credibility and trust  
**Recommendation:** Add first names or initials:
- "Sarah T., 5th Grade Teacher" 
- "John M., High School Counselor"

---

### 12. No Visual Active State for Navigation
**Location:** Navigation styling in CSS  
**Issue:** While JavaScript adds `.active` class, there's limited visual indication of current section  
**Impact:** Users may feel lost when scrolling through long page  
**Recommendation:** Enhance active state styling:

```css
.nav a.active {
  color: var(--primary);
  font-weight: 700;
  border-bottom: 3px solid var(--accent);
}
```

---

### 13. Schedule Page Missing Back Navigation
**Location:** `schedule.html`  
**Issue:** No breadcrumb or back button to return to home page easily  
**Impact:** Users may use browser back button or feel trapped  
**Recommendation:** Add breadcrumb or prominent back link above form

---

## 🔵 Low Priority Issues (Polish)

### 14. Inconsistent Button Styling Between Pages
**Location:** Various  
**Issue:** Schedule page has different CTA button styling than homepage  
**Impact:** Slight brand inconsistency  
**Recommendation:** Ensure all buttons use `.btn-primary` class consistently

---

### 15. Missing Loading States for Form
**Location:** `schedule.html` - JotForm embed  
**Issue:** No loading indicator while JotForm script loads  
**Impact:** User sees blank space temporarily  
**Recommendation:** Add CSS loading spinner or skeleton screen

---

### 16. Calendar Section May Confuse Users During Migration
**Location:** `index.html` - Calendar preview  
**Issue:** Shows calendar preview but clicking leads to JotForm (different UX)  
**Impact:** User expects calendar interaction but gets form  
**Recommendation:** Post-migration, remove calendar preview entirely or replace with benefits list

---

## Accessibility Findings

### ✅ Strengths
- Good use of semantic HTML (`<header>`, `<nav>`, `<section>`, `<footer>`)
- ARIA labels present on navigation
- Proper heading hierarchy (h1 → h2 → h3)
- Mobile-responsive design implemented

### ⚠️ Opportunities
1. **Missing skip-to-content link** for keyboard navigation
2. **Calendar dates lack ARIA labels** describing availability
3. **Mobile menu toggle lacks ARIA expanded state**
4. **Placeholder SVGs need better alt text** or aria-label

**Recommendation:** Add accessibility improvements:
```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<button class="mobile-menu-btn" 
        aria-label="Toggle navigation" 
        aria-expanded="false">
```

---

## Performance Notes

### Current State
- ✅ External CDN fonts (Google Fonts) loaded efficiently with preconnect
- ✅ Font Awesome loaded from CDN
- ✅ Minimal JavaScript (vanilla JS, no frameworks)
- ⚠️ Multiple SVG shapes could be optimized or moved to sprite

### Recommendations
1. Consider lazy-loading images below fold
2. Inline critical CSS for above-fold content
3. Add loading="lazy" to images

---

## Testing Notes

**Browsers Tested:** Chromium-based (automated)  
**Devices:** Desktop (1920x1080), Mobile simulation (375x667)  
**Functionality Tested:**
- ✅ Mobile menu toggle works
- ✅ Smooth scrolling to anchors works
- ✅ Header sticky positioning works
- ❌ Calendar interactions non-functional (as noted)
- ❌ JotForm embed blocked in test environment (external resource)

---

## Prioritized Action Items

### Phase 1: Critical Fixes (Week 1)
1. Remove duplicate CSS rules (Issue #1)
2. Update or remove outdated calendar (Issue #2)
3. Replace placeholder phone number (Issue #4)
4. Fix footer links or remove them (Issue #5)

### Phase 2: UX Improvements (Week 2)
5. Standardize navigation across desktop/mobile (Issues #7, #8)
6. Fix circular internal links (Issue #6)
7. Remove non-functional calendar interactions (Issue #3)

### Phase 3: Polish (Week 3)
8. Add real images and testimonials (Issues #10, #11)
9. Implement SEO meta tags (Issue #9)
10. Enhance navigation active states (Issue #12)

### Phase 4: Accessibility & Performance (Ongoing)
11. Add accessibility improvements
12. Optimize image loading
13. Test across multiple browsers and devices

---

## Screenshots Reference

### Desktop View
![Homepage Desktop](https://github.com/user-attachments/assets/e849aefc-0401-423e-b503-d6790ce4a590)
*Homepage showing full layout with navigation, hero, and content sections*

### Schedule Page
![Schedule Page](https://github.com/user-attachments/assets/a9fb08d9-0928-46c2-b7b5-aa3f81a04d5f)
*Appointment scheduling page with JotForm integration*

### Mobile View
![Mobile Homepage](https://github.com/user-attachments/assets/58dfacc3-3371-4043-be6e-249b0529b9dd)
*Mobile responsive view showing hamburger menu and stacked layout*

### Mobile Navigation
![Mobile Menu Open](https://github.com/user-attachments/assets/b0b8b9da-5d83-42b9-8b2d-9584e498f93c)
*Mobile navigation menu expanded state*

---

## Conclusion

The PSPH website has a solid foundation with good semantic HTML, responsive design, and clear information architecture. However, it suffers from several "launch readiness" issues including outdated content, placeholder data, and non-functional elements.

**Estimated Effort:**
- Critical fixes: 4-6 hours
- High priority: 6-8 hours  
- Medium priority: 8-10 hours
- Total: ~20-24 hours for complete remediation

**Recommended Next Steps:**
1. Address all critical issues before any marketing push
2. Create real content (images, testimonials, contact info)
3. Complete JotForm migration and remove old calendar code
4. Conduct user testing with actual K-12 educators
5. Implement analytics to track user behavior and pain points

---

**Audit Conducted By:** GitHub Copilot Agent  
**Review Status:** Ready for team review  
**Next Review:** After Phase 1 fixes are implemented
