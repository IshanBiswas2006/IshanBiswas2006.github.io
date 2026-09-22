/**
 * Hero Section Entrance Animation
 * ================================
 * Isolated entrance animation that plays once after the page loader dismisses.
 * Uses the existing GSAP library — no additional dependencies.
 *
 * Sequence:
 *   Phase 1: Hero container gently expands from small box at bottom → full size
 *            while the hero photo/canvas softly clears from blur
 *   Phase 2: Hero content gently floats up into view
 *   Phase 3: Headshot badge appears with subtle foreground zoom,
 *            side badges emerge from behind, then headshot settles back
 *   Phase 4: Text elements reveal with soft stagger
 *
 * All animations use GPU-friendly transforms (translate, scale, opacity, filter).
 * After completion, clearProps removes all inline styles so the final state
 * is pixel-identical to the original design.
 */

(function heroEntranceInit() {
  'use strict';

  // ── Reduced Motion Guard ──────────────────────────────────────────────
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── DOM References ────────────────────────────────────────────────────
  const heroSection  = document.querySelector('.hero-section.sticky-hero');
  const heroContent  = document.querySelector('.hero-content');
  const avatarOrbit  = document.querySelector('.avatar-orbit');
  const badges       = avatarOrbit ? Array.from(avatarOrbit.querySelectorAll('.oval-badge')) : [];
  const subtitle     = document.querySelector('.subtitle');
  const heroTitle    = document.querySelector('.hero-title');
  const aboutDesc    = document.querySelector('.about-description');
  const loader       = document.getElementById('page-loader');
  const heroCanvas   = document.getElementById('profile-canvas');

  // Bail out if critical elements are missing
  if (!heroSection || !heroContent || badges.length === 0) return;

  // ── Identify badge roles ──────────────────────────────────────────────
  // Badge order in DOM: [Portfolio, X, Headshot, GitHub, LinkedIn]
  const headshotIndex = badges.findIndex(b => b.classList.contains('headshot-badge'));
  const centerIndex   = headshotIndex >= 0 ? headshotIndex : Math.floor(badges.length / 2);
  const headshot      = badges[centerIndex];
  const sideBadges    = badges.filter((_, i) => i !== centerIndex);

  // ── Reduced Motion: show everything immediately, no animation ─────────
  if (reducedMotion) {
    return;
  }

  // ── Set Pre-Animation States (immediately, before first paint) ────────

  // Phase 1: Hero section starts as a small box near the bottom
  gsap.set(heroSection, {
    scale: 0.08,
    opacity: 0,
    transformOrigin: 'center bottom',
    willChange: 'transform, opacity',
  });

  // Hero photo/canvas starts blurred and slightly transparent
  if (heroCanvas) {
    gsap.set(heroCanvas, {
      filter: 'blur(12px)',
      opacity: 0.4,
      willChange: 'filter, opacity',
    });
  }

  // Phase 2: Hero content starts hidden below (gentle offset)
  gsap.set(heroContent, {
    opacity: 0,
    y: 40,
    willChange: 'transform, opacity',
  });

  // Phase 3: All badges start invisible
  gsap.set(badges, {
    opacity: 0,
    willChange: 'transform, opacity',
  });

  // Side badges start clustered at the center (behind headshot position)
  sideBadges.forEach((badge) => {
    const badgeIdx = badges.indexOf(badge);
    const offsetFromCenter = badgeIdx - centerIndex;
    // Each badge position is ~(width + gap); flex gap 18px + badge ~72px ≈ 90px
    const translateXToCenter = -offsetFromCenter * 90;
    gsap.set(badge, {
      x: translateXToCenter,
      scale: 0.88,
    });
  });

  // Phase 4: Text elements start hidden (gentle offset)
  const textElements = [subtitle, heroTitle, aboutDesc].filter(Boolean);
  gsap.set(textElements, {
    opacity: 0,
    y: 22,
    willChange: 'transform, opacity',
  });

  // ── Build the GSAP Timeline ───────────────────────────────────────────
  const tl = gsap.timeline({
    paused: true,
    onComplete: cleanupAfterAnimation,
  });

  // PHASE 1: Hero container gently expands from small box → full size
  tl.to(heroSection, {
    scale: 1,
    opacity: 1,
    duration: 1.35,
    ease: 'sine.out',
  });

  // PHASE 1B: Hero photo/canvas gradually clears from blur (overlaps with expansion)
  if (heroCanvas) {
    tl.to(heroCanvas, {
      filter: 'blur(0px)',
      opacity: 1,
      duration: 1.2,
      ease: 'sine.out',
    }, '-=0.9');
  }

  // PHASE 2: Hero content gently floats up
  tl.to(heroContent, {
    opacity: 1,
    y: 0,
    duration: 0.75,
    ease: 'sine.out',
  }, '-=0.35');

  // PHASE 3A: Headshot badge appears with subtle foreground zoom
  tl.to(headshot, {
    opacity: 1,
    scale: 1.1,
    y: 0,
    zIndex: 10,
    duration: 0.6,
    ease: 'sine.out',
  }, '-=0.5');

  // PHASE 3B: Side badges emerge smoothly from behind center
  tl.to(sideBadges, {
    opacity: 1,
    x: 0,
    scale: 1,
    duration: 0.7,
    ease: 'power1.out',
    stagger: {
      each: 0.075,
      from: 'center',
    },
  }, '-=0.3');

  // PHASE 3C: Headshot gently settles back to original scale
  tl.to(headshot, {
    scale: 1,
    zIndex: 'auto',
    duration: 0.48,
    ease: 'sine.inOut',
  }, '-=0.22');

  // PHASE 4: Text elements reveal with soft stagger
  tl.to(textElements, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'sine.out',
    stagger: 0.1,
  }, '-=0.45');

  // ── Cleanup: Remove all inline styles so final state matches original ──
  function cleanupAfterAnimation() {
    gsap.set(heroSection, { clearProps: 'all' });
    gsap.set(heroContent, { clearProps: 'all' });
    gsap.set(badges, { clearProps: 'all' });
    gsap.set(textElements, { clearProps: 'all' });
    if (heroCanvas) {
      gsap.set(heroCanvas, { clearProps: 'all' });
    }

    // Refresh ScrollTrigger so existing parallax animations recalculate
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // ── Trigger: Play after loader dismisses ──────────────────────────────
  function playEntrance() {
    // Small delay for visual breathing room after loader fades
    setTimeout(() => {
      tl.play();
    }, 80);
  }

  if (loader) {
    // If loader is already hidden (ultra-fast load), play immediately
    if (loader.classList.contains('is-hidden')) {
      playEntrance();
      return;
    }

    // Watch for the loader's is-hidden class to be added
    const loaderObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class' &&
          loader.classList.contains('is-hidden')
        ) {
          loaderObserver.disconnect();
          playEntrance();
          return;
        }
      }
    });

    loaderObserver.observe(loader, { attributes: true, attributeFilter: ['class'] });

    // Safety fallback: if loader is removed from DOM before observer fires
    const removalObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const removed of mutation.removedNodes) {
          if (removed === loader || (removed.contains && removed.contains(loader))) {
            removalObserver.disconnect();
            loaderObserver.disconnect();
            playEntrance();
            return;
          }
        }
      }
    });

    if (loader.parentNode) {
      removalObserver.observe(loader.parentNode, { childList: true });
    }

    // Ultimate fallback timeout in case loader logic changes
    setTimeout(() => {
      loaderObserver.disconnect();
      removalObserver.disconnect();
      if (tl.progress() === 0) {
        playEntrance();
      }
    }, 5000);
  } else {
    // No loader present — play immediately on DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', playEntrance, { once: true });
    } else {
      playEntrance();
    }
  }
})();
