// ============================================================
// contact.js — Contact Form Validation & Confetti
// ============================================================

export function initContact() {
    const contactForm  = document.getElementById('contact-form');
    const successModal = document.getElementById('successModal');

    if (!contactForm) return;

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
    const contactForm = document.getElementById('contact-form');
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

        el.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * 80}px, ${window.innerHeight + 40}px) rotate(${angle * 4}deg)`, opacity: 0 }
        ], { duration, easing: 'ease-in' }).onfinish = () => el.remove();
    }
}
