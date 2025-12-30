// 主JavaScript文件 - main.js

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initializeNavigation();
    initializeScrollEffects();
    initializePageLoader();
    initializeBackToTop();
    initializeProgressBar();
    initializeSearch();
});

// 导航菜单功能
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    // 移动端菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // 添加动画效果
        navMenu.classList.add('fade-in-up');
    });

    // 点击导航链接关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// 滚动效果
function initializeScrollEffects() {
    // 滚动时添加头部阴影
    const header = document.querySelector('.header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.backgroundColor = 'white';
        }
    });

    // 滚动触发动画（滑入效果）
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察所有带有 data-animate 属性的元素
    document.querySelectorAll('[data-animate="slide-in"]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // 统计数字动画
    animateStats();
}

// 统计数字动画
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace('+', '').replace(',', ''));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            const suffix = stat.textContent.includes('+') ? '+' : '';
            const formattedNumber = Math.floor(current).toLocaleString();
            stat.textContent = formattedNumber + suffix;
        }, 50);
    });
}

// 页面加载器
function initializePageLoader() {
    const loader = document.querySelector('.page-loader');

    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 300);
    }
}

// 返回顶部按钮
function initializeBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.opacity = '0';
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 页面滚动进度条
function initializeProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-top';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 搜索功能
function initializeSearch() {
    const searchInput = document.getElementById('course-search');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchInput || !searchBtn) return;

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 实时搜索建议
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (this.value.length > 2) {
                showSearchSuggestions(this.value);
            } else {
                hideSearchSuggestions();
            }
        }, 300);
    });
}

// 执行搜索
function performSearch() {
    const searchInput = document.getElementById('course-search');
    const query = searchInput.value.trim();

    if (!query) {
        searchInput.focus();
        searchInput.classList.add('shake');
        setTimeout(() => {
            searchInput.classList.remove('shake');
        }, 500);
        return;
    }

    // 添加加载动画
    searchInput.disabled = true;
    document.querySelector('.search-btn').innerHTML = '🔍 搜索中...';

    // 模拟搜索延迟
    setTimeout(() => {
        searchInput.disabled = false;
        document.querySelector('.search-btn').innerHTML = '搜索';

        // 这里可以添加实际的搜索逻辑
        console.log('搜索课程:', query);

        // 显示搜索结果
        showSearchResults(query);
    }, 1000);
}

// 显示搜索结果
function showSearchResults(query) {
    // 创建搜索结果容器
    let resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'search-results';
        resultsContainer.className = 'search-results';
        document.querySelector('.course-list-section .container').prepend(resultsContainer);
    }

    // 模拟数据
    const mockResults = [
        { title: `关于"${query}"的课程 1`, duration: '24课时', price: '¥199' },
        { title: `关于"${query}"的课程 2`, duration: '36课时', price: '¥299' },
        { title: `关于"${query}"的课程 3`, duration: '48课时', price: '¥399' }
    ];

    // 显示结果
    resultsContainer.innerHTML = `
        <h3>搜索结果 "${query}" (${mockResults.length}个结果)</h3>
        <div class="search-results-grid">
            ${mockResults.map(course => `
                <div class="course-card search-result-card">
                    <div class="course-info">
                        <h4>${course.title}</h4>
                        <div class="course-meta">
                            <span>${course.duration}</span>
                            <span class="price">${course.price}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // 滚动到结果区域
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 建议功能（简单实现）
function showSearchSuggestions(value) {
    // 移除旧的建议
    const oldSuggestions = document.querySelector('.search-suggestions');
    if (oldSuggestions) {
        oldSuggestions.remove();
    }

    if (value.length < 2) return;

    // 创建建议列表
    const suggestions = [
        'JavaScript基础入门',
        'Python编程进阶',
        'UI设计实战',
        'Web前端开发',
        '数据分析课程',
        '机器学习入门'
    ];

    // 过滤建议
    const filtered = suggestions.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
    );

    if (filtered.length > 0) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'search-suggestions';
        suggestionsContainer.innerHTML = filtered.map(item =>
            `<div class="suggestion-item" onclick="selectSuggestion('${item}')">${item}</div>`
        ).join('');

        const searchGroup = document.querySelector('.search-group');
        if (searchGroup) {
            searchGroup.appendChild(suggestionsContainer);
        }
    }
}

// 隐藏搜索建议
function hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) {
        suggestions.remove();
    }
}

// 选择建议
function selectSuggestion(value) {
    document.getElementById('course-search').value = value;
    hideSearchSuggestions();
    performSearch();
}

// 工具函数
const Utils = {
    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 格式化货币
    formatCurrency: function(amount) {
        return '¥' + amount.toFixed(2);
    },

    // 格式化日期
    formatDate: function(date) {
        const d = new Date(date);
        return d.toLocaleDateString('zh-CN');
    },

    // 存储到本地
    saveToStorage: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    // 从本地获取
    getFromStorage: function(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },

    // 显示消息
    showMessage: function(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            animation: fadeInRight 0.3s ease;
        `;

        document.body.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
};

// 键盘导航支持
function initializeKeyboardNavigation() {
    // Tab键导航高亮
    document.addEventListener('keydown', function(e) {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (e.key === 'Tab') {
            // 添加焦点样式
            document.body.classList.add('keyboard-navigation');
        }

        if (e.key === 'Escape') {
            // ESC键关闭菜单
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }

            // 关闭搜索建议
            hideSearchSuggestions();
        }
    });

    // 鼠标点击时移除键盘导航样式
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// 初始化键盘导航
initializeKeyboardNavigation();

// 导出工具函数供其他JS文件使用
window.Utils = Utils;