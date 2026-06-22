// Dark Lattice Design System - v2 Core Animations & Interactions
// Handles Page Transitions, Scroll Reveals, Stagger Entrances, and Reading Progress

document.addEventListener("DOMContentLoaded", () => {
    // ── 1. 页面加载淡入 ──
    document.body.classList.add('page-loaded');

    // ── 2. 导航栏滚动检测 (毛玻璃背景渐显) ──
    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            siteHeader.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
    }

    // ── 3. 首屏 Stagger 弹性入场序列 ──
    //      根据页面元素执行不同的淡入延迟安排

    // 3.1 主页 Hero 弹性动效
    const heroEyebrow = document.getElementById('hero-eyebrow');
    if (heroEyebrow) {
        setTimeout(() => heroEyebrow.classList.add('revealed'), 100);

        const heroWords = document.querySelectorAll('.hero-title .word');
        heroWords.forEach((word, idx) => {
            setTimeout(() => word.classList.add('revealed'), 300 + idx * 120);
        });

        const heroSubtitle = document.getElementById('hero-subtitle');
        if (heroSubtitle) {
            setTimeout(() => heroSubtitle.classList.add('revealed'), 700);
        }

        const heroCta = document.getElementById('hero-cta');
        if (heroCta) {
            setTimeout(() => heroCta.classList.add('revealed'), 850);
        }

        const heroSeparator = document.getElementById('hero-separator');
        if (heroSeparator) {
            setTimeout(() => heroSeparator.classList.add('revealed'), 950);
        }
    }

    // 3.2 列表页 Header Stagger 动效
    const listEyebrow = document.getElementById('pg-eyebrow');
    if (listEyebrow) {
        setTimeout(() => listEyebrow.classList.add('revealed'), 80);
        setTimeout(() => document.getElementById('pg-title')?.classList.add('revealed'), 180);
        setTimeout(() => document.getElementById('pg-desc')?.classList.add('revealed'), 300);
        setTimeout(() => document.getElementById('filter-bar')?.classList.add('revealed'), 420);
    }

    // 3.3 文章阅读页 Header Stagger 动效
    const articleBreadcrumb = document.getElementById('breadcrumb');
    if (articleBreadcrumb) {
        setTimeout(() => articleBreadcrumb.classList.add('revealed'), 80);
        setTimeout(() => document.getElementById('article-tags')?.classList.add('revealed'), 160);
        setTimeout(() => document.getElementById('article-title')?.classList.add('revealed'), 240);
        setTimeout(() => document.getElementById('article-meta')?.classList.add('revealed'), 320);
    }

    // ── 4. Scroll Reveal (通用滚动曝光检测) ──
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target); // 仅执行一次曝光，减少性能负荷
            }
        });
    }, {
        rootMargin: '-30px 0px -30px 0px',
        threshold: 0.05
    });

    document.querySelectorAll('.reveal, .reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });

    // ── 5. 阅读进度条 (零 Reflow / 仅改变 transform.scaleX) ──
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        const updateProgressBar = () => {
            const docEl = document.documentElement;
            const totalHeight = docEl.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const progress = window.scrollY / totalHeight;
                // 利用 CSS 自定义属性更新 transform，实现 GPU 加速的零 Reflow 进度反馈
                docEl.style.setProperty('--scroll-progress', progress.toFixed(4));
            }
        };

        window.addEventListener('scroll', updateProgressBar, { passive: true });
        // 初始页面加载时计算一次
        updateProgressBar();
    }

    // ── 5.1 TOC 目录滚动高亮监听 ──
    const tocLinks = document.querySelectorAll('#TableOfContents a');
    const articleBody = document.getElementById('article-body');
    if (tocLinks.length > 0 && articleBody) {
        const idToLink = new Map();
        tocLinks.forEach(link => {
            const hash = link.getAttribute('href');
            if (hash && hash.startsWith('#')) {
                const id = decodeURIComponent(hash.substring(1));
                idToLink.set(id, link);
            }
        });

        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tocLinks.forEach(link => {
                        link.parentElement.classList.remove('active');
                    });
                    const activeLink = idToLink.get(entry.target.id);
                    if (activeLink) {
                        activeLink.parentElement.classList.add('active');
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '-80px 0px -75% 0px',
            threshold: 0
        });

        const headers = articleBody.querySelectorAll('h2, h3');
        headers.forEach(header => spyObserver.observe(header));
    }

    // ── 6. 页面跳转退出淡出拦截器 (不干扰锚点与外链) ──
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // 过滤锚点链接、javascript 脚本和 _blank 外链
            if (href && !href.startsWith('#') && !href.startsWith('javascript:') && this.target !== '_blank') {
                e.preventDefault();
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 400ms var(--ease-exit)';
                setTimeout(() => {
                    window.location.href = href;
                }, 400); // 400ms 与 CSS 变量 --ease-exit 周期一致
            }
        });
    });
});

