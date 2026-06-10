window.runRouteLoaderAnimation = function (textEl, dotNetRef) {
    var part1 = 'Håndværker';
    var part2 = 'partner';
    var title = part1 + part2;
    var subtitle = 'Når det skal gøres ordentligt';
    var chars = 0;

    function jitter(base, range) {
        return base + Math.floor(Math.random() * range - range / 2);
    }

    function setTitleContent(n) {
        var p1 = part1.slice(0, Math.min(n, part1.length));
        var p2 = part2.slice(0, Math.max(0, n - part1.length));
        textEl.innerHTML = p1 + (p2 ? '<span class="rl-blue">' + p2 + '</span>' : '');
    }

    function typeSubtitle() {
        chars++;
        textEl.textContent = subtitle.slice(0, chars);
        if (chars < subtitle.length) {
            setTimeout(typeSubtitle, jitter(55, 25));
        } else {
            dotNetRef.invokeMethodAsync('OnTypingComplete');
        }
    }

    function eraseTitle() {
        if (chars > 0) {
            chars--;
            setTitleContent(chars);
            setTimeout(eraseTitle, jitter(70, 25));
        } else {
            textEl.innerHTML = '';
            textEl.classList.add('rl-subtitle-mode');
            var cursor = textEl.nextElementSibling;
            if (cursor) cursor.classList.add('rl-subtitle-mode');
            setTimeout(typeSubtitle, 250);
        }
    }

    function typeTitle() {
        chars++;
        setTitleContent(chars);
        if (chars < title.length) {
            setTimeout(typeTitle, jitter(95, 40));
        } else {
            setTimeout(eraseTitle, 1600);
        }
    }

    function startAnimation() {
        setTimeout(typeTitle, 400);
    }

    var loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) {
        startAnimation();
    } else {
        var observer = new MutationObserver(function () {
            if (!document.getElementById('loading-screen')) {
                observer.disconnect();
                startAnimation();
            }
        });
        observer.observe(document.body, { childList: true });
    }
};

window.lockScroll = () => { document.body.style.overflow = 'hidden'; };
window.unlockScroll = () => { document.body.style.overflow = ''; };
window.setSkipLoader = () => { sessionStorage.setItem('skipLoader', '1'); };

window.initScrollHandler = (dotNetRef) => {
    window.addEventListener('scroll', () => {
        dotNetRef.invokeMethodAsync('OnScroll', window.scrollY, document.documentElement.scrollHeight, window.innerHeight);
    }, { passive: true });
};

window.scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.initCountUp = () => {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const formatValue = (value, format, prefix, suffix) => {
        const base = format === 'da-DK' ? value.toLocaleString('da-DK') : String(value);
        return `${prefix}${base}${suffix}`;
    };

    const animateNum = (el) => {
        const end = Number(el.dataset.countEnd ?? 0);
        const duration = Number(el.dataset.countDuration ?? 1200);
        const prefix = el.dataset.countPrefix ?? '';
        const suffix = el.dataset.countSuffix ?? '';
        const format = el.dataset.countFormat ?? 'plain';
        const start = performance.now();

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(easeOut(progress) * end);
            el.textContent = formatValue(value, format, prefix, suffix);
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    const section = document.querySelector('[data-count-up-section]');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            section.querySelectorAll('[data-kpi-reveal]').forEach((el, index) => {
                window.setTimeout(() => el.classList.add('is-visible'), index * 90);
            });
            section.querySelectorAll('[data-count-up]').forEach((el) => {
                animateNum(el);
            });
        });
    }, { threshold: 0.4 });

    observer.observe(section);
};

window.initFaqHover = () => {
    if (window.__faqHoverInitialized) return;
    window.__faqHoverInitialized = true;

    const desktopFaqs = window.matchMedia('(hover: hover) and (pointer: fine)');

    document.addEventListener('mouseover', (event) => {
        if (!desktopFaqs.matches) return;

        const item = event.target.closest('.faq-item');
        if (!item || item.contains(event.relatedTarget)) return;

        item.open = true;
    });

    document.addEventListener('mouseout', (event) => {
        if (!desktopFaqs.matches) return;

        const item = event.target.closest('.faq-item');
        if (!item || item.contains(event.relatedTarget)) return;

        item.open = false;
    });

    document.addEventListener('click', (event) => {
        if (!desktopFaqs.matches) return;

        const summary = event.target.closest('.faq-item summary');
        if (!summary) return;

        event.preventDefault();
        summary.parentElement.open = true;
    });
};

window.initFaqHover();

// Carousel deaktiveret - items vises synligt på mobile i stedet
