/**
 * Interface: Monitoring
 * Logic for real-time flow and log streaming.
 */
(() => {
    let intervalId = null;

    const startStreaming = () => {
        const logStream = document.getElementById('log-stream');
        if (!logStream) return;

        const logs = [
            'INFO: Calculating projection $P(\\mathcal{W}, \\alpha)$...',
            'DEBUG: Alpha update: role_architect=0.85',
            'SUCCESS: Node [B-12] selected with p=0.92',
            'WARN: Memory dimension jitter detected in [C-04]',
            'INFO: New edge established between [B-12] and [Z-01]',
            'TRACE: Softmax normalization complete.',
            'DEBUG: Eigenvalue stabilization at 1.84',
            'ALERT: Potential role drift in Auditor-02 node!'
        ];

        intervalId = setInterval(() => {
            const log = document.createElement('p');
            log.textContent = `[${new Date().toLocaleTimeString()}] ${logs[Math.floor(Math.random() * logs.length)]}`;
            logStream.appendChild(log);
            logStream.scrollTop = logStream.scrollHeight;
            
            if (logStream.children.length > 50) {
                logStream.removeChild(logStream.firstChild);
            }
        }, 2000);
    };

    window.addEventListener('interface-switched', (e) => {
        if (e.detail.targetId === 'interface-monitoring') {
            if (!intervalId) startStreaming();
        } else {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    });
})();
