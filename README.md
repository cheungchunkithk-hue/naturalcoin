# Natural Coin (Markdown + Google Docs Edition)

- Sidebar chapters with language switch (EN / 中文)
- Loads chapter body from Google Docs (Publish to Web, output=txt) or local JSON fallback
- Markdown is rendered via marked.js

## Steps
1) In Google Docs: File → Share → Publish to the web → copy the `?output=txt` URL.
2) Put that URL into `lang_en.json` or `lang_cn.json` as `docUrl`.
3) Commit to GitHub Pages repo and open the site.
