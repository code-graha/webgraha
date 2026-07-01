// WebGraha — scroll-reveal (3D rise-in) for elements with class="reveal"
(function () {
    function init() {
        const items = document.querySelectorAll('.reveal');
        if (!items.length) return;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        items.forEach((el) => obs.observe(el));
    }

    // Run once on load for static .reveal elements, and again whenever
    // data-render.js finishes injecting dynamic content.
    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener('webgraha:data-rendered', init);
})();
