let currentLang = "en";
let chaptersData = [];
let langData = {};
let currentChapter = null;

// 語言切換
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  langSelect.addEventListener("change", async () => {
    currentLang = langSelect.value;
    await loadLanguage(currentLang);
    renderChapterList();  // ← 切換語言後，更新左邊章節目錄
    if (currentChapter) showChapter(currentChapter);
  });
});

// 載入章節結構
fetch("chapters.json")
  .then(res => res.json())
  .then(async (chapters) => {
    chaptersData = chapters;

    // 先載入英文
    await loadLanguage("en");
    renderChapterList();

    // 預設載入 Introduction
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
    .then(data => {
      langData = data;
    });
}

// 建立章節清單
function renderChapterList() {
  const chapterList = document.getElementById("chapter-list");
  chapterList.innerHTML = ""; // 清空舊目錄

  // 按 section 分組
  const sections = {};
  chaptersData.forEach(ch => {
    if (!sections[ch.section]) sections[ch.section] = [];
    sections[ch.section].push(ch);
  });

  // 建立目錄
  for (const [section, items] of Object.entries(sections)) {
    if (section !== "Introduction") {
      const secTitle = document.createElement("h3");
      secTitle.textContent = section;
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

// 顯示章節內容
function showChapter(ch) {
  const content = document.getElementById("content");
  const data = langData[String(ch.id)];
  let title = data ? data.title : "No title";
  let text = data ? data.summary : "(No content yet)";

  content.innerHTML = `
    <h1>${title}</h1>
    <p>${text}</p>
  `;
}
