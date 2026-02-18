// ============================================
// ULTRA-ADVANCED PORTFOLIO JAVASCRIPT
// ============================================

// ============================================
// ADVANCED WATER FLOW SIMULATION
// ============================================
class WaterFlowSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0; this.height = 0;
        this.waterParticles = []; this.waves = []; this.droplets = [];
        this.isActive = false; this.animationId = null;
        this.resize();
    }
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = this.canvas.width = rect.width;
        this.height = this.canvas.height = rect.height;
    }
    createWaterFlow(x, y) {
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            this.waterParticles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, size: Math.random() * 4 + 2, color: Math.random() > 0.5 ? `rgba(0,217,255,${Math.random()*0.8+0.2})` : `rgba(123,47,255,${Math.random()*0.8+0.2})` });
        }
        this.waves.push({ x, y, radius: 0, maxRadius: Math.min(this.width, this.height) * 0.6, alpha: 1, speed: 4, thickness: 4 });
        for (let i = 0; i < 15; i++) {
            this.droplets.push({ x: x + (Math.random()-0.5)*50, y: y + (Math.random()-0.5)*50, vx: (Math.random()-0.5)*6, vy: Math.random()*-8-4, gravity: 0.4, life: 1, size: Math.random()*3+1 });
        }
        if (!this.isActive) { this.isActive = true; this.animate(); }
    }
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.waves = this.waves.filter(wave => {
            wave.radius += wave.speed; wave.alpha = 1 - (wave.radius / wave.maxRadius); wave.thickness = 4 * wave.alpha;
            if (wave.alpha > 0) {
                const gradient = this.ctx.createRadialGradient(wave.x, wave.y, wave.radius*0.9, wave.x, wave.y, wave.radius);
                gradient.addColorStop(0, `rgba(0,217,255,${wave.alpha*0.7})`);
                gradient.addColorStop(0.5, `rgba(123,47,255,${wave.alpha*0.5})`);
                gradient.addColorStop(1, `rgba(255,0,110,${wave.alpha*0.3})`);
                this.ctx.beginPath(); this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI*2);
                this.ctx.strokeStyle = gradient; this.ctx.lineWidth = wave.thickness; this.ctx.stroke();
                this.ctx.beginPath(); this.ctx.arc(wave.x, wave.y, wave.radius*0.5, 0, Math.PI*2);
                this.ctx.fillStyle = `rgba(0,217,255,${wave.alpha*0.15})`; this.ctx.fill();
                for (let i = 0; i < 8; i++) {
                    const angle = (i/8)*Math.PI*2 + wave.radius*0.1;
                    this.ctx.beginPath(); this.ctx.arc(wave.x+Math.cos(angle)*wave.radius, wave.y+Math.sin(angle)*wave.radius, 2, 0, Math.PI*2);
                    this.ctx.fillStyle = `rgba(255,255,255,${wave.alpha*0.6})`; this.ctx.fill();
                }
                return true;
            }
            return false;
        });
        this.waterParticles = this.waterParticles.filter(p => {
            p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.vx *= 0.98; p.vy *= 0.98; p.life -= 0.02;
            if (p.life > 0) {
                const g = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                g.addColorStop(0, p.color); g.addColorStop(1, 'transparent');
                this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); this.ctx.fillStyle = g; this.ctx.fill();
                this.ctx.beginPath(); this.ctx.moveTo(p.x, p.y); this.ctx.lineTo(p.x-p.vx*2, p.y-p.vy*2);
                this.ctx.strokeStyle = p.color.replace(/[\d.]+\)$/g, `${p.life*0.3})`); this.ctx.lineWidth = p.size*0.5; this.ctx.stroke();
                return true;
            }
            return false;
        });
        this.droplets = this.droplets.filter(d => {
            d.x += d.vx; d.y += d.vy; d.vy += d.gravity; d.life -= 0.015;
            if (d.life > 0 && d.y < this.height) {
                this.ctx.beginPath();
                this.ctx.ellipse(d.x, d.y, d.size, d.size*(1+Math.abs(d.vy)*0.2), Math.atan2(d.vy, d.vx), 0, Math.PI*2);
                this.ctx.fillStyle = `rgba(0,217,255,${d.life*0.7})`; this.ctx.fill();
                this.ctx.beginPath(); this.ctx.arc(d.x-d.size*0.3, d.y-d.size*0.3, d.size*0.4, 0, Math.PI*2);
                this.ctx.fillStyle = `rgba(255,255,255,${d.life*0.4})`; this.ctx.fill();
                return true;
            }
            return false;
        });
        if (this.waterParticles.length > 0 || this.waves.length > 0 || this.droplets.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else { this.isActive = false; }
    }
    clear() {
        if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
        this.waterParticles = []; this.waves = []; this.droplets = [];
        this.isActive = false; this.ctx.clearRect(0, 0, this.width, this.height);
    }
}

