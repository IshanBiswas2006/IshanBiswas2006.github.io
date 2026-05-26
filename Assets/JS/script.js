/* =========================================================
   script.js — Portfolio by Ishan Biswas
   ========================================================= */


/* ── 1. PILL NAV ─────────────────────────────────────────── */

const PillNav = (() => {

    /* ── State ──────────────────────────────────────────── */
    let isMobileMenuOpen = false;
    let circles = [], timelines = [], activeTweens = [];
    let logoImgEl = null, logoTween = null;
    let hamburgerEl = null, mobileMenuEl = null, navItemsEl = null, logoEl = null;
    let ease = 'power3.out';

    /* ── Compute pill geometry and build GSAP timelines ─── */
    function layout() {
        circles.forEach((circle, i) => {
            if (!circle?.parentElement) return;

            const pill = circle.parentElement;
            const { width: w, height: h } = pill.getBoundingClientRect();

            /* Radius of the circular hover fill */
            const R     = (w * w / 4 + h * h) / (2 * h);
            const D     = Math.ceil(2 * R) + 2;
            const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - w * w / 4))) + 1;

            circle.style.width  = D + 'px';
            circle.style.height = D + 'px';
            circle.style.bottom = '-' + delta + 'px';
            gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: '50% ' + (D - delta) + 'px' });

            const lbl  = pill.querySelector('.pill-label');
            const lblH = pill.querySelector('.pill-label-hover');
            if (lbl)  gsap.set(lbl,  { y: 0 });
            if (lblH) gsap.set(lblH, { y: h + 12, opacity: 0 });

            /* Kill previous timeline for this pill */
            if (timelines[i]) timelines[i].kill();

            const tl = gsap.timeline({ paused: true });
            tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);
            if (lbl)  tl.to(lbl,  { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
            if (lblH) {
                gsap.set(lblH, { y: Math.ceil(h + 100), opacity: 0 });
                tl.to(lblH, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
            }
            timelines[i] = tl;
        });
    }

    /* ── Pill hover enter / leave ───────────────────────── */
    function handleEnter(i) {
        const tl = timelines[i];
        if (!tl) return;
        if (activeTweens[i]) activeTweens[i].kill();
        activeTweens[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' });
    }

    function handleLeave(i) {
        const tl = timelines[i];
        if (!tl) return;
        if (activeTweens[i]) activeTweens[i].kill();
        activeTweens[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' });
    }

    /* ── Logo spin on hover ─────────────────────────────── */
    function handleLogoEnter() {
        if (!logoImgEl) return;
        if (logoTween) logoTween.kill();
        gsap.set(logoImgEl, { rotate: 0 });
        logoTween = gsap.to(logoImgEl, { rotate: 360, duration: 0.4, ease, overwrite: 'auto' });
    }

    /* ── Mobile menu open / close ───────────────────────── */
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;

        if (hamburgerEl) {
            const [l1, l2] = hamburgerEl.querySelectorAll('.hamburger-line');
            if (isMobileMenuOpen) {
                gsap.to(l1, { rotation:  45, y:  3.5, duration: 0.3, ease });
                gsap.to(l2, { rotation: -45, y: -3.5, duration: 0.3, ease });
            } else {
                gsap.to(l1, { rotation: 0, y: 0, duration: 0.3, ease });
                gsap.to(l2, { rotation: 0, y: 0, duration: 0.3, ease });
            }
        }

        if (mobileMenuEl) {
            if (isMobileMenuOpen) {
                gsap.set(mobileMenuEl, { visibility: 'visible' });
                gsap.fromTo(mobileMenuEl,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.3, ease }
                );
            } else {
                gsap.to(mobileMenuEl, {
                    opacity: 0,
                    y: 10,
                    duration: 0.2,
                    ease,
                    onComplete: () => gsap.set(mobileMenuEl, { visibility: 'hidden' })
                });
            }
        }
    }

    /* ── Build the nav DOM ──────────────────────────────── */
    function buildNav(container, options) {
        const {
            logo = '',
            logoAlt = 'Logo',
            items = [],
            activeHref,
            className = '',
            baseColor = '#0d0d14',
            pillColor = '#f5f4f0',
            hoveredPillTextColor = '#f5f4f0',
            pillTextColor,
            initialLoadAnimation = true
        } = options;

        ease = options.ease || ease;

        const resolvedPillText = pillTextColor ?? baseColor;
        const cssVars = {
            '--base':       baseColor,
            '--pill-bg':    pillColor,
            '--hover-text': hoveredPillTextColor,
            '--pill-text':  resolvedPillText
        };

        /* ── Wrapper + nav ──────────────────────────────── */
        const wrapper = document.createElement('div');
        wrapper.className = 'pill-nav-container';

        const nav = document.createElement('nav');
        nav.className = 'pill-nav ' + className;
        nav.setAttribute('aria-label', 'Primary');
        Object.entries(cssVars).forEach(([k, v]) => nav.style.setProperty(k, v));

        /* ── Logo ───────────────────────────────────────── */
        const logoLink = document.createElement('a');
        logoLink.className = 'pill-logo';
        logoLink.href = items[0]?.href || '#';
        logoLink.setAttribute('aria-label', 'Home');
        logoEl = logoLink;

        if (logo) {
            const img = document.createElement('img');
            img.src = logo;
            img.alt = logoAlt;
            logoImgEl = img;
            logoLink.appendChild(img);
        }

        logoLink.addEventListener('mouseenter', handleLogoEnter);
        nav.appendChild(logoLink);

        /* ── Desktop pill list ──────────────────────────── */
        const navItems = document.createElement('div');
        navItems.className = 'pill-nav-items desktop-only';
        navItemsEl = navItems;

        const ul = document.createElement('ul');
        ul.className = 'pill-list';
        ul.setAttribute('role', 'menubar');

        items.forEach((item, i) => {
            const li = document.createElement('li');
            li.setAttribute('role', 'none');

            const a = document.createElement('a');
            a.href = item.href;
            a.className = 'pill' + (activeHref === item.href ? ' is-active' : '');
            a.setAttribute('role', 'menuitem');
            a.setAttribute('aria-label', item.label);

            const circle = document.createElement('span');
            circle.className = 'hover-circle';
            circle.setAttribute('aria-hidden', 'true');
            circles[i] = circle;
            a.appendChild(circle);

            const stack = document.createElement('span');
            stack.className = 'label-stack';

            const lbl = document.createElement('span');
            lbl.className = 'pill-label';
            lbl.textContent = item.label;

            const lblH = document.createElement('span');
            lblH.className = 'pill-label-hover';
            lblH.setAttribute('aria-hidden', 'true');
            lblH.textContent = item.label;

            stack.appendChild(lbl);
            stack.appendChild(lblH);
            a.appendChild(stack);

            a.addEventListener('mouseenter', () => handleEnter(i));
            a.addEventListener('mouseleave', () => handleLeave(i));

            li.appendChild(a);
            ul.appendChild(li);
        });

        navItems.appendChild(ul);
        nav.appendChild(navItems);

        /* ── Hamburger (mobile) ─────────────────────────── */
        const burger = document.createElement('button');
        burger.className = 'mobile-menu-button mobile-only';
        burger.setAttribute('aria-label', 'Toggle menu');
        hamburgerEl = burger;

        /* Two lines that animate into an X */
        ['', ''].forEach(() => {
            const line = document.createElement('span');
            line.className = 'hamburger-line';
            burger.appendChild(line);
        });

        burger.addEventListener('click', toggleMobileMenu);
        nav.appendChild(burger);
        wrapper.appendChild(nav);

        /* ── Mobile dropdown popover ────────────────────── */
        const pop = document.createElement('div');
        pop.className = 'mobile-menu-popover mobile-only';
        Object.entries(cssVars).forEach(([k, v]) => pop.style.setProperty(k, v));
        mobileMenuEl = pop;

        const mUl = document.createElement('ul');
        mUl.className = 'mobile-menu-list';

        items.forEach(item => {
            const li = document.createElement('li');
            const a  = document.createElement('a');
            a.href = item.href;
            a.className = 'mobile-menu-link';
            a.textContent = item.label;
            a.addEventListener('click', () => toggleMobileMenu());
            li.appendChild(a);
            mUl.appendChild(li);
        });

        pop.appendChild(mUl);
        wrapper.appendChild(pop);
        container.appendChild(wrapper);

        /* ── Initial state ──────────────────────────────── */
        gsap.set(mobileMenuEl, { visibility: 'hidden', opacity: 0 });

        layout();
        window.addEventListener('resize', layout);

        if (document.fonts?.ready) {
            document.fonts.ready.then(layout).catch(() => {});
        }

        /* ── Entry animation ────────────────────────────── */
        if (initialLoadAnimation) {
            if (logoEl)     { gsap.set(logoEl,     { scale: 0 }); gsap.to(logoEl,     { scale: 1, duration: 0.6, ease }); }
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


/* ── Inline SVG logo ─────────────────────────────────────── */

const ibLogo = 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
    '<rect width="40" height="40" rx="10" fill="#0d0d14"/>' +
    '<text x="50%" y="52%" text-anchor="middle" dominant-baseline="central" ' +
    'font-family="Syne,sans-serif" font-weight="800" font-size="15" fill="#f5f4f0">IB</text>' +
    '<circle cx="31" cy="28" r="4" fill="#2563eb"/>' +
    '</svg>'
);

/* ── Initialise nav ──────────────────────────────────────── */

PillNav.init({
    container: '#pill-nav-root',
    logo:      ibLogo,
    logoAlt:   'Ishan Biswas',
    items: [
        { label: 'About',          href: '#about'          },
        { label: 'Education',      href: '#education'      },
        { label: 'Certifications', href: '#certifications' },
        { label: 'Skills',         href: '#skills'         },
        { label: 'Projects',       href: '#projects'       },
        { label: 'Contact',        href: '#contact'        },
    ],
    ease:                 'power3.out',
    baseColor:            '#0d0d14',
    pillColor:            '#f5f4f0',
    pillTextColor:        '#0d0d14',
    hoveredPillTextColor: '#f5f4f0',
    initialLoadAnimation:  true
});


/* ── 2. FADE-IN ON SCROLL ────────────────────────────────── */

(function initFadeIn() {
    var els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    /* Stagger cards that share a grid container */
    document.querySelectorAll('.cards-grid, .skills-grid, .contact-grid').forEach(function (grid) {
        Array.from(grid.querySelectorAll('.fade-in')).forEach(function (el, i) {
            el.style.transitionDelay = (i * 0.1) + 's';
        });
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
})();


/* ── 3. SKILLS GRID (JS-rendered) ───────────────────────── */

(function buildSkills() {
    var grid = document.getElementById('skills-grid');
    if (!grid || grid.children.length > 0) return;

    var groups = [
        {
            title: 'Languages',
            items: [
                { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',       label: 'Python' },
                { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', label: 'C++'    },
                { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',                 label: 'C'      },
                // { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',           label: 'Java'   },
            ]
        },
        {
            title: 'Web',
            items: [
                { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',           label: 'HTML5'      },
                { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',             label: 'CSS3'       },
                { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', label: 'JavaScript' },
                // { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',           label: 'MySQL'      },
            ]
        },
        {
            title: 'Tools',
            items: [
                // { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',   label: 'NumPy'   },
                // { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', label: 'Pandas'  },
                { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',       label: 'Git'     },
                { src: 'http://raw.githubusercontent.com/bablubambal/All_logo_and_pictures/7c0ac2ceb9f9d24992ec393d11fa7337d2f92466/social%20icons/github.svg',       label: 'GitHub'     },
                { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', label: 'VS Code' },
            ]
        }
    ];

    groups.forEach(function (group, gi) {
        var tags = group.items.map(function (item) {
            return '<div class="skill-tag">' +
                '<img src="' + item.src + '" alt="' + item.label + '" loading="lazy">' +
                '<span class="skill-tag-label">' + item.label + '</span>' +
                '</div>';
        }).join('');

        var card = document.createElement('div');
        card.className = 'skill-group fade-in';
        card.style.transitionDelay = (gi * 0.12) + 's';
        card.innerHTML =
            '<div class="skill-group-title">' + group.title + '</div>' +
            '<div class="skill-tags">' + tags + '</div>';

        grid.appendChild(card);
    });

    /* Observe the newly-added cards */
    var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    grid.querySelectorAll('.fade-in').forEach(function (el) { obs.observe(el); });
})();

/* =========================================================
   PROJECT CARD EFFECTS — 3D tilt, shimmer, particles, magnetic tags
   ========================================================= */

(function initProjectEffects() {

    function spawnParticles(canvas, thumb) {
        var ctx = canvas.getContext('2d');
        var W, H, dots = [], raf;
        function resize() { W = canvas.width = thumb.offsetWidth; H = canvas.height = thumb.offsetHeight; }
        function initDots() {
            dots = [];
            for (var i = 0; i < 18; i++) {
                dots.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.8+0.5,
                    vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35, a: Math.random()*.5+.15 });
            }
        }
        function draw() {
            ctx.clearRect(0, 0, W, H);
            dots.forEach(function(d) {
                ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
                ctx.fillStyle = 'rgba(255,255,255,'+d.a+')'; ctx.fill();
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
                if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
            });
            raf = requestAnimationFrame(draw);
        }
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(en) {
                if (en.isIntersecting) { resize(); initDots(); draw(); }
                else cancelAnimationFrame(raf);
            });
        }, { threshold: 0.1 });
        io.observe(thumb);
        window.addEventListener('resize', function() { resize(); initDots(); });
    }

    function applyTilt(card) {
        var thumb    = card.querySelector('.project-thumb');
        var iconWrap = card.querySelector('.project-icon-wrap');
        if (!thumb) return;

        var shimmer = document.createElement('div');
        shimmer.className = 'project-shimmer';
        thumb.appendChild(shimmer);

        var canvas = document.createElement('canvas');
        canvas.className = 'project-particles';
        thumb.appendChild(canvas);
        spawnParticles(canvas, thumb);

        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = (e.clientX - rect.left) / rect.width  - 0.5;
            var y = (e.clientY - rect.top)  / rect.height - 0.5;
            card.style.transform  = 'translateY(-8px) rotateY('+(x*14)+'deg) rotateX('+(-y*10)+'deg)';
            card.style.transition = 'transform .08s linear, box-shadow .3s ease, border-color .3s ease';
            var sx = (e.clientX - rect.left) / rect.width  * 100;
            var sy = (e.clientY - rect.top)  / rect.height * 100;
            shimmer.style.background = 'radial-gradient(circle 90px at '+sx+'% '+sy+'%, rgba(255,255,255,0.18) 0%, transparent 70%)';
            shimmer.style.opacity = '1';
            if (iconWrap) {
                iconWrap.style.transform  = 'translate('+(x*8)+'px,'+(y*8)+'px) scale(1.08) rotate(-3deg)';
                iconWrap.style.transition = 'transform .12s linear';
            }
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform  = '';
            card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease, border-color .3s ease';
            shimmer.style.opacity = '0';
            if (iconWrap) {
                iconWrap.style.transform  = '';
                iconWrap.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
            }
        });
    }

    function applyMagneticTags(card) {
        card.querySelectorAll('.project-tag').forEach(function(tag) {
            tag.addEventListener('mousemove', function(e) {
                var r = tag.getBoundingClientRect();
                var dx = (e.clientX - r.left - r.width/2)  * 0.35;
                var dy = (e.clientY - r.top  - r.height/2) * 0.35;
                tag.style.transform  = 'translate('+dx+'px,'+dy+'px) translateY(-2px)';
                tag.style.transition = 'transform .1s linear';
            });
            tag.addEventListener('mouseleave', function() {
                tag.style.transform  = '';
                tag.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
            });
        });
    }

    function applyGlowEntrance(card) {
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(en) {
                if (en.isIntersecting) { card.classList.add('project-card--entered'); io.unobserve(card); }
            });
        }, { threshold: 0.25 });
        io.observe(card);
    }

    function init() {
        document.querySelectorAll('.project-card').forEach(function(card) {
            applyTilt(card);
            applyMagneticTags(card);
            applyGlowEntrance(card);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 120); });
    } else {
        setTimeout(init, 120);
    }

})();