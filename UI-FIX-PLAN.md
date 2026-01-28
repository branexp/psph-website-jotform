# PSPH Website UI Fix Implementation Plan

**Created:** January 28, 2026  
**Status:** Ready for Implementation  
**Estimated Effort:** 4-6 hours

---

## Overview

This document outlines 10 UI/UX improvements for the PSPH website based on user feedback. Each task includes the specific files to modify, code changes required, and implementation notes.

---

## Task 1: Enlarge and Link the Logo

**Priority:** High  
**Files:** `index.html`, `schedule.html`, `styles/style.css`

### Current State
- Logo uses `.logo` class with `height: 40px`
- Logo is inside a plain `<div class="brand">`, not clickable
- Users cannot click logo to return to homepage

### Changes Required

**index.html (lines 27-29):**
```html
<!-- FROM -->
<div class="brand">
  <img src="/assets/img/psph-logo.svg" alt="PSPH" class="logo" />
</div>

<!-- TO -->
<a href="/" class="brand">
  <img src="/assets/img/psph-logo.svg" alt="PSPH - Return to homepage" class="logo" />
</a>
```

**schedule.html (lines 35-37):** Same change as above

**styles/style.css (line 69):**
```css
/* FROM */
.brand .logo {
  height: 40px;
  width: auto;
}

/* TO */
.brand .logo {
  height: 56px;
  width: auto;
}
```

Also add text-decoration removal for `.brand` link:
```css
.brand {
  text-decoration: none;
}
```

---

## Task 2: Fix Mobile Menu Button Accessibility

**Priority:** High  
**Files:** `index.html`, `schedule.html`

### Current State
- Mobile menu button lacks `aria-expanded` attribute
- Screen readers cannot determine menu state

### Changes Required

**HTML (both files) - Add aria-expanded:**
```html
<!-- FROM -->
<button class="mobile-menu-btn" aria-label="Toggle navigation">

<!-- TO -->
<button class="mobile-menu-btn" aria-label="Toggle navigation" aria-expanded="false">
```

**JavaScript (both files) - Update toggle handler:**
```javascript
// FROM
document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
  document.querySelector('.mobile-nav').classList.toggle('active');
  this.classList.toggle('active');
});

// TO
document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
  document.querySelector('.mobile-nav').classList.toggle('active');
  this.classList.toggle('active');
  const isExpanded = this.classList.contains('active');
  this.setAttribute('aria-expanded', isExpanded);
});
```

---

## Task 3: Update Schedule Page Content

**Priority:** High  
**Files:** `schedule.html`, `styles/style.css`

### Current State
- Contains subtitle text to be removed
- Title is not centered

### Changes Required

**schedule.html (lines 72-75) - Remove subtitle:**
```html
<!-- FROM -->
<div class="form-title-section">
  <h1 class="form-title">Welcome to the Appointment Center!</h1>
  <p class="form-subtitle">In a complimentary one-on-one session, we'll cut through the complexity to give you the clarity and confidence you need.</p>
</div>

<!-- TO -->
<div class="form-title-section">
  <h1 class="form-title">Welcome to the Appointment Center!</h1>
</div>
```

**styles/style.css - Add form title styles:**
```css
/* Schedule Page Form Styles */
.form-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.form-title-section {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  color: var(--primary);
  font-size: 2rem;
  margin-bottom: 0;
}
```

---

## Task 4: Build Testimonial Carousel from JSON

**Priority:** High  
**Files:** `index.html`, `styles/style.css`

### Current State
- Hardcoded generic testimonials
- `assets/data/reviews.json` not being used
- JSON contains 25 reviews with rich data (name, job_title, state, school_district, review_text)

### Changes Required

**index.html - Replace testimonial HTML structure:**
```html
<!-- Replace static testimonial-group with carousel container -->
<section class="testimonials" id="testimonials">
  <div class="container">
    <h2>What educators say</h2>
    <div class="testimonial-carousel">
      <button class="carousel-btn carousel-prev" aria-label="Previous testimonial">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="testimonial-track">
        <!-- Testimonials loaded dynamically from reviews.json -->
      </div>
      <button class="carousel-btn carousel-next" aria-label="Next testimonial">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    <div class="carousel-dots"></div>
    <a href="schedule.html" class="btn btn-secondary">Schedule Your Session</a>
  </div>
</section>
```

