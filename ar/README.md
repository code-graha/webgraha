# WebGraha AR Poster — Deploy Checklist

Target live URL: **https://www.webgraha.com/ar/**

## Files that need to end up in this folder
- `index.html` — already done, links are filled in
- `qr-target.png` — your poster's QR code, exported as an image (you add this)
- `targets.mind` — generated from qr-target.png (you generate this, step 2 below)

## Steps
1. Export the QR code you're printing on the poster as `qr-target.png`
   (512×512px or larger, high contrast — plain black on white works best).
2. Upload `qr-target.png` to https://hiukim.github.io/mind-ar-js-doc/tools/compile
   and download the resulting `targets.mind` file.
3. Upload all three files (`index.html`, `qr-target.png`, `targets.mind`)
   into `public_html/ar/` on your webgraha.com hosting via cPanel File
   Manager or FTP.
4. Open `https://www.webgraha.com/ar/` on a phone — confirm it loads over
   HTTPS and prompts for camera access.
5. Generate the QR code that actually goes on the poster so it encodes
   `https://www.webgraha.com/ar/` — this is a different QR than
   qr-target.png used for tracking. It needs to look identical to
   qr-target.png (same QR, same crop) since MindAR is matching the visual
   pattern, but it points people TO the page while qr-target.png tells
   the page WHAT to track.

   Simplest way to guarantee they match: generate one QR code image,
   use it as both qr-target.png (upload for tracking) AND as the artwork
   on the poster. Don't generate two separate QR codes with the same URL —
   use the exact same file for both.
6. Print, test with a phone before the full print run.

## Current cards
- Website → www.webgraha.com
- WhatsApp → wa.me/917411720141
- Email → siddharth@webgraha.com
- Linktree → linktr.ee/webgraha

To change links, wording, or card layout, edit the `<a-entity class="ar-card">`
blocks in `index.html`.
