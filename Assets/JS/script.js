/* =========================================================
   main.js — Ishan Biswas Portfolio
   ========================================================= */

/* ── 0. PAGE LOADER ──────────────────────────────────────── */
(function initLoader() {
    var bar    = document.getElementById('loader-bar');
    var label  = document.getElementById('loader-label');
    var loader = document.getElementById('page-loader');
    if (!loader) return;

    var sections = ['About', 'Education', 'Projects', 'Certifications', 'Skills', 'Contact'];
    var step = 0;
    var pct  = 0;

    /* Restore night mode before loader fades so bg color matches */
    try {
        if (sessionStorage.getItem('ib-theme') === 'night') {
            document.body.classList.add('night-mode');
        }
    } catch (e) {}

    function tick() {
        if (step >= sections.length) {
            pct = 100;
            bar.style.width = '100%';
            label.textContent = 'Ready!';
            setTimeout(function () {
                loader.classList.add('hidden');
            }, 350);
            return;
        }
        pct = Math.round(((step + 1) / sections.length) * 95);
        bar.style.width = pct + '%';
        label.textContent = 'Loading ' + sections[step] + '…';
        step++;
        setTimeout(tick, 210);
    }

    tick();
})();

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
        { label: 'About',          href: '#about' },
        { label: 'Education',      href: '#education' },
        { label: 'Projects',       href: '#projects' },
        { label: 'Certifications', href: '#certifications' },
        { label: 'Skills',         href: '#skills' },
        { label: 'Contact',        href: '#contact' },
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
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

/* ── 3. ACTIVE SECTION HIGHLIGHT IN NAV ─────────────────── */
(function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.pill').forEach(pill => {
            pill.classList.remove('is-active');
            if (pill.getAttribute('href') === '#' + current) {
                pill.classList.add('is-active');
            }
        });
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            if (link.getAttribute('href') === '#' + current) {
                link.style.background = 'var(--base)';
                link.style.color = 'var(--hover-text)';
            } else {
                link.style.background = '';
                link.style.color = '';
            }
        });
    });
})();

/* ── 4. NIGHT MODE TOGGLE ────────────────────────────────── */
(function initThemeToggle() {

    var SUN_SVG =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
        'stroke="#f5c842" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="12" r="4"/>' +
        '<line x1="12" y1="2"  x2="12" y2="5"/>' +
        '<line x1="12" y1="19" x2="12" y2="22"/>' +
        '<line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>' +
        '<line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>' +
        '<line x1="2"  y1="12" x2="5"  y2="12"/>' +
        '<line x1="19" y1="12" x2="22" y2="12"/>' +
        '<line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>' +
        '<line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>' +
        '</svg>';

    var MOON_SVG =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8899ee" ' +
        'stroke="#8899ee" stroke-width="1">' +
        '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
        '<circle cx="17" cy="6" r="1.2" fill="#aabbff" stroke="none"/>' +
        '</svg>';

    var wrap = document.createElement('div');
    wrap.id = 'theme-toggle-wrap';
    wrap.setAttribute('title', 'Toggle day / night mode');
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('aria-label', 'Toggle day / night mode');
    wrap.tabIndex = 0;

    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle day / night mode');
    btn.setAttribute('aria-pressed', 'false');

    var knob = document.createElement('span');
    knob.className = 'knob';

    var sunEl = document.createElement('span');
    sunEl.className = 'icon-sun';
    sunEl.innerHTML = SUN_SVG;

    var moonEl = document.createElement('span');
    moonEl.className = 'icon-moon';
    moonEl.innerHTML = MOON_SVG;

    btn.appendChild(knob);
    btn.appendChild(sunEl);
    btn.appendChild(moonEl);
    wrap.appendChild(btn);

    function placeToggle() {
        var isMobile = window.innerWidth <= 768;

        if (isMobile) {
            var nav = document.querySelector('.pill-nav');
            if (!nav) return;

            var group = nav.querySelector('.pill-nav-right-group');
            if (!group) {
                group = document.createElement('div');
                group.className = 'pill-nav-right-group';

                var burger = nav.querySelector('.mobile-menu-button');
                if (burger) {
                    nav.removeChild(burger);
                    group.appendChild(wrap);
                    group.appendChild(burger);
                } else {
                    group.appendChild(wrap);
                }
                nav.appendChild(group);
            } else if (!group.contains(wrap)) {
                group.insertBefore(wrap, group.firstChild);
            }
        } else {
            if (!document.body.contains(wrap)) {
                document.body.appendChild(wrap);
            }
        }
    }

    var isNight = false;
    try {
        if (sessionStorage.getItem('ib-theme') === 'night') isNight = true;
    } catch (e) { }

    function applyTheme(night) {
        if (night) {
            document.body.classList.add('night-mode');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            document.body.classList.remove('night-mode');
            btn.setAttribute('aria-pressed', 'false');
        }
        try { sessionStorage.setItem('ib-theme', night ? 'night' : 'day'); } catch (e) { }
    }

    wrap.addEventListener('click', function (e) {
        e.stopPropagation();
        isNight = !isNight;
        applyTheme(isNight);
    });
    wrap.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            isNight = !isNight;
            applyTheme(isNight);
        }
    });

    function init() {
        placeToggle();
        applyTheme(isNight);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }

    var lastMobile = window.innerWidth <= 768;
    window.addEventListener('resize', function () {
        var nowMobile = window.innerWidth <= 768;
        if (nowMobile !== lastMobile) {
            lastMobile = nowMobile;
            if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
            var group = document.querySelector('.pill-nav-right-group');
            if (group) { group.parentNode.removeChild(group); }
            placeToggle();
        }
    });

})();