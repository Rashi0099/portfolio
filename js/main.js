// ============================================================
// main.js — Entry Point
// Imports and initialises all portfolio modules.
// ============================================================

import { initNavbar }       from './navbar.js';
import { initScroll }       from './scroll.js';
import { initSmoothScroll } from './smoothScroll.js';
import { initProjects }     from './projects.js';
import { initContact }      from './contact.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScroll();
    initSmoothScroll();
    initProjects();
    initContact();
});
