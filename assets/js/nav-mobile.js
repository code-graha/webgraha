// WebGraha — mobile hamburger nav menu (index.html)
(function () {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('mobile-menu-icon');
    if (!btn || !menu) return;

    function setOpen(open) {
        menu.classList.toggle('hidden', !open);
        btn.setAttribute('aria-expanded', String(open));
        icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(menu.classList.contains('hidden'));
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== btn) setOpen(false);
    });
})();
