// 课程筛选功能 - course-filter.js

class CourseFilter {
    constructor() {
        this.courses = [];
        this.filteredCourses = [];
        this.currentPage = 1;
        this.coursesPerPage = 9;
        this.sortBy = 'default';
        this.sortOrder = 'asc';

        // 筛选条件
        this.filters = {
            category: '',
            level: '',
            price: '',
            search: ''
        };

        this.init();
    }

    init() {
        // 模拟课程数据
        this.loadCourses();

        // 绑定筛选事件
        this.bindFilterEvents();

        // 绑定排序事件
        this.bindSortEvents();

        // 初始化显示
        this.renderCourses();
        this.updatePagination();
    }

    // 模拟加载课程数据
    loadCourses() {
        this.courses = [
            {
                id: 'web-dev',
                title: 'Web前端开发完整教程',
                category: 'programming',
                level: 'intermediate',
                price: 299,
                originalPrice: 599,
                duration: '48课时',
                instructor: '张老师',
                rating: 4.5,
                ratingCount: 256,
                description: '从零开始学习HTML、CSS、JavaScript等前端技术',
                image: 'images/web-dev.jpg',
                tags: ['HTML5', 'CSS3', 'JavaScript', 'React']
            },
            {
                id: 'python-basic',
                title: 'Python编程基础',
                category: 'programming',
                level: 'beginner',
                price: 199,
                duration: '36课时',
                instructor: '李老师',
                rating: 4.8,
                ratingCount: 512,
                description: '简单易学的Python入门课程',
                image: 'images/python.jpg',
                tags: ['Python', '基础语法', '数据结构']
            },
            {
                id: 'ui-design',
                title: 'UI设计入门到精通',
                category: 'design',
                level: 'intermediate',
                price: 399,
                duration: '24课时',
                instructor: '王老师',
                rating: 4.3,
                ratingCount: 128,
                description: '掌握设计原理和工具使用技巧',
                image: 'images/design.jpg',
                tags: ['设计原理', 'Figma', 'Photoshop']
            },
            {
                id: 'business-management',
                title: '商业管理学基础',
                category: 'business',
                level: 'beginner',
                price: 0, // 免费
                duration: '30课时',
                instructor: '赵教授',
                rating: 4.6,
                ratingCount: 342,
                description: '商业管理基础知识和案例分析',
                image: 'images/business.jpg',
                tags: ['管理学', '商业分析', '案例研究']
            },
            {
                id: 'english-speaking',
                title: '英语口语速成班',
                category: 'language',
                level: 'intermediate',
                price: 259,
                duration: '40课时',
                instructor: '外教Tom',
                rating: 4.7,
                ratingCount: 189,
                description: '快速提升英语口语表达能力',
                image: 'images/english.jpg',
                tags: ['英语口语', '发音纠正', '实战对话']
            },
            {
                id: 'digital-marketing',
                title: '数字营销全攻略',
                category: 'marketing',
                level: 'advanced',
                price: 599,
                duration: '60课时',
                instructor: '营销专家',
                rating: 4.9,
                ratingCount: 78,
                description: '掌握数字时代营销策略',
                image: 'images/marketing.jpg',
                tags: ['SEO', 'SEM', '社交媒体', '内容营销']
            },
            {
                id: 'data-analysis',
                title: '数据分析与可视化',
                category: 'programming',
                level: 'advanced',
                price: 499,
                originalPrice: 799,
                duration: '52课时',
                instructor: '数据科学家',
                rating: 4.6,
                ratingCount: 456,
                description: 'Python数据分析从入门到精通',
                image: 'images/data-analysis.jpg',
                tags: ['Python', 'Pandas', 'Matplotlib', '机器学习']
            },
            {
                id: 'photography',
                title: '摄影艺术与技巧',
                category: 'design',
                level: 'beginner',
                price: 179,
                duration: '28课时',
                instructor: '摄影师',
                rating: 4.2,
                ratingCount: 234,
                description: '从构图到后期处理全面掌握',
                image: 'images/photography.jpg',
                tags: ['摄影构图', '光线', '后期处理']
            },
            {
                id: 'japanese',
                title: '日语零基础入门',
                category: 'language',
                level: 'beginner',
                price: 329,
                duration: '44课时',
                instructor: '日语老师',
                rating: 4.1,
                ratingCount: 167,
                description: '轻松掌握日语基础',
                image: 'images/japanese.jpg',
                tags: ['日语', '假名', '基础对话']
            }
        ];

        // 添加更多模拟数据
        this.expandCourses();
    }

