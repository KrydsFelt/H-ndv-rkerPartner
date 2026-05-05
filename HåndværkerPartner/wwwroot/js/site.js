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
            setTimeout(typeSubtitle, jitter(70, 35));
        } else {
            dotNetRef.invokeMethodAsync('OnTypingComplete');
        }
    }

    function eraseTitle() {
        if (chars > 0) {
            chars--;
            setTitleContent(chars);
            setTimeout(eraseTitle, jitter(85, 30));
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
            setTimeout(typeTitle, jitter(130, 50));
        } else {
            setTimeout(eraseTitle, 900);
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
    const targets = [
        { selector: '.about-num-0', end: 50, suffix: '+', duration: 1600 },
        { selector: '.about-num-1', end: 1000, suffix: '+', display: (v) => v.toLocaleString('da-DK') + '+', duration: 1800 },
        { selector: '.about-num-2', end: 33, suffix: ' kr', duration: 1400 },
        { selector: '.about-num-3', end: 0, suffix: ' dage', duration: 800 },
    ];

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateNum = (el, target) => {
        const start = performance.now();
        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / target.duration, 1);
            const value = Math.round(easeOut(progress) * target.end);
            el.textContent = target.display ? target.display(value) : value + target.suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const card = document.querySelector('.about-big-card');
    if (!card) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            targets.forEach(t => {
                const el = card.querySelector('.' + t.selector.slice(1) + ' .n');
                if (el) animateNum(el, t);
            });
        });
    }, { threshold: 0.4 });

    observer.observe(card);
};
