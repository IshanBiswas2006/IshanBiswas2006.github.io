/**
 * Ishan Biswas Portfolio — Core Interaction & Animation Engine
 * Integrates:
 * - Lenis Inertia-based Smooth Scrolling
 * - GSAP ScrollTrigger Orchestration (Parallax & Staggered Entrances)
 * - Canvas Frame-by-Frame Scroll Scrubbing
 * - Unified Horizontal Touch / Pointer Dragging
 * - Custom Elastic Cursor Follower & Interactive Controls
 */

// Global reference to Lenis instance
let lenis = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scrolling & GSAP ScrollTrigger
  initLenisAndScrollTrigger();

  // 2. Smooth Anchor Navigation via Lenis
  initSmoothAnchorLinks();

  // 3. Custom Cursor Follower with Elastic Spring
  initCustomCursor();

  // 4. Horizontal Scroll Dragging with Silky Momentum & Auto-Motion
  initSliderTrack();

  // 5. Interactive Urgency Slider & Contact Modal
  initUrgencyAndModal();

  // 6. Live Time Display (IST)
  initLiveClock();

  // 7. Profile Frame-by-Frame Scroll Animation Integration
  initProfileScrollAnimation();

  // 8. GSAP ScrollTrigger Parallax & Entrance Animations
  initGSAPScrollAnimations();
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLLING & GSAP INTEGRATION
   ========================================================================== */
function initLenisAndScrollTrigger() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky exponential out ease
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false, // Maintain native touch momentum on phones
      touchMultiplier: 1.5,
      wheelMultiplier: 1.05,
      infinite: false,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Inform ScrollTrigger of Lenis scroll events
      lenis.on('scroll', ScrollTrigger.update);

      // Run Lenis within GSAP's optimized ticker
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      // Disable GSAP lag smoothing to maintain 1:1 sync with momentum
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    window.lenis = lenis;
  }
}

/* ==========================================================================
   2. SMOOTH ANCHOR NAVIGATION (via lenis.scrollTo)
   ========================================================================== */
