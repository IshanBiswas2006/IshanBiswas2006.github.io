/* =========================================================
   script.js — Portfolio by Ishan Biswas
   ========================================================= */

/* ── 1. PILL NAV ─────────────────────────────────────────── */
/* ===== PILL NAV ===== */
const PillNav = (() => {
  let isMobileMenuOpen = false, circles = [], timelines = [], activeTweens = [];
  let logoImgEl = null, logoTween = null, hamburgerEl = null;
  let mobileMenuEl = null, navItemsEl = null, logoEl = null;
  let ease = 'power3.out';

  function layout() {
    circles.forEach((circle, i) => {
      if (!circle?.parentElement) return;
      const pill = circle.parentElement;
      const { width: w, height: h } = pill.getBoundingClientRect();
      const R = (w * w / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - w * w / 4))) + 1;
      circle.style.width = D + 'px'; circle.style.height = D + 'px';
      circle.style.bottom = '-' + delta + 'px';
      gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: '50% ' + (D - delta) + 'px' });
      const lbl = pill.querySelector('.pill-label');
      const lblH = pill.querySelector('.pill-label-hover');
      if (lbl) gsap.set(lbl, { y: 0 });
      if (lblH) gsap.set(lblH, { y: h + 12, opacity: 0 });
      if (timelines[i]) timelines[i].kill();
      const tl = gsap.timeline({ paused: true });
      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
      if (lbl) tl.to(lbl, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
      if (lblH) { gsap.set(lblH, { y: Math.ceil(h + 100), opacity: 0 }); tl.to(lblH, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0); }
      timelines[i] = tl;
    });
  }

  function handleEnter(i) {
    const tl = timelines[i]; if (!tl) return;
    if (activeTweens[i]) activeTweens[i].kill();
    activeTweens[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
  }
  function handleLeave(i) {
    const tl = timelines[i]; if (!tl) return;
    if (activeTweens[i]) activeTweens[i].kill();
    activeTweens[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
  }
  function handleLogoEnter() {
    if (!logoImgEl) return;
    if (logoTween) logoTween.kill();
    gsap.set(logoImgEl, { rotate: 0 });
    logoTween = gsap.to(logoImgEl, { rotate: 360, duration: 0.4, ease, overwrite: 'auto' });
  }

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    if (hamburgerEl) {
      const [l1, l2] = hamburgerEl.querySelectorAll('.hamburger-line');
      if (isMobileMenuOpen) {
        gsap.to(l1, { rotation: 45, y: 3.5, duration: 0.3, ease });
        gsap.to(l2, { rotation: -45, y: -3.5, duration: 0.3, ease });
      } else {
        gsap.to(l1, { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(l2, { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }
    if (mobileMenuEl) {
      if (isMobileMenuOpen) {
        gsap.set(mobileMenuEl, { visibility: 'visible' });
        gsap.fromTo(mobileMenuEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease });
      } else {
        gsap.to(mobileMenuEl, {
          opacity: 0, y: 10, duration: 0.2, ease,
          onComplete: () => gsap.set(mobileMenuEl, { visibility: 'hidden' })
        });
      }
    }
  }

  function buildNav(container, options) {
    const { logo = '', logoAlt = 'Logo', items = [], activeHref, className = '',
      baseColor = '#0d0d14', pillColor = '#f5f4f0',
      hoveredPillTextColor = '#f5f4f0', pillTextColor, initialLoadAnimation = true } = options;
    ease = options.ease || ease;
    const resolvedPillText = pillTextColor ?? baseColor;
    const cssVars = { '--base': baseColor, '--pill-bg': pillColor, '--hover-text': hoveredPillTextColor, '--pill-text': resolvedPillText };

    const wrapper = document.createElement('div'); wrapper.className = 'pill-nav-container';
    const nav = document.createElement('nav'); nav.className = 'pill-nav ' + className;
    nav.setAttribute('aria-label', 'Primary');
    Object.entries(cssVars).forEach(([k, v]) => nav.style.setProperty(k, v));

    const logoLink = document.createElement('a'); logoLink.className = 'pill-logo';
    logoLink.href = items[0]?.href || '#'; logoLink.setAttribute('aria-label', 'Home'); logoEl = logoLink;
    if (logo) { const img = document.createElement('img'); img.src = logo; img.alt = logoAlt; logoImgEl = img; logoLink.appendChild(img); }
    logoLink.addEventListener('mouseenter', handleLogoEnter);
    nav.appendChild(logoLink);

    const navItems = document.createElement('div'); navItems.className = 'pill-nav-items desktop-only'; navItemsEl = navItems;
    const ul = document.createElement('ul'); ul.className = 'pill-list'; ul.setAttribute('role', 'menubar');
    items.forEach((item, i) => {
      const li = document.createElement('li'); li.setAttribute('role', 'none');
      const a = document.createElement('a'); a.href = item.href;
      a.className = 'pill' + (activeHref === item.href ? ' is-active' : '');
      a.setAttribute('role', 'menuitem'); a.setAttribute('aria-label', item.label);
      const circle = document.createElement('span'); circle.className = 'hover-circle'; circle.setAttribute('aria-hidden', 'true');
      circles[i] = circle; a.appendChild(circle);
      const stack = document.createElement('span'); stack.className = 'label-stack';
      const lbl = document.createElement('span'); lbl.className = 'pill-label'; lbl.textContent = item.label;
      const lblH = document.createElement('span'); lblH.className = 'pill-label-hover'; lblH.setAttribute('aria-hidden', 'true'); lblH.textContent = item.label;
      stack.appendChild(lbl); stack.appendChild(lblH); a.appendChild(stack);
      a.addEventListener('mouseenter', () => handleEnter(i));
      a.addEventListener('mouseleave', () => handleLeave(i));
      li.appendChild(a); ul.appendChild(li);
    });
    navItems.appendChild(ul); nav.appendChild(navItems);

    const burger = document.createElement('button'); burger.className = 'mobile-menu-button mobile-only';
    burger.setAttribute('aria-label', 'Toggle menu'); hamburgerEl = burger;
    ['', ''].forEach(() => { const l = document.createElement('span'); l.className = 'hamburger-line'; burger.appendChild(l); });
    burger.addEventListener('click', toggleMobileMenu);
    nav.appendChild(burger); wrapper.appendChild(nav);

    const pop = document.createElement('div'); pop.className = 'mobile-menu-popover mobile-only';
    Object.entries(cssVars).forEach(([k, v]) => pop.style.setProperty(k, v)); mobileMenuEl = pop;
    const mUl = document.createElement('ul'); mUl.className = 'mobile-menu-list';
    items.forEach(item => {
      const li = document.createElement('li'); const a = document.createElement('a');
      a.href = item.href; a.className = 'mobile-menu-link'; a.textContent = item.label;
      a.addEventListener('click', () => { toggleMobileMenu(); });
      li.appendChild(a); mUl.appendChild(li);
    });
    pop.appendChild(mUl); wrapper.appendChild(pop); container.appendChild(wrapper);
    gsap.set(mobileMenuEl, { visibility: 'hidden', opacity: 0 });
    layout(); window.addEventListener('resize', layout);
    if (document.fonts?.ready) document.fonts.ready.then(layout).catch(() => { });
    if (initialLoadAnimation) {
      if (logoEl) { gsap.set(logoEl, { scale: 0 }); gsap.to(logoEl, { scale: 1, duration: 0.6, ease }); }
      if (navItemsEl) { gsap.set(navItemsEl, { width: 0, overflow: 'hidden' }); gsap.to(navItemsEl, { width: 'auto', duration: 0.6, ease }); }
    }
  }

  return {
    init(options) {
      const container = document.querySelector(options.container || '#pill-nav-root');
      if (!container) return;
      buildNav(container, options);
    }
  };
})();

const ibLogo = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
  '<rect width="40" height="40" rx="10" fill="#0d0d14"/>' +
  '<text x="50%" y="52%" text-anchor="middle" dominant-baseline="central" ' +
  'font-family="Syne,sans-serif" font-weight="800" font-size="15" fill="#f5f4f0">IB</text>' +
  '<circle cx="31" cy="28" r="4" fill="#2563eb"/>' +
  '</svg>'
);

PillNav.init({
  container: '#pill-nav-root',
  logo: ibLogo,
  logoAlt: 'Ishan Biswas',
  items: [
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ],
  ease: 'power3.out',
  baseColor: '#0d0d14',
  pillColor: '#f5f4f0',
  pillTextColor: '#0d0d14',
  hoveredPillTextColor: '#f5f4f0',
  initialLoadAnimation: true
});
/* ── 2. FADE-IN ON SCROLL ────────────────────────────────── */
(function initFadeIn() {
  var els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  /* Stagger delay for sibling cards */
  function applyDelay(el, i) {
    el.style.transitionDelay = (i * 0.1) + 's';
  }

  /* Group siblings inside grid/card containers */
  document.querySelectorAll('.cards-grid, .skills-grid, .contact-grid').forEach(function(grid) {
    Array.from(grid.querySelectorAll('.fade-in')).forEach(applyDelay);
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function(el) { observer.observe(el); });
})();


/* ── 3. SKILLS GRID ──────────────────────────────────────── */
(function buildSkills() {
  var grid = document.getElementById('skills-grid');
  if (!grid || grid.children.length > 0) return;

  var groups = [
    {
      title: 'Languages',
      items: [
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',     label: 'Python'  },
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', label: 'C++'   },
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',               label: 'C'       },
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',         label: 'Java'    },
      ]
    },
    {
      title: 'Web & Database',
      items: [
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',         label: 'HTML5'      },
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',           label: 'CSS3'       },
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', label: 'JavaScript'},
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',         label: 'MySQL'      },
      ]
    },
    {
      title: 'Data Science & Tools',
      items: [
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',   label: 'NumPy'   },
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', label: 'Pandas'  },
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',       label: 'Git'     },
        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', label: 'VS Code' },
      ]
    }
  ];

  groups.forEach(function(group, gi) {
    var tags = group.items.map(function(item) {
      return '<div class="skill-tag">'
        + '<img src="' + item.src + '" alt="' + item.label + '" loading="lazy">'
        + '<span class="skill-tag-label">' + item.label + '</span>'
        + '</div>';
    }).join('');

    var card = document.createElement('div');
    card.className = 'skill-group fade-in';
    card.style.transitionDelay = (gi * 0.12) + 's';
    card.innerHTML =
      '<div class="skill-group-title">' + group.title + '</div>'
      + '<div class="skill-tags">' + tags + '</div>';
    grid.appendChild(card);
  });

  /* observe newly added cards */
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  grid.querySelectorAll('.fade-in').forEach(function(el) { obs.observe(el); });
})();
