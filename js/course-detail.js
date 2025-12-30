// 课程详情页面功能 - course-detail.js

class CourseDetail {
    constructor() {
        this.courseId = null;
        this.courseData = null;
        this.currentTab = 'overview';
        this.reviews = [];

        this.init();
    }

    init() {
        // 获取课程ID
        this.getCourseId();

        // 加载课程数据
        this.loadCourseData();

        // 绑定标签页切换
        this.bindTabEvents();

        // 绑定收藏功能
        this.bindFavoriteEvents();

        // 绑定购买功能
        this.bindPurchaseEvents();

        // 初始化相关课程
        this.loadRelatedCourses();

        // 添加滚动进度条
        this.addReadingProgress();

        // 添加分享功能
        this.addSocialSharing();
    }

    getCourseId() {
        const params = new URLSearchParams(window.location.search);
        this.courseId = params.get('id') || 'web-dev';
    }

    loadCourseData() {
        // 模拟课程数据（实际应用中应该从API获取）
        const mockCourses = {
            'web-dev': {
                id: 'web-dev',
                title: 'Web前端开发完整教程',
                category: 'programming',
                level: 'intermediate',
                price: 299,
                originalPrice: 599,
                duration: '48课时',
                instructor: {
                    name: '张老师',
                    title: '高级前端开发工程师',
                    bio: '拥有8年前端开发经验，曾在多家知名互联网公司担任技术负责人。精通各种前端技术栈，善于将复杂的技术概念简单化，让初学者也能轻松掌握。',
                    avatar: 'images/instructor-zhang.jpg',
                    stats: {
                        students: 15630,
                        courses: 12,
                        rating: 4.8
                    }
                },
                rating: 4.5,
                ratingCount: 256,
                description: '本课程将带你从零开始学习Web前端开发，涵盖HTML、CSS、JavaScript等核心技术，通过实战项目帮助你快速掌握前端开发技能。',
                images: ['images/web-dev.jpg', 'images/web-dev-2.jpg', 'images/web-dev-3.jpg'],
                tags: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue'],
                curriculum: [
                    {
                        title: '第一章：HTML基础入门',
                        lessons: [
                            { title: '1.1 HTML概述和开发环境搭建', duration: '30分钟', free: true },
                            { title: '1.2 HTML基本标签', duration: '45分钟' },
                            { title: '1.3 表单与输入元素', duration: '40分钟' },
                            { title: '1.4 HTML5新特性', duration: '35分钟' }
                        ]
                    },
                    {
                        title: '第二章：CSS样式设计',
                        lessons: [
                            { title: '2.1 CSS基础语法和选择器', duration: '35分钟' },
                            { title: '2.2 盒模型和布局基础', duration: '50分钟' },
                            { title: '2.3 Flexbox布局和Grid布局', duration: '60分钟' },
                            { title: '2.4 响应式设计与媒体查询', duration: '45分钟' }
                        ]
                    },
                    {
                        title: '第三章：JavaScript编程',
                        lessons: [
                            { title: '3.1 JavaScript基础语法', duration: '40分钟', free: true },
                            { title: '3.2 DOM操作与事件处理', duration: '55分钟' },
                            { title: '3.3 异步编程与Promise', duration: '45分钟' },
                            { title: '3.4 AJAX与API交互', duration: '50分钟' }
                        ]
                    },
                    {
                        title: '第四章：前端框架入门',
                        lessons: [
                            { title: '4.1 Vue.js基础', duration: '60分钟' },
                            { title: '4.2 React基础', duration: '70分钟' },
                            { title: '4.3 组件化开发', duration: '50分钟' },
                            { title: '4.4 状态管理', duration: '45分钟' }
                        ]
                    }
                ]
            }
        };

        // 如果找不到特定ID的课程，使用默认数据
        this.courseData = mockCourses[this.courseId] || {
            ...mockCourses['web-dev'],
            id: this.courseId,
            title: '课程详情页面',
            description: '这是一个示例课程页面。'
        };

        this.updateCourseDisplay();
        this.loadReviews();
    }

