// ============================================================
// scroll.js — Progress Bar, Navbar Compact, Scroll-to-Top,
//             Active Nav Link Highlighting
// ============================================================

export function initScroll() {
    const progressBar  = document.getElementById('scroll-progress');
    const navbar       = document.querySelector('.navbar');
    const sections     = document.querySelectorAll('section[id]');
    const navLinks     = document.querySelectorAll('.nav-link');

    // Create scroll-to-top button if not in HTML
    let scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (!scrollToTopBtn) {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className  = 'scroll-to-top';
        scrollToTopBtn.innerHTML  = '<i class="fas fa-arrow-up"></i>';
        scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollToTopBtn);
    }

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    let rafPending = false;

    function handleScroll() {
        rafPending = false;
        const scrollTop    = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (progressBar && scrollHeight > 0) {
            progressBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
        }

        if (navbar) {
            navbar.classList.toggle('scrolled', scrollTop > 60);
        }

        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('visible', scrollTop > 300);
        }

        let currentSection = '';
        sections.forEach(section => {
            if (scrollTop >= section.offsetTop - 160) {
                currentSection = section.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });
    }

    window.addEventListener('scroll', () => {
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(handleScroll);
        }
    }, { passive: true });
}
