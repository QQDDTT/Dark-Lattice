/**
 * Aura Dashboard Main Navigation Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const panels = document.querySelectorAll('.interface-panel');
    const titleEl = document.getElementById('dash-current-title');
    const subtitleEl = document.getElementById('dash-current-subtitle');

    const interfaceConfig = {
        'interface-overview': {
            title: 'Aura Command Center',
            subtitle: 'Real-time Multidimensional Graph Monitoring'
        },
        'interface-matrix': {
            title: 'Core Adjacency Matrix',
            subtitle: 'Visualizing Tensor $\\mathcal{W}$ Slices and Edge Weights'
        },
        'interface-monitoring': {
            title: 'Live Probability Stream',
            subtitle: 'Monitoring Path Selection and Stochastic Transitions'
        },
        'interface-evolution': {
            title: 'Self-Evolution Analysis',
            subtitle: 'Detecting Role Drift and Feedback Collapse Risks'
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('data-target');
            if (!targetId) return;

            e.preventDefault();

            // Update Nav State
            navItems.forEach(ni => ni.classList.remove('active'));
            item.classList.add('active');

            // Update Panels
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === targetId) {
                    panel.classList.add('active');
                }
            });

            // Update Header
            if (interfaceConfig[targetId]) {
                titleEl.textContent = interfaceConfig[targetId].title;
                subtitleEl.textContent = interfaceConfig[targetId].subtitle;
            }

            // Trigger re-init of specific interface logic if needed
            window.dispatchEvent(new CustomEvent('interface-switched', { detail: { targetId } }));
        });
    });
});