    expandCourses() {
        // 创建更多课程数据
        const categories = ['programming', 'design', 'business', 'language', 'marketing'];
        const levels = ['beginner', 'intermediate', 'advanced'];
        const instructors = ['陈老师', '刘老师', '周老师', '吴老师', '郑老师'];

        for (let i = 0; i < 20; i++) {
            const baseCourse = this.courses[i % this.courses.length];
            const newCourse = {
                ...baseCourse,
                id: baseCourse.id + `-${i + 10}`,
                title: baseCourse.title + ` (${i + 1})`,
                rating: Math.round((Math.random() * 1 + 4) * 10) / 10,
                ratingCount: Math.floor(Math.random() * 500) + 50,
                price: baseCourse.price === 0 ? 0 : Math.floor(Math.random() * 5 + 1) * 100
            };
            this.courses.push(newCourse);
        }
    }

    bindFilterEvents() {
        // 分类筛选
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        // 难度筛选
        const levelFilter = document.getElementById('level-filter');
        if (levelFilter) {
            levelFilter.addEventListener('change', (e) => {
                this.filters.level = e.target.value;
                this.applyFilters();
            });
        }

        // 价格筛选
        const priceFilter = document.getElementById('price-filter');
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.filters.price = e.target.value;
                this.applyFilters();
            });
        }

        // 搜索功能
        const searchInput = document.getElementById('course-search');
        const searchBtn = document.querySelector('.search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', window.Utils.debounce((e) => {
                this.filters.search = e.target.value.trim().toLowerCase();
                this.applyFilters();
            }, 300));
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
    }

    bindSortEvents() {
        // 添加排序选择器（如果没有的话）
        this.addSortControls();
    }

    addSortControls() {
        const filterContainer = document.querySelector('.filter-container');
        if (filterContainer && !document.querySelector('.sort-control')) {
            const sortGroup = document.createElement('div');
            sortGroup.className = 'sort-control';
            sortGroup.innerHTML = `
                <label>排序方式：</label>
                <select id="sort-select">
                    <option value="default">默认排序</option>
                    <option value="price-low">价格从低到高</option>
                    <option value="price-high">价格从高到低</option>
                    <option value="rating">评分最高</option>
                    <option value="popularity">最受欢迎</option>
                </select>
            `;
            filterContainer.appendChild(sortGroup);

            document.getElementById('sort-select').addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }
    }

    handleSort(sortType) {
        switch(sortType) {
            case 'price-low':
                this.sortBy = 'price';
                this.sortOrder = 'asc';
                break;
            case 'price-high':
                this.sortBy = 'price';
                this.sortOrder = 'desc';
                break;
            case 'rating':
                this.sortBy = 'rating';
                this.sortOrder = 'desc';
                break;
            case 'popularity':
                this.sortBy = 'ratingCount';
                this.sortOrder = 'desc';
                break;
            default:
                this.sortBy = 'default';
                this.sortOrder = 'asc';
        }

        this.currentPage = 1; // 重置到第一页
        this.applyFilters();
    }

    applyFilters() {
        // 如果没有筛选条件，返回所有课程
        if (!this.filters.category && !this.filters.level && !this.filters.price && !this.filters.search && this.sortBy === 'default') {
            this.filteredCourses = [...this.courses];
            this.applySorting();
            this.currentPage = 1;
            this.renderCourses();
            this.updatePagination();
            this.updateResultsInfo();
            return;
        }

        // 清空当前显示
        this.filteredCourses = this.courses.filter(course => {
            // 分类筛选
            if (this.filters.category && course.category !== this.filters.category) {
                return false;
            }

            // 难度筛选
            if (this.filters.level && course.level !== this.filters.level) {
                return false;
            }

            // 价格筛选
            if (this.filters.price) {
                if (!this.checkPriceRange(course.price, this.filters.price)) {
                    return false;
                }
            }

            // 搜索筛选
            if (this.filters.search) {
                const searchLower = this.filters.search.toLowerCase();
                const searchableText = [
                    course.title,
                    course.description,
                    course.instructor,
                    ...course.tags
                ].join(' ').toLowerCase();

                if (!searchableText.includes(searchLower)) {
                    return false;
                }
            }

            return true;
        });

        // 应用排序
        this.applySorting();

        // 重置到第一页
        this.currentPage = 1;

        // 渲染结果
        this.renderCourses();
        this.updatePagination();
        this.updateResultsInfo();
    }

    checkPriceRange(price, range) {
        switch(range) {
            case 'free':
                return price === 0;
            case '0-200':
                return price > 0 && price <= 200;
            case '200-500':
                return price > 200 && price <= 500;
            case '500+':
                return price > 500;
            default:
                return true;
        }
    }

    applySorting() {
        if (this.sortBy === 'default') {
            // 默认排序（保持原始顺序）
            return;
        }

        this.filteredCourses.sort((a, b) => {
            let aValue = a[this.sortBy];
            let bValue = b[this.sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (this.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }

    renderCourses() {
        const courseGrid = document.getElementById('course-grid');
        const noResults = document.getElementById('no-results');

        if (!courseGrid) return;

        // 计算分页
        const startIndex = (this.currentPage - 1) * this.coursesPerPage;
        const endIndex = Math.min(startIndex + this.coursesPerPage, this.filteredCourses.length);
        const coursesToShow = this.filteredCourses.slice(startIndex, endIndex);

        if (coursesToShow.length === 0) {
            courseGrid.innerHTML = '';
            if (noResults) {
                noResults.style.display = 'block';
            }
            this.hideLoadMore();
            return;
        }

        if (noResults) {
            noResults.style.display = 'none';
        }

        // 渲染课程卡片
        if (this.currentPage === 1) {
            // 第一页，清空并重新渲染
            courseGrid.innerHTML = coursesToShow.map(course => this.createCourseCard(course)).join('');

            // 添加动画
            courseGrid.style.opacity = '0';
            setTimeout(() => {
                courseGrid.style.opacity = '1';
                courseGrid.style.transition = 'opacity 0.3s ease';
            }, 50);
        } else {
            // 加载更多，追加到末尾
            const newCards = document.createElement('div');
            newCards.innerHTML = coursesToShow.map(course => this.createCourseCard(course)).join('');

            Array.from(newCards.children).forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.3s ease';
                courseGrid.appendChild(card);

                // 延迟显示动画
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 50);
            });
        }

        // 检查是否还有更多课程
        const hasMore = this.filteredCourses.length > endIndex;
        if (hasMore) {
            this.showLoadMore();
        } else {
            this.hideLoadMore();
        }

        // 懒加载图片
        this.lazyLoadImages();
    }

    createCourseCard(course) {
        return `
            <div class="course-card" data-course-id="${course.id}">
                <img src="${course.image}" alt="${course.title}" class="course-image lazy" data-src="${course.image}">
                <div class="course-info">
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="course-meta">
                        <span class="duration">${course.duration}</span>
                        ${this.renderPrice(course)}
                    </div>
                    <div class="course-extras">
                        ${this.renderRating(course)}
                        <span class="instructor">讲师：${course.instructor}</span>
                    </div>
                    ${this.renderTags(course)}
                    <a href="course-detail.html?id=${course.id}" class="btn btn-secondary">查看详情</a>
                </div>
            </div>
        `;
    }

    renderPrice(course) {
        if (course.price === 0) {
            return '<span class="price free-price">免费</span>';
        } else if (course.originalPrice) {
            return `
                <div class="price-group">
                    <span class="price current-price">¥${course.price}</span>
                    <span class="original-price">¥${course.originalPrice}</span>
                </div>`;
        } else {
            return `<span class="price">¥${course.price}</span>`;
        }
    }

    renderRating(course) {
        const fullStars = Math.floor(course.rating);
        const hasHalfStar = course.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return `
            <div class="rating">
                ${'★'.repeat(fullStars)}
                ${hasHalfStar ? '☆' : ''}
                ${'★'.repeat(emptyStars).replace(/./g, '☆')}
                <span class="rating-score">${course.rating}</span>
                <span class="rating-count">(${course.ratingCount})</span>
            </div>
        `;
    }

    renderTags(course) {
        if (!course.tags || course.tags.length === 0) return '';

        const limitedTags = course.tags.slice(0, 3); // 最多显示3个标签
        return `
            <div class="course-tags">
                ${limitedTags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredCourses.length / this.coursesPerPage);

        // 这里可以实现更复杂的分页逻辑
        // 目前使用简单的“加载更多”按钮
    }

    updateResultsInfo() {
        const searchQuery = document.getElementById('course-search')?.value || '';
        const resultsContainer = document.querySelector('.course-list-section .container');

        if (!resultsContainer) return;

        // 移除旧的结果信息
        const oldInfo = resultsContainer.querySelector('.results-info');
        if (oldInfo) {
            oldInfo.remove();
        }

        if (this.filteredCourses.length === 0 &&
            (Object.values(this.filters).some(v => v) ||
             this.filters.search ||
             this.sortBy !== 'default')) {

            const infoDiv = document.createElement('div');
            infoDiv.className = 'results-info';

            const filters = [];
            if (this.filters.search) filters.push(`搜索"${this.filters.search}"`);
            if (this.filters.category) filters.push(this.getCategoryName(this.filters.category));
            if (this.filters.level) filters.push(this.getLevelName(this.filters.level));
            if (this.filters.price) filters.push(this.getPriceName(this.filters.price));

            infoDiv.innerHTML = `
                <p>正在显示 ${filters.join('，')} 的结果
                    <button onclick="window.courseFilter.clearAllFilters()" class="clear-filters-btn">清除所有筛选</button>
                </p>
            `;

            resultsContainer.insertBefore(infoDiv, resultsContainer.firstChild);
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

    getPriceName(price) {
        const names = {
            'free': '免费课程',
            '0-200': '0-200元',
            '200-500': '200-500元',
            '500+': '500元以上'
        };
        return names[price] || price;
    }

    // 公共API
    clearAllFilters() {
        // 重置所有筛选条件
        this.filters = {
            category: '',
            level: '',
            price: '',
            search: ''
        };
        this.sortBy = 'default';
        this.currentPage = 1;

        // 清空表单控件
        const form = document.querySelector('.filter-container');
        if (form) {
            form.reset();
        }

        // 重新应用筛选
        this.applyFilters();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('.course-image.lazy');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // 浏览器不支持IntersectionObserver时的回退方案
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    showLoadMore() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderCourses();
                loadMoreBtn.removeEventListener('click', arguments.callee);
            }, { once: true });
        }
    }

    hideLoadMore() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// 初始化课程筛选
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在课程列表页面
    if (document.getElementById('course-grid')) {
        window.courseFilter = new CourseFilter();
    }
});

// 导出供其他模块使用
window.CourseFilter = CourseFilter;