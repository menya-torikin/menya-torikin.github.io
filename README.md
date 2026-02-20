# Menya Torikin 官網（Sheets 驅動，GitHub Pages）

## 開發
1. 安裝依賴
   - `npm i`
2. 抓取 Sheets 並啟動
   - `npm run dev`

> `npm run dev` 會先抓一次 Sheets。要即時同步可手動重跑 `npm run fetch`。

## 內容更新
- 直接修改 Google Sheets（公開 CSV）
- GitHub Actions build 時會抓最新資料後產生靜態頁

## 自訂網域
本專案已包含 `public/CNAME`：`menya-torikin.com`
如需改成其他網域，請修改該檔案與 `settings` 分頁的 `site_url`。

## Sheets 設定
- `sheets.config.json` 內已寫入你提供的 pub base 與 gid
