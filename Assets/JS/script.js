document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Cursor Tooltip on Hover with Elastic Spring Follower
  const follower = document.getElementById('cursor-follower');
  const followerText = follower ? follower.querySelector('.cursor-text') : null;

  if (follower && followerText) {
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isTracking = false;
    let cursorRafId = null;

    function renderCursor() {
      if (isTracking) {
        currentX += (mouseX - currentX) * 0.22;
        currentY += (mouseY - currentY) * 0.22;
        follower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(1)`;
        cursorRafId = requestAnimationFrame(renderCursor);
      }
    }

    document.querySelectorAll('[data-tooltip]').forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        followerText.textContent = item.getAttribute('data-tooltip');
        mouseX = e.clientX;
        mouseY = e.clientY;
        currentX = mouseX;
        currentY = mouseY;
        follower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(1)`;
        follower.classList.add('active');
        isTracking = true;
        if (!cursorRafId) cursorRafId = requestAnimationFrame(renderCursor);
      });

      item.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      item.addEventListener('mouseleave', () => {
        follower.classList.remove('active');
        isTracking = false;
        if (cursorRafId) {
          cancelAnimationFrame(cursorRafId);
          cursorRafId = null;
        }
      });
    });
  }

  // 2. Horizontal Scroll Dragging with Silky Smooth Momentum & Auto-Motion
  const slider = document.getElementById('slider-track');

  if (slider) {
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let velocityX = 0;
    let lastX = 0;
    let lastTime = 0;
    let isHovered = false;
    let sliderVisible = false;
    let momentumRafId = null;
    let autoRafId = null;
    let autoScrollDirection = 1;
    const autoScrollSpeed = 0.45;
    let hasDragged = false;

    // IntersectionObserver to only animate when in viewport
    const sliderObserver = new IntersectionObserver((entries) => {
      sliderVisible = entries[0].isIntersecting;
      if (sliderVisible && !autoRafId && !isDown) {
        autoRafId = requestAnimationFrame(autoMoveLoop);
      }
    }, { threshold: 0 });

    const sliderSection = document.getElementById('focus');
    if (sliderSection) sliderObserver.observe(sliderSection);

    function autoMoveLoop() {
      if (sliderVisible && !isDown && !isHovered && Math.abs(velocityX) < 0.05) {
        slider.scrollLeft += autoScrollSpeed * autoScrollDirection;

        const maxScroll = slider.scrollWidth - slider.clientWidth;
        if (slider.scrollLeft >= maxScroll - 3) {
          autoScrollDirection = -1;
        } else if (slider.scrollLeft <= 3) {
          autoScrollDirection = 1;
        }
      }
      if (sliderVisible) {
        autoRafId = requestAnimationFrame(autoMoveLoop);
      } else {
        autoRafId = null;
      }
    }

    function applyInertia() {
      if (Math.abs(velocityX) > 0.3) {
        slider.scrollLeft += velocityX;
        velocityX *= 0.94; // Silky smooth deceleration curve
        momentumRafId = requestAnimationFrame(applyInertia);
      } else {
        velocityX = 0;
        momentumRafId = null;
      }
    }

    // Pointer Events for unified Mouse, Trackpad & Touch
    slider.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return; // only main button
      isDown = true;
      hasDragged = false;

      if (momentumRafId) {
        cancelAnimationFrame(momentumRafId);
        momentumRafId = null;
      }

      slider.classList.add('is-dragging');
      try {
        slider.setPointerCapture(e.pointerId);
      } catch (_) {}

      startX = e.clientX;
      lastX = e.clientX;
      startScrollLeft = slider.scrollLeft;
      lastTime = performance.now();
      velocityX = 0;
    });

    slider.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      e.preventDefault();

      const currentX = e.clientX;
      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      const deltaX = startX - currentX;

      if (Math.abs(deltaX) > 4) {
        hasDragged = true;
      }

      // Smooth exponential velocity calculation (px per ~16.7ms frame)
      const instantV = ((lastX - currentX) / dt) * 16.67;
      velocityX = velocityX * 0.35 + instantV * 0.65;
      lastX = currentX;
      lastTime = now;

      // 1:1 direct tracking: card stays locked exactly under pointer
      slider.scrollLeft = startScrollLeft + deltaX;
    });

    function endDrag(e) {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove('is-dragging');

      try {
        if (slider.hasPointerCapture(e.pointerId)) {
          slider.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}

      // Apply smooth momentum if released with velocity
      if (Math.abs(velocityX) > 0.5) {
        velocityX = Math.max(-28, Math.min(28, velocityX));
        momentumRafId = requestAnimationFrame(applyInertia);
      }
    }

    slider.addEventListener('pointerup', endDrag);
    slider.addEventListener('pointercancel', endDrag);

    // Prevent accidental clicks when dragging
    slider.addEventListener('click', (e) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    slider.addEventListener('mouseenter', () => { isHovered = true; });
    slider.addEventListener('mouseleave', () => { isHovered = false; });

    // Start auto move if already visible
    if (sliderSection) {
      const rect = sliderSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        sliderVisible = true;
        autoRafId = requestAnimationFrame(autoMoveLoop);
      }
    }
  }

  // 3. Dynamic Urgency Label Update
  const urgencySlider = document.getElementById('urgency-slider');
  const urgentText = document.getElementById('urgent-text');
  const urgencyLabels = ['Whenever', 'Sometime soon', 'ASAP'];

  if (urgencySlider && urgentText) {
    urgencySlider.addEventListener('input', (e) => {
      urgentText.textContent = urgencyLabels[e.target.value - 1];
    });
  }

  // 4. Contact Modal Controls
  const modal = document.getElementById('contact-modal');
  const openBtns = [
    document.getElementById('partner-pill'),
    document.getElementById('nav-contact-btn'),
    document.getElementById('footer-trigger-modal')
  ];
  const closeBtn = document.getElementById('modal-close-btn');

  openBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => modal.classList.add('active'));
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // 5. Form Chip Toggle
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 6. Profile Section Scroll Frame-by-Frame Animation Integration
  initProfileScrollAnimation();
});

