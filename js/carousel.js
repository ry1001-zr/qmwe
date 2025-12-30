// 轮播图功能 - carousel.js

class ImageCarousel {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.options = {
            autoPlay: options.autoPlay !== false,
            interval: options.interval || 5000,
            transitionDuration: options.transitionDuration || 500,
            pauseOnHover: options.pauseOnHover !== false,
            showIndicators: options.showIndicators !== false,
            showControls: options.showControls !== false,
            ...options
        };

        this.init();
    }

    init() {
        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.indicators = this.container.querySelectorAll('.indicator');
        this.prevBtn = this.container.querySelector('.carousel-btn.prev');
        this.nextBtn = this.container.querySelector('.carousel-btn.next');

        if (this.slides.length === 0) return;

        this.currentSlide = 0;
        this.isAnimating = false;
        this.autoPlayTimer = null;

        this.setupEventListeners();

        if (this.options.autoPlay) {
            this.startAutoPlay();
        }

        // 添加触摸滑动支持
        this.addTouchSupport();

        // 初始化第一张幻灯片
        this.showSlide(0);
    }

    setupEventListeners() {
        // 控制按钮事件
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // 指示器点击事件
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (this.container.contains(document.activeElement) ||
                this.container.getBoundingClientRect().top < window.innerHeight) {
                switch(e.key) {
                    case 'ArrowLeft':
                        this.prevSlide();
                        break;
                    case 'ArrowRight':
                        this.nextSlide();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.pauseAutoPlay();
                        break;
                }
            }
        });

        // 鼠标悬停暂停
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.container.addEventListener('mouseleave', () => {
                if (this.options.autoPlay) {
                    this.startAutoPlay();
                }
            });
        }

        // 窗口可见性变化时暂停/恢复
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else if (this.options.autoPlay) {
                this.startAutoPlay();
            }
        });

        // 窗口大小变化时重新计算
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    showSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;

        this.isAnimating = true;

        // 确保只有一张幻灯片处于活动状态
        this.slides.forEach((slide, i) => {
            if (i !== index) {
                slide.classList.remove('active');
            }
        });

        // 更新指示器
        if (this.options.showIndicators) {
            this.indicators.forEach((indicator, i) => {
                if (i !== index) {
                    indicator.classList.remove('active');
                }
            });
        }

        // 设置新的当前幻灯片
        this.currentSlide = index;

        // 使用双重请求动画帧确保平滑过渡
        requestAnimationFrame(() => {
            this.slides[this.currentSlide].classList.add('active');

            if (this.options.showIndicators) {
                this.indicators[this.currentSlide].classList.add('active');
            }

            // 触发自定义事件
            this.container.dispatchEvent(new CustomEvent('slideChange', {
                detail: { currentSlide: this.currentSlide }
            }));

            setTimeout(() => {
                this.isAnimating = false;
            }, this.options.transitionDuration);
        });
    }

    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.slides.length) {
            nextIndex = 0;
        }
        this.showSlide(nextIndex);
    }

    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.slides.length - 1;
        }
        this.showSlide(prevIndex);
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.pauseAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.nextSlide();
        }, this.options.interval);
    }

    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    resetAutoPlay() {
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    // 触摸滑动支持
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartTime = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartTime = Date.now();
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const maxTimeThreshold = 1000;
            const timeElapsed = Date.now() - touchStartTime;

            if (timeElapsed < maxTimeThreshold) {
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // 向左滑动 - 下一张
                        this.nextSlide();
                    } else {
                        // 向右滑动 - 上一张
                        this.prevSlide();
                    }
                }
            }
        };
    }

    // 响应式处理
    onResize() {
        // 重置当前幻灯片以适应新尺寸
        this.showSlide(this.currentSlide);
    }

    // 销毁轮播图
    destroy() {
        clearInterval(this.autoPlayTimer);
        this.container.removeEventListener('mouseenter', this.pauseAutoPlay);
        this.container.removeEventListener('mouseleave', this.startAutoPlay);

        // 移除所有事件监听器
        this.prevBtn?.removeEventListener('click', this.prevSlide);
        this.nextBtn?.removeEventListener('click', this.nextSlide);
        this.indicators.forEach(indicator => {
            indicator.removeEventListener('click', () => this.goToSlide(this.indicators.indexOf(indicator)));
        });
    }
}

