// WebGraha — shooting star comets (about.html, 404.html, 405.html)
(function () {
    const field = document.getElementById('starfield');
    if (!field) return;

    function spawn() {
        const star = document.createElement('span');
        star.className = 'shooting-star';
        const angle = 115 + Math.random() * 35; // travels down-left, slight variation
        const dist = 380 + Math.random() * 260;
        const dur = (0.9 + Math.random() * 0.7).toFixed(2);
        const len = Math.round(80 + Math.random() * 70);
        star.style.top = (Math.random() * 35 + 4) + '%';
        star.style.left = (Math.random() * 45 + 40) + '%';
        star.style.setProperty('--angle', angle.toFixed(1) + 'deg');
        star.style.setProperty('--dist', dist.toFixed(0) + 'px');
        star.style.setProperty('--dur', dur + 's');
        star.style.setProperty('--len', len + 'px');
        field.appendChild(star);
        star.addEventListener('animationend', () => star.remove());
    }

    function loop() {
        spawn();
        setTimeout(loop, 2600 + Math.random() * 3200);
    }
    setTimeout(loop, 1500);
})();
