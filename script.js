// ============================================
// ENHANCED PORTFOLIO JAVASCRIPT
// Advanced 3D Effects, Particles & Interactions
// ============================================

// ============================================
// PARTICLE SYSTEM
// ============================================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = canvasId;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.position = 'relative';
            heroSection.insertBefore(this.canvas, heroSection.firstChild);
        }
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
    
    resize() {
        const hero = document.querySelector('.hero');
        if (hero) {
            this.canvas.width = hero.offsetWidth;
            this.canvas.height = hero.offsetHeight;
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
        }
    }
    
    init() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? 'rgba(0, 217, 255, 0.6)' : 'rgba(123, 47, 255, 0.6)'
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, i) => {
            // Move particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx -= (dx / distance) * force * 0.2;
                particle.vy -= (dy / distance) * force * 0.2;
            }
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 * (1 - distance / 120)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem('particles-canvas');
});

// ============================================
// 3D TILT EFFECT FOR CARDS
// ============================================
class TiltEffect {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.options = {
            maxTilt: options.maxTilt || 15,
            perspective: options.perspective || 1000,
            scale: options.scale || 1.05,
            speed: options.speed || 400,
            glare: options.glare !== false,
            maxGlare: options.maxGlare || 0.3
        };
        
        this.init();
    }
    
    init() {
        this.elements.forEach(element => {
            element.style.transformStyle = 'preserve-3d';
            element.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
            
            if (this.options.glare) {
                const glare = document.createElement('div');
                glare.className = 'tilt-glare';
                glare.style.position = 'absolute';
                glare.style.top = '0';
                glare.style.left = '0';
                glare.style.width = '100%';
                glare.style.height = '100%';
                glare.style.borderRadius = 'inherit';
                glare.style.background = 'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)';
                glare.style.opacity = '0';
                glare.style.pointerEvents = 'none';
                glare.style.transition = `opacity ${this.options.speed}ms ease`;
                element.style.position = 'relative';
                element.appendChild(glare);
            }
            
            element.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, element));
            element.addEventListener('mousemove', (e) => this.handleMouseMove(e, element));
            element.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, element));
        });
    }
    
    handleMouseEnter(e, element) {
        element.style.transition = 'none';
    }
    
    handleMouseMove(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        const tiltX = percentY * this.options.maxTilt;
        const tiltY = -percentX * this.options.maxTilt;
        
        element.style.transform = `
            perspective(${this.options.perspective}px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale(${this.options.scale})
        `;
        
        if (this.options.glare) {
            const glare = element.querySelector('.tilt-glare');
            if (glare) {
                const glareOpacity = Math.abs(percentX) * this.options.maxGlare;
                glare.style.opacity = glareOpacity;
                glare.style.background = `linear-gradient(${Math.atan2(percentY, percentX) * (180 / Math.PI) + 90}deg, rgba(255,255,255,0.3), transparent)`;
            }
        }
    }
    
    handleMouseLeave(e, element) {
        element.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.transform = `
            perspective(${this.options.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            scale(1)
        `;
        
        if (this.options.glare) {
            const glare = element.querySelector('.tilt-glare');
            if (glare) {
                glare.style.opacity = '0';
            }
        }
    }
}

// Initialize 3D tilt for various elements
document.addEventListener('DOMContentLoaded', () => {
    new TiltEffect('.stat-card', { maxTilt: 10, scale: 1.05 });
    new TiltEffect('.service-card', { maxTilt: 8, scale: 1.03 });
    new TiltEffect('.project-card', { maxTilt: 10, scale: 1.02 });
    new TiltEffect('.skill-tile', { maxTilt: 15, scale: 1.1 });
});

// ============================================
// MAGNETIC CURSOR EFFECT
// ============================================
const cursorDot = document.querySelector('.cursor-dot');

