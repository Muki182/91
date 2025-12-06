// 图片懒加载优化
class LazyLoader {
    constructor() {
        this.images = [];
        this.init();
    }

    init() {
        // 监听图片加载
        this.observeImages();
        // 预加载关键图片
        this.preloadCriticalImages();
    }

    observeImages() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        });

        // 观察所有需要懒加载的图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            observer.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }

    preloadCriticalImages() {
        // 预加载关键图片（如logo、首屏图片）
        const criticalImages = [
            // 可以添加需要预加载的图片URL
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
}

// 初始化懒加载
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
});