# GKahoot - Google 表單問卷回覆分析系統

![版本](https://img.shields.io/badge/version-0.0.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 專案簡介

GKahoot 是一個創新的問卷分析系統，透過與 Google 表單的整合，實現即時使用者答題狀況的統計及評分效果。本系統使用現代化的 React + TypeScript 技術棧開發，提供直觀的使用者介面和強大的分析功能。

### 核心功能

- **問卷整合**：輕鬆匯入 Google 表單的問卷題目
- **即時答題統計**：自動拉取表單回覆數據，分析各人答題狀況
- **分數排名**：根據正確答案及答題順序計算分數
- **排名統計**：全面統計每位答題參與者的答題表現

## 技術特點

- 基於 React 18 + TypeScript 開發
- 使用 Vite 作為建構工具
- 整合 Radix UI 組件庫
- 支援 CSV 檔案解析和處理
- 響應式設計，支援多種設備

## 安裝步驟

1. 克隆專案
```bash
git clone https://github.com/yourusername/gkahoot.git
cd gkahoot
```

2. 安裝依賴
```bash
npm install
```

3. 啟動開發服務器
```bash
npm run dev
```

4. 建置生產版本
```bash
npm run build
```

## 使用說明

### 1. 準備問卷資料
- 使用 Google 表單建立問卷
- 確保問卷回覆可匯出為 CSV 格式
- 下載問卷回覆的 CSV 檔案
- 確保 CSV 檔案包含以下欄位：
  - 員工編號/ID
  - 題目內容
  - 選項內容
  - 正確答案
  - 答題時間

### 2. 系統操作流程

#### 2.1 上傳檔案
1. 點擊主頁面上的「上傳 CSV」按鈕
2. 選擇已下載的 Google 表單 CSV 檔案
3. 系統會自動解析檔案內容並載入題目

#### 2.2 瀏覽題目
- 使用「回到上一題」和「看看下一題」按鈕在題目間導航
- 畫面上方會顯示目前題號和總題數
- 每題會顯示：
  - 題目內容
  - 各選項的選擇統計
  - 答題者分布

#### 2.3 查看統計資訊
- 點擊「顯示總排名」按鈕查看：
  - 前 10 名的答題者排名
  - 每位答題者的總分
- 統計資訊包含：
  - 答題正確率
  - 答題速度
  - 綜合得分

#### 2.4 即時更新
- 系統會自動追蹤新的答題紀錄
- 排名和統計會即時更新
- 可隨時重新上傳 CSV 更新資料

### 3. 注意事項
- CSV 檔案格式必須符合系統要求
- 建議定期更新資料以獲得最新統計
- 確保網路連線穩定以保持即時更新功能

## 系統需求

- Node.js 16.0 或以上版本
- 現代化瀏覽器（Chrome、Firefox、Safari、Edge 等）
- 穩定的網路連接

## 授權說明

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 文件

## 貢獻指南

歡迎提交 Issue 和 Pull Request 來協助改善專案。在提交之前，請確保：

1. 更新已經過測試
2. 程式碼符合專案的程式碼風格
3. Commit 訊息清晰明確

## 聯絡方式

如有任何問題或建議，歡迎透過以下方式聯繫：

- 提交 Issue
- 發送 Pull Request
- 電子郵件：[hsieh.ting.lin@gmail.com](mailto:hsieh.ting.lin@gmail.com)