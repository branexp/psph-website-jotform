# JotForm Scheduler Migration Guide

## Overview

This document details the migration from the custom PHP/JavaScript appointment scheduler to an embedded JotForm solution. The JotForm scheduler will be embedded directly into the PSPH website, allowing users to book appointments seamlessly without being redirected to an external site.

### Migration Goals

- **Improved User Experience**: Seamless in-page scheduling without redirects
- **Simplified Architecture**: Eliminate custom backend code (PHPMailer, validation logic)
- **Reduced Maintenance**: JotForm handles form processing, validation, emails, and spam protection
- **Streamlined Booking**: Native form handling with built-in thank-you page

### Current vs. New Architecture

| Component | Current Implementation | New Implementation |
|-----------|----------------------|-------------------|
| Form UI | Custom HTML in `schedule.html` | JotForm embedded script |
| Validation | `schedule-script.js` | JotForm built-in validation |
| Email Sending | `send-email.php` + PHPMailer | JotForm autoresponder + notifications |
| Confirmation | `confirmation.html` redirect | JotForm built-in thank-you page |
| Spam Protection | Honeypot field | JotForm CAPTCHA/spam filters |

---

## Part 1: JotForm Form Setup

### Step 1: Access JotForm Form Builder

1. Log in to your JotForm account at [jotform.com](https://www.jotform.com)
2. Navigate to **My Forms** → Select form `251803846453157` (or create new)
3. Click **Edit Form** to open the Form Builder

### Step 2: Configure Form Fields

Recreate the following fields in JotForm to match the current scheduler:

| Current Field | JotForm Field Type | Configuration |
|---------------|-------------------|---------------|
| First Name | **Name** (First, Last) | Required, split into two fields |
| Last Name | *(included above)* | Required |
| School District | **Dropdown** | Enable "Searchable", import options via CSV |
| School | **Dropdown** | Enable "Searchable", import options via CSV |
| Phone | **Phone Number** | Required, format: (000) 000-0000 |
| Email | **Email** | Required |
| Topics | **Checkbox** | Multiple selection, require at least 1 |
| Other Topic | **Text Box** | Conditional: show only when "Other" is checked |
| Appointment | **Date/Time Picker** | Required |

### Step 3: Configure Topic Checkbox Options

Add the following options to the Topics checkbox field:

1. Understanding Your Pension
2. Your Supplemental Retirement Accounts (403(b) / 457(b))
3. General Financial Health
4. Risk Management & Estate Planning
5. Other / My question isn't listed here

### Step 4: Set Up Conditional Logic for "Other" Field

1. Select the "Other Topic" text field
2. Go to **Settings** → **Conditions**
3. Add condition: **Show this field if** → "Topics" → **contains** → "Other"
4. Optionally set as required when visible

---

## Part 2: Importing District and School Data

JotForm supports importing dropdown options via CSV. Use this to populate the searchable District and School dropdowns.

### CSV Format for Districts

Create a CSV file (`districts.csv`) with district names:

```csv
District Name
Manchester School District
Nashua School District
Concord School District
Bedford School District
...
```

### CSV Format for Schools

Create a CSV file (`schools.csv`) with school names:

```csv
School Name
Manchester Central High School
Nashua High School South
Concord High School
Bedford High School
...
```

### Import Steps

1. In Form Builder, click on the **School District** dropdown field
2. Go to **Properties** → **Options**
3. Click **Bulk Edit** or **Import from CSV**
4. Upload `districts.csv` and confirm import
5. Repeat for the **School** dropdown with `schools.csv`
6. Enable **Searchable** option for both fields under field Properties

> **Note**: The current `assets/data/districts.json` and `assets/data/schools.json` files are empty. You must populate the CSV files with actual district and school data before importing.

---

## Part 3: Email Configuration

### Configure Autoresponder (Confirmation Email to User)

1. In Form Builder, go to **Settings** → **Emails**
2. Click **Autoresponder Email**
3. Configure:
   - **Recipient Email**: `{userEmail}` (the Email field from form)
   - **Subject**: "Your PSPH Appointment Request Received"
   - **From Name**: "Public School Pension Help"
   - **Reply-To**: `hello@psph.org`
4. Design the email body with:
   - Personalized greeting using `{firstName}`
   - Appointment date/time using `{appointmentDateTime}`
   - Selected topics using `{topics}`
   - Note about receiving Calendly invitation within 24 hours
   - Contact information: `hello@psph.org` / (603) 960-4295

### Configure Admin Notification Email

1. In **Settings** → **Emails**, click **Notification Email**
2. Configure:
   - **Recipient**: `hello@psph.org`
   - **Subject**: "New Appointment Request from {firstName} {lastName}"
   - **Include all form fields** in email body
3. Enable this notification to alert staff of new submissions

---

## Part 4: Thank-You Page Configuration

### Set Up JotForm's Built-in Thank-You Page

1. Go to **Settings** → **Thank You Page**
2. Select **Show Thank You Message**
3. Configure the message:

```
Thank you, {firstName}!

Your appointment request has been received.

📅 Appointment: {appointmentDateTime}
📝 Topics: {topics}

What happens next?
Within 24 hours, you'll receive a separate Calendly invitation with your Zoom meeting link.

Questions? Contact us at hello@psph.org or call (603) 960-4295.
```

4. Optionally add a **Redirect** link back to the homepage after a delay

---

## Part 5: Embed Implementation

### Update schedule.html

Replace the current form content in `schedule.html` with the JotForm embed code:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schedule an Appointment | PSPH</title>
    <!-- Keep existing meta tags, favicon, fonts, etc. -->
</head>
<body>
    <!-- Keep existing header/navigation -->
    
    <main class="site-main">
        <div class="form-wrapper">
            <!-- JotForm Embed -->
            <script
                type="text/javascript"
                src="https://form.jotform.com/jsform/251803846453157"
            ></script>

            <noscript>
                <p class="noscript-text">
                    JavaScript is disabled in your browser. Please enable JavaScript to view and submit this form.
                </p>
            </noscript>
        </div>
    </main>

    <!-- Keep existing footer -->
</body>
</html>
```

### Key Notes

- The JotForm script automatically renders the form within the `<div class="form-wrapper">` container
- The `<noscript>` fallback displays a message for users with JavaScript disabled
- JotForm handles all form validation, submission, and email sending
- No additional JavaScript files are required

---

## Part 6: Files to Delete

After successful migration and testing, the following files are no longer needed and have been removed:

### Deleted Files

| File/Folder | Previous Purpose |
|-------------|-----------------|
| `scripts/schedule-script.js` | Form validation, autocomplete, submission logic |
| `send-email.php` | PHPMailer email processing |
| `src/` (entire folder) | PHPMailer library files |
| `emails/confirmation-email.html` | HTML email template |
| `confirmation.html` | Post-submission confirmation page |
| `styles/confirmation-style.css` | Confirmation page styles |
| `styles/schedule-style.css` | Custom scheduler form styles |

### Files to Keep

| File | Purpose |
|------|---------|
| `schedule.html` | Updated with JotForm embed |
| `index.html` | Homepage (unchanged) |
| `styles/style.css` | Main site styles |
| `assets/data/reviews.json` | Testimonials data |
| `assets/data/districts.json` | Reference (empty, data in JotForm) |
| `assets/data/schools.json` | Reference (empty, data in JotForm) |
| `robots.txt` | SEO configuration |

---

## Part 7: Testing Checklist

Before considering the migration complete, verify:

### Form Functionality
- [ ] Form loads correctly on `schedule.html`
- [ ] All fields display and are functional
- [ ] Searchable dropdowns work (if data imported)
- [ ] Conditional "Other" field shows/hides correctly
- [ ] Date/Time picker allows selection
- [ ] Form validation prevents incomplete submissions

### Email Delivery
- [ ] User receives autoresponder email after submission
- [ ] Admin receives notification email at `hello@psph.org`
- [ ] Email content displays correctly (field values populated)
- [ ] Reply-to address works correctly

### Thank-You Page
- [ ] Thank-you message displays after submission
- [ ] Personalized fields populate correctly ({firstName}, {topics}, etc.)

### Cross-Browser/Device Testing
- [ ] Form works on Chrome, Firefox, Safari, Edge
- [ ] Form is mobile-responsive
- [ ] Form works with keyboard navigation

---

## Part 8: Rollback Plan

If issues arise after migration, the previous implementation is preserved in Git history.

### To Rollback

1. Revert to the previous commit before migration:
   ```bash
   git log --oneline  # Find the commit hash before migration
   git checkout <commit-hash> -- .
   ```

2. Or selectively restore deleted files:
   ```bash
   git checkout <commit-hash> -- send-email.php
   git checkout <commit-hash> -- scripts/schedule-script.js
   git checkout <commit-hash> -- src/
   # ... etc.
   ```

3. Revert `schedule.html` to the original form implementation

---

## Summary

This migration replaces a custom PHP/JavaScript scheduler with an embedded JotForm solution. Benefits include:

- **Zero backend maintenance**: No PHP or server-side code to maintain
- **Built-in features**: Validation, spam protection, email handling
- **Easier updates**: Form changes made in JotForm's visual builder
- **Reliability**: JotForm's infrastructure handles form processing

The manual Calendly invitation workflow remains unchanged—staff will continue sending Calendly invites after receiving form submission notifications.

---

*Migration Document Created: January 28, 2026*
*JotForm Form ID: 251803846453157*