function initProfileScrollAnimation() {
  const canvas = document.getElementById('profile-canvas');
  const headshotCanvas = document.getElementById('headshot-canvas');
  const wrapper = document.getElementById('hero-scroll-wrapper');
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  const headshotCtx = headshotCanvas ? headshotCanvas.getContext('2d') : null;
  const totalFrames = 192;
  const frameImages = new Array(totalFrames);
  let loadedCount = 0;
  let targetFrameIndex = 0;
  let currentFrameFloat = 0;
  let lastDrawnFrameIndex = -1;
  let lastTime = performance.now();

  // Reduced motion preference check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- WebP support detection ---
  let useWebP = false;
  const webpTestCanvas = document.createElement('canvas');
  webpTestCanvas.width = 1;
  webpTestCanvas.height = 1;
  try {
    useWebP = webpTestCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch (e) {
    useWebP = false;
  }

  function getFrameUrl(index) {
    const pad = String(index).padStart(4, '0');
    if (useWebP) {
      return `./Assets/Media/frames-webp/frame_${pad}.webp`;
    }
    return `./Assets/Media/frames/frame_${pad}.jpg`;
  }

  // Setup canvas size matching display size & device pixel ratio
  function resizeCanvas() {
    const heroSection = document.getElementById('about');
    const rect = heroSection ? heroSection.getBoundingClientRect() : canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(rect.width * dpr, 600);
    canvas.height = Math.max(rect.height * dpr, 400);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (headshotCanvas) {
      const hsRect = headshotCanvas.getBoundingClientRect();
      const hsDpr = Math.min(window.devicePixelRatio || 1, 2);
      headshotCanvas.width = Math.max(hsRect.width * hsDpr, 192);
      headshotCanvas.height = Math.max(hsRect.height * hsDpr, 264);

      if (headshotCtx) {
        headshotCtx.imageSmoothingEnabled = true;
        headshotCtx.imageSmoothingQuality = 'high';
      }
    }

    if (lastDrawnFrameIndex >= 0) {
      drawFrame(lastDrawnFrameIndex);
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 100);
  }, { passive: true });
  resizeCanvas();

  // Helper to draw an image covering canvas maintaining aspect ratio
  // Direct painting over existing canvas eliminates micro-flickering
  function drawImageToTarget(targetCtx, targetCanvas, img) {
    if (!targetCtx || !targetCanvas || !img || !img.complete || img.naturalWidth === 0) return;
    const cw = targetCanvas.width;
    const ch = targetCanvas.height;

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = cw;
      renderH = cw / imgRatio;
      offsetX = 0;
      offsetY = (ch - renderH) / 2;
    } else {
      renderH = ch;
      renderW = ch * imgRatio;
      offsetX = (cw - renderW) / 2;
      offsetY = 0;
    }

    targetCtx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }

  // Draw target frame or nearest available loaded frame fallback
  function drawFrame(index) {
    let imgToDraw = frameImages[index];
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      // Find nearest loaded frame
      for (let offset = 1; offset < totalFrames; offset++) {
        const prev = index - offset;
        const next = index + offset;
        if (prev >= 0 && frameImages[prev] && frameImages[prev].complete && frameImages[prev].naturalWidth !== 0) {
          imgToDraw = frameImages[prev];
          break;
        }
        if (next < totalFrames && frameImages[next] && frameImages[next].complete && frameImages[next].naturalWidth !== 0) {
          imgToDraw = frameImages[next];
          break;
        }
      }
    }
    if (imgToDraw) {
      drawImageToTarget(ctx, canvas, imgToDraw);
      if (headshotCtx && headshotCanvas) {
        drawImageToTarget(headshotCtx, headshotCanvas, imgToDraw);
      }
      lastDrawnFrameIndex = index;
    }
  }

  // Calculate target frame index from scroll position
  function updateScrollProgress() {
    if (prefersReducedMotion) {
      targetFrameIndex = 0;
      return;
    }
    const rect = wrapper.getBoundingClientRect();
    const scrollableHeight = wrapper.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) {
      targetFrameIndex = 0;
      return;
    }

    const currentScroll = -rect.top;
    const progress = Math.min(1, Math.max(0, currentScroll / scrollableHeight));
    targetFrameIndex = Math.min(totalFrames - 1, Math.max(0, Math.floor(progress * (totalFrames - 1))));
  }

  // --- IntersectionObserver: only run render loop when hero is visible ---
  let heroVisible = true;
  let heroRafId = null;

  const heroObserver = new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible && heroRafId === null) {
      lastTime = performance.now();
      heroRafId = requestAnimationFrame(renderLoop);
    }
  }, { threshold: 0 });

  heroObserver.observe(wrapper);

  // Animation Loop via requestAnimationFrame with cinematic LERP smoothing
  function renderLoop(timestamp) {
    if (heroVisible) {
      updateScrollProgress();

      const now = timestamp || performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth frame-rate independent interpolation (120Hz/60Hz adaptive)
      const delta = targetFrameIndex - currentFrameFloat;
      if (Math.abs(delta) > 0.02) {
        const factor = 1 - Math.exp(-14 * dt); // Buttery smooth spring deceleration
        currentFrameFloat += delta * factor;
      } else {
        currentFrameFloat = targetFrameIndex;
      }

      const frameToDraw = Math.min(totalFrames - 1, Math.max(0, Math.round(currentFrameFloat)));
      if (frameToDraw !== lastDrawnFrameIndex) {
        drawFrame(frameToDraw);
      }

      heroRafId = requestAnimationFrame(renderLoop);
    } else {
      heroRafId = null;
      lastTime = performance.now();
    }
  }

  // Load Frame 0 FIRST for instant render
  const frame0 = new Image();
  frame0.onload = () => {
    frameImages[0] = frame0;
    loadedCount++;
    drawFrame(0);
  };
  frame0.src = getFrameUrl(0);

  // --- Viewport-aware frame loading with scroll proximity reordering ---
  const loadedSet = new Set();
  let triggerQueueUpdate = null;

  function preloadAllFrames() {
    const keyframes = [];
    for (let i = 0; i < totalFrames; i += 10) {
      if (i !== 0) keyframes.push(i);
    }
    const remaining = [];
    for (let i = 0; i < totalFrames; i++) {
      if (!keyframes.includes(i) && i !== 0) {
        remaining.push(i);
      }
    }

    let batchInFlight = 0;
    const MAX_CONCURRENT = 5;

    triggerQueueUpdate = function() {
      if (remaining.length > 0) {
        remaining.sort((a, b) => Math.abs(a - targetFrameIndex) - Math.abs(b - targetFrameIndex));
        loadNext();
      }
    };

    function loadNext() {
      while (batchInFlight < MAX_CONCURRENT) {
        let idx;
        if (keyframes.length > 0) {
          idx = keyframes.shift();
        } else if (remaining.length > 0) {
          remaining.sort((a, b) => Math.abs(a - targetFrameIndex) - Math.abs(b - targetFrameIndex));
          idx = remaining.shift();
        } else {
          break;
        }

        if (loadedSet.has(idx)) {
          continue;
        }

        batchInFlight++;
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          frameImages[idx] = img;
          loadedSet.add(idx);
          loadedCount++;
          batchInFlight--;
          if (idx === Math.round(currentFrameFloat) || lastDrawnFrameIndex === idx) {
            drawFrame(Math.round(currentFrameFloat));
          }
          loadNext();
        };
        img.onerror = () => {
          batchInFlight--;
          loadNext();
        };
        img.src = getFrameUrl(idx);
      }
    }

    setTimeout(loadNext, 40);
  }

  // Trigger immediate frame prioritization on scroll
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    if (triggerQueueUpdate) triggerQueueUpdate();
  }, { passive: true });

  preloadAllFrames();
  heroRafId = requestAnimationFrame(renderLoop);
}
