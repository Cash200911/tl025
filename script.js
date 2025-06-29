// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 导航菜单交互 ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('change', () => {
            mobileNav.classList.toggle('active', menuToggle.checked);
        });

        // Close mobile menu when a link is clicked (optional, but good UX)
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle.checked) {
                    menuToggle.checked = false;
                    mobileNav.classList.remove('active');
                }
            });
        });
    }

    // --- 返回顶部按钮 ---
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.style.display = window.pageYOffset > 300 ? 'block' : 'none';
        });
    }

    // --- 多语言功能 ---
    const languageSwitcher = document.getElementById('language-switcher');
    let translations = {}; // 将从 JSON 文件加载翻译

    // 加载翻译文件
    async function loadTranslations() {
        try {
            const response = await fetch('translations.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            translations = await response.json();
            console.log('Translations loaded:', translations); // Debugging
            // 翻译加载完成后，应用初始语言
            initializeLanguage();
        } catch (error) {
            console.error('Error loading translations:', error);
            // 如果加载失败，可以提供一个回退机制，例如只显示默认语言
        }
    }

    // 应用翻译的函数
    function applyTranslation(lang) {
        if (!translations[lang]) {
            console.warn(`No translations found for language: ${lang}`);
            return;
        }

        // 翻译普通文本内容
        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // 翻译特殊属性，如 meta description 和 title
        const pageTitleElement = document.querySelector('title');
        const metaDescriptionElement = document.querySelector('meta[name="description"]');

        if (pageTitleElement && translations[lang]['page-title']) {
            pageTitleElement.textContent = translations[lang]['page-title'];
        }
        if (metaDescriptionElement && translations[lang]['meta-description']) {
            metaDescriptionElement.setAttribute('content', translations[lang]['meta-description']);
        }

        // 更新页面语言属性
        document.documentElement.lang = lang;
    }

    // 初始化语言
    function initializeLanguage() {
        const savedLang = localStorage.getItem('selectedLanguage');
        const browserLang = navigator.language || navigator.userLanguage; // 获取浏览器语言

        let initialLang = 'zh-CN'; // 默认语言

        if (savedLang && translations[savedLang]) {
            initialLang = savedLang;
        } else if (browserLang.startsWith('en') && translations['en']) {
            initialLang = 'en';
        } else if (browserLang.startsWith('th') && translations['th']) {
            initialLang = 'th';
        }
        // 您可以根据需要添加更多浏览器语言检测逻辑

        if (languageSwitcher) {
            languageSwitcher.value = initialLang;
        }
        applyTranslation(initialLang);
    }

    // 监听语言选择器的变化
    if (languageSwitcher) {
        languageSwitcher.addEventListener('change', (event) => {
            const selectedLang = event.target.value;
            applyTranslation(selectedLang);
            localStorage.setItem('selectedLanguage', selectedLang);
        });
    }

    // 页面加载时加载翻译
    loadTranslations();
});
