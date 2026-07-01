// WebGraha — collapsible "About & Social" widget on mobile (index.html)
(function () {
    const collapsed = document.getElementById('social-collapsed');
    const panel = document.getElementById('social-panel');
    const collapseBtn = document.getElementById('social-collapse-btn');
    if (!collapsed || !panel) return;

    collapsed.addEventListener('click', () => {
        collapsed.classList.add('hidden');
        panel.classList.remove('hidden');
    });
    collapseBtn.addEventListener('click', () => {
        panel.classList.add('hidden');
        collapsed.classList.remove('hidden');
    });
})();