// ============================================
// FLOATING PARTICLE SYSTEM FOR SERVICE CARDS
// ============================================
class FloatingParticles {
    constructor(canvas) {
        this.canvas = canvas; this.ctx = canvas.getContext('2d');
        this.width = 0; this.height = 0; this.particles = [];
        this.isActive = false; this.animationId = null;
        this.resize(); this.init();
    }
    resize() { const rect = this.canvas.parentElement.getBoundingClientRect(); this.width = this.canvas.width = rect.width; this.height = this.canvas.height = rect.height; }
    init() {
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({ x: Math.random()*this.width, y: Math.random()*this.height, vx:(Math.random()-0.5)*1, vy:(Math.random()-0.5)*1, size:Math.random()*3+1, color:Math.random()>0.5?`rgba(0,217,255,${Math.random()*0.6+0.2})`:`rgba(123,47,255,${Math.random()*0.6+0.2})`, life:Math.random() });
        }
    }
    start() { if (!this.isActive) { this.isActive = true; this.animate(); } }
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy; p.life += 0.01;
            p.vx += Math.sin(p.life)*0.02; p.vy += Math.cos(p.life)*0.02;
            if (p.x<0||p.x>this.width) p.vx*=-1;
            if (p.y<0||p.y>this.height) p.vy*=-1;
            const g = this.ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*2);
            g.addColorStop(0,p.color); g.addColorStop(1,'transparent');
            this.ctx.beginPath(); this.ctx.arc(p.x,p.y,p.size,0,Math.PI*2); this.ctx.fillStyle=g; this.ctx.fill();
            this.particles.slice(i+1).forEach(o => {
                const dx=p.x-o.x, dy=p.y-o.y, dist=Math.sqrt(dx*dx+dy*dy);
                if (dist<80) {
                    this.ctx.beginPath(); this.ctx.moveTo(p.x,p.y); this.ctx.lineTo(o.x,o.y);
                    this.ctx.strokeStyle=`rgba(0,217,255,${0.3*(1-dist/80)})`; this.ctx.lineWidth=1; this.ctx.stroke();
                }
            });
        });
        if (this.isActive) this.animationId = requestAnimationFrame(() => this.animate());
    }
    stop() {
        this.isActive = false;
        if (this.animationId) { cancelAnimationFrame(this.animationId); this.animationId = null; }
        setTimeout(() => this.ctx.clearRect(0,0,this.width,this.height), 500);
    }
}

