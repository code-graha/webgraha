// WebGraha — 3D mouse-tilt for elements with class="tilt-card"
(function () {
    function bind(card) {
        if (card.dataset.tiltBound) return;
        card.dataset.tiltBound = '1';
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = 'perspective(900px) rotateX(' + (-py * 9).toFixed(2) + 'deg) rotateY(' + (px * 9).toFixed(2) + 'deg) translateZ(6px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    }

    function init() {
        document.querySelectorAll('.tilt-card').forEach(bind);
    }

    document.addEventListener('DOMContentLoaded', init);
    document.addEventListener('webgraha:data-rendered', init);
})();
