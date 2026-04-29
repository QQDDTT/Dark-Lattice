export function initSkillRadar() {
    const container = document.getElementById('skill-radar-container');
    if (!container) return;

    // Dimensions reflecting actual blog content with I18n support
    const skills = [
        { label: container.dataset.labelAgent || 'Agent Logic', value: 92, color: '#3B82F6' },
        { label: container.dataset.labelVision || 'Vision AI', value: 85, color: '#8B5CF6' },
        { label: container.dataset.labelFrontend || 'Frontend UX', value: 95, color: '#06B6D4' },
        { label: container.dataset.labelStability || 'Stability', value: 80, color: '#3B82F6' },
        { label: container.dataset.labelEvolution || 'Evolution', value: 88, color: '#8B5CF6' },
        { label: container.dataset.labelKnowledge || 'Knowledge', value: 75, color: '#06B6D4' }
    ];

    const size = 350;
    const center = size / 2;
    const radius = size * 0.35;
    const angleStep = (Math.PI * 2) / skills.length;

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';
    svg.style.overflow = 'visible';

    // Add Definitions for Gradients and Filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // 1. Radial Gradient for the fill
    const radialGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient');
    radialGradient.setAttribute('id', 'skill-gradient');
    radialGradient.innerHTML = `
        <stop offset="0%" stop-color="rgba(59, 130, 246, 0.6)" />
        <stop offset="100%" stop-color="rgba(59, 130, 246, 0.1)" />
    `;
    defs.appendChild(radialGradient);

    // 2. Glow Filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    filter.innerHTML = `
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
        </feMerge>
    `;
    defs.appendChild(filter);

    svg.appendChild(defs);

    // Helper to get coordinates
    const getCoords = (angle, r) => ({
        x: center + r * Math.cos(angle - Math.PI / 2),
        y: center + r * Math.sin(angle - Math.PI / 2)
    });

    // 1. Draw Grid Lattice (Concentric Hexagons)
    const levels = 5;
    for (let i = 1; i <= levels; i++) {
        const r = (radius / levels) * i;
        const points = skills.map((_, index) => {
            const pos = getCoords(index * angleStep, r);
            return `${pos.x},${pos.y}`;
        }).join(' ');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points);
        polygon.setAttribute('fill', 'none');
        polygon.setAttribute('stroke', i === levels ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.1)');
        polygon.setAttribute('stroke-width', i === levels ? '1.5' : '1');
        if (i === levels) {
             polygon.style.strokeDasharray = '4,4';
        }
        svg.appendChild(polygon);
    }

    // 2. Draw Axis Lines with Dots
    skills.forEach((_, index) => {
        const angle = index * angleStep;
        const pos = getCoords(angle, radius);
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', center);
        line.setAttribute('y1', center);
        line.setAttribute('x2', pos.x);
        line.setAttribute('y2', pos.y);
        line.setAttribute('stroke', 'rgba(148, 163, 184, 0.15)');
        svg.appendChild(line);
    });

    // 3. Draw Skill Polygon Area
    const skillPoints = skills.map((skill, index) => {
        const pos = getCoords(index * angleStep, (radius * skill.value) / 100);
        return `${pos.x},${pos.y}`;
    }).join(' ');

    const skillPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    skillPolygon.setAttribute('points', skillPoints);
    skillPolygon.setAttribute('fill', 'url(#skill-gradient)');
    skillPolygon.setAttribute('stroke', '#3B82F6');
    skillPolygon.setAttribute('stroke-width', '2.5');
    skillPolygon.setAttribute('filter', 'url(#glow)');
    skillPolygon.style.transition = 'all 0.5s ease-in-out';
    svg.appendChild(skillPolygon);

    // 4. Add Vertices (Pulsating Dots)
    skills.forEach((skill, index) => {
        const angle = index * angleStep;
        const pos = getCoords(angle, (radius * skill.value) / 100);
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pos.x);
        circle.setAttribute('cy', pos.y);
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#3B82F6');
        circle.setAttribute('filter', 'url(#glow)');
        
        // Simple scale animation
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'r');
        animate.setAttribute('values', '4;6;4');
        animate.setAttribute('dur', '2s');
        animate.setAttribute('repeatCount', 'indefinite');
        circle.appendChild(animate);
        
        svg.appendChild(circle);
    });

    // 5. Add Labels with Enhanced Typography
    skills.forEach((skill, index) => {
        const angle = index * angleStep;
        const labelPos = getCoords(angle, radius + 30);
        
        // Text Shadow / Backing for legibility
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelPos.x);
        text.setAttribute('y', labelPos.y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#E2E8F0');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-family', 'Inter, sans-serif');
        text.style.textTransform = 'uppercase';
        text.style.letterSpacing = '1px';
        text.textContent = skill.label;
        
        svg.appendChild(text);

        // Optional: Value label
        const value = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        value.setAttribute('x', labelPos.x);
        value.setAttribute('y', labelPos.y + 12);
        value.setAttribute('text-anchor', 'middle');
        value.setAttribute('fill', '#64748B');
        value.setAttribute('font-size', '9');
        value.textContent = `${skill.value}%`;
        svg.appendChild(value);
    });

    container.appendChild(svg);
}
