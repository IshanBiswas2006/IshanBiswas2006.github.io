document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll reveal animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));

  // Immediate visibility check for elements above the fold on initial page load
  const checkInitialVisibility = () => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 40) {
        el.classList.add('is-visible');
      }
    });
  };

  checkInitialVisibility();

  // Smooth Scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});