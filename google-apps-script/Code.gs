/**
 * WebGraha — contact form backend.
 * Deploy as a Web App (Execute as: Me, Who has access: Anyone).
 * Receives form submissions, logs them to a Sheet, and emails the admin
 * a branded HTML notification.
 *
 * See SETUP.md in this folder for step-by-step deployment instructions.
 */

// ---- Configuration ----------------------------------------------------
var SHEET_NAME   = 'Enquiries';
var ADMIN_EMAIL  = 'siddharth@webgraha.com';
var SITE_NAME    = 'WebGraha';
var SITE_URL     = 'https://webgraha.com/';
var LOGO_URL     = 'https://webgraha.com/assets/logo-mark-512.png';
var MAX_FIELD_LENGTH = 2000;
// -----------------------------------------------------------------------

function doPost(e) {
  try {
    var data    = parsePayload(e);
    var name    = sanitize(data.name);
    var email   = sanitize(data.email);
    var message = sanitize(data.message);

    if (!name || !email) {
      return jsonResponse({ ok: false, error: 'Name and email are required.' });
    }
    if (!isValidEmail(email)) {
      return jsonResponse({ ok: false, error: 'That email address looks invalid.' });
    }

    var timestamp = new Date();
    appendToSheet(timestamp, name, email, message);
    sendAdminEmail(timestamp, name, email, message);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: err && err.message ? err.message : 'Unexpected server error.' });
  }
}

// Lets you sanity-check the deployment URL by opening it directly in a browser.
function doGet() {
  return ContentService
    .createTextOutput('WebGraha contact form endpoint is live. POST JSON to this URL.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('No form data received.');
  }
  // Front-end sends Content-Type: text/plain to avoid a CORS preflight.
  return JSON.parse(e.postData.contents);
}

function sanitize(value) {
  return (value || '').toString().trim().slice(0, MAX_FIELD_LENGTH);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendToSheet(timestamp, name, email, message) {
  getSheet().appendRow([timestamp, name, email, message]);
}

function sendAdminEmail(timestamp, name, email, message) {
  var subject   = 'New project enquiry — ' + name;
  var htmlBody  = buildEmailHtml(timestamp, name, email, message);
  var plainBody =
    'New enquiry via ' + SITE_NAME + '\n\n' +
    'Name: '    + name    + '\n' +
    'Email: '   + email   + '\n' +
    'Message: ' + (message || '(none)') + '\n\n' +
    'Received: ' + timestamp.toString();

  GmailApp.sendEmail(ADMIN_EMAIL, subject, plainBody, {
    htmlBody: htmlBody,
    name:    SITE_NAME + ' Enquiry',
    replyTo: email
  });
}

function buildEmailHtml(timestamp, name, email, message) {
  var safeMessage = (message || 'No additional details provided.').replace(/\n/g, '<br>');
  var when = timestamp.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  var replySubject = encodeURIComponent('Re: Your enquiry to ' + SITE_NAME);
  var replyBody = encodeURIComponent(
    'Hi ' + name + ',\n\n' +
    '\n\n' +
    '---\n' +
    'Your original message:\n' +
    (message || '(no message provided)') + '\n' +
    '---'
  );
  var domain = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return (
'<div style="margin:0;padding:0;background-color:#080e24;">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#080e24;min-width:100%;">' +
'<tr><td align="center" style="padding:40px 16px;">' +

  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">' +

    /* ── Logo header ── */
    '<tr><td align="center" style="padding-bottom:28px;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0"><tr>' +
        '<td style="vertical-align:middle;padding-right:10px;">' +
          '<img src="' + LOGO_URL + '" width="40" height="40" alt="' + SITE_NAME + '" style="display:block;border-radius:50%;border:1px solid rgba(110,231,183,0.25);">' +
        '</td>' +
        '<td style="vertical-align:middle;">' +
          '<span style="font-family:Georgia,\'Times New Roman\',serif;font-size:22px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">' + SITE_NAME + '</span>' +
        '</td>' +
      '</tr></table>' +
    '</td></tr>' +

    /* ── Green accent bar ── */
    '<tr><td style="background:linear-gradient(90deg,#6ee7b7 0%,#34d399 50%,transparent 100%);height:2px;border-radius:2px 2px 0 0;font-size:0;line-height:0;">&nbsp;</td></tr>' +

    /* ── Card ── */
    '<tr><td style="background-color:#0f172a;border:1px solid rgba(110,231,183,0.15);border-top:0;border-radius:0 0 20px 20px;padding:32px 28px;">' +

      /* section label */
      '<p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#6ee7b7;">New Project Enquiry</p>' +

      /* heading */
      '<h1 style="margin:0 0 24px;font-family:Georgia,\'Times New Roman\',serif;font-size:26px;font-weight:600;color:#f8fafc;line-height:1.25;">' +
        escapeHtml(name) + ' wants to talk' +
      '</h1>' +

      /* data rows */
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-collapse:collapse;">' +
        '<tr>' +
          '<td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;width:100px;">Name</td>' +
          '<td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#e2e8f0;text-align:right;">' + escapeHtml(name) + '</td>' +
        '</tr>' +
        '<tr>' +
          '<td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;">Email</td>' +
          '<td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#e2e8f0;text-align:right;">' +
            '<a href="mailto:' + escapeHtml(email) + '" style="color:#6ee7b7;text-decoration:none;">' + escapeHtml(email) + '</a>' +
          '</td>' +
        '</tr>' +
        '<tr>' +
          '<td style="padding:11px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;">Received</td>' +
          '<td style="padding:11px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#e2e8f0;text-align:right;">' + escapeHtml(when) + '</td>' +
        '</tr>' +
      '</table>' +

      /* message */
      '<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#64748b;">Message</p>' +
      '<div style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#cbd5e1;background-color:#0a1128;border:1px solid rgba(255,255,255,0.07);border-left:3px solid #6ee7b7;border-radius:0 12px 12px 0;padding:16px 18px;">' +
        safeMessage +
      '</div>' +

      /* CTA button */
      '<a href="mailto:' + escapeHtml(email) + '?subject=' + replySubject + '&amp;body=' + replyBody + '" ' +
        'style="display:inline-block;background-color:#6ee7b7;color:#0a1128;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;padding:13px 26px;border-radius:100px;letter-spacing:0.3px;">' +
        'Reply to ' + escapeHtml(name) + ' &rarr;' +
      '</a>' +

    '</td></tr>' +

    /* ── Footer ── */
    '<tr><td align="center" style="padding-top:24px;">' +
      '<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#334155;">' +
        SITE_NAME + ' &middot; <a href="' + SITE_URL + '" style="color:#475569;text-decoration:none;">' + domain + '</a>' +
      '</p>' +
      '<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#1e293b;">' +
        'This notification was sent because someone submitted the &ldquo;Start a Project&rdquo; form on your site.' +
      '</p>' +
    '</td></tr>' +

  '</table>' +

'</td></tr>' +
'</table>' +
'</div>'
  );
}

function escapeHtml(value) {
  return (value || '').toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
