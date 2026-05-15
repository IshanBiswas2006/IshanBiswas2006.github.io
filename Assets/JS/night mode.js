/* =========================================================
   night-mode.js — Add AFTER script.js
   ========================================================= */

(function initThemeToggle() {

    /* ── SVG icons ──────────────────────────────────────── */
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

    /* ── Build toggle button ────────────────────────────── */
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

    /* ── Theme state ────────────────────────────────────── */
    var isNight = false;
    try {
        if (sessionStorage.getItem('ib-theme') === 'night') isNight = true;
    } catch (e) {}

    function applyTheme(night) {
        if (night) {
            document.body.classList.add('night-mode');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            document.body.classList.remove('night-mode');
            btn.setAttribute('aria-pressed', 'false');
        }
        try { sessionStorage.setItem('ib-theme', night ? 'night' : 'day'); } catch (e) {}
    }

    /* ── Click / keyboard handler ───────────────────────── */
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

    /* ── Place toggle ───────────────────────────────────── */
    function placeToggle() {
        var isMobile = window.innerWidth <= 768;

        if (isMobile) {
            var nav = document.querySelector('.pill-nav');
            if (!nav) return;

            /* Always find the burger fresh */
            var burger = nav.querySelector('.mobile-menu-button');

            /* Remove any old right group */
            var oldGroup = nav.querySelector('.pill-nav-right-group');
            if (oldGroup) oldGroup.parentNode.removeChild(oldGroup);

            /* Build new group: [toggle] [burger] */
            var group = document.createElement('div');
            group.className = 'pill-nav-right-group';
            group.appendChild(wrap);
            if (burger) {
                nav.removeChild(burger);
                group.appendChild(burger);
            }
            nav.appendChild(group);

        } else {
            /* Desktop: fixed to body */
            var oldGroup = document.querySelector('.pill-nav-right-group');
            if (oldGroup) {
                /* Restore burger back to nav */
                var burger = oldGroup.querySelector('.mobile-menu-button');
                var nav = document.querySelector('.pill-nav');
                if (burger && nav) nav.appendChild(burger);
                oldGroup.parentNode.removeChild(oldGroup);
            }
            if (!document.body.contains(wrap)) {
                document.body.appendChild(wrap);
            }
        }
    }

    /* ── Init after PillNav has rendered ───────────────── */
    function init() {
        placeToggle();
        applyTheme(isNight);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(init, 50);
        });
    } else {
        setTimeout(init, 50);
    }

    /* ── Re-place on viewport resize ───────────────────── */
    var lastMobile = window.innerWidth <= 768;
    window.addEventListener('resize', function () {
        var nowMobile = window.innerWidth <= 768;
        if (nowMobile !== lastMobile) {
            lastMobile = nowMobile;
            placeToggle();
        }
    });

})();