    updateCourseDisplay() {
        // 更新面包屑
        const currentCourseName = document.getElementById('current-course-name');
        if (currentCourseName) {
            currentCourseName.textContent = this.courseData.title;
        }

        // 更新课程主要信息
        document.getElementById('course-title').textContent = this.courseData.title;
        document.getElementById('course-description').textContent = this.courseData.description;

        // 更新价格
        const currentPriceEl = document.querySelector('.current-price');
        const originalPriceEl = document.querySelector('.original-price');
        if (currentPriceEl) currentPriceEl.textContent = `¥${this.courseData.price}`;
        if (originalPriceEl) originalPriceEl.textContent = `¥${this.courseData.originalPrice || this.courseData.price * 2}`;

        // 更新课程元信息
        const metas = document.querySelectorAll('.course-meta span');
        metas.forEach(meta => {
            if (meta.textContent.includes('讲师：')) {
                meta.textContent = `讲师：${this.courseData.instructor.name}`;
            }
            if (meta.textContent.includes('分类：')) {
                meta.textContent = `分类：${this.getCategoryName(this.courseData.category)}`;
            }
            if (meta.textContent.includes('难度：')) {
                meta.textContent = `难度：${this.getLevelName(this.courseData.level)}`;
            }
            if (meta.textContent.includes('课时：')) {
                meta.textContent = `课时：${this.courseData.duration}`;
            }
        });

        // 更新评分
        this.updateRatingDisplay();

        // 更新标签
        const tagContainer = document.querySelector('.course-tags');
        if (tagContainer && this.courseData.tags) {
            tagContainer.innerHTML = this.courseData.tags.map(tag =>
                `<span class="tag">${tag}</span>`
            ).join('');
        }

        // 更新图片画廊
        this.updateImageGallery();

        // 更新讲师信息
        this.updateInstructorInfo();
    }

    updateRatingDisplay() {
        const stars = document.querySelectorAll('.stars');
        const ratingScore = document.querySelector('.rating-score');
        const reviewCount = document.querySelector('.review-count');

        // 清空并重新生成评分星星
        const ratingContainer = document.querySelector('.stars');
        if (ratingContainer) {
            ratingContainer.innerHTML = '';
            const fullStars = Math.floor(this.courseData.rating);
            const hasHalfStar = this.courseData.rating % 1 >= 0.5;

            for (let i = 0; i < fullStars; i++) {
                ratingContainer.innerHTML += '<span class="star filled">★</span>';
            }
            if (hasHalfStar) {
                ratingContainer.innerHTML += '<span class="star">☆</span>';
            }
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) {
                ratingContainer.innerHTML += '<span class="star">☆</span>';
            }
        }