function initSmoothAnchorLinks() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      if (lenis) {
        lenis.scrollTo(targetEl, {
          offset: -60,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   3. CUSTOM CURSOR FOLLOWER
   ========================================================================== */
function initCustomCursor() {
  const follower = document.getElementById('cursor-follower');
  const followerText = follower ? follower.querySelector('.cursor-text') : null;
  if (!follower || !followerText) return;

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

  document.querySelectorAll('[data-tooltip]').forEach((item) => {
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

/* ==========================================================================
   4. HORIZONTAL SLIDER WITH SILKY INERTIA & AUTO MOTION
   ========================================================================== */
function initSliderTrack() {
  const slider = document.getElementById('slider-track');
  if (!slider) return;

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

  const sliderObserver = new IntersectionObserver(
    (entries) => {
      sliderVisible = entries[0].isIntersecting;
      if (sliderVisible && !autoRafId && !isDown) {
        autoRafId = requestAnimationFrame(autoMoveLoop);
      }
    },
    { threshold: 0 }
  );

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

  slider.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
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

    const instantV = ((lastX - currentX) / dt) * 16.67;
    velocityX = velocityX * 0.35 + instantV * 0.65;
    lastX = currentX;
    lastTime = now;

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

    if (Math.abs(velocityX) > 0.5) {
      velocityX = Math.max(-28, Math.min(28, velocityX));
      momentumRafId = requestAnimationFrame(applyInertia);
    }
  }

  slider.addEventListener('pointerup', endDrag);
  slider.addEventListener('pointercancel', endDrag);

  slider.addEventListener(
    'click',
    (e) => {
      if (hasDragged) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  slider.addEventListener('mouseenter', () => {
    isHovered = true;
  });
  slider.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  if (sliderSection) {
    const rect = sliderSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      sliderVisible = true;
      autoRafId = requestAnimationFrame(autoMoveLoop);
    }
  }
}

/* ==========================================================================
   5. INTERACTIVE URGENCY SLIDER & CONTACT MODAL
   ========================================================================== */
function initUrgencyAndModal() {
  const urgencySlider = document.getElementById('urgency-slider');
  const urgentText = document.getElementById('urgent-text');
  const urgencyLabels = ['Whenever', 'Sometime soon', 'ASAP'];

  if (urgencySlider && urgentText) {
    urgencySlider.addEventListener('input', (e) => {
      urgentText.textContent = urgencyLabels[e.target.value - 1];
    });
  }

  const modal = document.getElementById('contact-modal');
  const openBtns = [
    document.getElementById('partner-pill'),
    document.getElementById('nav-contact-btn'),
    document.getElementById('footer-trigger-modal'),
  ];
  const closeBtn = document.getElementById('modal-close-btn');

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    if (lenis) lenis.stop(); // Lock smooth scroll while modal is active
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    if (lenis) lenis.start(); // Resume smooth scroll
  }

  openBtns.forEach((btn) => {
    if (btn) btn.addEventListener('click', openModal);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

/* ==========================================================================
   6. LIVE TIME (IST) DISPLAY
   ========================================================================== */
function initLiveClock() {
  const timeEl = document.getElementById('live-time');
  if (!timeEl) return;

  function updateTime() {
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    try {
      const istTime = new Intl.DateTimeFormat('en-US', options).format(new Date());
      timeEl.textContent = `${istTime} IST`;
    } catch (_) {
      timeEl.textContent = 'IST';
    }
  }

  updateTime();
  setInterval(updateTime, 30000);
}

/* ==========================================================================
   7. PROFILE SCROLL FRAME-BY-FRAME ANIMATION (ScrollTrigger Scrubbed)
   ========================================================================== */
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

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  let resizeTimer;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resizeCanvas, 100);
    },
    { passive: true }
  );
  resizeCanvas();

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

  function drawFrame(index) {
    let imgToDraw = frameImages[index];
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
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

  if (typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        targetFrameIndex = Math.min(
          totalFrames - 1,
          Math.max(0, Math.floor(self.progress * (totalFrames - 1)))
        );
        if (triggerQueueUpdate) triggerQueueUpdate();
      },
    });
  }

  let heroVisible = true;
  let heroRafId = null;

  const heroObserver = new IntersectionObserver(
    (entries) => {
      heroVisible = entries[0].isIntersecting;
      if (heroVisible && heroRafId === null) {
        lastTime = performance.now();
        heroRafId = requestAnimationFrame(renderLoop);
      }
    },
    { threshold: 0 }
  );

  heroObserver.observe(wrapper);

  function renderLoop(timestamp) {
    if (heroVisible) {
      if (typeof ScrollTrigger === 'undefined') {
        updateScrollProgress();
      }

      const now = timestamp || performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const delta = targetFrameIndex - currentFrameFloat;
      if (Math.abs(delta) > 0.02) {
        const factor = 1 - Math.exp(-14 * dt);
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

  const frame0 = new Image();
  frame0.onload = () => {
    frameImages[0] = frame0;
    loadedCount++;
    drawFrame(0);
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  };
  frame0.src = getFrameUrl(0);

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

    triggerQueueUpdate = function () {
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

  window.addEventListener(
    'scroll',
    () => {
      if (typeof ScrollTrigger === 'undefined') {
        updateScrollProgress();
      }
      if (triggerQueueUpdate) triggerQueueUpdate();
    },
    { passive: true }
  );

  preloadAllFrames();
  heroRafId = requestAnimationFrame(renderLoop);
}

/* ==========================================================================
   8. GSAP SCROLLTRIGGER ORCHESTRATION (PARALLAX & ENTRANCES)
   ========================================================================== */
function initGSAPScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // --- 8A. Top Navigation Scroll State & Active Section Spy ---
  ScrollTrigger.create({
    start: 'top -40',
    end: 999999,
    onUpdate: (self) => {
      const topNav = document.querySelector('.top-nav');
      if (topNav) {
        if (self.scroll() > 50) {
          topNav.classList.add('scrolled');
        } else {
          topNav.classList.remove('scrolled');
        }
      }
    },
  });

  const navSections = [
    { id: '#about', links: ['a[href="#about"]'] },
    { id: '#focus', links: ['a[href="#focus"]'] },
    { id: '#skills', links: ['a[href="#skills"]'] },
    { id: '#work', links: ['a[href="#work"]'] },
    { id: '#certifications', links: ['a[href="#certifications"]'] },
    { id: '#contact', links: ['a[href="#contact"]'] },
  ];

  navSections.forEach(({ id, links }) => {
    const el = document.querySelector(id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) {
          document.querySelectorAll('.nav-link').forEach((lnk) => lnk.classList.remove('active'));
          links.forEach((selector) => {
            const target = document.querySelector(selector);
            if (target) target.classList.add('active');
          });
        }
      },
    });
  });

  // --- 8B. Hero Badges & Content Parallax Scrub ---
  const badges = document.querySelectorAll('.avatar-orbit .oval-badge');
  if (badges.length > 0) {
    badges.forEach((badge, idx) => {
      const yOffset = idx % 2 === 0 ? -30 : -50;
      const rotateOffset = (idx - 2) * 2;
      gsap.to(badge, {
        y: yOffset,
        rotation: rotateOffset,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero-scroll-wrapper',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    });
  }

  // Hero Text Smooth Lift & Fade Parallax
  const heroTextElements = document.querySelectorAll('.hero-title, .subtitle, .about-description');
  if (heroTextElements.length > 0) {
    gsap.to(heroTextElements, {
      y: -40,
      opacity: 0.2,
      ease: 'none',
      stagger: 0.04,
      scrollTrigger: {
        trigger: '#hero-scroll-wrapper',
        start: 'center top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // --- 8C. Horizontal Slider Track (#focus) Entrance ---
  const dragPill = document.getElementById('drag-pill');
  if (dragPill) {
    gsap.from(dragPill, {
      opacity: 0,
      scale: 0.7,
      xPercent: -50,
      yPercent: -50,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '#focus',
        start: 'top 85%',
        once: true,
      },
    });
  }

  const sliderTrack = document.getElementById('slider-track');
  if (sliderTrack) {
    gsap.from(sliderTrack, {
      opacity: 0,
      duration: 0.85,
      ease: 'power2.out',
      clearProps: 'opacity',
      scrollTrigger: {
        trigger: '#focus',
        start: 'top 85%',
        once: true,
      },
    });
  }

  // --- 8D. Skills & Competencies (#skills) Staggered Entrances ---
  gsap.from('.tea-header h2, .tea-header p', {
    opacity: 0,
    y: 30,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
    scrollTrigger: {
      trigger: '.tea-section',
      start: 'top 85%',
      once: true,
    },
  });

  const teaCards = document.querySelectorAll('.tea-card');
  if (teaCards.length > 0) {
    gsap.from(teaCards, {
      opacity: 0,
      y: 35,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.tea-grid',
        start: 'top 85%',
        once: true,
      },
    });
  }

  const skillPills = document.querySelectorAll('.pills-wrapper .pill');
  if (skillPills.length > 0) {
    gsap.from(skillPills, {
      opacity: 0,
      scale: 0.85,
      y: 15,
      stagger: 0.02,
      duration: 0.5,
      ease: 'back.out(1.5)',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.skills-block',
        start: 'top 90%',
        once: true,
      },
    });
  }

  // --- 8E. Featured Projects (#work) Entrance ---
  gsap.from('.case-studies-section .section-label', {
    opacity: 0,
    x: -20,
    duration: 0.6,
    ease: 'power2.out',
    clearProps: 'transform,opacity',
    scrollTrigger: {
      trigger: '.case-studies-section',
      start: 'top 85%',
      once: true,
    },
  });

  const caseCards = document.querySelectorAll('.case-card');
  if (caseCards.length > 0) {
    gsap.from(caseCards, {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.85,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.case-grid',
        start: 'top 85%',
        once: true,
      },
    });
  }

  // --- 8F. Academic & Certifications (#certifications) Slide-in ---
  gsap.from('.built-section h2, .built-section .section-sub', {
    opacity: 0,
    y: 25,
    stagger: 0.1,
    duration: 0.75,
    ease: 'power3.out',
    clearProps: 'transform,opacity',
    scrollTrigger: {
      trigger: '.built-section',
      start: 'top 85%',
      once: true,
    },
  });

  const builtRows = document.querySelectorAll('.built-row');
  if (builtRows.length > 0) {
    gsap.from(builtRows, {
      opacity: 0,
      x: -30,
      stagger: 0.1,
      duration: 0.75,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.built-list',
        start: 'top 85%',
        once: true,
      },
    });
  }

  // --- 8G. Footer CTA (#contact) Parallax & Social Links Pop-in ---
  const footerHeading = document.getElementById('footer-trigger-modal');
  if (footerHeading) {
    gsap.from(footerHeading, {
      opacity: 0,
      y: 40,
      duration: 1.0,
      ease: 'power3.out',
      clearProps: 'opacity',
      scrollTrigger: {
        trigger: '.footer-cta',
        start: 'top 80%',
        once: true,
      },
    });

    gsap.to(footerHeading, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.footer-cta',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    });
  }

  const socialLinks = document.querySelectorAll('.social-links a');
  if (socialLinks.length > 0) {
    gsap.from(socialLinks, {
      opacity: 0,
      y: 20,
      scale: 0.85,
      stagger: 0.08,
      duration: 0.65,
      ease: 'back.out(1.7)',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.social-links',
        start: 'top 90%',
        once: true,
      },
    });
  }

  // Refresh ScrollTrigger calculations after initial setup
  ScrollTrigger.refresh();
}
