if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
if (typeof window !== 'undefined') {
  window.scrollTo(0, 0);
}

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const silkyEase = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

let lenis = null;

initPageLoader();

document.addEventListener('DOMContentLoaded', () => {
  initLenisAndScrollTrigger();

  initSmoothAnchorLinks();

  initCustomCursor();

  initSliderTrack();

  initUrgencyAndModal();

  initLiveClock();

  initProfileScrollAnimation();

  initGSAPScrollAnimations();
});

function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) {
    if (typeof window.__playHeroEntrance === 'function') {
      window.__playHeroEntrance();
    }
    return;
  }

  let isDismissed = false;

  function dismissLoader() {
    if (isDismissed) return;
    isDismissed = true;

    if (lenis) {
      lenis.start();
    }

    if (typeof window.__playHeroEntrance === 'function') {
      window.__playHeroEntrance();
    }

    loader.classList.add('is-hidden');

    const handleCleanup = (e) => {
      if (e && e.target !== loader) return;
      loader.removeEventListener('transitionend', handleCleanup);
      if (loader.parentNode) {
        loader.remove();
      }
    };

    loader.addEventListener('transitionend', handleCleanup);
    setTimeout(handleCleanup, 800);
  }

  const domReadyPromise = new Promise((resolve) => {
    if (document.readyState !== 'loading') {
      resolve();
    } else {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    }
  });

  const fontsReadyPromise = new Promise((resolve) => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(resolve).catch(resolve);
      setTimeout(resolve, 2000);
    } else {
      resolve();
    }
  });

  const frame0ReadyPromise = new Promise((resolve) => {
    if (window.__frame0Loaded) {
      resolve();
    } else {
      window.addEventListener('heroFrame0Loaded', resolve, { once: true });
      setTimeout(resolve, 2500);
    }
  });

  const minTimePromise = new Promise((resolve) => setTimeout(resolve, 350));

  Promise.all([domReadyPromise, fontsReadyPromise, frame0ReadyPromise, minTimePromise]).then(() => {
    dismissLoader();
  });
}

