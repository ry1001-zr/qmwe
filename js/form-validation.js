// 表单验证功能 - form-validation.js

class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;

        this.rules = {};
        this.errors = {};
        this.touched = new Set();
        this.isSubmitting = false;

        this.init();
    }

    init() {
        // 设置验证规则
        this.setupValidationRules();

        // 绑定事件
        this.bindEvents();

        // 添加输入法支持
        this.setupIMEEvents();
    }

    setupValidationRules() {
        // 用户名规则
        this.rules.username = {
            required: true,
            minLength: 3,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9_]+$/,
            message: {
                required: '请输入用户名',
                minLength: '用户名至少需要3个字符',
                maxLength: '用户名不能超过20个字符',
                pattern: '用户名只能包含字母、数字和下划线'
            }
        };

        // 邮箱规则
        this.rules.email = {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: {
                required: '请输入邮箱地址',
                pattern: '请输入有效的邮箱地址'
            }
        };

        // 手机号规则
        this.rules.phone = {
            required: true,
            pattern: /^1[3-9]\d{9}$/,
            message: {
                required: '请输入手机号码',
                pattern: '请输入有效的11位手机号码'
            }
        };

        // 密码规则
        this.rules.password = {
            required: true,
            minLength: 8,
            custom: (value) => {
                // 密码强度检查
                let strength = 0;
                if (value.length >= 8) strength++;
                if (/[a-z]/.test(value)) strength++;
                if (/[A-Z]/.test(value)) strength++;
                if (/\d/.test(value)) strength++;
                if (/[^\w\s]/.test(value)) strength++;

                if (strength < 2) {
                    return '密码强度过低';
                }
                if (strength < 4) {
                    return '密码强度中等，建议使用大小写字母、数字和特殊字符';
                }
                return true;
            },
            message: {
                required: '请设置密码',
                minLength: '密码至少需要8个字符',
                custom: '密码强度过低'
            }
        };

        // 确认密码规则
        this.rules['confirm-password'] = {
            required: true,
            match: 'password',
            message: {
                required: '请确认密码',
                match: '两次密码输入不一致'
            }
        };

        // 昵称规则（可选）
        this.rules.nickname = {
            maxLength: 30,
            pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/,
            message: {
                maxLength: '昵称不能超过30个字符',
                pattern: '昵称只能包含中文、字母、数字、下划线和横线'
            }
        };

        // 验证码规则
        this.rules.captcha = {
            required: true,
            length: 4,
            message: {
                required: '请输入验证码',
                length: '验证码长度为4位'
            }
        };

        // 复选框组规则
        this.rules['agreement'] = {
            required: true,
            message: {
                required: '请同意用户协议'
            }
        };
    }

    bindEvents() {
        // 输入框失去焦点时验证
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.touched.add(input.name);
                this.validateField(input);
            });

            // 实时验证（限制频率）
            input.addEventListener('input', window.Utils.debounce(() => {
                if (this.touched.has(input.name)) {
                    this.validateField(input);
                }
            }, 300));
        });

        // 表单提交
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // 密码切换显示
        const toggleButtons = this.form.querySelectorAll('.toggle-password');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    btn.textContent = '🙈';
                } else {
                    input.type = 'password';
                    btn.textContent = '👁';
                }
            });
        });

        // 验证码刷新
        const refreshCaptcha = document.getElementById('refresh-captcha');
        if (refreshCaptcha) {
            refreshCaptcha.addEventListener('click', this.refreshCaptcha.bind(this));
        }

        // 协议复选框
        const agreement = this.form.querySelector('#agreement');
        if (agreement) {
            agreement.addEventListener('change', () => {
                this.validateField(agreement);
            });
        }

        // 密码强度指示器
        const passwordInput = this.form.querySelector('#password');
        if (passwordInput) {
            passwordInput.addEventListener('input', this.updatePasswordStrength.bind(this));
        }
    }

    setupIMEEvents() {
        // 输入法支持（中文输入法时不验证）
        const inputs = this.form.querySelectorAll('input[type="text"], input[type="email"], textarea');
        inputs.forEach(input => {
            let isComposing = false;

            input.addEventListener('compositionstart', () => {
                isComposing = true;
            });

            input.addEventListener('compositionend', () => {
                isComposing = false;
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                if (!isComposing) {
                    window.Utils.debounce(() => {
                        if (this.touched.has(input.name)) {
                            this.validateField(input);
                        }
                    }, 300)();
                }
            });
        });
    }

    validateField(field) {
        const rules = this.rules[field.name];
        if (!rules) return true;

        const value = field.value.trim();
        const hasError = this.checkFieldRules(field, value, rules);

        this.displayFieldError(field, hasError);

        return !hasError;
    }

    checkFieldRules(field, value, rules) {
        const errors = [];

        // 必填检查
        if (rules.required && !value) {
            errors.push(rules.message.required);
        }

        // 如果值为空且不是必填，跳过其他验证
        if (!value && !rules.required) return errors;

        // 最小长度检查
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(rules.message.minLength);
        }

        // 最大长度检查
        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(rules.message.maxLength);
        }

        // 长度检查
        if (rules.length && value.length !== rules.length) {
            errors.push(rules.message.length);
        }

        // 正则表达式检查
        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(rules.message.pattern);
        }

        // 匹配字段检查
        if (rules.match) {
            const matchField = this.form.querySelector(`[name="${rules.match}"]`);
            if (matchField && value !== matchField.value) {
                errors.push(rules.message.match);
            }
        }

        // 自定义验证函数
        if (rules.custom) {
            const result = rules.custom(value);
            if (result !== true) {
                errors.push(typeof result === 'string' ? result : rules.message.custom);
            }
        }

        return errors.length > 0 ? errors : null;
    }

    displayFieldError(field, errors) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');

        if (errors) {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');

            if (errorElement) {
                errorElement.textContent = errors.join(', ');
            }

            // 显示错误动画
            formGroup.classList.add('shake');
            setTimeout(() => {
                formGroup.classList.remove('shake');
            }, 500);
        } else {
            formGroup.classList.remove('error');
            formGroup.classList.add('success');

            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }

    updatePasswordStrength() {
        const password = this.form.querySelector('#password');
        const strengthBar = this.form.querySelector('.strength-bar');
        const strengthText = this.form.querySelector('.strength-text');

        if (!password || !strengthBar || !strengthText) return;

        const value = password.value;
        let strength = this.calculatePasswordStrength(value);

        // 更新强度条
        strengthBar.style.width = strength.percentage + '%';
        strengthBar.style.backgroundColor = this.getStrengthColor(strength.level);

        // 更新文字
        const levelText = ['很弱', '弱', '中等', '强', '很强'][strength.level];
        strengthText.textContent = `密码强度：${levelText}`;
        strengthText.style.color = this.getStrengthColor(strength.level);
    }

    calculatePasswordStrength(password) {
        let strength = 0;

        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^\w\s]/.test(password)) strength++;

        const level = Math.min(strength - 1, 4);
        const percentage = Math.min((strength / 6) * 100, 100);

        return { level, percentage };
    }

    getStrengthColor(level) {
        const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997'];
        return colors[level];
    }

    refreshCaptcha() {
        const captchaImg = document.getElementById('captcha-image');
        const captchaInput = document.getElementById('captcha');

        if (captchaImg) {
            // 模拟刷新验证码
            captchaImg.src = `images/captcha.jpg?t=${Date.now()}`;
        }

        if (captchaInput) {
            captchaInput.value = '';
            captchaInput.focus();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        const submitBtn = this.form.querySelector('[type="submit"]');
        const formData = new FormData(this.form);

        // 验证所有字段
        let isValid = true;
        const inputs = this.form.querySelectorAll('input, select, textarea');

        for (let input of inputs) {
            if (!this.validateField(input)) {
                isValid = false;
                this.touched.add(input.name);
            }
        }

        if (!isValid) {
            // 滚动到第一个错误字段
            const firstError = this.form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.querySelector('input').focus();
            }

            window.Utils.showMessage('请修正所有错误后再提交', 'error');
            return;
        }

        // 禁用提交按钮
        this.isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = `<span class='loading-spinner'>⏳</span> 注册中...`;

        try {
            // 模拟API提交
            await this.submitForm(formData);

            // 显示成功消息
            this.showSuccess(submitBtn);
        } catch (error) {
            // 显示错误消息
            window.Utils.showMessage(error.message || '注册失败，请重试', 'error');

            // 重新启用按钮
            this.isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '立即注册';

            // 刷新验证码
            this.refreshCaptcha();
        }
    }

    async submitForm(formData) {
        // 模拟API调用
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟服务器响应
                const random = Math.random();

                if (random > 0.8) {
                    // 模拟失败
                    reject(new Error('用户名已存在'));
                } else {
                    // 模拟成功
                    resolve({ success: true });
                }
            }, 3000);
        });
    }

    showSuccess(submitBtn) {
        // 隐藏表单，显示成功消息
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.classList.add('fade-in');

            // 隐藏表单
            this.form.style.display = 'none';
        }

        // 模拟跳转
        let countdown = 3;
        const countdownEl = successMessage.querySelector('p');
        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownEl.textContent = `欢迎加入我们！我们将在${countdown}秒后自动跳转到登录页面...`;
            } else {
                clearInterval(interval);
                // 跳转到登录页面
                window.location.href = 'login.html';
            }
        }, 1000);
    }
}

// 初始化表单验证
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        new FormValidator('#register-form');
    }
});

// 导出类供其他模块使用
window.FormValidator = FormValidator;