**JavaScript - Add carousel logic:**
```javascript
// Testimonial Carousel
async function loadTestimonials() {
  try {
    const response = await fetch('/assets/data/reviews.json');
    const data = await response.json();
    
    // Filter reviews with non-empty review_text
    const reviews = data.reviews.filter(r => r.review_text && r.review_text.trim() !== '');
    
    const track = document.querySelector('.testimonial-track');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    reviews.forEach((review, index) => {
      // Create testimonial card
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      card.innerHTML = `
        <p class="testimonial-text">"${review.review_text}"</p>
        <p class="testimonial-author">${review.reviewer}</p>
        <p class="testimonial-role">${review.job_title}, ${review.state}</p>
      `;
      track.appendChild(card);
      
      // Create dot indicator
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
    
    initCarousel(reviews.length);
  } catch (error) {
    console.error('Failed to load testimonials:', error);
  }
}

let currentSlide = 0;
let autoRotateInterval;

function initCarousel(totalSlides) {
  document.querySelector('.carousel-prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  });
  
  document.querySelector('.carousel-next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  });
  
  // Auto-rotate every 6 seconds
  startAutoRotate(totalSlides);
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function updateCarousel() {
  const track = document.querySelector('.testimonial-track');
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function startAutoRotate(totalSlides) {
  autoRotateInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }, 6000);
}

// Initialize on page load
if (document.querySelector('.testimonial-carousel')) {
  loadTestimonials();
}
```

**styles/style.css - Add carousel styles:**
```css
/* Testimonial Carousel */
.testimonial-carousel {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.testimonial-track {
  display: flex;
  transition: transform 0.5s ease;
  width: 100%;
}

.testimonial-card {
  flex: 0 0 100%;
  background-color: var(--white);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: var(--shadow);
  text-align: center;
}

.testimonial-author {
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.carousel-btn {
  background: var(--primary);
  color: var(--white);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
}

.carousel-btn:hover {
  background: var(--secondary);
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: var(--light-gray);
  cursor: pointer;
  transition: var(--transition);
}

.carousel-dot.active {
  background: var(--primary);
}
```

---

## Task 5: Enable Saturdays in Calendar

**Priority:** Medium  
**Files:** `index.html`

### Current State
- Calendar marks Mon-Fri (dayOfWeek 1-5) as available
- Saturdays (dayOfWeek 6) are excluded

### Changes Required

**index.html JavaScript (around line 425):**
```javascript
// FROM
if (cellDate > today && dayOfWeek >= 1 && dayOfWeek <= 5) {

// TO
if (cellDate > today && dayOfWeek >= 1 && dayOfWeek <= 6) {
```

---

## Task 6: Change Page Background Color

**Priority:** Medium  
**Files:** `styles/style.css`

### Current State
- Body background: `var(--white)` = `#ffffff`

### Changes Required

**styles/style.css (line 41):**
```css
/* FROM */
body {
  font-family: var(--font-serif);
  line-height: 1.6;
  color: var(--secondary);
  background-color: var(--white);
}

/* TO */
body {
  font-family: var(--font-sans);
  line-height: 1.6;
  color: var(--secondary);
  background-color: #f5f7fa;
}
```

---

## Task 7: Replace Footer with New Disclaimer

**Priority:** Medium  
**Files:** `index.html`, `schedule.html`, `styles/style.css`

### Current State
- Simple footer with "PSPH" brand and "© PSPH. All rights reserved."

### Changes Required

