// Global Animation Logic using GSAP

export function initScrollAnimations() {
    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded.');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // 1. Generic Fade-in-up for articles / sections
    const fadeUpElements = document.querySelectorAll('.gsap-fade-up');
    fadeUpElements.forEach((el) => {
        gsap.fromTo(el, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%', // Trigger when top of element hits 85% of viewport
                    toggleActions: 'play none none none' // Play once
                }
            }
        );
    });

    // 2. Simple fade in for sidebars
    const fadeInElements = document.querySelectorAll('.gsap-fade-in');
    fadeInElements.forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                }
            }
        );
    });

    // 3. Staggered tags or list items
    const staggerContainers = document.querySelectorAll('.doc-tags');
    staggerContainers.forEach((container) => {
        const tags = container.querySelectorAll('.gsap-stagger');
        if (tags.length > 0) {
            gsap.fromTo(tags,
                { opacity: 0, scale: 0.8 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 90%'
                    }
                }
            );
        }
    });
}

export function initTOCScrollSpy() {
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -80% 0px', // Trigger when header is in the top 10%-20% of viewport
        threshold: 0
    };

    const tocLinks = document.querySelectorAll('#TableOfContents a');
    if (tocLinks.length === 0) return;

    // Build mapping of id -> link element
    const idToLink = new Map();
    tocLinks.forEach(link => {
        const hash = link.getAttribute('href');
        if (hash && hash.startsWith('#')) {
            const id = hash.substring(1);
            idToLink.set(id, link);
        }
    });

    const headers = document.querySelectorAll('.doc-body h2, .doc-body h3');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all
                tocLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to intersecting id
                const activeLink = idToLink.get(entry.target.id);
                if (activeLink) {
                    activeLink.classList.add('active');
                    // Optional: Smoothly scroll TOC container to keep active link in view
                    activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }, observerOptions);

    headers.forEach(header => observer.observe(header));
}