        if (ratingScore) ratingScore.textContent = this.courseData.rating;
        if (reviewCount) reviewCount.textContent = `(${this.courseData.ratingCount}条评价)`;
    }

    updateImageGallery() {
        const mainImage = document.getElementById('course-main-image');
        const gallery = document.querySelector('.course-gallery');

        if (mainImage && this.courseData.images && this.courseData.images.length > 0) {
            mainImage.src = this.courseData.images[0];
        }

        if (gallery && this.courseData.images && this.courseData.images.length > 1) {
            gallery.innerHTML = this.courseData.images.map((img, index) =>
                `<img src="${img}" alt="课程图片${index + 1}" class="thumb ${index === 0 ? 'active' : ''}">`
            ).join('');
        }
    }

    updateInstructorInfo() {
        const instructorCard = document.querySelector('.instructor-card');
        if (instructorCard && this.courseData.instructor) {
            instructorCard.innerHTML = `
                <img src="${this.courseData.instructor.avatar}" alt="${this.courseData.instructor.name}" class="instructor-avatar">
                <div class="instructor-info">
                    <h3>${this.courseData.instructor.name}</h3>
                    <p class="instructor-title">${this.courseData.instructor.title}</p>
                    <p class="instructor-bio">${this.courseData.instructor.bio}</p>
                    <div class="instructor-stats">
                        <div class="stat">
                            <span class="number">${this.courseData.instructor.stats.students.toLocaleString()}</span>
                            <span class="label">名学生</span>
                        </div>
                        <div class="stat">
                            <span class="number">${this.courseData.instructor.stats.courses}</span>
                            <span class="label">门课程</span>
                        </div>
                        <div class="stat">
                            <span class="number">${this.courseData.instructor.stats.rating}</span>
                            <span class="label">平均分</span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    getCategoryName(category) {
        const names = {
            'programming': '编程开发',
            'design': '设计创意',
            'business': '商业管理',
            'language': '语言学习',
            'marketing': '市场营销'
        };
        return names[category] || category;
    }

    getLevelName(level) {
        const names = {
            'beginner': '初级',
            'intermediate': '中级',
            'advanced': '高级'
        };
        return names[level] || level;
    }

    bindTabEvents() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                this.switchTab(targetTab);
            });
        });

        // URL参数支持的标签页切换
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam) {
            this.switchTab(tabParam);
        }
    }

    switchTab(tabName) {
        const allButtons = document.querySelectorAll('.tab-btn');
        const allContents = document.querySelectorAll('.tab-content');

        // 隐藏所有标签内容
        allContents.forEach(content => content.classList.remove('active'));

        // 移除所有按钮的激活状态
        allButtons.forEach(button => button.classList.remove('active'));

        // 显示选中的标签内容
        const targetContent = document.getElementById(tabName);
        if (targetContent) {
            targetContent.classList.add('active');

            // 根据标签内容更新显示
            switch(tabName) {
                case 'curriculum':
                    this.renderCurriculum();
                    break;
                case 'reviews':
                    this.renderReviews();
                    break;
                case 'instructor':
                    // 已经初始化显示
                    break;
            }
        }

        // 更新按钮状态
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }

        this.currentTab = tabName;

        // 更新URL（不刷新页面）
        this.updateURL(tabName);

        // 滚动到标签区域顶部
        const tabsHeader = document.querySelector('.tabs-header');
        if (tabsHeader) {
            tabsHeader.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    updateURL(tabName) {
        const url = new URL(window.location);
        url.searchParams.set('tab', tabName);
        window.history.replaceState({}, '', url);
    }

    renderCurriculum() {
        const curriculumContainer = document.getElementById('curriculum');
        if (!curriculumContainer || !this.courseData.curriculum) return;

        curriculumContainer.innerHTML = `
            <div class="curriculum-overview">
                <h4>课程结构</h4>
                <div class="curriculum-stats">
                    <span>共 ${this.courseData.curriculum.length} 章</span>
                    <span>${this.countTotalLessons()} 节课</span>
                    <span>总时长约 ${this.courseData.duration}</span>
                </div>
            </div>
            <div class="curriculum-chapters">
                ${this.courseData.curriculum.map((chapter, index) => `
                    <div class="chapter" data-chapter="${index}">
                        <div class="chapter-header">
                            <h3>${chapter.title}</h3>
                            <span class="chapter-stats">${chapter.lessons.length} 节课</span>
                        </div>
                        <div class="lessons-list">
                            ${chapter.lessons.map((lesson, lessonIndex) => `
                                <div class="lesson-item ${lesson.free ? 'lesson-free' : ''}">
                                    <div class="lesson-info">
                                        <span class="lesson-index">${index + 1}.${lessonIndex + 1}</span>
                                        <span class="lesson-title">${lesson.title}</span>
                                        ${lesson.free ? '<span class="free-badge">免费试看</span>' : ''}
                                    </div>
                                    <div class="lesson-meta">
                                        <span class="lesson-duration">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <path d="M12 6v6l4 2"></path>
                                            </svg>
                                            ${lesson.duration}
                                        </span>
                                        <button class="preview-btn ${lesson.free ? '' : 'disabled'}"
                                            ${lesson.free ? `onclick="courseDetail.playLessonPreview('${lesson.title}')"` : 'disabled'}>
                                            ${lesson.free ? '▶ 试看' : '🔒 锁定'}
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    countTotalLessons() {
        return this.courseData.curriculum.reduce((total, chapter) => total + chapter.lessons.length, 0);
    }

    renderReviews() {
        const reviewsContainer = document.getElementById('reviews-container');
        if (!reviewsContainer) return;

        reviewsContainer.innerHTML = `
            <div class="reviews-actions">
                <div class="filter-group">
                    <label>筛选：</label>
                    <select id="review-filter" onchange="courseDetail.filterReviews(this.value)">
                        <option value="all">全部评价</option>
                        <option value="5">5星评价</option>
                        <option value="4">4星以上</option>
                        <option value="3">3星以上</option>
                    </select>
                </div>
                <div class="sort-group">
                    <label>排序：</label>
                    <select id="review-sort" onchange="courseDetail.sortReviews(this.value)">
                        <option value="newest">最新</option>
                        <option value="oldest">最早</option>
                        <option value="helpful">最有帮助</option>
                    </select>
                </div>
            </div>
            <div class="reviews-list-content">
                ${this.generateMockReviews()}
            </div>
            <div class="load-more-reviews">
                <button class="btn btn-secondary" onclick="courseDetail.loadMoreReviews()">
                    加载更多评价
                </button>
            </div>
        `;
    }

    generateMockReviews() {
        const reviewData = [
            {
                id: 1,
                user: '学员小王',
                rating: 5,
                date: '2024-01-15',
                content: '课程内容非常详细，老师讲解清晰易懂，对零基础学习者很友好！',
                helpful: 23,
                avatar: 'images/avatar1.jpg'
            },
            {
                id: 2,
                user: '前端小白',
                rating: 4,
                date: '2024-01-10',
                content: '整体不错，实战项目很实用。希望能增加更多最新的技术栈内容。',
                helpful: 15,
                avatar: 'images/avatar2.jpg'
            },
            {
                id: 3,
                user: '代码爱好者',
                rating: 5,
                date: '2024-01-05',
                content: '从零基础到能独立开发网站，这门课程帮助很大。推荐！',
                helpful: 31,
                avatar: 'images/avatar3.jpg'
            },
            {
                id: 4,
                user: '学习者小李',
                rating: 4,
                date: '2023-12-28',
                content: '课程结构合理，循序渐进。售后服务响应及时。',
                helpful: 18,
                avatar: 'images/avatar4.jpg'
            }
        ];

        this.reviews = reviewData.map(review => {
            const daysAgo = Math.floor((new Date() - new Date(review.date)) / (1000 * 60 * 60 * 24));
            return { ...review, daysAgo };
        });

        return this.renderReviewItems(this.reviews);
    }

    renderReviewItems(reviews) {
        return reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <img src="${review.avatar}" alt="${review.user}" class="review-avatar">
                    <div class="review-user-info">
                        <h4>${review.user}</h4>
                        <div class="review-meta">
                            ${this.renderStars(review.rating)}
                            <span class="review-date">${review.daysAgo}天前</span>
                        </div>
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.content}</p>
                </div>
                <div class="review-actions">
                    <button class="helpful-btn" onclick="courseDetail.markHelpful(${review.id})">
                        👍 有帮助 (${review.helpful})
                    </button>
                    <button class="reply-btn" onclick="courseDetail.replyToReview(${review.id})">
                        💬 回复
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? '<span class="star filled">★</span>' : '<span class="star">☆</span>');
        }
        return `<div class="review-stars">${stars.join('')}</div>`;
    }

    playLessonPreview(lessonTitle) {
        // 模拟播放预览视频
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.innerHTML = `
            <div class="preview-content">
                <span class="close-preview">&times;</span>
                <h3>${lessonTitle}</h3>
                <div class="preview-video">
                    <video controls>
                        <source src="videos/sample-preview.mp4" type="video/mp4">
                        您的浏览器不支持视频播放。
                    </video>
                </div>
                <div class="preview-info">
                    <p>这是本节课的预览内容，完整课程请购买后观看。</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 关闭预览
        modal.querySelector('.close-preview').addEventListener('click', () => {
            modal.remove();
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    bindFavoriteEvents() {
        const favoriteBtn = this.form.querySelector('.btn-secondary');
        if (favoriteBtn && favoriteBtn.textContent.includes('收藏')) {
            favoriteBtn.addEventListener('click', () => {
                this.toggleFavorite(favoriteBtn);
            });
        }
    }

    toggleFavorite(btn) {
        const isFavorited = btn.classList.contains('favorited');

        // 更新按钮状态
        if (isFavorited) {
            btn.classList.remove('favorited');
            btn.innerHTML = '☆ 加入收藏';
            window.Utils.showMessage('已取消收藏', 'info');

            // 从收藏列表中移除
            this.removeFromFavorites(this.courseId);
        } else {
            btn.classList.add('favorited');
            btn.innerHTML = '★ 已收藏';
            btn.classList.add('heartbeat');
            setTimeout(() => btn.classList.remove('heartbeat'), 1500);

            // 添加到收藏列表
            this.addToFavorites(this.courseId);
            window.Utils.showMessage('已添加到收藏', 'success');
        }

        // 保存到本地存储
        this.saveFavoriteStatus(!isFavorited);
    }

    addToFavorites(courseId) {
        let favorites = window.Utils.getFromStorage('favoriteCourses') || [];
        if (!favorites.includes(courseId)) {
            favorites.push(courseId);
            window.Utils.saveToStorage('favoriteCourses', favorites);
        }
    }

    removeFromFavorites(courseId) {
        let favorites = window.Utils.getFromStorage('favoriteCourses') || [];
        favorites = favorites.filter(id => id !== courseId);
        window.Utils.saveToStorage('favoriteCourses', favorites);
    }

    saveFavoriteStatus(isFavorited) {
        window.Utils.saveToStorage(`favorite_${this.courseId}`, isFavorited);
    }

    bindPurchaseEvents() {
        const purchaseBtn = document.querySelector('.btn-primary.btn-large');
        if (purchaseBtn && purchaseBtn.textContent.includes('购买')) {
            purchaseBtn.addEventListener('click', () => {
                this.handlePurchase(purchaseBtn);
            });
        }
    }

    async handlePurchase(btn) {
        btn.disabled = true;
        btn.innerHTML = '处理中...';

        try {
            // 模拟购买流程
            await this.simulatePurchase();

            // 显示成功
            btn.innerHTML = '✓ 购买成功';
            btn.classList.add('success');
            window.Utils.showMessage('购买成功！课程已添加到您的学习列表中', 'success');

            // 更新页面状态
            this.updateAfterPurchase();
        } catch (error) {
            btn.disabled = false;
            btn.innerHTML = '立即购买';
            window.Utils.showMessage(error.message || '购买失败，请重试', 'error');
        }
    }

    async simulatePurchase() {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const random = Math.random();
                if (random > 0.9) {
                    reject(new Error('支付失败，请检查账户余额'));
                } else {
                    resolve();
                }
            }, 2000);
        });
    }

    updateAfterPurchase() {
        // 更新购买按钮
        const purchaseBtn = document.querySelector('.btn-primary.btn-large');
        if (purchaseBtn) {
            purchaseBtn.textContent = '立即学习';
            purchaseBtn.onclick = () => {
                window.location.href = `/learn/${this.courseId}`;
            };
        }

        // 隐藏价格信息
        const priceSection = document.querySelector('.price-section');
        if (priceSection) {
            priceSection.style.display = 'none';
        }

        // 显示学习进度（模拟）
        this.showLearningProgress();
    }

    showLearningProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'learning-progress';
        progressBar.innerHTML = `
            <div class="progress-header">
                <span>学习进度</span>
                <span class="progress-percentage">0%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <p class="progress-message">开始学习第一课</p>
        `;

        const courseHeader = document.querySelector('.course-purchase');
        if (courseHeader) {
            courseHeader.parentNode.insertBefore(progressBar, courseHeader.nextSibling);

            // 动画显示进度条
            setTimeout(() => {
                progressBar.classList.add('visible');
            }, 100);
        }
    }

    loadRelatedCourses() {
        const relatedContainer = document.getElementById('related-courses-grid');
        if (!relatedContainer) return;

        // 根据当前课程分类筛选相关课程
        const relatedCourses = window.courseFilter?.courses.filter(course =>
            course.category === this.courseData.category && course.id !== this.courseId
        ).slice(0, 3) || [];

        if (relatedCourses.length > 0) {
            relatedContainer.innerHTML = relatedCourses.map(course => `
                <div class="course-card">
                    <img src="${course.image}" alt="${course.title}" class="course-image">
                    <div class="course-info">
                        <h3>${course.title}</h3>
                        <p class="price">¥${course.price}</p>
                        <a href="course-detail.html?id=${course.id}" class="btn btn-secondary">查看详情</a>
                    </div>
                </div>
            `).join('');
        }
    }

    addReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
        document.body.appendChild(progressBar);

        let ticking = false;

        const updateProgress = () => {
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;
            const progress = (scrollPosition / documentHeight) * 100;

            progressBar.style.setProperty('--progress', `${progress}%`);
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgress);
                ticking = true;
            }
        });
    }

    addSocialSharing() {
        // 添加分享按钮功能
        const shareButtons = document.querySelectorAll('.share-btn');
        shareButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const shareUrl = window.location.href;
                const shareTitle = `我正在学习：${this.courseData.title}`;

                if (navigator.share) {
                    navigator.share({
                        title: shareTitle,
                        url: shareUrl
                    });
                } else {
                    // 复制链接到剪贴板
                    this.copyToClipboard(shareUrl, '课程链接已复制到剪贴板');
                }
            });
        });
    }

    copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            window.Utils.showMessage(message, 'success');
        }).catch(() => {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            window.Utils.showMessage(message, 'success');
        });
    }

    // 收藏状态初始化
    initializeFavoriteStatus() {
        const isFavorited = window.Utils.getFromStorage(`favorite_${this.courseId}`);
        const favoriteBtn = document.querySelector('.btn-secondary');

        if (isFavorited) {
            favoriteBtn.textContent = '★ 已收藏';
            favoriteBtn.classList.add('favorited');
        }
    }

    // 评价筛选
    filterReviews(filter) {
        // 实现评价筛选逻辑
        console.log('Filtering reviews by:', filter);
    }

    // 评价排序
    sortReviews(sortBy) {
        // 实现评价排序逻辑
        console.log('Sorting reviews by:', sortBy);
    }

    // 标记评价有帮助
    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful++;
            // 重新渲染评价
            this.renderReviews();
            window.Utils.showMessage('感谢您的反馈', 'info');
        }
    }

    // 回复评价
    replyToReview(reviewId) {
        // 实现回复功能
        console.log('Replying to review:', reviewId);
    }
}

// 初始化课程详情页面
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.course-detail-page')) {
        window.courseDetail = new CourseDetail();
    }
});

// 导出供其他模块使用
window.CourseDetail = CourseDetail;