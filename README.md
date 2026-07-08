# WebGraha — Site

Boutique web design and digital solutions studio. This repository contains the full static site: marketing homepage, about page, brand guidelines, error pages, and all supporting assets.

---

## Project structure

```
Final Draft/
├── index.html              # Homepage (3D globe, service pills, enquiry widget)
├── about.html              # Story, process, testimonials
├── services.html           # Web Design / App Development / Branding / SEO & Growth detail
├── portfolio.html          # Selected client work
├── faq.html                # Frequently asked questions
├── contact.html            # Contact form + direct email/WhatsApp/social
├── blog/
│   ├── index.html          # Blog listing page (served at /blog)
│   ├── how-much-does-a-website-cost.html
│   ├── how-long-does-branding-take.html
│   └── choosing-a-web-design-agency.html
├── testimonials.html       # Standalone form for clients to submit a testimonial
├── brand.html              # Internal brand guidelines (noindex)
├── 404.html                # "Lost in orbit" error page (no nav bar, by design)
├── 405.html                # "Wrong approach vector" error page (no nav bar, by design)
├── webgraha-data.json      # ← Edit this to update content (see below)
├── robots.txt
├── sitemap.xml
├── llms.txt
├── SEO-Plan.md
├── SEO-Launch-Guide.md     # Step-by-step: indexing, off-page authority, AI visibility
├── .htaccess               # Apache 404 config + static asset caching
├── tailwind.config.js      # Tailwind theme (build-time only, see "Tailwind CSS" below)
│
├── assets/
│   ├── css/
│   │   ├── tailwind-src.css # Tailwind build input (@tailwind directives)
│   │   ├── tailwind.min.css # ← Compiled, purged Tailwind (generated, don't hand-edit)
│   │   ├── base.css        # Shared across every page (incl. loading screen)
│   │   ├── home.css        # index.html only
│   │   ├── about.css       # about.html only
│   │   ├── services.css    # services.html only
│   │   ├── portfolio.css   # portfolio.html only
│   │   ├── faq.css         # faq.html only
│   │   ├── contact.css     # contact.html only
│   │   ├── blog.css        # blog/index.html and all blog/ posts
│   │   ├── testimonials.css # testimonials.html only
│   │   ├── brand.css       # brand.html only
│   │   └── error.css       # 404.html + 405.html
│   ├── js/
│   │   ├── protect.js              # Right-click / DevTools source protection
│   │   ├── starfield.js            # Twinkling star generator
│   │   ├── shooting-stars.js       # Comet animations
│   │   ├── starfield-parallax.js   # Mouse-parallax depth (about.html and other subpages)
│   │   ├── reveal.js               # Scroll-reveal (IntersectionObserver)
│   │   ├── tilt.js                 # 3D mouse-tilt on cards
│   │   ├── nav-mobile.js           # Mobile hamburger toggle (index.html)
│   │   ├── services-carousel.js    # Scroll-snap dots (index.html)
│   │   ├── social-widget.js        # Collapsible social widget (index.html)
│   │   ├── enquiry-form.js         # Homepage enquiry widget fetch + UI states
│   │   ├── contact-form.js         # Contact page form fetch + UI states (contact.html)
│   │   ├── testimonial-form.js     # Testimonial form fetch + UI states (testimonials.html)
│   │   ├── globe.js                # Three.js rotating Earth
│   │   └── data-render.js          # Dynamic social/projects/testimonials
│   ├── vendor/
│   │   ├── fontawesome/            # Font Awesome 6.4 (CSS, JS, webfonts)
│   │   └── three/                  # Three.js r128
│   │   └── three-globe/            # Earth texture maps (JPG/PNG)
│   └── [images, logos, icons]
│
└── google-apps-script/
    ├── Code.gs             # Backend: Google Sheets + branded email (enquiries + testimonials)
    └── SETUP.md            # Step-by-step deployment guide
```

**Site structure note:** Projects and FAQ used to be sections inside `about.html`; they're now their own pages (`portfolio.html`, `faq.html`) so each can rank independently. `about.html` covers story, process, and testimonials. The homepage's service pills and About's services blurb both link to `/services` for full detail.

