// WebGraha — mobile services carousel (scroll-snap dot sync) (index.html)
(function () {
    const track = document.getElementById('services-track');
    const dotsWrap = document.getElementById('services-dots');
    if (!track || !dotsWrap) return;
    const cards = Array.from(track.querySelectorAll('.service-card'));
    const dots = Array.from(dotsWrap.querySelectorAll('.service-dot'));

    function updateActive() {
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const dist = Math.abs(cardCenter - center);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        dots.forEach((d, i) => d.classList.toggle('active', i === closest));
    }

    let ticking = false;
    track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { updateActive(); ticking = false; });
    });
    updateActive();
})();
