/**
 * Interface: Matrix
 * Logic for the Adjacency Matrix visualization.
 */
(() => {
    const initMatrix = () => {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;

        // Clear and rebuild grid
        canvas.innerHTML = '';
        canvas.style.display = 'grid';
        canvas.style.gridTemplateColumns = 'repeat(25, 1fr)';
        
        for (let i = 0; i < 625; i++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            const weight = Math.random();
            cell.style.opacity = weight;
            cell.style.background = `rgba(139, 92, 246, ${weight})`;
            
            cell.addEventListener('mouseenter', () => {
                const source = Math.floor(i / 25);
                const target = i % 25;
                document.getElementById('cell-details').innerHTML = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Source Node:</span>
                        <code style="color: var(--dash-accent);">N-${source.toString().padStart(3, '0')}</code>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Target Node:</span>
                        <code style="color: var(--dash-accent);">N-${target.toString().padStart(3, '0')}</code>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Weight:</span>
                        <code style="color: #10b981;">${weight.toFixed(4)}</code>
                    </div>
                `;
            });

            canvas.appendChild(cell);
        }
    };

    window.addEventListener('interface-switched', (e) => {
        if (e.detail.targetId === 'interface-matrix') {
            initMatrix();
        }
    });

    // Also init if it's the default view
    if (document.getElementById('interface-matrix').classList.contains('active')) {
        initMatrix();
    }
})();
