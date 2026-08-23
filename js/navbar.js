// ============================================================
// navbar.js — Mobile Menu Toggle & Nav Active State
// ============================================================

export function initNavbar() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu    = document.querySelector('.nav-menu');

    if (!mobileMenu) return;

    mobileMenu.addEventListener('click', () => {
        const isActive = mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active', isActive);
        document.querySelector('.navbar').classList.toggle('menu-active', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';

        const [b0, b1, b2] = mobileMenu.querySelectorAll('.bar');
        if (isActive) {
            b0.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            b1.style.opacity   = '0';
            b2.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            b0.style.transform = '';
            b1.style.opacity   = '';
            b2.style.transform = '';
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.querySelector('.navbar').classList.remove('menu-active');
            document.body.style.overflow = '';

            mobileMenu.querySelectorAll('.bar').forEach(b => {
                b.style.transform = '';
                b.style.opacity   = '';
            });
        });
    });
}
