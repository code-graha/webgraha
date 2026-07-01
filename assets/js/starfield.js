// WebGraha — twinkling starfield (used by every page)
(function () {
    const field = document.getElementById('starfield');
    if (!field) return;
    const COUNT = parseInt(field.getAttribute('data-star-count'), 10) || 130;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        const size = (Math.random() * 1.8 + 0.6).toFixed(2);
        star.style.left = (Math.random() * 100) + '%';
        star.style.top = (Math.random() * 100) + '%';
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDuration = (Math.random() * 3.5 + 2) + 's';
        star.style.animationDelay = (Math.random() * 4) + 's';
        frag.appendChild(star);
    }
    field.appendChild(frag);
})();
