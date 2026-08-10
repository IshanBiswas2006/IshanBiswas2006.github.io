document.addEventListener('DOMContentLoaded', () => {
  // 1. Custom Cursor Tooltip on Hover
  const follower = document.getElementById('cursor-follower');
  const followerText = follower ? follower.querySelector('.cursor-text') : null;

  if (follower && followerText) {
    document.querySelectorAll('[data-tooltip]').forEach(item => {
      item.addEventListener('mouseenter', () => {
        followerText.textContent = item.getAttribute('data-tooltip');
        follower.classList.add('active');
      });

      item.addEventListener('mousemove', (e) => {
        follower.style.left = `${e.clientX}px`;
        follower.style.top = `${e.clientY}px`;
      });

      item.addEventListener('mouseleave', () => {
        follower.classList.remove('active');
      });
    });
  }

  // 2. Horizontal Scroll Dragging & Smooth Slow Auto-Motion
  const slider = document.getElementById('slider-track');
  let isDown = false;
  let startX;
  let scrollLeft;
  let autoScrollDirection = 1;
  let autoScrollSpeed = 0.6; // Slow movement pace
  let isHovered = false;

  if (slider) {
    // Continuous Slow Auto-Scroll Functionality
    function slowAutoMove() {
      if (!isDown && !isHovered) {
        slider.scrollLeft += autoScrollSpeed * autoScrollDirection;

        // Bounce back smoothly when reaching borders
        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 5) {
          autoScrollDirection = -1;
        } else if (slider.scrollLeft <= 5) {
          autoScrollDirection = 1;
        }
      }
      requestAnimationFrame(slowAutoMove);
    }
    requestAnimationFrame(slowAutoMove);

    slider.addEventListener('mouseenter', () => { isHovered = true; });
    slider.addEventListener('mouseleave', () => {
      isHovered = false;
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
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
  let lastDrawnFrameIndex = -1;

  // Reduced motion preference check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getFrameUrl(index) {
    const pad = String(index).padStart(4, '0');
    return `./Assets/Media/frames/frame_${pad}.jpg`;
  }

  // Setup canvas size matching display size & device pixel ratio
  function resizeCanvas() {
    const heroSection = document.getElementById('about');
    const rect = heroSection ? heroSection.getBoundingClientRect() : canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(rect.width * dpr, 600);
    canvas.height = Math.max(rect.height * dpr, 400);

    if (headshotCanvas) {
      const hsRect = headshotCanvas.getBoundingClientRect();
      headshotCanvas.width = Math.max(hsRect.width * dpr, 192);
      headshotCanvas.height = Math.max(hsRect.height * dpr, 264);
    }

    if (lastDrawnFrameIndex >= 0) {
      drawFrame(lastDrawnFrameIndex);
    }
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  // Helper to draw an image covering canvas maintaining aspect ratio
  function drawImageToTarget(targetCtx, targetCanvas, img) {
    if (!targetCtx || !targetCanvas || !img || !img.complete || img.naturalWidth === 0) return;
    const cw = targetCanvas.width;
    const ch = targetCanvas.height;
    targetCtx.clearRect(0, 0, cw, ch);

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

    targetCtx.imageSmoothingEnabled = true;
    targetCtx.imageSmoothingQuality = 'high';
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

  // Animation Loop via requestAnimationFrame
  function renderLoop() {
    updateScrollProgress();
    if (targetFrameIndex !== lastDrawnFrameIndex) {
      drawFrame(targetFrameIndex);
    }
    requestAnimationFrame(renderLoop);
  }

  // Load Frame 0 FIRST for instant render
  const frame0 = new Image();
  frame0.onload = () => {
    frameImages[0] = frame0;
    loadedCount++;
    drawFrame(0);
  };
  frame0.src = getFrameUrl(0);

  // Preload keyframes first (every 10th frame), then all remaining frames
  function preloadAllFrames() {
    const indicesToLoad = [];
    // Priority 1: Keyframes
    for (let i = 0; i < totalFrames; i += 10) {
      if (i !== 0) indicesToLoad.push(i);
    }
    // Priority 2: Remaining frames
    for (let i = 0; i < totalFrames; i++) {
      if (!indicesToLoad.includes(i) && i !== 0) {
        indicesToLoad.push(i);
      }
    }

    function loadNextBatch(batchSize = 8) {
      if (indicesToLoad.length === 0) return;
      const batch = indicesToLoad.splice(0, batchSize);
      let batchLoaded = 0;

      batch.forEach(idx => {
        const img = new Image();
        img.onload = () => {
          frameImages[idx] = img;
          loadedCount++;
          batchLoaded++;
          if (idx === targetFrameIndex || lastDrawnFrameIndex === idx) {
            drawFrame(targetFrameIndex);
          }
          if (batchLoaded === batch.length) {
            setTimeout(loadNextBatch, 10);
          }
        };
        img.onerror = () => {
          batchLoaded++;
          if (batchLoaded === batch.length) {
            setTimeout(loadNextBatch, 10);
          }
        };
        img.src = getFrameUrl(idx);
      });
    }

    setTimeout(() => loadNextBatch(10), 50);
  }

  preloadAllFrames();
  requestAnimationFrame(renderLoop);
}
