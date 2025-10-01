let currentLang = "en";
let chaptersData = [];
let langData = {};
let currentChapter = null;

document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  langSelect.addEventListener("change", async () => {
    currentLang = langSelect.value;
    await loadLanguage(currentLang);
    if (currentChapter) showChapter(currentChapter);
  });
});

fetch("chapters.json")
  .then(res => res.json())
  .then(chapters => {
    chaptersData = chapters;
    const chapterList = document.getElementById("chapter-list");

    const sections = {};
    chapters.forEach(ch => {
      if (!sections[ch.section]) sections[ch.section] = [];
      sections[ch.section].push(ch);
    });

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

    loadLanguage("en").then(() => {
      const intro = chapters.find(ch => ch.id === 0);
      if (intro) {
        currentChapter = intro;
        showChapter(intro);
      }
    });
  });

function loadLanguage(lang) {
  return fetch(`lang_${lang}.json`)
    .then(res => res.json())
    .then(data => {
      langData = data;
    });
}

function showChapter(ch) {
  const content = document.getElementById("content");
  let text = langData[String(ch.id)] || "(No content yet)";

  content.innerHTML = `
    <h1>${ch.title}</h1>
    <p>${text}</p>
  `;
}
