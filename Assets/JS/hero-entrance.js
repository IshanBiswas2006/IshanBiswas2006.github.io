(function heroEntranceInit() {
  'use strict';

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const heroSection = document.querySelector('.hero-section.sticky-hero');
  const heroContent = document.querySelector('.hero-content');
  const avatarOrbit = document.querySelector('.avatar-orbit');
  const badges = avatarOrbit ? Array.from(avatarOrbit.querySelectorAll('.oval-badge')) : [];
  const subtitle = document.querySelector('.subtitle');
  const heroTitle = document.querySelector('.hero-title');
  const aboutDesc = document.querySelector('.about-description');
  const loader = document.getElementById('page-loader');
  const heroCanvas = document.getElementById('profile-canvas');

  if (!heroSection || !heroContent || badges.length === 0) return;

  const headshotIndex = badges.findIndex(b => b.classList.contains('headshot-badge'));
  const centerIndex = headshotIndex >= 0 ? headshotIndex : Math.floor(badges.length / 2);
  const headshot = badges[centerIndex];
  const sideBadges = badges.filter((_, i) => i !== centerIndex);

  if (reducedMotion) {
    return;
  }

  gsap.set(heroSection, {
    scale: 0.08,
    opacity: 0,
    transformOrigin: 'center bottom',
    willChange: 'transform, opacity',
  });

  if (heroCanvas) {
    gsap.set(heroCanvas, {
      filter: 'blur(12px)',
      opacity: 0.4,
      willChange: 'filter, opacity',
    });
  }

  gsap.set(heroContent, {
    opacity: 0,
    y: 40,
    willChange: 'transform, opacity',
  });

  gsap.set(badges, {
    opacity: 0,
    willChange: 'transform, opacity',
  });

  sideBadges.forEach((badge) => {
    const badgeIdx = badges.indexOf(badge);
    const offsetFromCenter = badgeIdx - centerIndex;

    const translateXToCenter = -offsetFromCenter * 90;
    gsap.set(badge, {
      x: translateXToCenter,
      scale: 0.88,
    });
  });

  const textElements = [subtitle, heroTitle, aboutDesc].filter(Boolean);
  gsap.set(textElements, {
    opacity: 0,
    y: 22,
    willChange: 'transform, opacity',
  });

  const tl = gsap.timeline({
    paused: true,
    onComplete: cleanupAfterAnimation,
  });

  tl.to(heroSection, {
    scale: 1,
    opacity: 1,
    duration: 1.35,
    ease: 'sine.out',
  });

  if (heroCanvas) {
    tl.to(heroCanvas, {
      filter: 'blur(0px)',
      opacity: 1,
      duration: 1.2,
      ease: 'sine.out',
    }, '-=0.9');
  }

  tl.to(heroContent, {
    opacity: 1,
    y: 0,
    duration: 0.75,
    ease: 'sine.out',
  }, '-=0.35');

  tl.to(headshot, {
    opacity: 1,
    scale: 1.1,
    y: 0,
    zIndex: 10,
    duration: 0.6,
    ease: 'sine.out',
  }, '-=0.5');

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

  tl.to(headshot, {
    scale: 1,
    zIndex: 'auto',
    duration: 0.48,
    ease: 'sine.inOut',
  }, '-=0.22');

  tl.to(textElements, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'sine.out',
    stagger: 0.1,
  }, '-=0.45');

  function cleanupAfterAnimation() {
    gsap.set(heroSection, { clearProps: 'all' });
    gsap.set(heroContent, { clearProps: 'all' });
    gsap.set(badges, { clearProps: 'all' });
    gsap.set(textElements, { clearProps: 'all' });
    if (heroCanvas) {
      gsap.set(heroCanvas, { clearProps: 'all' });
    }

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  function playEntrance() {
    setTimeout(() => {
      tl.play();
    }, 80);
  }

  if (loader) {
    if (loader.classList.contains('is-hidden')) {
      playEntrance();
      return;
    }

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

    setTimeout(() => {
      loaderObserver.disconnect();
      removalObserver.disconnect();
      if (tl.progress() === 0) {
        playEntrance();
      }
    }, 5000);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', playEntrance, { once: true });
    } else {
      playEntrance();
    }
  }
})();
