# Winston Tang - 個人作品集網站

## 📋 專案概述

這是 Winston Tang 的個人作品集網站，展示全端開發技能與專案經驗。網站採用現代化響應式設計，具備完整的模組化架構與優化性能。

**🌐 線上網址**: [https://winterdrive.github.io](https://winterdrive.github.io)

## ✨ 主要特色

- 🎨 **現代化設計** - 響應式深色主題介面
- ⚡ **高性能優化** - 懶加載、資源預載入、模組化載入
- 🔧 **模組化架構** - 組件分離、功能模組化
- 📱 **完全響應式** - 支援桌面、平板、手機裝置
- ♿ **無障礙設計** - 鍵盤導航、螢幕閱讀器友善
- 🌐 **國際化支援** - 繁體中文介面

## 🏗️ 技術架構

### 核心技術

- **前端框架**: 原生 JavaScript ES6+
- **樣式技術**: CSS3 (Grid, Flexbox, Custom Properties)
- **響應式設計**: Mobile-First 設計理念
- **外部函式庫**: Bootstrap 4, Font Awesome 6

### 模組化設計

```
js/
├── main.js          # 主要應用程式控制器
├── navigation.js    # 導航與滾動功能
├── animations.js    # 動畫效果處理
└── utils.js         # 工具函數與性能優化
```

### 組件化結構

```
components/
├── navbar.html      # 導航欄組件
├── projects.html    # 專案展示組件
└── footer.html      # 頁腳組件
```

### 樣式模組化

```
css/
├── main.css         # 主樣式檔案 (匯入所有模組)
├── base.css         # 基礎樣式與變數
├── components.css   # 組件樣式
├── animations.css   # 動畫效果
└── responsive.css   # 響應式設計
```

## 🚀 功能特色

### 💫 互動體驗

- **平滑滾動導航** - 錨點平滑滾動與高亮顯示
- **滾動顯示動畫** - Intersection Observer 驅動的動畫
- **載入效果** - 優雅的頁面載入動畫
- **游標追蹤** - 動態游標跟隨效果

### 📊 專案展示

- **專案分類** - 多種專案類型標籤
- **互動卡片** - 懸停效果與詳細資訊
- **外部連結** - 直接連接到 GitHub 與 VS Code Marketplace

### 🎯 性能優化

- **懶加載圖片** - 減少初始載入時間
- **模組化載入** - 按需載入組件
- **資源預載入** - 關鍵資源提前載入
- **節流與防抖** - 事件處理優化

## 📁 專案結構

```
winterdrive.github.io/
├── index.html           # 主頁面
├── README.md           # 專案說明
├── project.md          # 專案列表 (開發用)
├── resume.md           # 履歷資訊 (開發用)
├── components/         # 可重用組件
│   ├── navbar.html
│   ├── projects.html
│   └── footer.html
├── css/               # 樣式模組
│   ├── main.css
│   ├── base.css
│   ├── components.css
│   ├── animations.css
│   └── responsive.css
└── js/                # JavaScript 模組
    ├── main.js
    ├── navigation.js
    ├── animations.js
    └── utils.js
```