// Service card water/particle init
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card').forEach(card => {
        const waterCanvas = document.createElement('canvas');
        waterCanvas.className = 'water-canvas';
        card.insertBefore(waterCanvas, card.firstChild);
        const waterFlow = new WaterFlowSimulation(waterCanvas);

        const particleCanvas = document.createElement('canvas');
        particleCanvas.className = 'particle-canvas';
        card.insertBefore(particleCanvas, card.firstChild);
        const floatingParticles = new FloatingParticles(particleCanvas);

        const borderTop = document.createElement('div');
        borderTop.className = 'service-border-top';
        card.appendChild(borderTop);

        let flowInterval;
        card.addEventListener('mouseenter', e => {
            const rect = card.getBoundingClientRect();
            waterFlow.createWaterFlow(e.clientX-rect.left, e.clientY-rect.top);
            floatingParticles.start();
        });
        card.addEventListener('mousemove', e => {
            clearInterval(flowInterval);
            flowInterval = setInterval(() => {
                const rect = card.getBoundingClientRect();
                waterFlow.createWaterFlow(e.clientX-rect.left, e.clientY-rect.top);
            }, 200);
        });
        card.addEventListener('mouseleave', () => {
            clearInterval(flowInterval);
            setTimeout(() => { waterFlow.clear(); floatingParticles.stop(); }, 1000);
        });
        window.addEventListener('resize', () => { waterFlow.resize(); floatingParticles.resize(); floatingParticles.init(); });
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
        this.particles = []; this.mouseX = 0; this.mouseY = 0;
        const heroSection = document.querySelector('.hero');
        if (heroSection) { heroSection.style.position = 'relative'; heroSection.insertBefore(this.canvas, heroSection.firstChild); }
        this.resize(); this.init(); this.animate();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', e => { this.mouseX = e.clientX; this.mouseY = e.clientY; });
    }
    resize() {
        const hero = document.querySelector('.hero');
        if (hero) {
            this.canvas.width = hero.offsetWidth; this.canvas.height = hero.offsetHeight;
            this.canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
        }
    }
    init() {
        this.particles = [];
        const count = Math.floor((this.canvas.width * this.canvas.height) / 12000);
        for (let i = 0; i < count; i++) {
            this.particles.push({ x:Math.random()*this.canvas.width, y:Math.random()*this.canvas.height, z:Math.random()*100, vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5, vz:(Math.random()-0.5)*0.3, radius:Math.random()*2+1, color:Math.random()>0.5?'rgba(0,217,255,0.7)':'rgba(123,47,255,0.7)', life:Math.random()*Math.PI*2 });
        }
    }
    animate() {
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.particles.forEach((p,i) => {
            p.x+=p.vx; p.y+=p.vy; p.z+=p.vz; p.life+=0.02;
            const scale=100/(100+p.z), size=p.radius*scale, alpha=scale;
            const dx=this.mouseX-p.x, dy=this.mouseY-p.y, dist=Math.sqrt(dx*dx+dy*dy);
            if (dist<150) { const f=(150-dist)/150; p.vx-=(dx/dist)*f*0.3*scale; p.vy-=(dy/dist)*f*0.3*scale; }
            if (p.x<0||p.x>this.canvas.width) p.vx*=-1;
            if (p.y<0||p.y>this.canvas.height) p.vy*=-1;
            if (p.z<0||p.z>100) p.vz*=-1;
            p.vx*=0.99; p.vy*=0.99; p.vz*=0.99;
            const g=this.ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*3);
            g.addColorStop(0,p.color.replace('0.7',alpha*0.7)); g.addColorStop(1,'transparent');
            this.ctx.beginPath(); this.ctx.arc(p.x,p.y,size,0,Math.PI*2); this.ctx.fillStyle=g; this.ctx.fill();
            const pulse=Math.sin(p.life)*0.5+0.5;
            this.ctx.beginPath(); this.ctx.arc(p.x,p.y,size*(1+pulse*0.5),0,Math.PI*2);
            this.ctx.strokeStyle=p.color.replace('0.7',alpha*0.3*pulse); this.ctx.lineWidth=1; this.ctx.stroke();
            this.particles.slice(i+1).forEach(o => {
                const dx=p.x-o.x, dy=p.y-o.y, dz=p.z-o.z;
                const d2=Math.sqrt(dx*dx+dy*dy);
                if (d2<120&&Math.abs(dz)<30) {
                    const as=(scale+(100/(100+o.z)))/2;
                    this.ctx.beginPath(); this.ctx.strokeStyle=`rgba(0,217,255,${0.25*(1-d2/120)*as})`; this.ctx.lineWidth=1*as;
                    this.ctx.moveTo(p.x,p.y); this.ctx.lineTo(o.x,o.y); this.ctx.stroke();
                }
            });
        });
        requestAnimationFrame(() => this.animate());
    }
}
document.addEventListener('DOMContentLoaded', () => { new ParticleSystem3D('particles-canvas'); });

