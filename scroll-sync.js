// Standalone script for scroll-syncing
document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('main-profile-img');
    const heroContainer = document.getElementById('hero-img-container');
    const aboutTarget = document.getElementById('about-image-target');
    
    if (!profileImg || !heroContainer || !aboutTarget) return;

    let ticking = false;

    function updateProfilePosition() {
        // Calculate the bounding boxes as if there were no transforms
        // To get accurate positions, we need the fixed positions of the containers
        const heroRect = heroContainer.getBoundingClientRect();
        const aboutRect = aboutTarget.getBoundingClientRect();
        
        const scrollY = window.scrollY;
        
        // Define animation range based on scroll
        // Start moving when Hero starts to scroll out, finish when About target is in center of screen
        const startScroll = 0;
        const endScroll = document.getElementById('about').offsetTop - 100;
        
        let progress = (scrollY - startScroll) / (endScroll - startScroll);
        progress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1
        
        // Smooth easing (ease-in-out)
        const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        
        if (progress === 0) {
            profileImg.style.position = 'relative';
            profileImg.style.transform = 'none';
            profileImg.style.width = '100%';
            profileImg.style.height = '100%';
            profileImg.style.top = '0';
            profileImg.style.left = '0';
            profileImg.style.zIndex = '1';
        } else {
            // Switch to fixed positioning for smooth travel
            profileImg.style.position = 'fixed';
            profileImg.style.zIndex = '100';
            
            // Hero starting metrics (absolute to viewport at scroll 0)
            const startW = heroContainer.offsetWidth;
            const startH = heroContainer.offsetHeight;
            const startX = heroContainer.getBoundingClientRect().left;
            const startY = heroContainer.getBoundingClientRect().top + (progress > 0 && profileImg.style.position === 'fixed' ? 0 : 0); 
            // Wait, getting the rect while the element is fixed will break if we rely on it.
        }
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProfilePosition();
                ticking = false;
            });
            ticking = true;
        }
    });
});
