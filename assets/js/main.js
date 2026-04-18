import { initHeroScene } from './scene-3d.js';
import { initSkillRadar } from './skill-radar.js';
import { initScrollAnimations, initTOCScrollSpy } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dark Lattice initialized');
    
    // Initialize Home Page Hero 3D Scene
    initHeroScene();

    // Initialize Skill Radar
    initSkillRadar();

    // Initialize Global Animations (GSAP)
    initScrollAnimations();

    // Initialize TOC ScrollSpy
    initTOCScrollSpy();
});
