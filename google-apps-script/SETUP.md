# WebGraha contact + testimonial forms — Google Sheets + email backend

`Code.gs` in this folder is a single Google Apps Script that backs **two** forms on the site, both posting to the same deployed URL:

1. The "Start a Project" enquiry form on `/` — appends a row (timestamp, name, email, message) to the **Enquiries** sheet tab.
2. The testimonial form on `/testimonials` — appends a row (timestamp, name, role, email, rating, testimonial, publish consent) to the **Testimonials** sheet tab.

Each submission also emails `siddharth@webgraha.com` a notification styled to match the WebGraha brand (dark navy card, green accent, Playfair/Georgia heading). The two forms are told apart by a `formType` field in the JSON payload (`"enquiry"` or `"testimonial"`) — `Code.gs` routes each to its own sheet + email template, and creates the relevant sheet tab automatically on first submission.

No paid services required — this runs entirely on Google's free Apps Script + Gmail quota (100 emails/day on a regular Gmail account, far more than these forms need).

## 1. Create the Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it something like **WebGraha Enquiries**.
3. Leave it empty — the script creates the `Enquiries` and `Testimonials` tabs (with header rows) automatically the first time each form is submitted.

## 2. Add the script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete the default placeholder code in `Code.gs`.
3. Copy the entire contents of this folder's `Code.gs` into it.
4. At the top of the file, double-check the config block matches reality:
   ```js
   var ADMIN_EMAIL = 'siddharth@webgraha.com'; // where notifications go
   var SITE_URL = 'https://webgraha.com/';      // your real domain
   var LOGO_URL = 'https://webgraha.com/assets/logo-mark-512.png'; // must be a public HTTPS URL once live
   ```
   The `LOGO_URL` only renders correctly in the email once the site is actually deployed at that domain — email clients can't load images from your local machine.
5. Save (Ctrl+S / Cmd+S). Name the project **WebGraha Contact Form**.

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Settings:
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone
4. Click **Deploy**.
5. The first time, Google will ask you to authorize the script (it needs permission to edit the Sheet and send email as you). Click through the "Google hasn't verified this app" warning — it's your own script, this is expected for personal Apps Script projects.
6. Copy the **Web app URL** it gives you. It looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

## 4. Wire it into the site

Both forms read their endpoint from a `data-endpoint` attribute on the `<form>` element — paste the **same** `/exec` URL into both.

1. Open `index.html`. Find the enquiry form element (search for `enquiry-form`):
   ```html
   <form id="enquiry-form" data-endpoint="" ...>
   ```
   Paste your `/exec` URL into the `data-endpoint` attribute value.
2. Open `testimonials.html`. Find the testimonial form element (search for `testimonial-form`):
   ```html
   <form id="testimonial-form" data-endpoint="" ...>
   ```
   Paste the same `/exec` URL here too.
3. Save and reload each page. Submit a test enquiry on `/` and a test testimonial on `/testimonials` — you should see a new row appear in the corresponding Sheet tab within a few seconds, and a notification email arrive at `siddharth@webgraha.com` for each.

## 5. Re-deploying after edits

Apps Script Web App URLs only update their *behavior* automatically when you edit `Code.gs` if you deploy a **new version** of the *same* deployment:

- **Deploy → Manage deployments → (pencil icon) → New version → Deploy.**

This keeps the same `/exec` URL, so you don't need to touch `/` again after the first setup. Only use **New deployment** (which generates a new URL) if you intentionally want a fresh endpoint.

## Notes

- The front end posts with `Content-Type: text/plain` instead of `application/json`. This is intentional — it's the standard workaround to avoid a CORS preflight request, which Apps Script Web Apps don't handle. The script still parses the body as JSON server-side (`e.postData.contents`).
- All form input is trimmed and capped at 2000 characters server-side before being written to the Sheet or the email, as basic spam/abuse hygiene.
- If you'd rather notifications go to a different inbox (e.g. a shared team inbox), just change `ADMIN_EMAIL` and redeploy a new version (step 5).
- To stop receiving notifications temporarily without losing submissions, comment out the `sendAdminEmail(...)` call in `handleEnquiry` and/or `sendTestimonialAdminEmail(...)` in `handleTestimonial` — the Sheet logging will keep working independently.
- Testimonials are logged with a "Publish Consent" column (Yes/No) — always check that column before copying a quote into `webgraha-data.json`'s `testimonials` array, even if the star rating and text look publishable.
