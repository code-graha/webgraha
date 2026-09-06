// WebGraha — generates the per-page Open Graph / Twitter share images into
// assets/og/*.png (1200x630) using the real site background gradient, the
// full wordmark logo, and the logo mark as a faint watermark.
//
// Run after adding/renaming a page or changing its title/description:
//   npm install && npx playwright install chromium   (first time only)
//   npm run generate-og-images
//
// See README.md's "Open Graph images" section for details.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOGO_FULL = fs.readFileSync(path.join(ROOT, 'assets/logo-full.svg'), 'utf8');
const LOGO_MARK = fs.readFileSync(path.join(ROOT, 'assets/logo-mark.svg'), 'utf8');
const OUT_DIR = path.join(ROOT, 'assets/og');

const PAGES = [
    { file: 'og-home.png', eyebrow: 'WebGraha', title: 'Web Design, App Development &amp; Branding Studio', subtitle: 'Crafting digital experiences with precision, elegance, and purpose.' },
    { file: 'og-about.png', eyebrow: 'About WebGraha', title: 'Our Story', subtitle: 'A direct, no-hand-off approach to web design and app development.' },
    { file: 'og-services.png', eyebrow: 'Services', title: 'Web Design, App Development, Branding &amp; SEO', subtitle: 'A fixed, seven-step process — 4–6 week delivery, fixed cost, no hidden charges.' },
    { file: 'og-portfolio.png', eyebrow: 'Portfolio', title: 'Selected Work', subtitle: 'Real client projects across web design and app development, from first conversation to launch.' },
    { file: 'og-faq.png', eyebrow: 'FAQ', title: 'Frequently Asked Questions', subtitle: "Timelines, process, remote work, and what's included in an engagement." },
    { file: 'og-contact.png', eyebrow: "Let's talk", title: 'Start a Project', subtitle: 'Most enquiries get a response within one business day.' },
    { file: 'og-testimonials.png', eyebrow: 'Client Voices', title: 'Share Your Experience', subtitle: 'Worked with WebGraha? Tell other businesses what to expect.' },
    { file: 'og-blog.png', eyebrow: 'The WebGraha Blog', title: 'Notes on Web, Branding &amp; Growth', subtitle: 'Pricing, timelines, and how to choose an agency.' },
    { file: 'og-blog-website-cost.png', eyebrow: 'WebGraha Blog', title: 'How Much Should a Small Business Website Cost?', subtitle: 'An honest breakdown of what actually drives web design cost.' },
    { file: 'og-blog-branding-timeline.png', eyebrow: 'WebGraha Blog', title: 'How Long Does Branding Take?', subtitle: 'A realistic, phase-by-phase timeline and what speeds it up.' },
    { file: 'og-blog-choosing-agency.png', eyebrow: 'WebGraha Blog', title: 'How to Choose a Web Design Agency', subtitle: '7 honest questions to ask before you hire.' },
    { file: 'og-building.png', eyebrow: 'WebGraha Labs — In Development', title: 'Something New Is Taking Shape in Orbit', subtitle: "A WebGraha project in progress — not part of the main site yet." },
];

// Deterministic PRNG (mulberry32) so regenerating the images gives the same
// starfield every time instead of a different random layout per run.
function mulberry32(seed) {
    return function () {
        seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function generateStars() {
    const rand = mulberry32(20260830);
    let html = '';
    for (let i = 0; i < 160; i++) {
        const top = (rand() * 100).toFixed(2);
        const left = (rand() * 100).toFixed(2);
        const isBright = rand() < 0.14;
        const size = isBright ? (1.6 + rand() * 1.6).toFixed(2) : (0.8 + rand() * 1).toFixed(2);
        const opacity = isBright ? (0.75 + rand() * 0.25).toFixed(2) : (0.25 + rand() * 0.45).toFixed(2);
        const glow = isBright ? `box-shadow:0 0 ${(size * 2.5).toFixed(1)}px rgba(255,255,255,0.65);` : '';
        html += `<span class="star" style="top:${top}%;left:${left}%;width:${size}px;height:${size}px;opacity:${opacity};${glow}"></span>`;
    }
    return html;
}

function renderHtml({ eyebrow, title, subtitle }) {
    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative;
    font-family: 'Inter', sans-serif;
    background: #050810;
  }
  .bg-glow {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 28%, #1c2c5c 0%, #131f45 32%, #0d1733 58%, #050810 100%);
  }
  .stars { position: absolute; inset: 0; }
  .star {
    position: absolute;
    border-radius: 50%;
    background: #fff;
  }
  .vignette {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0) 0%, rgba(2,4,14,0.45) 68%, rgba(1,2,9,0.8) 100%);
  }
  .mark-watermark {
    position: absolute; right: -60px; top: 50%; transform: translateY(-50%);
    width: 620px; height: 620px; opacity: 0.07;
  }
  .mark-watermark svg { width: 100%; height: 100%; }
  .accent-glow {
    position: absolute; right: -120px; top: -140px;
    width: 620px; height: 620px; border-radius: 50%;
    background: radial-gradient(circle, rgba(110,231,183,0.16) 0%, rgba(110,231,183,0) 70%);
  }
  .content {
    position: relative; z-index: 2;
    padding: 72px 88px;
    height: 630px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .logo-full { height: 46px; }
  .logo-full svg { height: 100%; width: auto; display: block; }
  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase;
    color: #6ee7b7; margin-bottom: 22px;
  }
  .title {
    font-family: 'Playfair Display', serif;
    font-weight: 600; font-size: 58px; line-height: 1.18; letter-spacing: -0.01em;
    color: #ffffff; max-width: 880px;
  }
  .subtitle {
    margin-top: 26px; font-size: 22px; font-weight: 300; line-height: 1.55;
    color: #9aa5b8; max-width: 720px;
  }
  .footer {
    display: flex; align-items: center; gap: 14px;
  }
  .footer .rule { width: 44px; height: 2px; background: linear-gradient(90deg, #6ee7b7, transparent); }
  .footer .domain {
    font-family: 'JetBrains Mono', monospace; font-size: 15px; letter-spacing: 2px;
    color: #6b7690; text-transform: uppercase;
  }
</style></head>
<body>
  <div class="bg-glow"></div>
  <div class="stars">${generateStars()}</div>
  <div class="accent-glow"></div>
  <div class="vignette"></div>
  <div class="mark-watermark">${LOGO_MARK}</div>
  <div class="content">
    <div class="logo-full">${LOGO_FULL}</div>
    <div>
      <p class="eyebrow">${eyebrow}</p>
      <h1 class="title">${title}</h1>
      <p class="subtitle">${subtitle}</p>
    </div>
    <div class="footer"><span class="rule"></span><span class="domain">webgraha.com</span></div>
  </div>
</body></html>`;
}

(async () => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

    for (const spec of PAGES) {
        await page.setContent(renderHtml(spec), { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: path.join(OUT_DIR, spec.file) });
        console.log('Generated', spec.file);
    }

    await browser.close();
})();
