# Natural Coin (Markdown + Google Docs + Giscus)

### Features
- English default, bilingual switch
- Loads text from Google Docs `pub?output=txt` (auto-fix + proxy fallback)
- Renders Markdown via marked.js
- Shared Giscus discussion (discussion #1)

### How to add text
1. In Google Docs → File → Share → **Publish to the web**
2. Copy the link (ends with `/pub?output=txt`)
3. Paste it as `"docUrl"` in `lang_en.json` / `lang_cn.json`
4. Commit & refresh your GitHub Pages