if (cursorDot) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        cursorDot.style.left = `${cursorX}px`;
        cursorDot.style.top = `${cursorY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Magnetic effect on interactive elements
    document.querySelectorAll('a, button, .btn, .filter-btn, .overlay-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('active');
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('active');
        });
        
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

// ============================================
// HERO IMAGE PARALLAX WITH MOUSE
// ============================================
const heroImage = document.querySelector('.blob-shape');

if (heroImage) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        
        heroImage.style.transform = `translate(${x}px, ${y}px) rotateY(${x * 0.5}deg) rotateX(${-y * 0.5}deg)`;
    });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');

        const bars = mobileMenu.querySelectorAll('.bar');
        if (mobileMenu.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = '';
            bars[1].style.opacity = '';
            bars[2].style.transform = '';
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            const bars = mobileMenu.querySelectorAll('.bar');
            bars[0].style.transform = '';
            bars[1].style.opacity = '';
            bars[2].style.transform = '';
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (navbar) {
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    lastScroll = currentScroll;
});

// ============================================
// TYPING EFFECT
// ============================================
const typedTextElement = document.getElementById('typed-text');
if (typedTextElement) {
    const textArray = [
        'Python Full-Stack Developer',
        'Backend Specialist',
        'Web Developer',
        'Problem Solver'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        const currentText = textArray[textIndex];

        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typingSpeed = 500;
        }

        setTimeout(typeText, typingSpeed);
    }

    setTimeout(typeText, 1000);
}

// ============================================
// PROJECT FILTERING
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('successModal');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        let isValid = true;
        clearFormErrors();

        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();

        if (name.length < 3) {
            showFormError('name', 'Name must be at least 3 characters');
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showFormError('email', 'Enter a valid email address');
            isValid = false;
        }

        if (message.length < 10) {
            showFormError('message', 'Message must be at least 10 characters');
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
            return;
        }

        setTimeout(() => {
            if (successModal) {
                successModal.classList.add('show');
                createConfetti();
                contactForm.reset();

                setTimeout(() => {
                    successModal.classList.remove('show');
                }, 3000);
            }
        }, 800);
    });
}

function showFormError(fieldName, message) {
    const input = contactForm.querySelector(`[name="${fieldName}"]`);
    const group = input.closest('.form-group');
    group.classList.add('error');
    const errorMsg = group.querySelector('.error-msg');
    if (errorMsg) {
        errorMsg.innerText = message;
    }
}

function clearFormErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const msg = group.querySelector('.error-msg');
        if (msg) msg.innerText = '';
    });
}

// ============================================
// CONFETTI EFFECT
// ============================================
function createConfetti() {
    const colors = ['#00D9FF', '#7B2FFF', '#FF006E', '#00FFA3', '#FFD600'];
    const confettiCount = 80;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '12px';
        confetti.style.height = '12px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-20px';
        confetti.style.opacity = '1';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.zIndex = '10001';
        confetti.style.pointerEvents = 'none';
        confetti.style.boxShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`;

        document.body.appendChild(confetti);

        const duration = Math.random() * 3 + 2;
        const angle = Math.random() * 360;
        const distance = Math.random() * 400 + 200;

        confetti.animate([
            {
                transform: 'translate(0, 0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${window.innerHeight + 100}px) rotate(${angle * 5}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

// ============================================
// NAVBAR ACTIVE LINK HIGHLIGHT
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============================================
// FLOATING LABELS
// ============================================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    if (input.value) {
        input.setAttribute('placeholder', ' ');
    }

    input.addEventListener('focus', () => {
        input.setAttribute('placeholder', ' ');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.removeAttribute('placeholder');
        }
    });
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
let scrollToTopBtn = document.querySelector('.scroll-to-top');

if (!scrollToTopBtn) {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);
}

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ============================================
// THEME TOGGLE
// ============================================
const toggle = document.getElementById("theme-toggle");
const icon = toggle?.querySelector("i");

if (toggle && icon) {
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }

        toggle.classList.add("spin");
        setTimeout(() => toggle.classList.remove("spin"), 300);
    });
}

// ============================================
// PAGE LOAD ANIMATION
// ============================================
window.addEventListener('load', () => {
    document.body.classList.remove('loading');

    document.querySelectorAll('[data-aos]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            el.classList.add('aos-animate');
        }
    });
});

// ============================================
// PERFORMANCE: REDUCE ANIMATIONS ON LOW FPS
// ============================================
let lastTime = performance.now();
let fps = 60;

function measureFPS() {
    const currentTime = performance.now();
    fps = 1000 / (currentTime - lastTime);
    lastTime = currentTime;
    
    if (fps < 30) {
        document.body.classList.add('reduce-motion');
    } else {
        document.body.classList.remove('reduce-motion');
    }
    
    requestAnimationFrame(measureFPS);
}

measureFPS();


