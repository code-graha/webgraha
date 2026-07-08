// WebGraha — renders social links, projects, and testimonials from
// webgraha-data.json so that content can be added/removed by editing
// that one file, with no HTML/JS changes required.
//
// Note: fetch() of a local file fails under the file:// protocol (a
// Chrome security restriction, not specific to this site). Serve the
// folder over any local HTTP server (e.g. `python -m http.server`) for
// this to work — see SEO-Plan.md.
(function () {
    // Absolute path so this still resolves correctly from pages nested
    // under /blog/, not just root-level pages.
    const DATA_URL = '/webgraha-data.json';

    function escapeHtml(value) {
        return (value || '').toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // The vendored Font Awesome build predates the X rebrand and has no
    // fa-x-twitter glyph (only the old bird), so the X logo is inlined here
    // instead — official mark, inherits size/color via currentColor/1em
    // exactly like the fa-* icons next to it.
    const X_LOGO_SVG = '<svg viewBox="0 0 1200 1227" width="1em" height="1em" fill="currentColor" ' +
        'aria-hidden="true" style="display:inline-block;vertical-align:-0.125em;">' +
        '<path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"/>' +
        '</svg>';

    function renderSocialLinks(containers, social) {
        if (!containers.length) return;
        const items = social.filter((s) => s.showInWidget !== false);

        containers.forEach((container) => {
            const hoverClass = container.getAttribute('data-hover-class') || 'hover:text-brand-accent';
            container.innerHTML = items.map((item) => {
                const isMail = /^mailto:/i.test(item.url);
                const targetAttrs = isMail ? '' : ' target="_blank" rel="noopener"';
                const iconMarkup = item.platform === 'x' ? X_LOGO_SVG : '<i class="' + item.icon + '"></i>';
                return '<a href="' + escapeHtml(item.url) + '"' + targetAttrs + ' class="' + hoverClass + ' transition-colors" aria-label="' + escapeHtml(item.label) + '">' + iconMarkup + '</a>';
            }).join('');
        });
    }

    function setupIframeDesktopScale(iframe) {
        const bar = iframe.closest('.browser-frame');
        if (!bar) return;
        // Always render at desktop viewport so the website shows its desktop
        // layout regardless of card size. Scale factor shrinks it to fit the
        // card — container height stays the same as before (aspect ratios match).
        const DESKTOP_W = 1280;
        const DESKTOP_H = 680;

        function resize() {
            const w = bar.clientWidth;
            if (!w) return;
            const scale  = w / DESKTOP_W;
            const barEl  = bar.querySelector('.bf-bar');
            const barH   = barEl ? barEl.offsetHeight : 0;
            // position:absolute takes the iframe out of normal flow so its
            // 1280px layout width never causes the card or page to overflow.
            // top:barH places it below the browser-chrome bar, matching the
            // same visible area as the previous in-flow layout.
            bar.style.position       = 'relative';
            bar.style.height         = Math.round(DESKTOP_H * scale) + 'px';
            iframe.style.position    = 'absolute';
            iframe.style.top         = barH + 'px';
            iframe.style.left        = '0';
            iframe.style.width       = DESKTOP_W + 'px';
            iframe.style.height      = DESKTOP_H + 'px';
            iframe.style.transform   = 'scale(' + scale + ')';
            iframe.style.transformOrigin = '0 0';
        }

        resize();
        new ResizeObserver(resize).observe(bar);
    }

    function renderProjects(container, projects) {
        if (!container) return;
        container.innerHTML = '';
        projects.forEach((proj, i) => {
            const delay = (i * 0.08).toFixed(2);
            const a = document.createElement('a');
            const fullUrl = proj.url
                ? (proj.url.startsWith('http') ? proj.url : 'https://' + proj.url)
                : '#';
            const displayUrl = proj.url
                ? proj.url.replace(/^https?:\/\/(www\.)?/, '')
                : '';
            a.href = fullUrl;
            if (fullUrl !== '#') { a.target = '_blank'; a.rel = 'noopener'; }
            a.className = 'card-hover tilt-card glass-panel rounded-2xl p-5 flex flex-col gap-3 border border-white/10 reveal';
            a.style.transitionDelay = delay + 's';
            a.innerHTML =
                '<div class="browser-frame">' +
                    '<div class="bf-bar">' +
                        '<span class="bf-dot bg-red-400/70"></span>' +
                        '<span class="bf-dot bg-yellow-400/70"></span>' +
                        '<span class="bf-dot bg-green-400/70"></span>' +
                        '<span class="bf-url">' + escapeHtml(displayUrl) + '</span>' +
                    '</div>' +
                    '<iframe loading="lazy" title="' + escapeHtml(proj.name) + ' preview"></iframe>' +
                '</div>' +
                '<div class="flex items-center justify-between">' +
                    '<span class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-accent"><i class="' + proj.icon + '"></i></span>' +
                    '<span class="text-[11px] font-mono uppercase tracking-widest text-gray-500">' + escapeHtml(proj.category) + '</span>' +
                '</div>' +
                '<h3 class="font-serif text-lg text-white">' + escapeHtml(proj.name) + '</h3>' +
                '<p class="text-gray-400 text-sm leading-relaxed">' + escapeHtml(proj.description) + '</p>' +
                '<span class="text-xs text-brand-accent mt-1">' + (fullUrl !== '#' ? 'Visit ' + displayUrl : 'View case study') + ' &rarr;</span>';
            container.appendChild(a);
            const iframe = a.querySelector('iframe');
            if (fullUrl !== '#') {
                iframe.src = fullUrl;
            }
            setupIframeDesktopScale(iframe);
        });
    }

    function renderTestimonials(container, testimonials) {
        if (!container) return;
        container.innerHTML = '';
        testimonials.forEach((t, i) => {
            const delay = (i * 0.1).toFixed(2);
            const avatarHtml = t.avatar
                ? '<img src="' + escapeHtml(t.avatar) + '" alt="' + escapeHtml(t.name) + '" class="w-9 h-9 flex-none rounded-full object-cover border border-white/10" loading="lazy" decoding="async">'
                : '<span class="w-9 h-9 flex-none rounded-full bg-brand-green/40 border border-white/10 flex items-center justify-center text-xs font-serif text-white">' + escapeHtml(t.initials || '') + '</span>';
            const fig = document.createElement('figure');
            fig.className = 'glass-panel tilt-card rounded-2xl p-6 flex flex-col gap-4 reveal';
            fig.style.transitionDelay = delay + 's';
            fig.innerHTML =
                '<i class="fa-solid fa-quote-left text-brand-accent/70"></i>' +
                '<blockquote class="text-gray-300 text-sm leading-relaxed">"' + escapeHtml(t.quote) + '"</blockquote>' +
                '<figcaption class="flex items-center gap-3 mt-auto pt-2 border-t border-white/10">' +
                    avatarHtml +
                    '<span class="flex flex-col min-w-0">' +
                        '<span class="text-sm text-white font-medium truncate">' + escapeHtml(t.name) + '</span>' +
                        '<span class="text-xs text-gray-500 truncate">' + escapeHtml(t.role) + '</span>' +
                    '</span>' +
                '</figcaption>';
            container.appendChild(fig);
        });
    }

    async function init() {
        const socialContainers = Array.from(document.querySelectorAll('#social-links, .social-links'));
        const projectsContainer = document.getElementById('projects-grid');
        const testimonialsContainer = document.getElementById('testimonials-grid');

        if (!socialContainers.length && !projectsContainer && !testimonialsContainer) return;

        try {
            const res = await fetch(DATA_URL);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();

            renderSocialLinks(socialContainers, data.social || []);
            renderProjects(projectsContainer, data.projects || []);
            renderTestimonials(testimonialsContainer, data.testimonials || []);

            document.dispatchEvent(new CustomEvent('webgraha:data-rendered'));
        } catch (err) {
            console.warn('WebGraha: could not load webgraha-data.json —', err.message, '(if you opened this file directly via file://, serve it over a local HTTP server instead — see SEO-Plan.md)');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
