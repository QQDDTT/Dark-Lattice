export function initSkillRadar() {
    const container = document.getElementById('skill-radar-container');
    if (!container) return;

    const skills = [
        { label: '算法研究', value: 90 },
        { label: '前端工程', value: 85 },
        { label: '后端系统', value: 75 },
        { label: '机器翻译', value: 80 },
        { label: '数据可视化', value: 88 }
    ];

    const size = 300;
    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / skills.length;

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
    svg.style.width = '100%';
    svg.style.height = 'auto';

    // 1. Draw Grid (Pentagons)
    for (let i = 1; i <= 4; i++) {
        const r = (radius / 4) * i;
        const points = skills.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
        }).join(' ');
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points);
        polygon.setAttribute('fill', 'none');
        polygon.setAttribute('stroke', 'rgba(148, 163, 184, 0.1)');
        svg.appendChild(polygon);
    }

    // 2. Draw Axis Lines
    skills.forEach((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', center);
        line.setAttribute('y1', center);
        line.setAttribute('x2', center + radius * Math.cos(angle));
        line.setAttribute('y2', center + radius * Math.sin(angle));
        line.setAttribute('stroke', 'rgba(148, 163, 184, 0.1)');
        svg.appendChild(line);
    });

    // 3. Draw Skill Polygon
    const skillPoints = skills.map((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const r = (radius * skill.value) / 100;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(' ');

    const skillPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    skillPolygon.setAttribute('points', skillPoints);
    skillPolygon.setAttribute('fill', 'rgba(59, 130, 246, 0.2)');
    skillPolygon.setAttribute('stroke', '#3B82F6');
    skillPolygon.setAttribute('stroke-width', '2');
    svg.appendChild(skillPolygon);

    // 4. Add Labels
    skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = center + (radius + 20) * Math.cos(angle);
        const y = center + (radius + 20) * Math.sin(angle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#94A3B8');
        text.setAttribute('font-size', '10');
        text.textContent = skill.label;
        svg.appendChild(text);
    });

    container.appendChild(svg);
}
