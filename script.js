let currentLang = "en";
let chaptersData = [];
let langData = {};
let currentChapter = null;

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  langSelect.addEventListener("change", async () => {
    currentLang = langSelect.value;
    await loadLanguage(currentLang);
    renderChapterList();
    if (currentChapter) showChapter(currentChapter);
  });
});

// 載入章節結構
fetch("chapters.json")
  .then(res => res.json())
  .then(async (chapters) => {
    chaptersData = chapters;
    await loadLanguage("en");
    renderChapterList();

    const intro = chapters.find(ch => ch.id === 0);
    if (intro) {
      currentChapter = intro;
      showChapter(intro);
    }
  });

// 載入語言 JSON
function loadLanguage(lang) {
  return fetch(`lang_${lang}.json`)
    .then(res => res.json())
    .then(data => { langData = data; });
}

// 建立章節清單
function renderChapterList() {
  const chapterList = document.getElementById("chapter-list");
  chapterList.innerHTML = "";

  // 按 section 分組
  const sections = {};
  chaptersData.forEach(ch => {
    if (!sections[ch.section]) sections[ch.section] = [];
    sections[ch.section].push(ch);
  });

  for (const [section, items] of Object.entries(sections)) {
    const secTitleText = (langData.sections && langData.sections[section]) || section;

    if (section !== "intro") {
      const secTitle = document.createElement("h3");
      secTitle.textContent = secTitleText;
      chapterList.appendChild(secTitle);
    }

    items.forEach(ch => {
      const link = document.createElement("a");
      const data = langData[String(ch.id)];
      link.href = "#";
      link.textContent = data ? data.title : `Chapter ${ch.id}`;
      link.onclick = () => {
        currentChapter = ch;
        showChapter(ch);
      };
      chapterList.appendChild(link);
    });
  }
}

// 顯示章節內容（支援 Google Docs + Markdown）
async function showChapter(ch) {
  const content = document.getElementById("content");
  const data = langData[String(ch.id)];
  let title = data ? data.title : "No title";
  let summary = data ? data.summary : "(No summary)";
  let htmlBody = "";

  if (data && data.docUrl) {
    try {
      const res = await fetch(data.docUrl);
      if (res.ok) {
        const md = await res.text();
        htmlBody = window.marked.parse(md); // Markdown → HTML
      } else {
        htmlBody = "<p>(正文載入失敗)</p>";
      }
    } catch (err) {
      console.error("載入 Google Docs 正文失敗:", err);
      htmlBody = "<p>(無法載入正文)</p>";
    }
  } else if (data && data.body) {
    const md = Array.isArray(data.body) ? data.body.join("\\n\\n") : String(data.body);
    htmlBody = window.marked.parse(md);
  }

  content.innerHTML = `
    <h1>${title}</h1>
    <p><em>${summary}</em></p>
    <article>${htmlBody}</article>
  `;
}