// ============================================
// ADVANCED 3D TILT EFFECT (stat-card, service-card, skill-tile only)
// ============================================
class TiltEffect3D {
    constructor(selector, options = {}) {
        this.elements = document.querySelectorAll(selector);
        this.options = { maxTilt:options.maxTilt||15, perspective:options.perspective||1000, scale:options.scale||1.05, speed:options.speed||400, glare:options.glare!==false, maxGlare:options.maxGlare||0.3, depth:options.depth||50 };
        this.init();
    }
    init() {
        this.elements.forEach(el => {
            el.style.transformStyle = 'preserve-3d';
            el.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.4,0,0.2,1)`;
            if (this.options.glare) {
                const glare = document.createElement('div');
                glare.className = 'tilt-glare';
                Object.assign(glare.style, { position:'absolute', top:'0', left:'0', width:'100%', height:'100%', borderRadius:'inherit', background:'linear-gradient(45deg,rgba(255,255,255,0.2),transparent)', opacity:'0', pointerEvents:'none', transition:`opacity ${this.options.speed}ms ease` });
                el.style.position = 'relative'; el.appendChild(glare);
            }
            el.addEventListener('mouseenter', e => this.handleEnter(e, el));
            el.addEventListener('mousemove', e => this.handleMove(e, el));
            el.addEventListener('mouseleave', e => this.handleLeave(e, el));
        });
    }
    handleEnter(e, el) { el.style.transition = 'none'; }
    handleMove(e, el) {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX-rect.left-rect.width/2)/(rect.width/2);
        const py = (e.clientY-rect.top-rect.height/2)/(rect.height/2);
        el.style.transform = `perspective(${this.options.perspective}px) rotateX(${py*this.options.maxTilt}deg) rotateY(${-px*this.options.maxTilt}deg) translateZ(${this.options.depth}px) scale(${this.options.scale})`;
        if (this.options.glare) {
            const glare = el.querySelector('.tilt-glare');
            if (glare) { const op=Math.sqrt(px*px+py*py)*this.options.maxGlare; glare.style.opacity=op; glare.style.background=`linear-gradient(${Math.atan2(py,px)*(180/Math.PI)+90}deg,rgba(255,255,255,0.4),transparent 70%)`; }
        }
    }
    handleLeave(e, el) {
        el.style.transition = `transform ${this.options.speed}ms cubic-bezier(0.4,0,0.2,1)`;
        el.style.transform = `perspective(${this.options.perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)`;
        if (this.options.glare) { const g = el.querySelector('.tilt-glare'); if (g) g.style.opacity = '0'; }
    }
}

// ============================================
// ULTRA LIQUID MAGNETIC CURSOR
// ============================================
class LiquidCursor {
    constructor() {
        this.dot = document.querySelector('.cursor-dot');
        if (!this.dot) return;
        this.mx = 0; this.my = 0; this.cx = 0; this.cy = 0;
        this.trail = []; this.maxTrail = 18;
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener('mousemove', e => { this.mx = e.clientX; this.my = e.clientY; });
        window.addEventListener('resize', () => { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; });
        this.bindMagnetic(); this.animate();
    }
    bindMagnetic() {
        document.querySelectorAll('a, button, .btn, .filter-btn, .overlay-btn, .service-card').forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX-rect.left-rect.width/2, y = e.clientY-rect.top-rect.height/2;
                el.style.transform = `translate(${x*0.18}px,${y*0.18}px)`;
                this.dot.classList.add('active');
            });
            el.addEventListener('mouseleave', () => { el.style.transform = ''; this.dot.classList.remove('active'); });
        });
    }
    animate() {
        this.cx += (this.mx-this.cx)*0.14; this.cy += (this.my-this.cy)*0.14;
        this.dot.style.left = this.cx+'px'; this.dot.style.top = this.cy+'px';
        this.trail.push({x:this.cx,y:this.cy});
        if (this.trail.length > this.maxTrail) this.trail.shift();
        const ctx = this.ctx;
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        for (let i = 0; i < this.trail.length; i++) {
            const p = this.trail[i], t = i/this.trail.length, size = t*10, alpha = t*0.5;
            ctx.beginPath(); ctx.arc(p.x,p.y,size,0,Math.PI*2); ctx.fillStyle=`rgba(0,217,255,${alpha})`; ctx.fill();
            const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*3);
            g.addColorStop(0,`rgba(0,217,255,${alpha*0.5})`); g.addColorStop(1,'transparent');
            ctx.beginPath(); ctx.arc(p.x,p.y,size*3,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        }
        requestAnimationFrame(() => this.animate());
    }
}
document.addEventListener('DOMContentLoaded', () => { new LiquidCursor(); });

// Init tilt — exclude project-card (handled separately below)
document.addEventListener('DOMContentLoaded', () => {
    new TiltEffect3D('.stat-card', { maxTilt:12, scale:1.08, depth:60 });
    new TiltEffect3D('.service-card', { maxTilt:10, scale:1.05, depth:70 });
    new TiltEffect3D('.skill-tile', { maxTilt:18, scale:1.15, depth:40 });
});

// ============================================
// PROJECT CARD — PREMIUM HOVER INTERACTIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const colors = ['#00D9FF','#7B2FFF','#FF006E','#00FFA3','#ffffff'];

    document.querySelectorAll('.project-card').forEach(card => {
        const spotlight = card.querySelector('.card-spotlight');

        // Cursor spotlight + 3-D tilt on mousemove
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width)  * 100;
            const y = ((e.clientY - r.top)  / r.height) * 100;

            if (spotlight) {
                spotlight.style.setProperty('--mx', x + '%');
                spotlight.style.setProperty('--my', y + '%');
            }

            const tX = ((y - 50) / 50) * 7;
            const tY = ((x - 50) / 50) * -7;
            card.style.transform = `translateY(-14px) scale(1.025) perspective(900px) rotateX(${tX}deg) rotateY(${tY}deg)`;
        });

        // Reset on leave
        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'transform .55s cubic-bezier(.23,1,.32,1), box-shadow .45s ease';
        });

        // Particle burst on enter
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
            spawnParticles(card, colors);
        });
    });

    function spawnParticles(card, colors) {
        for (let i = 0; i < 12; i++) {
            const p     = document.createElement('div');
            p.className = 'card-particle';
            const angle = (i / 12) * Math.PI * 2;
            const dist  = 45 + Math.random() * 55;
            const c     = colors[i % colors.length];
            p.style.cssText = `
                left:${25 + Math.random()*50}%;
                top:${25 + Math.random()*50}%;
                background:${c};
                box-shadow:0 0 7px ${c};
                --tx:${Math.cos(angle)*dist}px;
                --ty:${Math.sin(angle)*dist}px;
                animation-delay:${i * 0.03}s;
            `;
            card.appendChild(p);
            setTimeout(() => p.remove(), 820);
        }
    }
});

// ============================================
// HERO IMAGE PARALLAX
// ============================================
const heroImage = document.querySelector('.blob-shape');
if (heroImage) {
    window.addEventListener('mousemove', e => {
        const x = (e.clientX/window.innerWidth-0.5)*50;
        const y = (e.clientY/window.innerHeight-0.5)*50;
        heroImage.style.transform = `translate(${x}px,${y}px) rotateY(${x*0.5}deg) rotateX(${-y*0.5}deg) translateZ(50px)`;
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
            bars[0].style.transform = 'rotate(-45deg) translate(-5px,6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px,-6px)';
        } else { bars[0].style.transform=''; bars[1].style.opacity=''; bars[2].style.transform=''; }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active'); navMenu.classList.remove('active');
            const bars = mobileMenu.querySelectorAll('.bar');
            bars[0].style.transform=''; bars[1].style.opacity=''; bars[2].style.transform='';
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    });
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const st = document.documentElement.scrollTop;
    const sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (progressBar) progressBar.style.width = (st/sh*100)+'%';
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (navbar) { navbar.classList[window.pageYOffset > 50 ? 'add' : 'remove']('scrolled'); }
});

// ============================================
// TYPING EFFECT
// ============================================
const typedTextElement = document.getElementById('typed-text');
if (typedTextElement) {
    const textArray = ['Python Full-Stack Developer','Backend Specialist','Web Developer','Problem Solver'];
    let ti=0, ci=0, isDeleting=false, typingSpeed=100;
    function typeText() {
        const cur = textArray[ti];
        typedTextElement.textContent = isDeleting ? cur.substring(0,ci-1) : cur.substring(0,ci+1);
        isDeleting ? ci-- : ci++;
        typingSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && ci===cur.length) { isDeleting=true; typingSpeed=2000; }
        else if (isDeleting && ci===0) { isDeleting=false; ti=(ti+1)%textArray.length; typingSpeed=500; }
        setTimeout(typeText, typingSpeed);
    }
    setTimeout(typeText, 1000);
}

// ============================================
// PROJECT FILTERING
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        const filter = button.getAttribute('data-filter');
        projectCards.forEach((card, i) => {
            const cat = card.getAttribute('data-category');
            const show = filter==='all' || cat===filter;
            if (show) {
                card.style.display = 'block';
                setTimeout(() => { card.style.opacity='1'; card.style.transform='scale(1) translateY(0)'; }, i*60);
            } else {
                card.style.opacity='0'; card.style.transform='scale(0.95) translateY(20px)';
                setTimeout(() => { card.style.display='none'; }, 320);
            }
        });
    });
});

// ============================================
// CONTACT FORM
// ============================================
const contactForm  = document.getElementById('contact-form');
const successModal = document.getElementById('successModal');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        let isValid = true;
        clearFormErrors();
        const name=contactForm.name.value.trim(), email=contactForm.email.value.trim(), message=contactForm.message.value.trim();
        if (name.length<3) { showFormError('name','Name must be at least 3 characters'); isValid=false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFormError('email','Enter a valid email address'); isValid=false; }
        if (message.length<10) { showFormError('message','Message must be at least 10 characters'); isValid=false; }
        if (!isValid) { e.preventDefault(); return; }
        setTimeout(() => {
            if (successModal) { successModal.classList.add('show'); createConfetti(); contactForm.reset(); setTimeout(()=>successModal.classList.remove('show'),3000); }
        }, 800);
    });
}
function showFormError(field, msg) {
    const input = contactForm.querySelector(`[name="${field}"]`);
    const group = input.closest('.form-group');
    group.classList.add('error');
    const em = group.querySelector('.error-msg');
    if (em) em.innerText = msg;
}
function clearFormErrors() {
    document.querySelectorAll('.form-group').forEach(g => { g.classList.remove('error'); const m=g.querySelector('.error-msg'); if(m) m.innerText=''; });
}

// ============================================
// CONFETTI
// ============================================
function createConfetti() {
    const colors=['#00D9FF','#7B2FFF','#FF006E','#00FFA3','#FFD600'];
    for (let i=0;i<100;i++) {
        const el=document.createElement('div');
        const c=colors[Math.floor(Math.random()*colors.length)];
        Object.assign(el.style,{position:'fixed',width:'12px',height:'12px',backgroundColor:c,left:Math.random()*100+'%',top:'-20px',opacity:'1',borderRadius:Math.random()>0.5?'50%':'0',zIndex:'10001',pointerEvents:'none',boxShadow:`0 0 10px ${c}`});
        document.body.appendChild(el);
        const dur=Math.random()*3+2, angle=Math.random()*360, dist=Math.random()*400+200;
        el.animate([{transform:'translate(0,0) rotate(0deg)',opacity:1},{transform:`translate(${Math.cos(angle)*dist}px,${window.innerHeight+100}px) rotate(${angle*5}deg)`,opacity:0}],{duration:dur*1000,easing:'cubic-bezier(0.25,0.46,0.45,0.94)'});
        setTimeout(()=>el.remove(),dur*1000);
    }
}

// ============================================
// NAVBAR ACTIVE LINK
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current='';
    sections.forEach(s => { if (window.pageYOffset >= s.offsetTop-150) current=s.getAttribute('id'); });
    navLinks.forEach(l => { l.classList.remove('active'); if (l.getAttribute('href')===`#${current}`) l.classList.add('active'); });
});

// ============================================
// FLOATING LABELS
// ============================================
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    if (input.value) input.setAttribute('placeholder',' ');
    input.addEventListener('focus', () => input.setAttribute('placeholder',' '));
    input.addEventListener('blur',  () => { if (!input.value) input.removeAttribute('placeholder'); });
});

