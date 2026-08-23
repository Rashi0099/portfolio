// ============================================================
// projects.js — Project Filter & Auto-Scroll Carousel
// ============================================================

export function initProjects() {
    initProjectFilter();
    initProjectsCarousel();
}

function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            // Query cards inside the click event because Firebase loads them dynamically!
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
                const match = filter === 'all' || card.getAttribute('data-category') === filter;
                card.style.display = match ? 'block' : 'none';
            });
        });
    });
}

function initProjectsCarousel() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    let autoScrollDir   = 1;
    let userInteracting = false;

    projectsGrid.addEventListener('mouseenter', () => { userInteracting = true; });
    projectsGrid.addEventListener('mouseleave', () => { userInteracting = false; });
    projectsGrid.addEventListener('touchstart', () => { userInteracting = true; }, { passive: true });
    projectsGrid.addEventListener('touchend',   () => {
        setTimeout(() => { userInteracting = false; }, 1500);
    }, { passive: true });

    let lastTimestamp = 0;
    const speedPerMs  = 1.2 / 25;

    function animateScroll(timestamp) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;

        if (!userInteracting) {
            projectsGrid.scrollLeft += autoScrollDir * (speedPerMs * deltaTime);
            const maxScroll = projectsGrid.scrollWidth - projectsGrid.clientWidth;
            if (projectsGrid.scrollLeft >= maxScroll - 1) autoScrollDir = -1;
            if (projectsGrid.scrollLeft <= 0)             autoScrollDir = 1;
        }
        requestAnimationFrame(animateScroll);
    }
    requestAnimationFrame(animateScroll);
}