function initLenisAndScrollTrigger() {
  if (prefersReducedMotion) return;

  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: silkyEase,
      smoothTouch: false,
      touchMultiplier: 1.5,
      wheelMultiplier: 1.05,
      infinite: false,
    });

    const loader = document.getElementById('page-loader');
    if (loader && !loader.classList.contains('is-hidden')) {
      lenis.stop();
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
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
          easing: silkyEase,
        });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

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

  const orbit = document.querySelector('.avatar-orbit');
  if (orbit) {
    orbit.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-tooltip]');
      if (!target) return;

      const text = target.getAttribute('data-tooltip');
      if (followerText.textContent !== text) {
        followerText.textContent = text;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isTracking) {
        currentX = mouseX;
        currentY = mouseY;
        follower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(1)`;
        follower.classList.add('active');
        isTracking = true;
        if (!cursorRafId) cursorRafId = requestAnimationFrame(renderCursor);
      }
    });

    orbit.addEventListener('mousemove', (e) => {
      if (isTracking) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    }, { passive: true });

    orbit.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-tooltip]');
      const related = e.relatedTarget ? e.relatedTarget.closest('[data-tooltip]') : null;
      if (target && target !== related) {
        if (!related) {
          follower.classList.remove('active');
          isTracking = false;
          if (cursorRafId) {
            cancelAnimationFrame(cursorRafId);
            cursorRafId = null;
          }
        }
      }
    });
  }
}

function initSliderTrack() {
  const track = document.getElementById('slider-track');
  const section = document.getElementById('focus');
  if (!track) return;

  if (prefersReducedMotion) {
    track.style.overflowX = 'auto';
    return;
  }

  const originalCards = Array.from(track.children);
  const fragment = document.createDocumentFragment();
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    fragment.appendChild(clone);
  });
  track.appendChild(fragment);

  let originalSetWidth = 0;
  function measureOriginalWidth() {
    originalSetWidth = 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    const len = originalCards.length;
    for (let i = 0; i < len; i++) {
      originalSetWidth += originalCards[i].offsetWidth;
      if (i < len - 1) originalSetWidth += gap;
    }
    originalSetWidth += gap;
  }
  measureOriginalWidth();

  let translateX = 0;
  let isPaused = false;
  let sectionVisible = false;
  const speed = 0.7;

  const observer = new IntersectionObserver(
    (entries) => {
      sectionVisible = entries[0].isIntersecting;
    },
    { threshold: 0 }
  );
  if (section) observer.observe(section);

  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time, deltaTime) => {
      if (!sectionVisible || isPaused) return;

      const dt = deltaTime / (1000 / 60);
      translateX -= speed * dt;

      if (originalSetWidth > 0 && Math.abs(translateX) >= originalSetWidth) {
        translateX += originalSetWidth;
      }

      track.style.transform = `translate3d(${translateX}px, 0, 0)`;
    });
  } else {
    let lastTime = performance.now();
    function marqueeLoop(now) {
      if (sectionVisible && !isPaused) {
        const dt = Math.min((now - lastTime) / 16.67, 3);
        translateX -= speed * dt;
        if (originalSetWidth > 0 && Math.abs(translateX) >= originalSetWidth) {
          translateX += originalSetWidth;
        }
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }
      lastTime = now;
      requestAnimationFrame(marqueeLoop);
    }
    requestAnimationFrame(marqueeLoop);
  }

  track.addEventListener('mouseenter', () => { isPaused = true; }, { passive: true });
  track.addEventListener('mouseleave', () => { isPaused = false; }, { passive: true });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      measureOriginalWidth();
      if (originalSetWidth > 0 && Math.abs(translateX) >= originalSetWidth) {
        translateX = translateX % originalSetWidth;
      }
    }, 150);
  }, { passive: true });
}

function initUrgencyAndModal() {
  const urgencySlider = document.getElementById('urgency-slider');
  const urgentText = document.getElementById('urgent-text');
  const urgencyLabels = ['Whenever', 'Sometime soon', 'ASAP'];

  if (urgencySlider && urgentText) {
    function updateSliderProgress() {
      const min = parseFloat(urgencySlider.min);
      const max = parseFloat(urgencySlider.max);
      const val = parseFloat(urgencySlider.value);
      const pct = ((val - min) / (max - min)) * 100;
      urgencySlider.style.setProperty('--slider-progress', pct + '%');
      urgentText.textContent = urgencyLabels[Math.round(val) - 1];
    }
    updateSliderProgress();
    urgencySlider.addEventListener('input', updateSliderProgress);
  }

  const modal = document.getElementById('contact-modal');
  const openBtns = [
    document.getElementById('partner-pill'),
    document.getElementById('footer-trigger-modal'),
  ];
  const closeBtn = document.getElementById('modal-close-btn');

  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    if (lenis) lenis.stop();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    if (lenis) lenis.start();
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

  const chipContainer = document.querySelector('.chip-options');
  if (chipContainer) {
    const allChips = chipContainer.querySelectorAll('.chip');
    chipContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      allChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
    });
  }
}

function initLiveClock() {
  const timeEl = document.getElementById('live-time');
  if (!timeEl) return;

  let formatter = null;
  try {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (_) {}

  function updateTime() {
    if (formatter) {
      try {
        timeEl.textContent = `${formatter.format(new Date())} IST`;
        return;
      } catch (_) {}
    }
    timeEl.textContent = 'IST';
  }

  updateTime();
  setInterval(updateTime, 30000);
}

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

  function getFrameUrl(index) {
    const pad = String(index).padStart(4, '0');
    return `./Assets/Media/frames/frame_${pad}.webp`;
  }

  function resizeCanvas() {
    const heroSection = document.getElementById('about');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rectW = heroSection ? heroSection.offsetWidth : (canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth);
    const rectH = heroSection ? heroSection.offsetHeight : (canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight);
    canvas.width = Math.max(rectW * dpr, 600);
    canvas.height = Math.max(rectH * dpr, 400);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (headshotCanvas) {
      const hsW = headshotCanvas.offsetWidth || 96;
      const hsH = headshotCanvas.offsetHeight || 132;
      headshotCanvas.width = Math.max(hsW * dpr, 192);
      headshotCanvas.height = Math.max(hsH * dpr, 264);

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
      const maxSearch = Math.min(25, totalFrames);
      for (let offset = 1; offset < maxSearch; offset++) {
        const prev = index - offset;
        const next = index + offset;
        if (prev >= 0 && frameImages[prev]?.complete && frameImages[prev].naturalWidth !== 0) {
          imgToDraw = frameImages[prev];
          break;
        }
        if (next < totalFrames && frameImages[next]?.complete && frameImages[next].naturalWidth !== 0) {
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

  let triggerQueueUpdate = null;

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
    window.__frame0Loaded = true;
    window.dispatchEvent(new CustomEvent('heroFrame0Loaded'));
  };
  frame0.onerror = () => {
    window.__frame0Loaded = true;
    window.dispatchEvent(new CustomEvent('heroFrame0Loaded'));
  };
  frame0.src = getFrameUrl(0);
  if (frame0.complete && frame0.naturalWidth !== 0) {
    frameImages[0] = frame0;
    loadedCount++;
    drawFrame(0);
    window.__frame0Loaded = true;
    window.dispatchEvent(new CustomEvent('heroFrame0Loaded'));
  }

  const loadedSet = new Set();

  function preloadAllFrames() {
    const keyframes = [];
    const keyframeSet = new Set([0]);
    for (let i = 0; i < totalFrames; i += 10) {
      if (i !== 0) {
        keyframes.push(i);
        keyframeSet.add(i);
      }
    }
    const remaining = [];
    for (let i = 0; i < totalFrames; i++) {
      if (!keyframeSet.has(i) && i !== 0) {
        remaining.push(i);
      }
    }

    let batchInFlight = 0;
    const MAX_CONCURRENT = 5;

    triggerQueueUpdate = function () {
      if (remaining.length > 0) {
        loadNext();
      }
    };

    function loadNext() {
      while (batchInFlight < MAX_CONCURRENT) {
        let idx;
        if (keyframes.length > 0) {
          idx = keyframes.shift();
        } else if (remaining.length > 0) {
          let closestIdx = 0;
          let minDiff = Math.abs(remaining[0] - targetFrameIndex);
          const rLen = remaining.length;
          for (let i = 1; i < rLen; i++) {
            const diff = Math.abs(remaining[i] - targetFrameIndex);
            if (diff < minDiff) {
              minDiff = diff;
              closestIdx = i;
            }
          }
          idx = remaining.splice(closestIdx, 1)[0];
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

  preloadAllFrames();
  heroRafId = requestAnimationFrame(renderLoop);
}

function initGSAPScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (prefersReducedMotion) return;

  const topNav = document.querySelector('.top-nav');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (topNav) {
    ScrollTrigger.create({
      start: 'top -50',
      end: 999999,
      toggleClass: { targets: topNav, className: 'scrolled' },
    });
  }

  const navSections = [
    { el: document.querySelector('#about'), link: document.querySelector('a[href="#about"]') },
    { el: document.querySelector('#work'), link: document.querySelector('a[href="#work"]') },
    { el: document.querySelector('#certifications'), link: document.querySelector('a[href="#certifications"]') },
    { el: document.querySelector('#skills'), link: document.querySelector('a[href="#skills"]') },
  ].filter(item => item.el && item.link);

  navSections.forEach(({ el, link }) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) {
          allNavLinks.forEach((lnk) => lnk.classList.remove('active'));
          link.classList.add('active');
        }
      },
    });
  });

  function initHeroScrollTriggers() {
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
  }

  let heroScrollTriggersInitialized = false;
  const safeInitHeroScroll = () => {
    if (heroScrollTriggersInitialized) return;
    heroScrollTriggersInitialized = true;
    initHeroScrollTriggers();
  };

  if (prefersReducedMotion) {
    safeInitHeroScroll();
  } else {
    window.__onHeroEntranceComplete = safeInitHeroScroll;
    setTimeout(safeInitHeroScroll, 4000);
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
}
