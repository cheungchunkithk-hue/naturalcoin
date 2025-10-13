let currentLang="en";let chaptersData=[];let langData={};let currentChapter=null;

document.addEventListener("DOMContentLoaded",()=>{
  const sel=document.getElementById("lang-select");
  sel.value="en";
  sel.addEventListener("change",async()=>{
    currentLang=sel.value;
    await loadLanguage(currentLang);
    renderList();
    if(currentChapter)showChapter(currentChapter);
  });
});

fetch("chapters.json").then(r=>r.json()).then(async c=>{
  chaptersData=c;await loadLanguage("en");renderList();
  const intro=c.find(x=>x.id===0);
  if(intro){currentChapter=intro;showChapter(intro);}
});

function loadLanguage(lang){return fetch(`lang_${lang}.json`).then(r=>r.json()).then(d=>langData=d);}

function renderList(){
  const list=document.getElementById("chapter-list");
  list.innerHTML="";
  const sec={};
  chaptersData.forEach(ch=>{if(!sec[ch.section])sec[ch.section]=[];sec[ch.section].push(ch);});
  for(const[s,it]of Object.entries(sec)){
    const t=(langData.sections&&langData.sections[s])||s;
    if(s!=="intro"){const h=document.createElement("h3");h.textContent=t;list.appendChild(h);}
    it.forEach(ch=>{
      const a=document.createElement("a");
      const d=langData[String(ch.id)];
      a.href="#";a.textContent=d?d.title:`Chapter ${ch.id}`;
      a.onclick=()=>{currentChapter=ch;showChapter(ch);};
      list.appendChild(a);
    });
  }
}

function normalizeUrl(u){
  try{
    const x=new URL(u);
    if(x.hostname.includes("docs.google.com")&&x.pathname.includes("/document/d/")){
      const id=x.pathname.split("/document/d/")[1].split("/")[0];
      return`"docUrl": "https://docs.google.com/document/d/1n8xHf.../pub?output=txt"
;
    }
  }catch(e){}
  return u;
}

async function fetchDoc(u){
  const url=normalizeUrl(u);
  try{
    const r=await fetch(url,{mode:"cors"});
    if(r.ok)return await r.text();
    throw new Error("HTTP "+r.status);
  }catch(e){
    const n=url.replace(/^https?:\/\//,"");
    for(const f of[`https://r.jina.ai/http://${n}`,`https://r.jina.ai/https://${n}`]){
      try{const r2=await fetch(f);if(r2.ok)return await r2.text();}catch(_){}
    }
    throw e;
  }
}

async function showChapter(ch){
  const el=document.getElementById("content");
  const d=langData[String(ch.id)];
  const title=d?.title||"No title";
  const sum=d?.summary||"(No summary)";
  let html="";
  if(d?.docUrl){
    try{const md=await fetchDoc(d.docUrl);html=window.marked.parse(md);}
    catch(e){
      const norm=normalizeUrl(d.docUrl);
      html=`<p>(Unable to load text)</p><p><a href="${norm}" target="_blank">Open source text</a></p>`;
    }
  }else if(d?.body){const md=Array.isArray(d.body)?d.body.join("\\n\\n"):String(d.body);html=window.marked.parse(md);}
  el.innerHTML=`<h1>${title}</h1><p><em>${sum}</em></p><article>${html}</article>`;
}

