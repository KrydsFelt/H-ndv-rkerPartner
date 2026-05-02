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
