// WebGraha — subtle 3D depth: starfield shifts with cursor (about.html)
(function () {
    const field = document.getElementById('starfield');
    if (!field) return;
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 16;
        const y = (e.clientY / window.innerHeight - 0.5) * 16;
        field.style.transform = 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px)';
    });
})();