**Both HTML files - Replace footer content:**
```html
<!-- FROM -->
<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-brand">PSPH</div>
    </div>
    <div class="footer-copyright">© PSPH. All rights reserved.</div>
  </div>
</footer>

<!-- TO -->
<footer class="footer">
  <div class="container">
    <p class="footer-disclaimer">
      Public School Pension Help (PSPH) helps public employees better understand their pension and retirement options by connecting them with qualified, independent service professionals. PSPH is a coordinating service and is not affiliated with any school district, union, or pension system.
    </p>
    <p class="footer-copyright">© 2026 Public School Pension Help. All rights reserved.</p>
  </div>
</footer>
```

**styles/style.css - Add footer disclaimer styles:**
```css
/* Footer */
.footer {
  padding: 2rem 0;
  background-color: var(--dark);
  color: var(--white);
  text-align: center;
}

.footer-disclaimer {
  font-size: 0.85rem;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto 1rem;
  color: var(--light-gray);
}

.footer-copyright {
  font-size: 0.8rem;
  color: var(--light-gray);
}
```

---

## Task 8: Reorder Page Sections to Match Navigation

**Priority:** Medium  
**Files:** `index.html`

### Current State
- **Navigation order:** How it works → Pension Basics → About → Stories → FAQs
- **Page order:** How it works → Stories → About → Pension Basics → FAQs

### Changes Required

Move HTML sections to match navigation order:

1. Hero (unchanged)
2. `#how-it-works` (unchanged)
3. `#pension-basics` ← Move UP (currently after About)
4. `#about` ← Move DOWN
5. `#testimonials` (Stories) ← Move DOWN (currently after How it works)
6. `#faqs` (unchanged)
7. `.cta-section` (unchanged)
8. `#contact` (unchanged)
9. Footer (unchanged)

**Implementation:** Cut and paste section blocks to reorder.

---

## Task 9: Switch All Text to Merriweather Sans

**Priority:** Medium  
**Files:** `styles/style.css`

### Current State
- Body uses `var(--font-serif)` (Merriweather)
- Only nav/buttons use `var(--font-sans)` (Merriweather Sans)

### Changes Required

**styles/style.css (line 41):**
```css
/* FROM */
body {
  font-family: var(--font-serif);
  ...
}

/* TO */
body {
  font-family: var(--font-sans);
  ...
}
```

**styles/style.css - Update headings (around line 50):**
```css
/* FROM */
h1, h2, h3, h4 {
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--dark);
}

/* TO */
h1, h2, h3, h4 {
  font-family: var(--font-sans);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: var(--dark);
}
```

---

## Implementation Checklist

| # | Task | Status |
|---|------|--------|
| 1 | Enlarge and link the logo | ⬜ Not Started |
| 2 | Fix mobile menu button aria-expanded | ⬜ Not Started |
| 3 | Update schedule.html content | ⬜ Not Started |
| 4 | Build testimonial carousel from JSON | ⬜ Not Started |
| 5 | Enable Saturdays in calendar | ⬜ Not Started |
| 6 | Change page background to #f5f7fa | ⬜ Not Started |
| 7 | Replace footer with new disclaimer | ⬜ Not Started |
| 8 | Reorder sections to match nav | ⬜ Not Started |
| 9 | Switch all text to Merriweather Sans | ⬜ Not Started |

---

## Testing Requirements

After implementation, verify:

1. **Logo:** Clickable on both pages, returns to homepage, increased size visible
2. **Mobile menu:** Opens/closes correctly, screen reader announces state changes
3. **Schedule page:** Title centered, subtitle removed
4. **Carousel:** Loads reviews from JSON, auto-rotates every 6 seconds, prev/next buttons work, dots indicate position
5. **Calendar:** Saturdays show as available (clickable)
6. **Background:** Light gray (#f5f7fa) visible across all pages
7. **Footer:** Full disclaimer text displays, smaller font, centered
8. **Section order:** Scrolling matches navigation link order
9. **Font:** All body text uses Merriweather Sans (sans-serif appearance)

---

## Files Modified Summary

| File | Tasks |
|------|-------|
| `index.html` | 1, 2, 4, 5, 7, 8 |
| `schedule.html` | 1, 2, 3, 7 |
| `styles/style.css` | 1, 3, 4, 6, 7, 9 |

---

**Document prepared for implementation review.**
