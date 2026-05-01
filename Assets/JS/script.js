const SKILLS = {
  "Programming Languages": [
    { name: "C",          logo: "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/7c0ac2ceb9f9d24992ec393d11fa7337d2f92466/programming%20languages/c.svg" },
    { name: "C++",        logo: "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/7c0ac2ceb9f9d24992ec393d11fa7337d2f92466/programming%20languages/c++.svg" },
    { name: "Java",       logo: "https://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/7c0ac2ceb9f9d24992ec393d11fa7337d2f92466/programming%20languages/java.svg" },
    { name: "OOP",        logo: "https://cdn.simpleicons.org/abstractmetatransactions/2563eb" },
    { name: "HTML",       logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" },
    { name: "CSS",        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" },
    { name: "JavaScript", logo: "https://cdn.simpleicons.org/javascript/F0DB4F" },
    { name: "MySQL",      logo: "https://cdn.simpleicons.org/mysql/00618A" },
  ],
  "Core Areas": [
    { name: "DSA",             logo: "https://cdn.simpleicons.org/thealgorithms/2563eb" },
    { name: "Data Science",    logo: "https://cdn.simpleicons.org/anaconda/44A833" },
    { name: "Problem Solving", logo: "https://cdn.simpleicons.org/leetcode/FFA116" },
    { name: "Logical Thinking",logo: "https://cdn.simpleicons.org/brain/7c3aed" },
  ],
  "Tools & Environment": [
    { name: "VS Code", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" },
    { name: "GitHub",  logo: "https://cdn.simpleicons.org/github/181616" },
    { name: "Git",     logo: "https://cdn.simpleicons.org/git/F05032", learning: true },
  ],
};

(function buildSkills() {
  const grid = document.getElementById('skills-grid');

  Object.entries(SKILLS).forEach(([groupName, items]) => {
    const group = document.createElement('div');
    group.className = 'skill-group fade-in';

    const title = document.createElement('div');
    title.className = 'skill-group-title';
    title.textContent = groupName;
    group.appendChild(title);

    const tags = document.createElement('div');
    tags.className = 'skill-tags';

    items.forEach(skill => {
      if (skill.learning) {
        const pill = document.createElement('span');
        pill.className = 'skill-tag-text';
        pill.title = skill.name + ' (Currently Learning)';
        pill.innerHTML = `<span class="learn-dot"></span>${skill.name} <em style="font-size:.7rem;opacity:.7">(Learning)</em>`;
        tags.appendChild(pill);
      } else {
        const card = document.createElement('div');
        card.className = 'skill-tag';
        card.title = skill.name;

        const img = document.createElement('img');
        img.src = skill.logo;
        img.alt = skill.name;
        img.width = 32;
        img.height = 32;
        img.onerror = function() {
          this.style.display = 'none';
          const fb = document.createElement('span');
          fb.style.cssText = 'font-size:1.6rem;line-height:1';
          fb.textContent = '📦';
          card.insertBefore(fb, card.firstChild);
        };

        const label = document.createElement('span');
        label.className = 'skill-tag-label';
        label.textContent = skill.name;

        card.appendChild(img);
        card.appendChild(label);
        tags.appendChild(card);
      }
    });

    group.appendChild(tags);
    grid.appendChild(group);
  });
})();

// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// Hamburger
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
      const R = (w*w/4 + h*h) / (2*h);
      const D = Math.ceil(2*R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R*R - w*w/4))) + 1;
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
      if (lbl) tl.to(lbl, { y: -(h+8), duration: 2, ease, overwrite: 'auto' }, 0);
      if (lblH) { gsap.set(lblH, { y: Math.ceil(h+100), opacity: 0 }); tl.to(lblH, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0); }
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
        gsap.to(mobileMenuEl, { opacity: 0, y: 10, duration: 0.2, ease,
          onComplete: () => gsap.set(mobileMenuEl, { visibility: 'hidden' }) });
      }
    }
  }

  function buildNav(container, options) {
    const { logo='', logoAlt='Logo', items=[], activeHref, className='',
      baseColor='#0d0d14', pillColor='#f5f4f0',
      hoveredPillTextColor='#f5f4f0', pillTextColor, initialLoadAnimation=true } = options;
    ease = options.ease || ease;
    const resolvedPillText = pillTextColor ?? baseColor;
    const cssVars = { '--base': baseColor, '--pill-bg': pillColor, '--hover-text': hoveredPillTextColor, '--pill-text': resolvedPillText };

    const wrapper = document.createElement('div'); wrapper.className = 'pill-nav-container';
    const nav = document.createElement('nav'); nav.className = 'pill-nav ' + className;
    nav.setAttribute('aria-label', 'Primary');
    Object.entries(cssVars).forEach(([k,v]) => nav.style.setProperty(k,v));

    const logoLink = document.createElement('a'); logoLink.className = 'pill-logo';
    logoLink.href = items[0]?.href || '#'; logoLink.setAttribute('aria-label','Home'); logoEl = logoLink;
    if (logo) { const img = document.createElement('img'); img.src = logo; img.alt = logoAlt; logoImgEl = img; logoLink.appendChild(img); }
    logoLink.addEventListener('mouseenter', handleLogoEnter);
    nav.appendChild(logoLink);

    const navItems = document.createElement('div'); navItems.className = 'pill-nav-items desktop-only'; navItemsEl = navItems;
    const ul = document.createElement('ul'); ul.className = 'pill-list'; ul.setAttribute('role','menubar');
    items.forEach((item, i) => {
      const li = document.createElement('li'); li.setAttribute('role','none');
      const a = document.createElement('a'); a.href = item.href;
      a.className = 'pill' + (activeHref === item.href ? ' is-active' : '');
      a.setAttribute('role','menuitem'); a.setAttribute('aria-label', item.label);
      const circle = document.createElement('span'); circle.className = 'hover-circle'; circle.setAttribute('aria-hidden','true');
      circles[i] = circle; a.appendChild(circle);
      const stack = document.createElement('span'); stack.className = 'label-stack';
      const lbl = document.createElement('span'); lbl.className = 'pill-label'; lbl.textContent = item.label;
      const lblH = document.createElement('span'); lblH.className = 'pill-label-hover'; lblH.setAttribute('aria-hidden','true'); lblH.textContent = item.label;
      stack.appendChild(lbl); stack.appendChild(lblH); a.appendChild(stack);
      a.addEventListener('mouseenter', () => handleEnter(i));
      a.addEventListener('mouseleave', () => handleLeave(i));
      li.appendChild(a); ul.appendChild(li);
    });
    navItems.appendChild(ul); nav.appendChild(navItems);

    const burger = document.createElement('button'); burger.className = 'mobile-menu-button mobile-only';
    burger.setAttribute('aria-label','Toggle menu'); hamburgerEl = burger;
    ['',''].forEach(() => { const l = document.createElement('span'); l.className = 'hamburger-line'; burger.appendChild(l); });
    burger.addEventListener('click', toggleMobileMenu);
    nav.appendChild(burger); wrapper.appendChild(nav);

    const pop = document.createElement('div'); pop.className = 'mobile-menu-popover mobile-only';
    Object.entries(cssVars).forEach(([k,v]) => pop.style.setProperty(k,v)); mobileMenuEl = pop;
    const mUl = document.createElement('ul'); mUl.className = 'mobile-menu-list';
    items.forEach(item => {
      const li = document.createElement('li'); const a = document.createElement('a');
      a.href = item.href; a.className = 'mobile-menu-link'; a.textContent = item.label;
      a.addEventListener('click', () => { isMobileMenuOpen = true; toggleMobileMenu(); });
      li.appendChild(a); mUl.appendChild(li);
    });
    pop.appendChild(mUl); wrapper.appendChild(pop); container.appendChild(wrapper);
    gsap.set(mobileMenuEl, { visibility: 'hidden', opacity: 0 });
    layout(); window.addEventListener('resize', layout);
    if (document.fonts?.ready) document.fonts.ready.then(layout).catch(()=>{});
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
    { label: 'About',     href: '#about'          },
    { label: 'Education', href: '#education'      },
    { label: 'Certs',     href: '#certifications' },
    { label: 'Skills',    href: '#skills'         },
    { label: 'Contact',   href: '#contact'        },
  ],
  ease:                  'power3.out',
  baseColor:             '#0d0d14',
  pillColor:             '#f5f4f0',
  pillTextColor:         '#0d0d14',
  hoveredPillTextColor:  '#f5f4f0',
  initialLoadAnimation:  true
});
// const hamburger = document.querySelector('.hamburger');
// const navLinks = document.querySelector('.nav-links');
// hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
