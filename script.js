/* ==========================================================================
   MUHAMMAD AWAIS HAMEED — PORTFOLIO SCRIPT
   Cinematic upgrade: 3D command-center hero (Three.js, lazy-loaded + capability
   checked + mobile fallback), cursor glow, magnetic buttons, 3D card tilt,
   scroll-cinematic reveals, animated counters, and the signature rank-climb
   SEO demo.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktopWidth = window.matchMedia('(min-width: 768px)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------------------------------------------------
     Footer year
  --------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     Nav: scroll state + mobile toggle
  --------------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal (supports data-reveal="scale|blur|rotate" variants —
     the actual visual treatment lives in CSS; this just toggles the class)
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------------
     Animated impact counters
  --------------------------------------------------------------------- */
  const counters = document.querySelectorAll('.impact-item .num');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    if (prefersReduced) {
      el.textContent = target + suffix;
    } else {
      requestAnimationFrame(step);
    }
  };
  if ('IntersectionObserver' in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => countIO.observe(c));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------------------------------------------------------------------
     Shared hero mouse state — drives BOTH the CSS panel parallax and the
     Three.js camera, so the two layers move together as one "camera".
  --------------------------------------------------------------------- */
  const heroVisual = document.getElementById('heroVisual');
  const heroMouse = { x: 0, y: 0 }; // normalized -0.5..0.5
  const canRunHeroInteraction = !!heroVisual && isFinePointer && !prefersReduced;

  if (canRunHeroInteraction) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      heroMouse.x = (e.clientX - rect.left) / rect.width - 0.5;
      heroMouse.y = (e.clientY - rect.top) / rect.height - 0.5;
    });
    heroVisual.addEventListener('mouseleave', () => { heroMouse.x = 0; heroMouse.y = 0; });
  }

  /* ---------------------------------------------------------------------
     HTML layer parallax: the console stage + floating command-center panels
  --------------------------------------------------------------------- */
  const stage = document.getElementById('consoleStage');
  if (stage && canRunHeroInteraction) {
    let curX = 0, curY = 0;
    const raf = () => {
      curX += (heroMouse.x * 18 - curX) * 0.06;
      curY += (heroMouse.y * -18 - curY) * 0.06;
      stage.style.transform = `rotateY(${curX}deg) rotateX(${curY}deg)`;
      requestAnimationFrame(raf);
    };
    raf();
  }

  /* ---------------------------------------------------------------------
     Signature element: Search Console "rank climb" animation
     Simulates a listing climbing from a low rank to #1 for a keyword,
     visually embodying SEO expertise.
  --------------------------------------------------------------------- */
  const typeTextEl = document.getElementById('typeText');
  const serpListEl = document.getElementById('serpList');
  const rankReadout = document.getElementById('rankReadout');

  const KEYWORD = 'wireless earbuds';
  const ROW_COUNT = 6;

  function buildSerpRows() {
    serpListEl.innerHTML = '';
    for (let i = 0; i < ROW_COUNT; i++) {
      const row = document.createElement('div');
      row.className = 'serp-row';
      if (i === 0) row.classList.add('top');
      const rank = document.createElement('span');
      rank.className = 'rank';
      rank.textContent = '#' + (i + 1);
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.width = (90 - i * 8) + '%';
      row.appendChild(rank);
      row.appendChild(bar);
      serpListEl.appendChild(row);
    }
    const rows = serpListEl.querySelectorAll('.serp-row');
    rows[rows.length - 1].classList.add('is-client');
  }

  function climbOneStep() {
    const rows = Array.from(serpListEl.querySelectorAll('.serp-row'));
    const clientIndex = rows.findIndex(r => r.classList.contains('is-client'));
    if (clientIndex <= 0) return false;
    const above = rows[clientIndex - 1];
    const client = rows[clientIndex];
    above.classList.remove('is-client');
    client.classList.add('is-client');
    serpListEl.insertBefore(client, above);
    const updated = Array.from(serpListEl.querySelectorAll('.serp-row'));
    updated.forEach((row, i) => {
      row.querySelector('.rank').textContent = '#' + (i + 1);
      row.classList.toggle('top', i === 0);
    });
    return clientIndex - 1 > 0;
  }

  function typeKeyword(callback) {
    let i = 0;
    typeTextEl.textContent = '';
    const interval = setInterval(() => {
      typeTextEl.textContent += KEYWORD[i];
      i++;
      if (i >= KEYWORD.length) {
        clearInterval(interval);
        setTimeout(callback, 500);
      }
    }, 70);
  }

  function runRankSequence() {
    buildSerpRows();
    if (rankReadout) rankReadout.textContent = '▲ climbing to #1';
    typeKeyword(() => {
      let steps = 0;
      const maxSteps = ROW_COUNT - 1;
      const interval = setInterval(() => {
        const canContinue = climbOneStep();
        steps++;
        if (!canContinue || steps >= maxSteps) {
          clearInterval(interval);
          if (rankReadout) rankReadout.textContent = '▲ ranked #1 of ' + ROW_COUNT;
          setTimeout(() => {
            if (!prefersReduced) runRankSequence();
          }, 3200);
        }
      }, 750);
    });
  }

  if (typeTextEl && serpListEl) {
    if (prefersReduced) {
      typeTextEl.textContent = KEYWORD;
      buildSerpRows();
      const rows = serpListEl.querySelectorAll('.serp-row');
      rows.forEach(r => r.classList.remove('is-client'));
      rows[0].classList.add('is-client', 'top');
      if (rankReadout) rankReadout.textContent = '▲ ranked #1 of ' + ROW_COUNT;
    } else {
      runRankSequence();
    }
  }

  /* ---------------------------------------------------------------------
     Service card: cursor glow + true 3D tilt (single mousemove handler)
  --------------------------------------------------------------------- */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
        const rotateY = (px - 0.5) * 10;
        const rotateX = (0.5 - py) * 10;
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------------------
     Magnetic buttons
  --------------------------------------------------------------------- */
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      const strength = 0.35;
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ---------------------------------------------------------------------
     Cursor glow — follows the pointer across the whole page
  --------------------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && isFinePointer && !prefersReduced) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let cx = gx, cy = gy;
    let active = false;
    window.addEventListener('mousemove', (e) => {
      gx = e.clientX; gy = e.clientY;
      if (!active) { active = true; cursorGlow.classList.add('is-active'); }
    }, { passive: true });
    document.addEventListener('mouseleave', () => {
      active = false;
      cursorGlow.classList.remove('is-active');
    });
    const raf = () => {
      cx += (gx - cx) * 0.15;
      cy += (gy - cy) * 0.15;
      cursorGlow.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(raf);
    };
    raf();
  }

  /* ---------------------------------------------------------------------
     Background particle network canvas (page-wide ambient layer)
  --------------------------------------------------------------------- */
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas && !prefersReduced) {
    const ctx = bgCanvas.getContext('2d');
    let w, h, particles;
    const COLORS = ['#F2B84B', '#2BE9C7', '#8172F5'];

    function resize() {
      w = bgCanvas.width = window.innerWidth;
      h = bgCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }));

    let bgRunning = true;
    document.addEventListener('visibilitychange', () => {
      bgRunning = document.visibilityState === 'visible';
      if (bgRunning) requestAnimationFrame(tick);
    });

    function tick() {
      if (!bgRunning) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(140,150,180,${0.08 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ---------------------------------------------------------------------
     Contact form: front-end only confirmation (no backend configured)
  --------------------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message ready ✓';
      btn.style.opacity = '0.8';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.opacity = '1';
      }, 2600);
    });
  }

  /* =======================================================================
     3D E-COMMERCE COMMAND CENTER — Three.js hero scene
     Loaded lazily and only when the device can comfortably run it. Falls
     back to a lightweight CSS ambience everywhere else (see .no-3d in
     style.css). The whole module is scoped to #heroThreeCanvas so the
     render loop only ever covers the hero panel, not the full page.
  ========================================================================= */
  (function initHeroCommandCenter() {
    const canvas = document.getElementById('heroThreeCanvas');
    if (!canvas || !heroVisual) return;

    function supportsWebGL() {
      try {
        const test = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
          (test.getContext('webgl') || test.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    }

    const lowMemory = 'deviceMemory' in navigator && navigator.deviceMemory && navigator.deviceMemory < 4;
    const shouldUse3D = !prefersReduced && isDesktopWidth && isFinePointer && supportsWebGL() && !lowMemory;

    if (!shouldUse3D) {
      heroVisual.classList.add('no-3d');
      return;
    }

    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
      .then(buildScene)
      .catch(() => {
        heroVisual.classList.add('no-3d');
      });

    function buildScene() {
      if (!window.THREE) {
        heroVisual.classList.add('no-3d');
        return;
      }
      try {
        const THREE = window.THREE;
        const rect = heroVisual.getBoundingClientRect();

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(rect.width, rect.height, false);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(48, rect.width / rect.height, 0.1, 100);
        camera.position.set(0, 0, 6.2);

        scene.add(new THREE.AmbientLight(0x8fa2c9, 0.7));
        const goldLight = new THREE.PointLight(0xF2B84B, 1.3, 22);
        goldLight.position.set(2.5, 2, 4);
        scene.add(goldLight);
        const tealLight = new THREE.PointLight(0x2BE9C7, 0.9, 22);
        tealLight.position.set(-3, -1.5, 3);
        scene.add(tealLight);

        /* ---- soft round point texture for premium (non-gamer) particle glow ---- */
        function makeGlowTexture() {
          const size = 64;
          const c = document.createElement('canvas');
          c.width = c.height = size;
          const ctx2d = c.getContext('2d');
          const g = ctx2d.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
          g.addColorStop(0, 'rgba(255,255,255,0.9)');
          g.addColorStop(0.5, 'rgba(255,255,255,0.35)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx2d.fillStyle = g;
          ctx2d.fillRect(0, 0, size, size);
          return new THREE.CanvasTexture(c);
        }
        const glowTex = makeGlowTexture();

        /* ---- floating data particles ---- */
        const tier = window.innerWidth > 1400 ? 80 : window.innerWidth > 1024 ? 55 : 34;
        const palette = [
          [0.949, 0.722, 0.294], // gold
          [0.169, 0.914, 0.780], // teal
          [0.506, 0.447, 0.961]  // violet
        ];
        const positions = new Float32Array(tier * 3);
        const colors = new Float32Array(tier * 3);
        const velocities = [];
        for (let i = 0; i < tier; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 8.5;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 5.4;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
          const c = palette[i % palette.length];
          colors[i * 3] = c[0]; colors[i * 3 + 1] = c[1]; colors[i * 3 + 2] = c[2];
          velocities.push({
            x: (Math.random() - 0.5) * 0.004,
            y: (Math.random() - 0.5) * 0.004,
            z: (Math.random() - 0.5) * 0.003
          });
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const particleMat = new THREE.PointsMaterial({
          size: 0.09,
          map: glowTex,
          vertexColors: true,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
        });
        const points = new THREE.Points(particleGeo, particleMat);
        scene.add(points);

        /* ---- connecting light lines between nearby particles (static topology,
               positions updated per-frame — cheap and keeps the "data network"
               feel connected to the drifting particles) ---- */
        const maxLines = 46;
        const linePairs = [];
        outer:
        for (let i = 0; i < tier; i++) {
          for (let j = i + 1; j < tier; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d < 2.1) {
              linePairs.push([i, j]);
              if (linePairs.length >= maxLines) break outer;
            }
          }
        }
        const linePositions = new Float32Array(linePairs.length * 2 * 3);
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({ color: 0x8b93ac, transparent: true, opacity: 0.16 });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lines);

        /* ---- floating wireframe nodes: abstract "marketplace" data nodes ---- */
        const nodeColors = [0xF2B84B, 0x2BE9C7, 0x8172F5, 0xF2B84B];
        const nodeConfigs = [
          { pos: [-2.6, 1.1, -1.2], scale: 0.42 },
          { pos: [2.7, -0.9, -1.6], scale: 0.5 },
          { pos: [-1.6, -1.5, 0.4], scale: 0.32 },
          { pos: [2.1, 1.5, 0.7], scale: 0.36 }
        ];
        const nodes = nodeConfigs.map((cfg, i) => {
          const geo = new THREE.IcosahedronGeometry(cfg.scale, 0);
          const mat = new THREE.MeshStandardMaterial({
            color: nodeColors[i % nodeColors.length],
            wireframe: true,
            transparent: true,
            opacity: 0.3,
            roughness: 0.4
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
          scene.add(mesh);
          return {
            mesh,
            baseY: cfg.pos[1],
            phase: Math.random() * Math.PI * 2,
            speedX: (Math.random() - 0.5) * 0.004,
            speedY: (Math.random() - 0.5) * 0.004
          };
        });

        /* ---- render loop: only runs while hero is visible + tab is active ---- */
        const clock = new THREE.Clock();
        let running = true;
        let mouseX = 0, mouseY = 0;

        function updateMouse() {
          mouseX = heroMouse.x;
          mouseY = heroMouse.y;
        }

        function animate() {
          if (!running) return;
          requestAnimationFrame(animate);
          updateMouse();
          const t = clock.getElapsedTime();

          camera.position.x += ((mouseX * 1.1) - camera.position.x) * 0.04;
          camera.position.y += ((mouseY * -1.1) - camera.position.y) * 0.04;
          camera.position.z = 6.2 - Math.min(Math.max(scrollDolly, 0), 1) * 0.9;
          camera.lookAt(0, 0, 0);

          const posAttr = particleGeo.attributes.position;
          for (let i = 0; i < tier; i++) {
            posAttr.array[i * 3] += velocities[i].x;
            posAttr.array[i * 3 + 1] += velocities[i].y;
            posAttr.array[i * 3 + 2] += velocities[i].z;
            if (posAttr.array[i * 3] > 4.3 || posAttr.array[i * 3] < -4.3) velocities[i].x *= -1;
            if (posAttr.array[i * 3 + 1] > 2.8 || posAttr.array[i * 3 + 1] < -2.8) velocities[i].y *= -1;
            if (posAttr.array[i * 3 + 2] > 2.3 || posAttr.array[i * 3 + 2] < -2.3) velocities[i].z *= -1;
          }
          posAttr.needsUpdate = true;

          const linePosAttr = lineGeo.attributes.position;
          linePairs.forEach((pair, idx) => {
            const [a, b] = pair;
            linePosAttr.array[idx * 6] = posAttr.array[a * 3];
            linePosAttr.array[idx * 6 + 1] = posAttr.array[a * 3 + 1];
            linePosAttr.array[idx * 6 + 2] = posAttr.array[a * 3 + 2];
            linePosAttr.array[idx * 6 + 3] = posAttr.array[b * 3];
            linePosAttr.array[idx * 6 + 4] = posAttr.array[b * 3 + 1];
            linePosAttr.array[idx * 6 + 5] = posAttr.array[b * 3 + 2];
          });
          linePosAttr.needsUpdate = true;

          nodes.forEach(n => {
            n.mesh.rotation.x += n.speedX;
            n.mesh.rotation.y += n.speedY;
            n.mesh.position.y = n.baseY + Math.sin(t * 0.4 + n.phase) * 0.14;
          });

          renderer.render(scene, camera);
        }

        /* ---- scroll dolly: gentle push-in while scrolling through the hero ---- */
        let scrollDolly = 0;
        let scrollTicking = false;
        function updateScrollDolly() {
          const heroHeight = heroVisual.closest('.hero') ? heroVisual.closest('.hero').offsetHeight : window.innerHeight;
          scrollDolly = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);
          scrollTicking = false;
        }
        window.addEventListener('scroll', () => {
          if (!scrollTicking) {
            requestAnimationFrame(updateScrollDolly);
            scrollTicking = true;
          }
        }, { passive: true });

        /* ---- pause the render loop when the hero scrolls out of view, or the
               tab is hidden — keeps the 3D scene from costing anything site-wide ---- */
        if ('IntersectionObserver' in window) {
          const heroIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              running = entry.isIntersecting && document.visibilityState === 'visible';
              if (running) requestAnimationFrame(animate);
            });
          }, { threshold: 0.05 });
          heroIO.observe(heroVisual);
        }
        document.addEventListener('visibilitychange', () => {
          const stillIntersecting = heroVisual.getBoundingClientRect().bottom > 0 &&
            heroVisual.getBoundingClientRect().top < window.innerHeight;
          running = document.visibilityState === 'visible' && stillIntersecting;
          if (running) requestAnimationFrame(animate);
        });

        /* ---- resize handling ---- */
        let resizeTicking = false;
        function handleResize() {
          const r = heroVisual.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) { resizeTicking = false; return; }
          camera.aspect = r.width / r.height;
          camera.updateProjectionMatrix();
          renderer.setSize(r.width, r.height, false);
          resizeTicking = false;
        }
        window.addEventListener('resize', () => {
          if (!resizeTicking) {
            requestAnimationFrame(handleResize);
            resizeTicking = true;
          }
        }, { passive: true });

        animate();
        canvas.classList.add('is-ready');
      } catch (err) {
        heroVisual.classList.add('no-3d');
      }
    }
  })();
});
