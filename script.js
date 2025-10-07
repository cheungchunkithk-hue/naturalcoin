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

  const sections = {};
  chaptersData.forEach(ch => {
    if (!sections[ch.section]) sections[ch.section] = [];
    sections[ch.section].push(ch);
  });

  for (const [section, items] of Object.entries(sections)) {
    const secTitleText = langData.sections[section] || section;
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

// 顯示章節內容（可讀取 Google Docs 正文）
async function showChapter(ch) {
  const content = document.getElementById("content");
  const data = langData[String(ch.id)];
  let title = data ? data.title : "No title";
  let summary = data ? data.summary : "(No summary)";
  let body = "";

  // 如果有 Google Docs 正文
  if (data && data.docUrl) {
    try {
      const res = await fetch(data.docUrl);
      if (res.ok) {
        const text = await res.text();
        // 自動將換行轉成段落
        body = text
          .split(/\n+/)
          .map(p => `<p>${p.trim()}</p>`)
          .join("");
      } else {
        body = "<p>(正文載入失敗)</p>";
      }
    } catch (err) {
      console.error("載入 Google Docs 正文失敗:", err);
      body = "<p>(無法載入正文)</p>";
    }
  } else if (data && data.body) {
    // 備援方案：仍可讀本地 JSON body
    body = data.body.map(p => `<p>${p}</p>`).join("");
  }

  content.innerHTML = `
    <h1>${title}</h1>
    <p><em>${summary}</em></p>
    ${body}
  `;
}
