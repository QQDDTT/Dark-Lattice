import { initHeroScene } from './scene-3d.js';
import { initSkillRadar } from './skill-radar.js';
import { initScrollAnimations, initTOCScrollSpy, initMobileTOC } from './animations.js';

// Central Environment Parameter Detection
window.AppConfig = {
    isMobile: window.matchMedia('(max-width: 1023px)').matches,
    isPortrait: window.matchMedia('(orientation: portrait)').matches
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dark Lattice initialized');
    
    // Listen for mobile/desktop state changes
    const mqlMobile = window.matchMedia('(max-width: 1023px)');
    const mqlPortrait = window.matchMedia('(orientation: portrait)');

    const updateEnv = () => {
        window.AppConfig.isMobile = mqlMobile.matches;
        window.AppConfig.isPortrait = mqlPortrait.matches;
        window.dispatchEvent(new CustomEvent('app:env-change', { 
            detail: { 
                isMobile: mqlMobile.matches,
                isPortrait: mqlPortrait.matches 
            } 
        }));
    };

    mqlMobile.addEventListener('change', updateEnv);
    mqlPortrait.addEventListener('change', updateEnv);


    // Initialize Home Page Hero 3D Scene
    initHeroScene();

    // Initialize Skill Radar
    initSkillRadar();

    // Initialize Global Animations (GSAP)
    initScrollAnimations();

    // Initialize TOC ScrollSpy
    initTOCScrollSpy();

    // Initialize Mobile TOC Toggle
    initMobileTOC();
});

