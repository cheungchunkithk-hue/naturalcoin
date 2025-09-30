
let currentLang = "en";
let chaptersData = [];
let currentChapter = null;

// 語言切換
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("lang-select");
  langSelect.addEventListener("change", () => {
    currentLang = langSelect.value;
    if (currentChapter) showChapter(currentChapter);
  });
});

// 載入 JSON
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

    // 預設載入簡介 (id=0)
    const intro = chapters.find(ch => ch.id === 0);
    if (intro) {
      currentChapter = intro;
      showChapter(intro);
    }
  });

function showChapter(ch) {
  const content = document.getElementById("content");
  let text = currentLang === "en" ? ch.summary_en : ch.summary_cn;

  content.innerHTML = `
    <h1>${ch.title}</h1>
    <p>${text}</p>
    <section id="comments">
      <script src="https://giscus.app/client.js"
        data-repo="yourname/natural-coin-whitepaper"
        data-repo-id="YOUR_REPO_ID"
        data-category="General"
        data-category-id="YOUR_CATEGORY_ID"
        data-mapping="pathname"
        data-reactions-enabled="1"
        data-theme="light"
        crossorigin="anonymous"
        async>
      </script>
    </section>
  `;
}
