/**
 * Main - 主要初始化模組
 * 統一管理所有模組的初始化和協調工作
 */


class App {
  constructor() {
    this.modules = {};
    this.isInitialized = false;
    console.log('📱 App 實例已創建');
    // 簡化初始化流程
    this.initBasic();
  }
  /**
   * 基礎初始化（不依賴DOM）
   */
  initBasic() {
    console.log('🔧 開始基礎初始化...');
    this.setupBasics();
    this.setupGlobalEventListeners();

    // 初始化關鍵模組，確保動畫正常工作
    if (document.readyState !== 'loading') {
      this.initEssentialModules();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.initEssentialModules();
      });
    }

    this.isInitialized = true;
    console.log('✅ 基礎初始化完成');
  }

  /**
   * 初始化應用程式
   */
  async init() {
    try {
      // 顯示載入狀態
      this.showInitialLoading();

      // 基礎設置
      this.setupBasics();

      // 等待 DOM 完全載入
      if (document.readyState === 'loading') {
        await this.waitForDOMContentLoaded();
      }

      // 初始化所有模組
      await this.initializeModules();

      // 設置全域事件監聽器
      this.setupGlobalEventListeners();

      // 完成初始化
      this.completeInitialization();

    } catch (error) {
      console.error('應用程式初始化失敗:', error);
      this.handleInitializationError(error);
    }
  }
  /**
   * 顯示初始化載入狀態
   */
  showInitialLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'flex';
      loadingOverlay.classList.add('show');
      console.log('📍 顯示載入動畫');
    }
  }

  /**
   * 基礎設置
   */
  setupBasics() {
    // 設置視窗環境變數
    this.setupViewportVariables();

    // 設置主題
    this.setupTheme();

    // 設置語言
    this.setupLanguage();

    // 設置可訪問性
    this.setupAccessibility();
  }  /**
   * 設置視窗環境變數
   */
  setupViewportVariables() {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateViewportHeight();

    // 使用 Utils 的靜態方法
    if (window.Utils && typeof Utils.throttle === 'function') {
      window.addEventListener('resize', Utils.throttle(updateViewportHeight, 100));
    } else {
      // 簡單的防抖處理
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateViewportHeight, 100);
      });
    }
  }  /**
   * 設置主題 - 已移至檔案末尾的 applyTheme 函數
   */
  setupTheme() {
    // 初始化主題狀態（在 DOMContentLoaded 事件中處理）
    const theme = localStorage.getItem('theme') || 'dark';
    // 確保 applyTheme 函數可用後再執行
    if (typeof applyTheme === 'function') {
      applyTheme(theme);
    } else {
      // 如果 applyTheme 尚未定義，延遲執行
      setTimeout(() => {
        if (typeof applyTheme === 'function') {
          applyTheme(theme);
        }
      }, 100);
    }
  }

  /**
   * 設置主題 - 已移至檔案末尾的 applyTheme 函數
   * @param {string} theme - 主題名稱
   */
  setTheme(theme) {
    applyTheme(theme);
  }

  /**
   * 設置語言
   */
  setupLanguage() {
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = navigator.language.substring(0, 2);

    const language = savedLanguage || browserLanguage || 'zh';
    this.setLanguage(language);
  }

  /**
   * 設置語言
   * @param {string} lang - 語言代碼
   */
  setLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('language', lang);
  }

  /**
   * 設置可訪問性
   */
  setupAccessibility() {
    // 檢查使用者偏好
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }

    // 跳過連結
    this.createSkipLink();

    // 焦點管理
    this.setupFocusManagement();
  }

  /**
   * 創建跳過連結
   */
  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = '跳過導航';

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * 設置焦點管理
   */
  setupFocusManagement() {
    // 為主要內容區域添加 ID
    const mainContent = document.querySelector('main') || document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }

    // 監聽鍵盤導航
    document.addEventListener('keydown', (e) => {
      // Tab 鍵導航視覺提示
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    // 滑鼠點擊移除鍵盤導航提示
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }

  /**
   * 等待 DOM 內容載入完成
   * @returns {Promise} Promise
   */
  waitForDOMContentLoaded() {
    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }

  /**
   * 初始化所有模組
   */
  async initializeModules() {
    console.log('🚀 開始初始化模組...');

    // 如果使用傳統腳本載入（非模組系統）
    const moduleInitializers = [
      { name: 'Utils', init: () => window.Utils || new Utils() },
      { name: 'Navigation', init: () => window.Navigation || new Navigation() },
      { name: 'Animations', init: () => window.Animations || new Animations() }
    ];

    for (const { name, init } of moduleInitializers) {
      try {
        console.log(`📦 初始化 ${name} 模組...`);
        this.modules[name] = init();
        console.log(`✅ ${name} 模組初始化完成`);
      } catch (error) {
        console.error(`❌ ${name} 模組初始化失敗:`, error);
      }
    }

    // 載入模組化組件
    await this.loadComponents();
  }
  /**
   * 載入模組化組件
   */  async loadComponents() {
    console.log('📄 開始載入模組化組件...');

    try {      // 載入導航欄組件
      await this.loadNavbarComponent();
      console.log('✅ 導航欄組件載入完成');

      // 載入專案組件
      await this.loadProjectsComponent();
      console.log('✅ 專案組件載入完成');

      // 載入頁腳組件
      await this.loadFooterComponent();
      console.log('✅ 頁腳組件載入完成');      // 初始化動態組件
      await this.initializeDynamicComponents();

      // 組件載入完成後重新應用主題
      setTimeout(() => {
        const theme = localStorage.getItem('theme') || 'dark';
        if (typeof applyTheme === 'function') {
          applyTheme(theme);
          console.log('✅ 主題狀態已重新應用:', theme);
        }
      }, 200);

    } catch (error) {
      console.error('❌ 組件載入失敗:', error);
    }
  }

  /**
   * 載入導航欄組件
   */
  async loadNavbarComponent() {
    try {
      const response = await fetch('./components/navbar.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const navbarHTML = await response.text();

      // 找到現有的導航欄並替換
      const existingNavbar = document.querySelector('.modern-navbar');
      if (existingNavbar) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = navbarHTML;
        const newNavbar = tempDiv.firstElementChild;

        // 替換導航欄
        existingNavbar.parentNode.replaceChild(newNavbar, existingNavbar);

        // 重新綁定導航欄事件
        this.bindNavbarEvents();
      }
    } catch (error) {
      console.error('載入導航欄組件失敗:', error);
    }
  }
  /**
   * 載入頁腳組件
   */
  async loadFooterComponent() {
    try {
      const response = await fetch('./components/footer.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const footerHTML = await response.text();
      // 找到現有的頁腳並替換（新的 BEM 樣式）
      const existingFooter = document.querySelector('.footer');
      if (existingFooter) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = footerHTML;
        const newFooter = tempDiv.firstElementChild;

        // 替換頁腳
        existingFooter.parentNode.replaceChild(newFooter, existingFooter);

        // 重新綁定頁腳事件
        this.bindFooterEvents();
      }
    } catch (error) {
      console.error('載入頁腳組件失敗:', error);
    }
  }
  /**
   * 載入專案組件
   */
  async loadProjectsComponent() {
    try {
      console.log('📦 開始載入專案組件...');
      const response = await fetch('./components/projects.html');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const projectsHTML = await response.text();
      console.log('📦 專案組件 HTML 載入成功，長度:', projectsHTML.length);

      // 找到專案容器並載入內容
      const projectsContainer = document.getElementById('projects-container');
      if (projectsContainer) {
        projectsContainer.innerHTML = projectsHTML;
        console.log('✅ 專案組件成功插入到容器中');

        // 確保容器可見
        projectsContainer.style.display = 'block';
        projectsContainer.style.visibility = 'visible';

        // 檢查專案卡片數量
        const projectCards = projectsContainer.querySelectorAll('.project-card');
        console.log('📊 找到專案卡片數量:', projectCards.length);
      } else {
        console.error('❌ 找不到 #projects-container 元素');
      }
    } catch (error) {
      console.error('❌ 載入專案組件失敗:', error);
    }
  }

  /**
   * 初始化關鍵模組（確保基本功能正常）
   */
  initEssentialModules() {
    console.log('🔧 初始化關鍵模組...');

    try {
      // 初始化動畫模組以處理 scroll-reveal 元素
      if (window.Animations) {
        this.modules.Animations = new Animations();
        console.log('✅ 動畫模組初始化完成');
      }

      // 初始化導航模組
      if (window.Navigation) {
        this.modules.Navigation = new Navigation();
        console.log('✅ 導航模組初始化完成');
      }
    } catch (error) {
      console.error('❌ 關鍵模組初始化失敗:', error);
    }
  }

  /**
   * 綁定導航欄事件
   */
  bindNavbarEvents() {    /* 移動端菜單切換功能已移至 navigation.js，請使用 Navigation 模組的 toggleMobileMenu() */

    // 導航連結點擊事件
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {        /* 移動端菜單關閉和平滑滾動功能已移至 navigation.js，請使用 Navigation 模組的處理 */
      });
    });    // 主題切換按鈕（由於使用事件委派，這裡不需要手動綁定）
    // 主題切換功能已移至檔案末尾的全域事件委派處理// 滾動時更新導航欄樣式（功能已移至 Navigation 模組）
    /* this.setupNavbarScrollEffect(); */
  }
  /* 導航欄滾動效果已移至 navigation.js，請使用 Navigation 模組的 updateScrollElements() */
  /**
   * 綁定頁腳事件
   */
  bindFooterEvents() {    /* 回到頂部按鈕功能已移至 navigation.js，請使用 Navigation 模組的 setupBackToTop() */

    // 頁腳社交連結點擊效果
    const socialLinks = document.querySelectorAll('.footer__social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', (e) => {        // 為外部連結添加點擊效果
        if (link.hasAttribute('target')) {
          // 使用 animations 模組的波紋效果
          if (this.modules.Animations) {
            this.modules.Animations.createRippleEffect(e, link);
          }
        }
      });
    });    /* 頁腳平滑滾動功能已移至 navigation.js，請使用 Navigation 模組的 setupSmoothScrolling() */
  }
  /**
   * 顯示通知訊息
   * @param {string} message - 通知訊息
   * @param {string} type - 通知類型 (success, error, warning, info)
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    `;

    // 添加通知樣式
    const bgColor = type === 'success' ?
      'linear-gradient(45deg, #64ffda, #536dfe)' :
      type === 'error' ?
        'linear-gradient(45deg, #ff4081, #ff6b6b)' :
        'linear-gradient(45deg, #536dfe, #ff4081)';

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: #0c0c0c;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      z-index: 10000;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // 動畫顯示
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // 自動移除
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, type === 'error' ? 4000 : 3000);
  }  /* 波紋效果函數已移至 animations.js，請使用 this.animations.createRippleEffect() */
  /**
   * 切換主題 - 已移至檔案末尾的全域函數
   */
  toggleTheme() {
    const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }/**
   * 設置全域事件監聽器
   */
  setupGlobalEventListeners() {
    // 滾動事件由 Navigation 模組處理，避免重複
    // this.setupScrollEvents();

    // 鍵盤事件
    this.setupKeyboardEvents();

    // 視窗大小調整事件
    this.setupResizeEvents();
  }
  /**
   * 設置鍵盤事件（滾動功能已移至 Navigation 模組）
   */
  setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
      // Escape 鍵關閉所有彈出元素
      if (e.key === 'Escape') {
        this.closeAllModals();
      }

      // Ctrl+/ 顯示鍵盤快捷鍵幫助
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        this.showKeyboardShortcuts();
      }
    });
  }

  /**
   * 關閉所有彈出視窗
   */
  closeAllModals() {
    // 關閉移動端選單
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle?.classList.remove('active');
      document.body.style.overflow = '';
    }

    // 關閉其他彈出元素...
  }

  /**
   * 顯示鍵盤快捷鍵幫助
   */
  showKeyboardShortcuts() {
    this.showNotification('鍵盤快捷鍵：Escape-關閉彈出視窗, Ctrl+/-顯示幫助', 'info');
  }

  /**
   * 設置視窗大小調整事件
   */
  setupResizeEvents() {
    const handleResize = () => {
      // 更新 CSS 自定義屬性
      this.setupViewportVariables();

      // 重新計算佈局
      this.recalculateLayout();
    };

    if (window.Utils && typeof Utils.throttle === 'function') {
      window.addEventListener('resize', Utils.throttle(handleResize, 250));
    } else {
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
      });
    }
  }

  /**
   * 重新計算佈局
   */
  recalculateLayout() {
    // 通知所有模組重新計算佈局
    Object.values(this.modules).forEach(module => {
      if (module && typeof module.recalculateLayout === 'function') {
        module.recalculateLayout();
      }
    });
  }

  /**
   * 完成初始化
   */
  completeInitialization() {
    this.isInitialized = true;

    // 隱藏載入畫面
    this.hideLoadingOverlay();

    // 派發初始化完成事件
    this.dispatchCustomEvent('app:initialized');

    console.log('🎉 應用程式初始化完成!');
  }
  /**
   * 隱藏載入畫面
   */
  hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
      console.log('📍 隱藏載入動畫');
      loadingOverlay.classList.add('fade-out');
      loadingOverlay.classList.remove('show');

      setTimeout(() => {
        loadingOverlay.style.display = 'none';
        console.log('📍 載入動畫已完全隱藏');
      }, 500); // 等待動畫完成
    }
  }

  /**
   * 處理初始化錯誤
   * @param {Error} error - 錯誤物件
   */
  handleInitializationError(error) {
    console.error('初始化失敗:', error);

    // 顯示錯誤訊息
    this.showNotification('應用程式載入失敗，請重新整理頁面', 'error');

    // 隱藏載入畫面
    this.hideLoadingOverlay();

    // 記錄錯誤
    this.logError('initialization', error);
  }

  /**
   * 記錄錯誤
   * @param {string} context - 錯誤上下文
   * @param {Error} error - 錯誤物件
   */
  logError(context, error) {
    const errorData = {
      context,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // 在開發環境中記錄到控制台
    if (process?.env?.NODE_ENV === 'development') {
      console.error('Error logged:', errorData);
    }

    // 在生產環境中可以發送到錯誤追蹤服務
    // this.sendErrorToService(errorData);
  }

  /**
   * 獲取通知圖標
   * @param {string} type - 通知類型
   * @returns {string} 圖標名稱
   */
  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  /**
   * 派發自定義事件
   * @param {string} eventName - 事件名稱
   * @param {any} detail - 事件詳情
   */
  dispatchCustomEvent(eventName, detail = null) {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
  }

  /**
   * 初始化動態組件
   */
  async initializeDynamicComponents() {
    try {
      // 等待 ComponentBuilder 和 AppData 載入完成
      if (typeof ComponentBuilder === 'undefined' || typeof AppData === 'undefined') {
        await new Promise(resolve => {
          const checkComponents = () => {
            if (typeof ComponentBuilder !== 'undefined' && typeof AppData !== 'undefined') {
              resolve();
            } else {
              setTimeout(checkComponents, 100);
            }
          };
          checkComponents();
        });
      }

      const builder = new ComponentBuilder();

      // 動態替換各種元素
      const replacements = [
        // 導航連結
        { selector: '.nav-menu', html: builder.createNavigationLinks() },
        { selector: '#navMenu', html: builder.createNavigationLinks() },
        // 社交連結
        { selector: '.social-links', html: builder.createSocialLinks() },
        { selector: '#socialLinks', html: builder.createSocialLinks() },
        { selector: '#footerSocialLinks', html: builder.createSocialLinks() },

        // 聯絡資訊
        { selector: '.contact-cards', html: builder.createContactCards() },
        { selector: '#contactCards', html: builder.createContactCards() },
        { selector: '#footerContactInfo', html: builder.createContactCards() },

        // 版權信息
        { selector: '.copyright', html: builder.createCopyright() },
        { selector: '#copyright', html: builder.createCopyright() },
        { selector: '#footerCopyright', html: builder.createCopyright() },
        // 跳過返回頂部按鈕，因為 HTML 中已經定義了完整的按鈕結構
        // 避免重複渲染造成巢狀 button 元素
      ];

      // 執行替換
      let successCount = 0;
      replacements.forEach(({ selector, html }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element && html) {
            element.innerHTML = html;
            successCount++;
          }
        });
      });

      console.log(`✅ 動態組件初始化完成 (${successCount} 個元素已更新)`);
    } catch (error) {
      console.error('❌ 組件初始化失敗:', error);
    }
  }

  /**
   * 等待關鍵資源載入
   */
  async waitForCriticalResources() {
    const resources = [
      'utils.js'
    ];

    return Promise.all(resources.map(resource => {
      return new Promise((resolve) => {
        const checkResource = () => {
          switch (resource) {
            case 'utils.js':
              if (window.Utils) resolve();
              else setTimeout(checkResource, 50);
              break;
            default:
              resolve();
          }
        };
        checkResource();
      });
    }));
  }
}

