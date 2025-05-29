/**
 * Utils - 工具函數模組
 * 包含通用工具函數、性能優化、瀏覽器兼容性處理
 */

class Utils {
  constructor() {
    this.init();
  }

  init() {
    this.setupBrowserSupport();
    this.setupPerformanceOptimizations();
  }

  /**
   * 瀏覽器支援檢測
   */
  setupBrowserSupport() {
    // 檢測CSS自定義屬性支援
    if (!this.supportsCSSCustomProperties()) {
      this.loadCSSCustomPropertiesPolyfill();
    }

    // 檢測Intersection Observer支援
    if (!window.IntersectionObserver) {
      this.loadIntersectionObserverPolyfill();
    }

    // 檢測 requestAnimationFrame 支援
    this.polyfillRequestAnimationFrame();
  }

  /**
   * 性能優化設置
   */
  setupPerformanceOptimizations() {
    // 圖片懶加載
    this.setupLazyLoading();

    // 預加載關鍵資源
    this.preloadCriticalResources();

    // 設置性能監控
    this.setupPerformanceMonitoring();
  }

  /**
   * 檢測 CSS 自定義屬性支援
   * @returns {boolean} 是否支援
   */
  supportsCSSCustomProperties() {
    return window.CSS && CSS.supports && CSS.supports('color', 'var(--test)');
  }

