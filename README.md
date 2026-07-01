# WebGraha — Site

Boutique web design and digital solutions studio. This repository contains the full static site: marketing homepage, about page, brand guidelines, error pages, and all supporting assets.

---

## Project structure

```
Final Draft/
├── index.html              # Homepage (3D globe, services, enquiry form)
├── about.html              # About, process, projects, testimonials, FAQ
├── brand.html              # Internal brand guidelines (noindex)
├── 404.html                # "Lost in orbit" error page
├── 405.html                # "Wrong approach vector" error page
├── webgraha-data.json      # ← Edit this to update content (see below)
├── robots.txt
├── sitemap.xml
├── llms.txt
├── SEO-Plan.md
├── .htaccess               # Apache 404 config (Netlify/Vercel/GH Pages = zero config)
│
├── assets/
│   ├── css/
│   │   ├── base.css        # Shared across every page
│   │   ├── home.css        # index.html only
│   │   ├── about.css       # about.html only
│   │   ├── brand.css       # brand.html only
│   │   └── error.css       # 404.html + 405.html
│   ├── js/
│   │   ├── tailwind-config.js      # Shared Tailwind theme
│   │   ├── protect.js              # Right-click / DevTools source protection
│   │   ├── starfield.js            # Twinkling star generator
│   │   ├── shooting-stars.js       # Comet animations
│   │   ├── starfield-parallax.js   # Mouse-parallax depth (about.html)
│   │   ├── reveal.js               # Scroll-reveal (IntersectionObserver)
│   │   ├── tilt.js                 # 3D mouse-tilt on cards
│   │   ├── nav-mobile.js           # Mobile hamburger toggle
│   │   ├── services-carousel.js    # Scroll-snap dots (index.html)
│   │   ├── social-widget.js        # Collapsible social widget (index.html)
│   │   ├── enquiry-form.js         # Contact form fetch + UI states
│   │   ├── globe.js                # Three.js rotating Earth
│   │   └── data-render.js          # Dynamic social/projects/testimonials
│   ├── vendor/
│   │   ├── fontawesome/            # Font Awesome 6.4 (CSS, JS, webfonts)
│   │   └── three/                  # Three.js r128
│   │   └── three-globe/            # Earth texture maps (JPG/PNG)
│   └── [images, logos, icons]
│
└── google-apps-script/
    ├── Code.gs             # Backend: Google Sheets + branded email
    └── SETUP.md            # Step-by-step deployment guide
```

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

## Contact form (Google Apps Script)

The "Start a Project" enquiry form is wired to a Google Apps Script backend that logs submissions to a Google Sheet and sends a branded email notification to the admin.

**Setup:** see `google-apps-script/SETUP.md` for step-by-step deployment instructions. Once deployed, paste the `/exec` URL into the `data-endpoint=""` attribute on the `<form>` element in `index.html`.

---

## Key third-party dependencies

All vendor libraries are **self-hosted** under `assets/vendor/` — the site works fully offline (internet not required at runtime) for everything listed here:

| Library | Version | Local path |
|---|---|---|
| Font Awesome | 6.4.0 | `assets/vendor/fontawesome/` |
| Three.js | r128 | `assets/vendor/three/three.min.js` |
| Earth textures | — | `assets/vendor/three-globe/` |

Still loaded remotely (optional, cosmetic only — page works without them, fonts/styles degrade gracefully):

| Dependency | Purpose |
|---|---|
| Tailwind CSS Play CDN | Utility class compilation (JIT, in-browser) |
| Google Fonts | Playfair Display, Inter, JetBrains Mono |

---

## Deployment

The site is a plain static folder — no build step required. Drop the `Final Draft/` contents into any static host:

| Host | Notes |
|---|---|
| **Netlify / Vercel / Cloudflare Pages** | Drop the folder; `404.html` auto-detected, zero config |
| **GitHub Pages** | Same — `404.html` auto-detected at root |
| **Apache (cPanel/shared hosting)** | `.htaccess` already included with `ErrorDocument 404` |
| **Nginx** | Add `error_page 404 /404.html;` to your server block |

Before going live, replace `webgraha.com` everywhere if your real domain differs — one global find-and-replace across `index.html`, `about.html`, `brand.html`, `robots.txt`, `sitemap.xml`, `llms.txt`, and `google-apps-script/Code.gs`.

---

## SEO & AI search

See **`SEO-Plan.md`** for a full breakdown of what's implemented (JSON-LD structured data, Open Graph, Twitter Cards, robots.txt, sitemap.xml, llms.txt) and what still needs to be done post-launch (Search Console/Bing Webmaster submission, analytics, real case studies replacing placeholders).

---

*WebGraha — Your gateway to the digital universe.*