// 導出 App 類別供外部使用，但不自動創建實例
window.App = App;

// 導出供其他地方使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}

/**
 * 主題切換按鈕互動 - 使用事件委派處理動態載入的按鈕
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.body.classList.toggle('light-theme', theme === 'light');
  // 更新所有主題切換按鈕的圖標
  const buttons = document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn');
  buttons.forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      if (theme === 'light') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    }
  });
}

// 使用事件委派來處理動態載入的按鈕
document.addEventListener('click', function (e) {
  // 檢查點擊的元素是否為主題切換按鈕或其子元素
  if (e.target.id === 'themeToggleBtn' || 
      e.target.classList.contains('theme-toggle-btn') || 
      e.target.closest('#themeToggleBtn') || 
      e.target.closest('.theme-toggle-btn') ||
      // 檢查是否點擊了按鈕內的圖標
      (e.target.tagName === 'I' && e.target.closest('#themeToggleBtn')) ||
      (e.target.tagName === 'I' && e.target.closest('.theme-toggle-btn'))) {
    
    console.log('主題切換按鈕被點擊');
    var currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    var newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    console.log('主題已切換至:', newTheme);
  }
});

// 初始化主題狀態
document.addEventListener('DOMContentLoaded', function () {
  var theme = localStorage.getItem('theme') || 'dark';
  applyTheme(theme);
});
