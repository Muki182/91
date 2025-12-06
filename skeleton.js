// 骨架屏加载优化
class SkeletonLoader {
    constructor() {
        this.skeletonElements = [];
    }

    // 显示骨架屏
    showSkeleton(containerId, count = 6) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const skeleton = this.createSkeletonCard();
            container.appendChild(skeleton);
            this.skeletonElements.push(skeleton);
        }
    }

    // 创建骨架卡片
    createSkeletonCard() {
        const card = document.createElement('div');
        card.className = 'skeleton-card skeleton';
        card.innerHTML = `
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
            <div class="skeleton skeleton-text" style="width: 80%;"></div>
            <div class="skeleton skeleton-text" style="width: 40%;"></div>
            <div class="skeleton skeleton-text" style="width: 70%;"></div>
        `;
        return card;
    }

    // 隐藏骨架屏
    hideSkeleton() {
        this.skeletonElements.forEach(element => {
            element.style.display = 'none';
        });
        this.skeletonElements = [];
    }

    // 显示加载动画
    showLoading(containerId, text = '加载中...') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-text">${text}</div>
            </div>
        `;
    }

    // 隐藏加载动画
    hideLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

// 全局加载状态管理
class LoadingManager {
    constructor() {
        this.loadingStates = new Map();
        this.skeletonLoader = new SkeletonLoader();
    }

    // 开始加载
    startLoading(containerId, type = 'skeleton', count = 6) {
        if (type === 'skeleton') {
            this.skeletonLoader.showSkeleton(containerId, count);
        } else {
            this.skeletonLoader.showLoading(containerId);
        }
        this.loadingStates.set(containerId, true);
    }

    // 结束加载
    endLoading(containerId) {
        this.skeletonLoader.hideSkeleton();
        this.skeletonLoader.hideLoading(containerId);
        this.loadingStates.set(containerId, false);
    }

    // 检查是否在加载中
    isLoading(containerId) {
        return this.loadingStates.get(containerId) || false;
    }
}

// 创建全局加载管理器
window.loadingManager = new LoadingManager();