// ============================================
// ULTRA-ADVANCED PORTFOLIO JAVASCRIPT
// Water Flow Simulation, Liquid Physics & 3D Effects
// ============================================

// ============================================
// ADVANCED WATER FLOW SIMULATION
// ============================================
class WaterFlowSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.waterParticles = [];
        this.waves = [];
        this.droplets = [];
        this.isActive = false;
        this.animationId = null;
        
        this.resize();
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = this.canvas.width = rect.width;
        this.height = this.canvas.height = rect.height;
    }
    
    createWaterFlow(x, y) {
        // Create flowing water particles
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            
            this.waterParticles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                size: Math.random() * 4 + 2,
                color: Math.random() > 0.5 ? 
                    `rgba(0, 217, 255, ${Math.random() * 0.8 + 0.2})` : 
                    `rgba(123, 47, 255, ${Math.random() * 0.8 + 0.2})`
            });
        }
        
        // Create ripple waves
        this.waves.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: Math.min(this.width, this.height) * 0.6,
            alpha: 1,
            speed: 4,
            thickness: 4
        });
        
        // Create droplets
        for (let i = 0; i < 15; i++) {
            this.droplets.push({
                x: x + (Math.random() - 0.5) * 50,
                y: y + (Math.random() - 0.5) * 50,
                vx: (Math.random() - 0.5) * 6,
                vy: Math.random() * -8 - 4,
                gravity: 0.4,
                life: 1,
                size: Math.random() * 3 + 1
            });
        }
        
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw and update waves with gradient
        this.waves = this.waves.filter(wave => {
            wave.radius += wave.speed;
            wave.alpha = 1 - (wave.radius / wave.maxRadius);
            wave.thickness = 4 * wave.alpha;
            
            if (wave.alpha > 0) {
                // Outer wave
                const gradient = this.ctx.createRadialGradient(
                    wave.x, wave.y, wave.radius * 0.9,
                    wave.x, wave.y, wave.radius
                );
                gradient.addColorStop(0, `rgba(0, 217, 255, ${wave.alpha * 0.7})`);
                gradient.addColorStop(0.5, `rgba(123, 47, 255, ${wave.alpha * 0.5})`);
                gradient.addColorStop(1, `rgba(255, 0, 110, ${wave.alpha * 0.3})`);
                
                this.ctx.beginPath();
                this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = wave.thickness;
                this.ctx.stroke();
                
                // Inner glow
                this.ctx.beginPath();
                this.ctx.arc(wave.x, wave.y, wave.radius * 0.5, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 217, 255, ${wave.alpha * 0.15})`;
                this.ctx.fill();
                
                // Shimmer effect
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2 + wave.radius * 0.1;
                    const shimmerX = wave.x + Math.cos(angle) * wave.radius;
                    const shimmerY = wave.y + Math.sin(angle) * wave.radius;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(shimmerX, shimmerY, 2, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${wave.alpha * 0.6})`;
                    this.ctx.fill();
                }
                
                return true;
            }
            return false;
        });
        
        // Draw and update water particles
        this.waterParticles = this.waterParticles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.15; // Gravity
            particle.vx *= 0.98; // Friction
            particle.vy *= 0.98;
            particle.life -= 0.02;
            
            if (particle.life > 0) {
                // Draw water particle with glow
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
                
                // Add trail effect
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(particle.x - particle.vx * 2, particle.y - particle.vy * 2);
                this.ctx.strokeStyle = particle.color.replace(/[\d.]+\)$/g, `${particle.life * 0.3})`);
                this.ctx.lineWidth = particle.size * 0.5;
                this.ctx.stroke();
                
                return true;
            }
            return false;
        });
        
        // Draw and update droplets
        this.droplets = this.droplets.filter(droplet => {
            droplet.x += droplet.vx;
            droplet.y += droplet.vy;
            droplet.vy += droplet.gravity;
            droplet.life -= 0.015;
            
            if (droplet.life > 0 && droplet.y < this.height) {
                // Droplet shape with motion blur
                this.ctx.beginPath();
                this.ctx.ellipse(
                    droplet.x, droplet.y, 
                    droplet.size, 
                    droplet.size * (1 + Math.abs(droplet.vy) * 0.2),
                    Math.atan2(droplet.vy, droplet.vx),
                    0, Math.PI * 2
                );
                this.ctx.fillStyle = `rgba(0, 217, 255, ${droplet.life * 0.7})`;
                this.ctx.fill();
                
                // Highlight
                this.ctx.beginPath();
                this.ctx.arc(droplet.x - droplet.size * 0.3, droplet.y - droplet.size * 0.3, droplet.size * 0.4, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${droplet.life * 0.4})`;
                this.ctx.fill();
                
                return true;
            }
            return false;
        });
        
        if (this.waterParticles.length > 0 || this.waves.length > 0 || this.droplets.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.isActive = false;
        }
    }
    
    clear() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.waterParticles = [];
        this.waves = [];
        this.droplets = [];
        this.isActive = false;
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}

// ============================================
// FLOATING PARTICLE SYSTEM FOR CARDS
// ============================================
class FloatingParticles {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.particles = [];
        this.isActive = false;
        this.animationId = null;
        
        this.resize();
        this.init();
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = this.canvas.width = rect.width;
        this.height = this.canvas.height = rect.height;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                size: Math.random() * 3 + 1,
                color: Math.random() > 0.5 ? 
                    `rgba(0, 217, 255, ${Math.random() * 0.6 + 0.2})` : 
                    `rgba(123, 47, 255, ${Math.random() * 0.6 + 0.2})`,
                life: Math.random()
            });
        }
    }
    
    start() {
        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life += 0.01;
            
            // Sine wave motion
            particle.vx += Math.sin(particle.life) * 0.02;
            particle.vy += Math.cos(particle.life) * 0.02;
            
            // Boundary check
            if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;
            
            // Draw particle with glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Connect nearby particles
            this.particles.slice(i + 1).forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${0.3 * (1 - distance / 80)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        if (this.isActive) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }
    
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        setTimeout(() => {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }, 500);
    }
}

// Initialize water flow and particles for service cards
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // Create water canvas
        const waterCanvas = document.createElement('canvas');
        waterCanvas.className = 'water-canvas';
        card.insertBefore(waterCanvas, card.firstChild);
        
        const waterFlow = new WaterFlowSimulation(waterCanvas);
        
        // Create particle canvas
        const particleCanvas = document.createElement('canvas');
        particleCanvas.className = 'particle-canvas';
        card.insertBefore(particleCanvas, card.firstChild);
        
        const floatingParticles = new FloatingParticles(particleCanvas);
        
        let flowInterval;
        
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            waterFlow.createWaterFlow(x, y);
            floatingParticles.start();
        });
        
        card.addEventListener('mousemove', (e) => {
            clearInterval(flowInterval);
            flowInterval = setInterval(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                waterFlow.createWaterFlow(x, y);
            }, 200);
        });
        
        card.addEventListener('mouseleave', () => {
            clearInterval(flowInterval);
            setTimeout(() => {
                waterFlow.clear();
                floatingParticles.stop();
            }, 1000);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            waterFlow.resize();
            floatingParticles.resize();
            floatingParticles.init();
        });
    });
});

// ============================================
// HERO PARTICLE SYSTEM WITH 3D DEPTH
// ============================================
class ParticleSystem3D {
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
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 12000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 100, // Depth
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? 'rgba(0, 217, 255, 0.7)' : 'rgba(123, 47, 255, 0.7)',
                life: Math.random() * Math.PI * 2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, i) => {
            // Update position with 3D movement
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;
            particle.life += 0.02;
            
            // 3D perspective effect
            const scale = 100 / (100 + particle.z);
            const size = particle.radius * scale;
            const alpha = scale;
            
            // Mouse interaction with depth
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.vx -= (dx / distance) * force * 0.3 * scale;
                particle.vy -= (dy / distance) * force * 0.3 * scale;
            }
            
            // Boundary check with depth
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            if (particle.z < 0 || particle.z > 100) particle.vz *= -1;
            
            // Damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            particle.vz *= 0.99;
            
            // Draw particle with depth-based glow
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, size * 3
            );
            
            const colorWithAlpha = particle.color.replace('0.7', alpha * 0.7);
            gradient.addColorStop(0, colorWithAlpha);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // Pulsing effect
            const pulse = Math.sin(particle.life) * 0.5 + 0.5;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size * (1 + pulse * 0.5), 0, Math.PI * 2);
            this.ctx.strokeStyle = particle.color.replace('0.7', alpha * 0.3 * pulse);
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // Draw connections with depth consideration
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const dz = particle.z - otherParticle.z;
                const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz);
                const distance2D = Math.sqrt(dx * dx + dy * dy);
                
                if (distance2D < 120 && Math.abs(dz) < 30) {
                    const avgScale = (scale + (100 / (100 + otherParticle.z))) / 2;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${0.25 * (1 - distance2D / 120) * avgScale})`;
                    this.ctx.lineWidth = 1 * avgScale;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize 3D particles
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem3D('particles-canvas');
});

// ============================================
// ADVANCED 3D TILT EFFECT
// ============================================
class TiltEffect3D {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.options = {
            maxTilt: options.maxTilt || 15,
            perspective: options.perspective || 1000,
            scale: options.scale || 1.05,
            speed: options.speed || 400,
            glare: options.glare !== false,
            maxGlare: options.maxGlare || 0.3,
            depth: options.depth || 50
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
                glare.style.background = 'linear-gradient(45deg, rgba(255,255,255,0.2), transparent)';
                glare.style.opacity = '0';
                glare.style.pointerEvents = 'none';
                glare.style.transition = `opacity ${this.options.speed}ms ease`;
                element.style.position = 'relative';
                element.appendChild(glare);
            }
            
            // Add depth layers for children
            const children = element.querySelectorAll('*');
            children.forEach((child, index) => {
                const depth = Math.min(index * 10, this.options.depth);
                child.style.transform = `translateZ(${depth}px)`;
                child.style.transformStyle = 'preserve-3d';
            });
            
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
        
        // Enhanced 3D transform with perspective and depth
        element.style.transform = `
            perspective(${this.options.perspective}px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            translateZ(${this.options.depth}px)
            scale(${this.options.scale})
        `;
        
        if (this.options.glare) {
            const glare = element.querySelector('.tilt-glare');
            if (glare) {
                const glareOpacity = Math.sqrt(percentX * percentX + percentY * percentY) * this.options.maxGlare;
                glare.style.opacity = glareOpacity;
                const angle = Math.atan2(percentY, percentX) * (180 / Math.PI) + 90;
                glare.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,0.4), transparent 70%)`;
            }
        }
    }
    
    handleMouseLeave(e, element) {
        element.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        element.style.transform = `
            perspective(${this.options.perspective}px)
            rotateX(0deg)
            rotateY(0deg)
            translateZ(0px)
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
// ============================================
// ULTRA LIQUID MAGNETIC CURSOR (UPGRADED)
// ============================================

class LiquidCursor {

    constructor() {

        this.dot = document.querySelector('.cursor-dot');

        if (!this.dot) return;

        this.mx = 0;
        this.my = 0;

        this.cx = 0;
        this.cy = 0;

        this.trail = [];
        this.maxTrail = 18;

        // create liquid canvas
        this.canvas = document.createElement('canvas');

        this.canvas.style.cssText = `
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            pointer-events:none;
            z-index:9999;
        `;

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');

        window.addEventListener('mousemove', e => {

            this.mx = e.clientX;
            this.my = e.clientY;

        });

        window.addEventListener('resize', () => {

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

        });

        this.bindMagnetic();

        this.animate();
    }


    bindMagnetic() {

        const targets =
            document.querySelectorAll(
                'a, button, .btn, .filter-btn, .overlay-btn, .service-card, .project-card'
            );

        targets.forEach(el => {

            el.addEventListener('mousemove', e => {

                const rect = el.getBoundingClientRect();

                const x =
                    e.clientX - rect.left - rect.width / 2;

                const y =
                    e.clientY - rect.top - rect.height / 2;

                el.style.transform =
                    `translate(${x * 0.18}px, ${y * 0.18}px)`;

                this.dot.classList.add('active');

            });

            el.addEventListener('mouseleave', () => {

                el.style.transform = '';

                this.dot.classList.remove('active');

            });

        });

    }


    animate() {

        this.cx += (this.mx - this.cx) * 0.14;
        this.cy += (this.my - this.cy) * 0.14;

        this.dot.style.left = this.cx + 'px';
        this.dot.style.top = this.cy + 'px';


        this.trail.push({
            x: this.cx,
            y: this.cy
        });

        if (this.trail.length > this.maxTrail)
            this.trail.shift();


        const ctx = this.ctx;

        ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        for (let i = 0; i < this.trail.length; i++) {

            const p = this.trail[i];

            const t = i / this.trail.length;

            const size = t * 10;

            const alpha = t * 0.5;

            // liquid blob
            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(0,217,255,${alpha})`;

            ctx.fill();


            // glow
            const grad =
                ctx.createRadialGradient(
                    p.x,
                    p.y,
                    0,
                    p.x,
                    p.y,
                    size * 3
                );

            grad.addColorStop(
                0,
                `rgba(0,217,255,${alpha * 0.5})`
            );

            grad.addColorStop(
                1,
                'transparent'
            );

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                size * 3,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = grad;

            ctx.fill();
        }

        requestAnimationFrame(
            () => this.animate()
        );
    }

}


// initialize cursor
document.addEventListener(
    'DOMContentLoaded',
    () => {

        new LiquidCursor();

    }
);


// Initialize 3D tilt for various elements
document.addEventListener('DOMContentLoaded', () => {
    new TiltEffect3D('.stat-card', { maxTilt: 12, scale: 1.08, depth: 60 });
    new TiltEffect3D('.service-card', { maxTilt: 10, scale: 1.05, depth: 70 });
    new TiltEffect3D('.project-card', { maxTilt: 12, scale: 1.05, depth: 50 });
    new TiltEffect3D('.skill-tile', { maxTilt: 18, scale: 1.15, depth: 40 });
});


// ============================================
// HERO IMAGE PARALLAX WITH 3D DEPTH
// ============================================
const heroImage = document.querySelector('.blob-shape');

if (heroImage) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 50;
        const y = (e.clientY / window.innerHeight - 0.5) * 50;
        
        heroImage.style.transform = `
            translate(${x}px, ${y}px) 
            rotateY(${x * 0.5}deg) 
            rotateX(${-y * 0.5}deg)
            translateZ(50px)
        `;
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
// PROJECT FILTERING WITH ANIMATION
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');

            if (filterValue === 'all' || category === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                }, index * 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(20px)';
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
    const confettiCount = 100;

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
// PERFORMANCE OPTIMIZATION
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