**Adding a new blog post:** copy one of the existing post files under `blog/` as a template (not `blog/index.html` — that's the listing page). Everything under `blog/`, including `index.html`, is one level deeper than the rest of the site, so — unlike every root-level page, which uses relative paths like `assets/css/...` — they reference assets and `webgraha-data.json` with a leading slash (`/assets/css/...`). Get this wrong and the page will silently load unstyled or without dynamic content. After adding a post: link it from `blog/index.html`'s listing, add it to that page's `Blog` JSON-LD `blogPost` array, and add it to `sitemap.xml`.

---

## Editing content — the only file you need to touch

**`webgraha-data.json`** is the single source of truth for everything dynamic on the site. The page HTML and JS never need to change when you update social links, projects, or testimonials.

### Social links

Each entry controls the icon rendered in the homepage widget, the About footer, the 404/405 pages, and anywhere else `#social-links` appears.

```jsonc
{
    "platform": "instagram",
    "label": "Instagram",
    "url": "https://www.instagram.com/yourhandle/",
    "icon": "fa-brands fa-instagram",   // any Font Awesome class
    "showInWidget": true                 // set false to hide without deleting
}
```

### Projects

Each project renders a browser-frame preview card with a real iframe mockup, category badge, description, and a link to the case study URL.

```jsonc
{
    "id": "unique-id",
    "name": "Project Name",
    "category": "E-Commerce",           // shown as the badge label
    "url": "https://client-site.com",   // used for the card link AND the browser-bar address
    "icon": "fa-solid fa-cart-shopping",
    "description": "One-line description shown under the title.",
    "preview": {
        "bgFrom": "#0a1128",            // gradient start color
        "bgTo": "#11241c",              // gradient end color
        "mutedColor": "#9ca3af",        // nav/body-text color inside iframe
        "brandName": "CLIENT",          // bold header text
        "navItems": ["Shop", "About"],  // nav links
        "heading": "Hero headline",
        "headingItalic": false,
        "subheading": "A short supporting line.",
        "buttonText": "CTA label",
        "buttonBg": "#6ee7b7",
        "buttonColor": "#06281c",
        "fontFamily": "Arial,Helvetica,sans-serif",
        "buttonRadius": "20px"          // optional, defaults to 20px
    }
}
```

**To add a project:** append a new object to the `"projects"` array.
**To remove a project:** delete its object. The grid reflows automatically.
**To reorder projects:** reorder the objects in the array.

### Testimonials

```jsonc
{
    "quote": "Quote text here (no surrounding quotes needed).",
    "name": "Client Name",
    "role": "Title, Company",
    "initials": "CN",           // fallback shown when no avatar image is set
    "avatar": "/assets/clients/client-logo.png"  // set to null to use initials instead
}
```

`avatar` can be any image URL — a client photo, company logo, or favicon. Set it to `null` (or omit it) to fall back to the initials circle.

---

## Running locally

> The site requires a local HTTP server for dynamic content (social links, projects, testimonials) and the 3D Earth textures. Opening files directly via `file://` will cause those to silently fail — the rest of the page still loads and works normally.

**Quick option — Python (no install needed on macOS/most Linux):**
```bash
cd "Final Draft"
python -m http.server 8000
# then open http://localhost:8000
```

**VS Code:** install the **Live Server** extension → right-click `index.html` → "Open with Live Server".

**Node (if installed):**
```bash
npx serve "Final Draft"
```

---

## Contact + testimonial forms (Google Apps Script)

The "Start a Project" enquiry form (`index.html`) and the testimonial form (`testimonials.html`) both post to the same Google Apps Script backend, which logs each to its own Google Sheet tab and sends a branded email notification to the admin.

**Setup:** see `google-apps-script/SETUP.md` for step-by-step deployment instructions. Once deployed, paste the same `/exec` URL into the `data-endpoint=""` attribute on the `<form>` element in `index.html`, `contact.html`, **and** `testimonials.html`.

---

## Key third-party dependencies

All vendor libraries are **self-hosted** under `assets/vendor/` — the site works fully offline (internet not required at runtime) for everything listed here:

| Library | Version | Local path |
|---|---|---|
| Font Awesome | 6.4.0 | `assets/vendor/fontawesome/` (CSS/webfonts only — the JS SVG engine is intentionally not loaded, it would duplicate the icon rendering the CSS already does) |
| Three.js | r128 | `assets/vendor/three/three.min.js` |
| Earth textures | — | `assets/vendor/three-globe/` |
| Tailwind CSS | 3.4 | `assets/css/tailwind.min.css` (compiled, see below) |

Still loaded remotely (optional, cosmetic only — page works without it, fonts/styles degrade gracefully):

| Dependency | Purpose |
|---|---|
| Google Fonts | Playfair Display, Inter, JetBrains Mono |

---

## Tailwind CSS

Tailwind is compiled ahead of time into `assets/css/tailwind.min.css` — no Play CDN, no in-browser JIT compilation. This is a one-time build output, not an ongoing build step: pages are still plain static HTML/CSS/JS.

If you add a **new** Tailwind utility class to any `.html` file or `assets/js/**/*.js` file, rebuild the stylesheet so it picks it up:

```bash
npx tailwindcss -i assets/css/tailwind-src.css -o assets/css/tailwind.min.css --minify
```

The shared theme (brand colors, fonts) lives in `tailwind.config.js` at the repo root.

---

## Deployment

The site is a plain static folder — no build step required. Drop the `Final Draft/` contents into any static host:

| Host | Notes |
|---|---|
| **Netlify / Vercel / Cloudflare Pages** | Drop the folder; `404.html` auto-detected, zero config |
| **GitHub Pages** | Same — `404.html` auto-detected at root |
| **Apache (cPanel/shared hosting)** | `.htaccess` already included with `ErrorDocument 404` |
| **Nginx** | Add `error_page 404 /404.html;` to your server block |

Before going live, replace `webgraha.com` everywhere if your real domain differs — one global find-and-replace across `index.html`, `about.html`, `services.html`, `portfolio.html`, `faq.html`, `contact.html`, `blog/*.html` (including `blog/index.html`), `testimonials.html`, `brand.html`, `robots.txt`, `sitemap.xml`, `llms.txt`, and `google-apps-script/Code.gs`.

---

## SEO & AI search

See **`SEO-Plan.md`** for a full breakdown of what's implemented (JSON-LD structured data, Open Graph, Twitter Cards, robots.txt, sitemap.xml, llms.txt) and what still needs to be done post-launch (Search Console/Bing Webmaster submission, analytics, real case studies replacing placeholders).

---

*WebGraha — Your gateway to the digital universe.*