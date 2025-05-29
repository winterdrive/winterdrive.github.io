/**
 * Navigation - 導航功能模組
 * 處理導航欄交互、滾動效果、移動端菜單
 */

class Navigation {
  constructor() {
    this.init();
  }
  init() {
    this.bindEvents();
    this.setupSmoothScrolling();
    this.highlightCurrentSection();
    this.setupBackToTop();
    this.setupKeyboardNavigation();
  }

  /**
   * 綁定事件監聽器
   */
  bindEvents() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // 移動端菜單切換
    if (navToggle && navMenu) {
      // 檢查選單是否有連結，若無則隱藏按鈕
      if (!navMenu.querySelector('.nav-link')) {
        navToggle.style.display = 'none';
      } else {
        navToggle.style.display = '';
      }
      navToggle.addEventListener('click', () => {
        this.toggleMobileMenu(navMenu, navToggle);
      });

      // 點擊導航連結關閉移動端菜單
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu(navMenu, navToggle);
        });
      });
    }

    // 滾動效果
    this.setupScrollThrottle();
  }

  /**
   * 切換移動端菜單
   * @param {HTMLElement} navMenu - 導航菜單元素
   * @param {HTMLElement} navToggle - 菜單切換按鈕
   */
  toggleMobileMenu(navMenu, navToggle) {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');

    // 防止背景滾動
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * 關閉移動端菜單
   * @param {HTMLElement} navMenu - 導航菜單元素
   * @param {HTMLElement} navToggle - 菜單切換按鈕
   */
  closeMobileMenu(navMenu, navToggle) {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  /**
   * 設置滾動節流優化
   */
  setupScrollThrottle() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollElements();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * 更新滾動相關元素
   */
  updateScrollElements() {
    const navbar = document.querySelector('.modern-navbar');
    const backToTopBtn = document.getElementById('backToTop');
    const scrollY = window.scrollY;

    // 導航欄背景效果
    if (navbar) {
      if (scrollY > 50) {
        navbar.style.background = 'rgba(12, 12, 12, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
      } else {
        navbar.style.background = 'rgba(12, 12, 12, 0.9)';
        navbar.style.boxShadow = 'none';
      }
    }

    // 回到頂部按鈕
    if (backToTopBtn) {
      if (scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // 視差效果
    this.updateParallaxEffects(scrollY);
  }
  /**
   * 更新視差效果
   * @param {number} scrollY - 垂直滾動距離
   */
  updateParallaxEffects(scrollY) {
    // 設置 CSS 自定義屬性供視差元素使用
    document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);

    // 背景視差效果 - 查找實際存在的視差元素
    const parallaxElements = document.querySelectorAll('.parallax, [data-parallax]');
    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.1); // 不同元素不同速度
      const yPos = -(scrollY * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  /**
   * 平滑滾動到指定元素
   * @param {string} targetId - 目標元素ID
   */
  scrollToElement(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      const navbar = document.querySelector('.modern-navbar');
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetPosition = target.offsetTop - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * 初始化導航連結的平滑滾動
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        this.scrollToElement(targetId);
      });
    });
  }

  /**
   * 高亮當前頁面區域的導航連結
   */
  highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');

          // 移除所有活動狀態
          navLinks.forEach(link => link.classList.remove('active'));

          // 添加當前區域的活動狀態
          const currentLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
          if (currentLink) {
            currentLink.classList.add('active');
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -80px 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  /**
   * 設置回到頂部按鈕功能
   */
  setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  /**
   * 監聽鍵盤事件（可訪問性）
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Escape 鍵關閉移動端菜單
      if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navMenu.classList.contains('active')) {
          this.closeMobileMenu(navMenu, navToggle);
        }
      }
    });
  }
  /**
   * 完整初始化所有功能（供外部手動調用）
   */
  initializeAll() {
    this.setupSmoothScrolling();
    this.highlightCurrentSection();
    this.setupBackToTop();
    this.setupKeyboardNavigation();
  }
}

// 全域 Navigation
window.Navigation = Navigation;

// 自動初始化
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
});
