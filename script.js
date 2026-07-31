// ============================================================
// PORTFOLIO SCRIPT — Abdul Rasheed YP
// Sections:
//   1. Mobile Menu Toggle
//   2. Smooth Scroll
//   3. Unified Scroll Handler (progress, navbar, active links, scroll-to-top)
//   4. Project Filter
//   5. Auto-Scroll Projects Carousel
//   6. Contact Form Validation
//   7. Confetti on form submit
//   8. Theme Toggle
// ============================================================


// ============================================================
// 1. MOBILE MENU TOGGLE
// ============================================================
const mobileMenu = document.getElementById('mobile-menu');
const navMenu    = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        const isActive = mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active', isActive);

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
            mobileMenu.querySelectorAll('.bar').forEach(b => {
                b.style.transform = '';
                b.style.opacity   = '';
            });
        });
    });
}


// ============================================================
// 2. SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});


// ============================================================
// 3. UNIFIED SCROLL HANDLER
//    Uses requestAnimationFrame to avoid janking the main thread.
//    passive: true tells the browser it won't call preventDefault.
// ============================================================
const progressBar   = document.getElementById('scroll-progress');
const navbar        = document.querySelector('.navbar');
const sections      = document.querySelectorAll('section[id]');
const navLinks      = document.querySelectorAll('.nav-link');

// Scroll-to-top button (create if not in HTML)
let scrollToTopBtn = document.querySelector('.scroll-to-top');
if (!scrollToTopBtn) {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className   = 'scroll-to-top';
    scrollToTopBtn.innerHTML   = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
}
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

let rafPending = false;

function onScroll() {
    if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(handleScroll);
    }
}

function handleScroll() {
    rafPending = false;
    const scrollTop    = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (progressBar && scrollHeight > 0) {
        progressBar.style.width = ((scrollTop / scrollHeight) * 100) + '%';
    }

    // Navbar compact state
    if (navbar) {
        navbar.classList.toggle('scrolled', scrollTop > 60);
    }

    // Scroll-to-top button visibility
    if (scrollToTopBtn) {
        scrollToTopBtn.classList.toggle('visible', scrollTop > 300);
    }

    // Active nav link
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

window.addEventListener('scroll', onScroll, { passive: true });


// ============================================================
// 4. PROJECT FILTER
// ============================================================
const filterButtons  = document.querySelectorAll('.filter-btn');
const projectCards   = document.querySelectorAll('.project-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const match = filter === 'all' || card.getAttribute('data-category') === filter;
            card.style.display = match ? 'block' : 'none';
        });
    });
});


// ============================================================
// 5. AUTO-SCROLL PROJECTS CAROUSEL
//    Pauses on hover/touch.
// ============================================================
const projectsGrid = document.querySelector('.projects-grid');
let   autoScrollDir    = 1;
let   userInteracting  = false;

if (projectsGrid) {
    projectsGrid.addEventListener('mouseenter',  () => { userInteracting = true; });
    projectsGrid.addEventListener('mouseleave',  () => { userInteracting = false; });
    projectsGrid.addEventListener('touchstart',  () => { userInteracting = true;  }, { passive: true });
    projectsGrid.addEventListener('touchend',    () => {
        setTimeout(() => { userInteracting = false; }, 1500);
    }, { passive: true });

    setInterval(() => {
        if (userInteracting) return;
        projectsGrid.scrollLeft += autoScrollDir * 1.2;

        const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
        if (projectsGrid.scrollLeft >= maxScroll - 1) autoScrollDir = -1;
        if (projectsGrid.scrollLeft <= 0)              autoScrollDir = 1;
    }, 25);
}


// ============================================================
// 6. CONTACT FORM VALIDATION
// ============================================================
const contactForm  = document.getElementById('contact-form');
const successModal = document.getElementById('successModal');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        clearFormErrors();
        let valid = true;

        const name    = this.name.value.trim();
        const email   = this.email.value.trim();
        const message = this.message.value.trim();

        if (name.length < 3) {
            showError('name', 'Name must be at least 3 characters');
            valid = false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Enter a valid email address');
            valid = false;
        }
        if (message.length < 10) {
            showError('message', 'Message must be at least 10 characters');
            valid = false;
        }

        if (!valid) {
            e.preventDefault();
            return;
        }

        // Show success modal after submission
        setTimeout(() => {
            if (successModal) {
                successModal.classList.add('show');
                createConfetti();
                contactForm.reset();
                setTimeout(() => successModal.classList.remove('show'), 3000);
            }
        }, 500);
    });
}

function showError(fieldName, msg) {
    if (!contactForm) return;
    const input = contactForm.querySelector(`[name="${fieldName}"]`);
    if (!input) return;
    const group = input.closest('.form-group');
    if (group) {
        group.classList.add('error');
        const errEl = group.querySelector('.error-msg');
        if (errEl) errEl.textContent = msg;
    }
}

function clearFormErrors() {
    document.querySelectorAll('.form-group').forEach(g => {
        g.classList.remove('error');
        const e = g.querySelector('.error-msg');
        if (e) e.textContent = '';
    });
}


// ============================================================
// 7. CONFETTI (lightweight, DOM-based, one-shot)
// ============================================================
function createConfetti() {
    const colors = ['#00D9FF', '#7B2FFF', '#FF006E', '#00FFA3', '#FFD600'];
    for (let i = 0; i < 80; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            background: ${colors[i % colors.length]};
            left: ${Math.random() * 100}%;
            top: -20px;
            z-index: 99999;
            pointer-events: none;
        `;
        document.body.appendChild(el);

        const duration = 2000 + Math.random() * 1500;
        const angle    = Math.random() * 360;
        const dist     = 200 + Math.random() * 300;

        el.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * 80}px, ${window.innerHeight + 40}px) rotate(${angle * 4}deg)`, opacity: 0 }
        ], { duration, easing: 'ease-in' }).onfinish = () => el.remove();
    }
}