// ============================================
// SCROLL TO TOP
// ============================================
let scrollToTopBtn = document.querySelector('.scroll-to-top');
if (!scrollToTopBtn) {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);
}
window.addEventListener('scroll', () => { scrollToTopBtn.classList[window.pageYOffset>300?'add':'remove']('visible'); });
scrollToTopBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

// ============================================
// SCROLL REVEAL (AOS)
// ============================================
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); observer.unobserve(e.target); } });
}, { threshold:0.15, rootMargin:'0px 0px -80px 0px' });
document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// ============================================
// THEME TOGGLE
// ============================================
const toggle = document.getElementById('theme-toggle');
const icon   = toggle?.querySelector('i');
if (toggle && icon) {
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        icon.classList[document.body.classList.contains('dark')?'replace':'replace']('fa-moon','fa-sun');
        if (document.body.classList.contains('dark')) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        else { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        toggle.classList.add('spin'); setTimeout(()=>toggle.classList.remove('spin'),300);
    });
}

// ============================================
// PAGE LOAD
// ============================================
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    document.querySelectorAll('[data-aos]').forEach(el => { if (el.getBoundingClientRect().top<window.innerHeight) el.classList.add('aos-animate'); });
});

// ============================================
// PERFORMANCE / FPS MONITOR
// ============================================
let lastTime = performance.now();
function measureFPS() {
    const now = performance.now();
    const fps = 1000/(now-lastTime);
    lastTime = now;
    document.body.classList[fps<30?'add':'remove']('reduce-motion');
    requestAnimationFrame(measureFPS);
}
measureFPS();