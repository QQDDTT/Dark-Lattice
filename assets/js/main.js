// Minimalist Script Logic
// Handles Page Transitions and Scroll Animations

document.addEventListener("DOMContentLoaded", () => {
    // 1. 页面加载后的淡入效果
    document.body.classList.add('page-loaded');

    // 2. 幻灯片动态效果 (Intersection Observer 双向触发)
    const observerOptions = {
        root: null,
        rootMargin: '-50px 0px -50px 0px', // 上下收缩50px，使得离开视口时更早触发淡出
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // 离开视口时移除类，实现向下/向上滚动时的双向淡入淡出
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach((elem) => {
        observer.observe(elem);
    });

    // 3. 页面切换时的淡出效果拦截
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            // 仅处理外部或跨页链接的淡出，忽略锚点链接
            if (targetUrl && !targetUrl.startsWith('#') && !targetUrl.startsWith('javascript:')) {
                // 判断是否是新标签页打开
                if (this.target === '_blank') return;
                
                e.preventDefault();
                document.body.classList.remove('page-loaded');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 600); // 必须与 SCSS 中 body 的 transition 时间一致
            }
        });
    });
});
