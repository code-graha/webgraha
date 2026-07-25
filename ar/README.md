# WebGraha AR Poster — Deploy Checklist

Target live URL: **https://www.webgraha.com/ar/**

## Tracking target: the WebGraha logo (not a QR code)

`targets.mind` is currently compiled from `logo-target.png` (a render of
`assets/logo-full.svg` on the brand navy background) — scanning the printed
WebGraha logo is what triggers the AR scene now, not a QR code.

⚠️ **Two things to resolve before printing:**

1. **How do people actually open the AR page?** A QR code doubled as both
   the tracking image AND a scannable link — that trick no longer works
   once the tracking target is a logo instead of a QR code, since a logo
   can't be scanned to open a URL. The printed card needs *some* separate
   way to get people to `https://www.webgraha.com/ar/` — e.g. a QR code
   printed elsewhere on the card (unrelated to tracking), a short/memorable
   URL, or an NFC tag. Decide this before finalizing the card design.

2. **Tracking reliability risk.** MindAR's image tracking works by matching
   distinctive corner-like features. A QR code is deliberately full of many
   small, unique, high-contrast squares — great for tracking. A wordmark
   logo like WebGraha's has large flat/curved areas and few sharp corners,
   which typically tracks *less* reliably (may need the camera closer,
   steadier, or better lit than a QR code would). **Test this specific
   target thoroughly on a real printed card before committing to a full
   print run** — if tracking feels unreliable, reverting to a QR-code
   target (see git history for the previous `qr-target.png` + recompiled
   `targets.mind`) is the fallback.

## Files that need to end up in this folder
- `index.html` — already done, links are filled in
- `logo-target.png` — the image `targets.mind` was compiled from (reference/print-matching only; not loaded by index.html at runtime)
- `targets.mind` — generated from logo-target.png (regenerate via step 2 below if you change the source image)

## Steps
1. Export the target image (currently `logo-target.png`, 1200×651px,
   high contrast — light logo on the dark navy background works well).
2. Upload it to https://hiukim.github.io/mind-ar-js-doc/tools/compile
   and download the resulting `targets.mind` file.
3. Upload `index.html`, `logo-target.png`, and `targets.mind` into
   `public_html/ar/` on your webgraha.com hosting via cPanel File
   Manager or FTP.
4. Open `https://www.webgraha.com/ar/` on a phone — confirm it loads over
   HTTPS and prompts for camera access.
5. Resolve the URL-access question above (item 1) and finalize what
   actually goes on the printed card.
6. Print a single test card first — confirm tracking is reliably fast
   and stable on a real phone before running the full print job.

## Current cards
- Website → www.webgraha.com
- WhatsApp → wa.me/917411720141
- Email → siddharth@webgraha.com
- Linktree → linktr.ee/webgraha

To change links, wording, or card layout, edit the `<a-entity class="ar-card">`
blocks in `index.html`.
