window.lockScroll = () => { document.body.style.overflow = 'hidden'; };
window.unlockScroll = () => { document.body.style.overflow = ''; };

window.initCarousel = (dotNetRef) => {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;
    track.addEventListener('scroll', () => {
        const index = Math.round(track.scrollLeft / track.offsetWidth);
        dotNetRef.invokeMethodAsync('SetActiveCard', index);
    }, { passive: true });
};

window.scrollCarouselTo = (index) => {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;
    track.scrollTo({ left: index * track.offsetWidth, behavior: 'smooth' });
};

window.initScrollHandler = (dotNetRef) => {
    window.addEventListener('scroll', () => {
        dotNetRef.invokeMethodAsync('OnScroll', window.scrollY);
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