  /**
   * 載入 CSS 自定義屬性 polyfill
   */
  loadCSSCustomPropertiesPolyfill() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2';
    script.onload = () => {
      cssVars({
        include: 'link[rel=stylesheet],style',
        preserveStatic: true,
        preserveVars: true
      });
    };
    document.head.appendChild(script);
  }

  /**
   * 載入 Intersection Observer polyfill
   */
  loadIntersectionObserverPolyfill() {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
  }

  /**
   * polyfill requestAnimationFrame
   */
  polyfillRequestAnimationFrame() {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (callback) => {
        return setTimeout(callback, 1000 / 60);
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = (id) => {
        clearTimeout(id);
      };
    }
  }

  /**
   * 設置圖片懶加載
   */
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // 降級處理
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  /**
   * 預加載關鍵資源
   */
  preloadCriticalResources() {
    const criticalResources = [
      { href: './css/main.css', as: 'style' },
      { href: './js/main.js', as: 'script' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      document.head.appendChild(link);
    });
  }

  /**
   * 性能監控
   */
  setupPerformanceMonitoring() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          this.logPerformanceMetrics(perfData);
        }, 0);
      });
    }
  }

  /**
   * 記錄性能指標
   * @param {PerformanceNavigationTiming} perfData - 性能數據
   */
  logPerformanceMetrics(perfData) {
    const metrics = {
      'DNS查詢時間': perfData.domainLookupEnd - perfData.domainLookupStart,
      'TCP連接時間': perfData.connectEnd - perfData.connectStart,
      '請求響應時間': perfData.responseEnd - perfData.requestStart,
      'DOM構建時間': perfData.domContentLoadedEventEnd - perfData.domLoading,
      '頁面載入時間': perfData.loadEventEnd - perfData.navigationStart
    };

    console.group('🚀 性能指標');
    Object.entries(metrics).forEach(([key, value]) => {
      console.log(`${key}: ${Math.round(value)}ms`);
    });
    console.groupEnd();
  }

  /**
   * 節流函數
   * @param {Function} func - 要節流的函數
   * @param {number} limit - 節流間隔
   * @returns {Function} 節流後的函數
   */
  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * 防抖函數
   * @param {Function} func - 要防抖的函數
   * @param {number} delay - 延遲時間
   * @returns {Function} 防抖後的函數
   */
  static debounce(func, delay) {
    let timeoutId;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
  }

  /**
   * 深度克隆對象
   * @param {any} obj - 要克隆的對象
   * @returns {any} 克隆後的對象
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const clonedObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = this.deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }

  /**
   * 獲取查詢參數
   * @param {string} param - 參數名
   * @returns {string|null} 參數值
   */
  static getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /**
   * 設置查詢參數
   * @param {string} param - 參數名
   * @param {string} value - 參數值
   */
  static setUrlParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
  }

  /**
   * 移除查詢參數
   * @param {string} param - 參數名
   */
  static removeUrlParam(param) {
    const url = new URL(window.location);
    url.searchParams.delete(param);
    window.history.replaceState({}, '', url);
  }

  /**
   * 複製文字到剪貼板
   * @param {string} text - 要複製的文字
   * @returns {Promise<boolean>} 是否成功
   */
  static async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 降級處理
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        textArea.remove();
        return successful;
      }
    } catch (error) {
      console.error('複製失敗:', error);
      return false;
    }
  }

  /**
   * 檢測設備類型
   * @returns {Object} 設備信息
   */
  static getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android|Silk|Kindle|PlayBook/i.test(userAgent) && !/Mobile/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    return {
      isMobile,
      isTablet,
      isDesktop,
      userAgent,
      platform: navigator.platform,
      language: navigator.language
    };
  }

  /**
   * 檢測瀏覽器
   * @returns {Object} 瀏覽器信息
   */
  static getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (userAgent.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/([0-9]+)/)[1];
    } else if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/([0-9]+)/)[1];
    } else if (userAgent.indexOf('Safari') > -1) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/([0-9]+)/)[1];
    } else if (userAgent.indexOf('Edge') > -1) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edge\/([0-9]+)/)[1];
    }

    return {
      name: browserName,
      version: browserVersion,
      userAgent
    };
  }

  /**
   * 格式化文件大小
   * @param {number} bytes - 位元組數
   * @param {number} decimals - 小數位數
   * @returns {string} 格式化後的大小
   */
  static formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * 生成隨機ID
   * @param {number} length - ID長度
   * @returns {string} 隨機ID
   */
  static generateRandomId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 檢測暗色模式
   * @returns {boolean} 是否為暗色模式
   */
  static isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * 監聽暗色模式變化
   * @param {Function} callback - 回調函數
   */
  static onDarkModeChange(callback) {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener(callback);
      return () => mediaQuery.removeListener(callback);
    }
    return () => { };
  }

  /**
   * 檢測在線狀態
   * @returns {boolean} 是否在線
   */
  static isOnline() {
    return navigator.onLine;
  }

  /**
   * 監聽網路狀態變化
   * @param {Function} onlineCallback - 上線回調
   * @param {Function} offlineCallback - 離線回調
   */
  static onNetworkChange(onlineCallback, offlineCallback) {
    window.addEventListener('online', onlineCallback);
    window.addEventListener('offline', offlineCallback);

    return () => {
      window.removeEventListener('online', onlineCallback);
      window.removeEventListener('offline', offlineCallback);
    };
  }

  /**
   * 平滑滾動到元素
   * @param {HTMLElement|string} element - 目標元素或選擇器
   * @param {Object} options - 滾動選項
   */
  static scrollToElement(element, options = {}) {
    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) return;

    const defaultOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      offset: 0
    };

    const finalOptions = { ...defaultOptions, ...options };

    if (finalOptions.offset) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - finalOptions.offset;
      window.scrollTo({
        top: targetPosition,
        behavior: finalOptions.behavior
      });
    } else {
      target.scrollIntoView({
        behavior: finalOptions.behavior,
        block: finalOptions.block,
        inline: finalOptions.inline
      });
    }
  }

  /**
   * 載入外部腳本
   * @param {string} src - 腳本URL
   * @param {Object} options - 載入選項
   * @returns {Promise} 載入Promise
   */
  static loadScript(src, options = {}) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = options.async !== false;
      script.defer = options.defer || false;

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  /**
   * 載入外部樣式表
   * @param {string} href - 樣式表URL
   * @returns {Promise} 載入Promise
   */
  static loadStylesheet(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;

      link.onload = resolve;
      link.onerror = reject;

      document.head.appendChild(link);
    });
  }

  /**
   * 元素是否在視窗中
   * @param {HTMLElement} element - 目標元素
   * @param {number} threshold - 閾值
   * @returns {boolean} 是否可見
   */
  static isElementInViewport(element, threshold = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -threshold &&
      rect.left >= -threshold &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
    );
  }

  /**
   * 等待元素出現
   * @param {string} selector - 選擇器
   * @param {number} timeout - 超時時間
   * @returns {Promise<HTMLElement>} 元素Promise
   */
  static waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`元素 ${selector} 在 ${timeout}ms 內未出現`));
      }, timeout);
    });
  }
}

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
  new Utils();
});

// 創建全域 Utils 實例
window.Utils = new Utils();
