// WebGraha — rotating 3D Earth (Three.js) (index.html)
(function () {
    const canvas = document.getElementById('globe-canvas');
    if (!window.THREE || !canvas) return;

    // Defer WebGL init + texture fetch until the browser is idle so the
    // 2.2MB of earth textures never compete with first paint / LCP.
    const schedule = window.requestIdleCallback || function (cb) { setTimeout(cb, 200); };
    schedule(init, { timeout: 1500 });

    function init() {

    const THREE = window.THREE;
    let w = window.innerWidth, h = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, w / h, 0.1, 100);
    camera.position.set(0, 0, 4.6);

    const group = new THREE.Group();
    group.rotation.z = 0.32;
    group.scale.set(1.15, 1.15, 1.15);
    scene.add(group);

    scene.add(new THREE.AmbientLight(0x3c4a64, 0.7));
    scene.add(new THREE.HemisphereLight(0x5a86ab, 0x5a4630, 0.55));
    const dirLight = new THREE.DirectionalLight(0xfff3dc, 2.1);
    dirLight.position.set(-2.1, -0.85, 2.3);
    scene.add(dirLight);

    function makeFallbackTexture() {
        const c = document.createElement('canvas');
        c.width = 1024; c.height = 512;
        const ctx = c.getContext('2d');
        const g = ctx.createLinearGradient(0, 0, 0, 512);
        g.addColorStop(0, '#1a365d'); g.addColorStop(1, '#0a1128');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1024, 512);
        for (let i = 0; i < 2400; i++) {
            const r = Math.random() * 22 + 4;
            const green = Math.random() < 0.5;
            ctx.fillStyle = green
                ? 'rgba(44,76,59,' + (Math.random() * 0.5 + 0.2).toFixed(2) + ')'
                : 'rgba(74,59,44,' + (Math.random() * 0.4 + 0.15).toFixed(2) + ')';
            ctx.beginPath();
            ctx.arc(Math.random() * 1024, Math.random() * 512, r, 0, Math.PI * 2);
            ctx.fill();
        }
        return new THREE.CanvasTexture(c);
    }

    const base = 'assets/vendor/three-globe/';
    const loader = new THREE.TextureLoader();
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xc3cdd6),
        metalness: 0.28,
        roughness: 0.72
    });
    const renderOnce = () => renderer.render(scene, camera);
    material.map = loader.load(base + 'earth-blue-marble.jpg',
        () => { material.needsUpdate = true; renderOnce(); },
        undefined,
        () => { material.map = makeFallbackTexture(); material.needsUpdate = true; renderOnce(); }
    );
    material.bumpMap = loader.load(base + 'earth-topology.jpg');
    material.bumpScale = 0.018;
    material.metalnessMap = loader.load(base + 'earth-water.jpg');

    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), material);
    earth.rotation.y = -1.6;
    group.add(earth);

    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: { uStrength: { value: 1.0 } },
        vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'varying vec3 vN; uniform float uStrength; void main(){ float i = pow(0.58 - dot(vN, vec3(0.0,0.0,1.0)), 3.0); i = clamp(i,0.0,1.0)*uStrength; gl_FragColor = vec4(vec3(0.36,0.56,0.48), 1.0) * i; }',
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false
    });
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), atmosphereMaterial);
    atmosphere.scale.set(1.16, 1.16, 1.16);
    group.add(atmosphere);

    let tx = 0, ty = 0, px = 0, py = 0;
    window.addEventListener('mousemove', (e) => {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
    });
    window.addEventListener('resize', () => {
        w = window.innerWidth; h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    });

    const ROTATION_SPEED = 1.1; // slow, smooth, continuous
    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.0011 * ROTATION_SPEED;
        px += (tx - px) * 0.045;
        py += (ty - py) * 0.045;
        group.position.x = px * 0.07;
        group.rotation.x = py * 0.10;
        renderer.render(scene, camera);
    }
    animate();
    }
})();
