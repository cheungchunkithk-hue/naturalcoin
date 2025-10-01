
let currentLang = "en";
let chaptersData = [];
let langData = {};
let currentChapter = null;

// 語言切換
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  langSelect.addEventListener("change", () => {
    currentLang = langSelect.value;
    loadLanguage(currentLang).then(() => {
      if (currentChapter) showChapter(currentChapter);
    });
  });
});

// 載入章節結構
fetch("chapters.json")
  .then(res => res.json())
  .then(chapters => {
    chaptersData = chapters;
    const chapterList = document.getElementById("chapter-list");

    // 按 section 分組
    const sections = {};
    chapters.forEach(ch => {
      if (!sections[ch.section]) sections[ch.section] = [];
      sections[ch.section].push(ch);
    });

    // 建立目錄
    for (const [section, items] of Object.entries(sections)) {
      const secTitle = document.createElement("h3");
      secTitle.textContent = section;
      chapterList.appendChild(secTitle);

      items.forEach(ch => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = ch.title;
        link.onclick = () => {
          currentChapter = ch;
          showChapter(ch);
        };
        chapterList.appendChild(link);
      });
    }

    // 預設載入英文
    loadLanguage("en").then(() => {
      const intro = chapters.find(ch => ch.id === 0);
      if (intro) {
        currentChapter = intro;
        showChapter(intro);
      }
    });
  });

// 載入語言 JSON
function loadLanguage(lang) {
  return fetch(`lang_${lang}.json`)
    .then(res => res.json())
    .then(data => {
      langData = data;
    });
}

function showChapter(ch) {
  const content = document.getElementById("content");
  let text = langData[ch.id] || "(No content yet)";

  content.innerHTML = `
    <h1>${ch.title}</h1>
    <p>${text}</p>
  `;
}