// 图片懒加载
class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        // 检查是否支持 Intersection Observer
        if (!('IntersectionObserver' in window)) {
            this.fallbackLoad();
            return;
        }

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px' // 提前 100px 开始加载
        });

        // 观察所有懒加载图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // 创建新图片以预加载
        const newImg = new Image();
        newImg.onload = () => {
            img.src = src;
            img.classList.add('loaded');
            img.classList.remove('loading');

            // 触发自定义事件
            img.dispatchEvent(new Event('lazyloaded'));
        };

        newImg.onerror = () => {
            img.classList.add('error');
            img.classList.remove('loading');

            // 显示错误占位图
            img.src = 'images/placeholder-error.jpg';
        };

        // 开始加载
        img.classList.add('loading');
        newImg.src = src;
    }

    fallbackLoad() {
        // 不支持 Intersection Observer 的浏览器回退方案
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

// 创建图片画廊
class ImageGallery {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.images = this.container.querySelectorAll('.thumb');
        this.mainImage = document.getElementById('course-main-image');

        if (this.images.length === 0) return;

        this.init();
    }

    init() {
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => {
                this.setActiveImage(index);
            });

            // 预加载图片
            img.addEventListener('mouseenter', () => {
                this.preloadImage(index);
            });
        });
    }

    setActiveImage(index) {
        // 移除所有active类
        this.images.forEach(img => {
            img.classList.remove('active');
        });

        // 添加active类到当前图片
        this.images[index].classList.add('active');

        // 更新主图片
        const newSrc = this.images[index].src.replace('-thumb', '');
        if (this.mainImage) {
            this.mainImage.style.opacity = '0.5';
            setTimeout(() => {
                this.mainImage.src = newSrc;
                this.mainImage.style.opacity = '1';
            }, 150);
        }
    }

    preloadImage(index) {
        const src = this.images[index].src.replace('-thumb', '');
        const img = new Image();
        img.src = src;
    }
}

// 自定义控件样式
function styleControls() {
    // 为轮播图控制按钮添加涟漪效果
    document.querySelectorAll('.carousel-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // 创建涟漪效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 初始化
function initializeCarousels() {
    // 主轮播图
    window.mainCarousel = new ImageCarousel('.hero-carousel', {
        autoPlay: true,
        interval: 6000,
        pauseOnHover: true,
        showIndicators: true,
        showControls: true,
        transitionDuration: 800  /* 增加过渡时间减少闪烁 */
    });

    // 课程详情页图片画廊
    new ImageGallery('.course-gallery');

    // 图片懒加载
    new LazyImageLoader();

    // 样式控制按钮
    styleControls();

    // 添加自定义事件监听
    document.addEventListener('lazyloaded', (e) => {
        // 图片加载完成后的额外处理
        e.target.classList.add('fade-in');
    });
}

// 为图片添加加载状态
function addImageLoadStatus() {
    document.querySelectorAll('img').forEach(img => {
        if (!img.complete) {
            img.classList.add('loading');

            img.onload = function() {
                this.classList.remove('loading');
                this.classList.add('loaded');
            };

            img.onerror = function() {
                this.classList.remove('loading');
                this.classList.add('error');
                // 显示错误占位图
                this.src = 'images/placeholder-error.jpg';
            };
        }
    });
}

// 监听 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousels();
    addImageLoadStatus();
});

// 导出供其他模块使用
window.ImageCarousel = ImageCarousel;
window.ImageGallery = ImageGallery;
window.LazyImageLoader = LazyImageLoader;