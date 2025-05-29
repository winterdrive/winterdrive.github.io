/**
 * Animations - 動畫效果模組
 * 處理視覺效果、滾動動畫、載入效果
 */

class Animations {
  constructor() {
    // 游標功能已移除 - 使用預設游標
    this.init();
  }
  init() {
    // setupCustomCursor() 已移除 - 使用預設游標
    this.setupScrollAnimations();
    this.setupLoadingAnimation();
    this.setupHoverEffects();
  }
  /* 游標功能已移除 - 使用預設游標 */

  /**
   * 設置滾動動畫
   */
  setupScrollAnimations() {
    // 滾動顯示動畫
    this.setupScrollReveal();

    // 數字計數動畫
    this.setupCounterAnimation();

    // 進度條動畫
    this.setupProgressBars();
  }

  /**
   * 滾動顯示動畫
   */
  setupScrollReveal() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // 為子元素添加延遲動畫
          const children = entry.target.querySelectorAll('[data-delay]');
          children.forEach(child => {
            const delay = child.getAttribute('data-delay');
            child.style.animationDelay = delay + 'ms';
            child.classList.add('animate-fadeIn');
          });
        }
      });
    }, observerOptions);    // 觀察所有需要動畫的元素
    document.querySelectorAll('.scroll-reveal, .tech-button').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * 數字計數動畫
   */
  setupCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  /**
   * 執行計數動畫
   * @param {HTMLElement} element - 計數元素
   */
  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = parseInt(element.getAttribute('data-duration')) || 2000;
    const start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用緩動函數
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeOutQuart);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  }

  /**
   * 設置進度條動畫
   */
  setupProgressBars() {
    const progressBars = document.querySelectorAll('[data-progress]');

    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateProgressBar(entry.target);
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => progressObserver.observe(bar));
  }

  /**
   * 執行進度條動畫
   * @param {HTMLElement} element - 進度條元素
   */
  animateProgressBar(element) {
    const progress = parseInt(element.getAttribute('data-progress'));
    const duration = parseInt(element.getAttribute('data-duration')) || 1500;

    element.style.width = '0%';
    element.style.transition = `width ${duration}ms ease-out`;

    // 延遲開始動畫以確保過渡效果
    setTimeout(() => {
      element.style.width = progress + '%';
    }, 100);
  }

  /**
   * 設置載入動畫
   */
  setupLoadingAnimation() {
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (loadingOverlay) {
      // 模擬載入時間
      setTimeout(() => {
        this.hideLoadingAnimation();
      }, 1500);
    }
  }

  /**
   * 隱藏載入動畫
   */
  hideLoadingAnimation() {
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (loadingOverlay) {
      loadingOverlay.classList.add('fade-out');

      // 動畫完成後移除元素
      setTimeout(() => {
        loadingOverlay.remove();
        // 觸發頁面載入完成事件
        this.onPageLoaded();
      }, 500);
    }
  }

  /**
   * 頁面載入完成後的處理
   */
  onPageLoaded() {
    // 添加載入完成的類別
    document.body.classList.add('loaded');

    // 開始主要動畫序列
    this.startMainAnimationSequence();
  }

  /**
   * 開始主要動畫序列
   */  startMainAnimationSequence() {
    // 按順序顯示各個部分
    const animationSequence = [
      { selector: '.tech-grid', delay: 200 }
    ];

    animationSequence.forEach(({ selector, delay }) => {
      setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) {
          element.classList.add('animate-fadeIn');
        }
      }, delay);
    });
  }
  /**
   * 設置懸停效果
   */
  setupHoverEffects() {
    // 技術按鈕懸停效果
    this.setupTechButtonHover();

    // 導航連結懸停效果
    this.setupNavLinkHover();
  }

  /**
   * 技術按鈕懸停效果
   */
  setupTechButtonHover() {
    document.querySelectorAll('.tech-button').forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-8px) scale(1.02)';
        button.classList.add('animate-glow');
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
        button.classList.remove('animate-glow');
      });

      // 點擊波紋效果
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e, button);
      });
    });
  }
  /**
   * 導航連結懸停效果
   */
  setupNavLinkHover() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.color = 'var(--primary-color)';
      });

      link.addEventListener('mouseleave', () => {
        link.style.color = '';
      });
    });
  }

  /**
   * 創建波紋效果
   * @param {Event} e - 點擊事件
   * @param {HTMLElement} element - 目標元素
   */
  createRippleEffect(e, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      background-color: rgba(255, 255, 255, 0.5);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    // 移除波紋元素
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
  /* 視差背景效果已移至 navigation.js，請使用 Navigation 模組的 updateParallaxEffects() */

  /**
   * 文字打字機效果
   * @param {HTMLElement} element - 目標元素
   * @param {string} text - 要顯示的文字
   * @param {number} speed - 打字速度（毫秒）
   */
  typewriterEffect(element, text, speed = 100) {
    element.textContent = '';
    let i = 0;

    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        element.classList.add('typing-complete');
      }
    }, speed);
  }
}

// 全域 Animations
window.Animations = Animations;

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
  new Animations();
});
