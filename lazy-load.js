// 图片懒加载优化
class LazyLoader {
    constructor() {
        this.images = [];
        this.init();
    }

    init() {
        // 监听图片加载
        this.observeImages();
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

}

// 初始化懒加载
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
});