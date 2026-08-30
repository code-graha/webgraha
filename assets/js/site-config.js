// WebGraha — centralized site config.
//
// Single place to update the deployed Google Apps Script endpoint used by
// the enquiry form (index.html), the contact form (contact.html), and the
// testimonial form (testimonials.html) — see google-apps-script/SETUP.md.
// Load this script (deferred, before the form scripts) on any page with a
// form that needs it.
window.WEBGRAHA_CONFIG = {
    FORM_ENDPOINT: 'https://script.google.com/macros/s/AKfycbxwCQU-wwqx2IYvwFfD18V7pxDGeZD1Y4AlSD0seKxdOQBDr9Tzu_Ler4qGsf8coKD0vA/exec'
};
