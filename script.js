/* ============================================================
   유틸
============================================================ */
const $ = (s, r=document) => r.querySelector(s);
const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const DAYS_KO = ["일","월","화","수","목","금","토"];

function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove("show"), 1800);
}

/* 이미지 순번 자동 감지: images/<folder>/1.jpg, 2.jpg ... (jpg/jpeg/png) */
function tryLoad(base){
  const exts = ["jpg","jpeg","png","JPG","PNG"];
  return new Promise((resolve)=>{
    let i = 0;
    const attempt = () => {
      if(i >= exts.length){ resolve(null); return; }
      const url = base + "." + exts[i++];
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = attempt;
      img.src = url;
    };
    attempt();
  });
}
async function autoDetect(folder, max=30){
  const found = [];
  for(let n=1; n<=max; n++){
    const url = await tryLoad(`images/${folder}/${n}`);
    if(!url) break;      // 순번이 끊기면 종료
    found.push(url);
  }
  return found;
}

/* 유튜브 ID 추출 (전체 URL 또는 ID 모두 허용) */
function youtubeId(v){
  if(!v) return "";
  v = v.trim();
  const m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  if(m) return m[1];
  if(/^[A-Za-z0-9_-]{11}$/.test(v)) return v;
  return "";
}

/* ============================================================
   렌더링
============================================================ */
const W = CONFIG.wedding;
const dateObj = new Date(W.date + "T" + (W.time||"00:00") + ":00");
const y = dateObj.getFullYear(), mo = dateObj.getMonth(), d = dateObj.getDate();
const dow = dateObj.getDay();
const hh = dateObj.getHours(), mm = dateObj.getMinutes();
const ampm = hh < 12 ? "오전" : "오후";
const hh12 = ((hh + 11) % 12) + 1;
const timeStr = `${ampm} ${hh12}시${mm ? " " + mm + "분" : ""}`;
const dateKo = `${y}년 ${mo+1}월 ${d}일 ${DAYS_KO[dow]}요일`;

// 메타
document.title = CONFIG.meta.title;
(function setMeta(){
  const add = (p,c) => { const m=document.createElement("meta"); m.setAttribute("property",p); m.content=c; document.head.appendChild(m); };
  add("og:title", CONFIG.meta.title);
  add("og:description", CONFIG.meta.description);
  add("og:type", "website");
  tryLoad("images/og/1").then(u => { if(u) add("og:image", u); });
})();

// 커튼
$("#curtainNames").textContent = `${CONFIG.groom.name} · ${CONFIG.bride.name}`;
$("#curtainSub").textContent = `${y}. ${String(mo+1).padStart(2,"0")}. ${String(d).padStart(2,"0")} ${DAYS[dow]}`;

// 히어로
$("#heroEn").innerHTML = `${CONFIG.groom.nameEn.toUpperCase()} &amp; ${CONFIG.bride.nameEn.toUpperCase()}`;
$("#heroNames").textContent = `${CONFIG.groom.name} · ${CONFIG.bride.name}`;
$("#heroDate").textContent = `${y}. ${String(mo+1).padStart(2,"0")}. ${String(d).padStart(2,"0")}`;
$("#heroPlace").textContent = `${dateKo} ${timeStr} · ${W.venue}`;
tryLoad("images/hero/1").then(u => {
  if(u){
    const ph = $("#heroPhoto");
    const img = document.createElement("img"); img.src = u; img.alt = "메인 사진";
    ph.querySelector(".ph-flake")?.remove();
    ph.insertBefore(img, ph.firstChild);
  }
});

// 인사말
$("#greetTitle").textContent = CONFIG.greeting.title;
$("#greetBody").textContent = CONFIG.greeting.content;
(function renderParents(){
  const g = CONFIG.groom, b = CONFIG.bride;
  const nm = (p, dec) => dec ? `<span class="deceased">${p}</span>` : p;
  $("#parents").innerHTML = `
    <div class="row"><span class="lbl">GROOM</span>
      ${nm(g.father, g.fatherDeceased)} · ${nm(g.mother, g.motherDeceased)}
      의 아들 <span class="child">${g.name}</span></div>
    <div class="row"><span class="lbl">BRIDE</span>
      ${nm(b.father, b.fatherDeceased)} · ${nm(b.mother, b.motherDeceased)}
      의 딸 <span class="child">${b.name}</span></div>`;
})();

// 스토리
$("#storyTitle").textContent = CONFIG.story.title;
$("#storyBody").textContent = CONFIG.story.content;
autoDetect("story").then(urls => {
  const box = $("#storyImgs");
  urls.forEach(u => {
    const div = document.createElement("div"); div.className = "shot";
    const img = document.createElement("img"); img.src = u; img.alt = "스토리 사진"; img.loading="lazy";
    div.appendChild(img); box.appendChild(div);
  });
});

// 캘린더
(function renderCalendar(){
  $("#calHead").textContent = `${y}. ${String(mo+1).padStart(2,"0")}`;
  const first = new Date(y, mo, 1).getDay();
  const total = new Date(y, mo+1, 0).getDate();
  let html = "<tr>" + DAYS.map((dd,i)=>`<th class="${i===0?'sun':''}">${dd}</th>`).join("") + "</tr><tr>";
  let cell = 0;
  for(let i=0;i<first;i++){ html += "<td></td>"; cell++; }
  for(let dd=1; dd<=total; dd++){
    if(cell === 7){ html += "</tr><tr>"; cell = 0; }
    const isSun = (cell === 0);
    const cls = dd===d ? "today" : (isSun ? "sun" : "");
    html += `<td class="${cls}">${dd===d ? `<span>${dd}</span>` : dd}</td>`;
    cell++;
  }
  html += "</tr>";
  $("#calTable").innerHTML = html;
})();

// 카운트다운
(function renderCountdown(){
  const box = $("#countdown");
  const parts = [["DAYS","d"],["HOURS","h"],["MIN","m"],["SEC","s"]];
  parts.forEach(([lbl,key])=>{
    const c = document.createElement("div"); c.className="cd-cell";
    c.innerHTML = `<div class="cd-num" data-k="${key}">0</div><div class="cd-lbl">${lbl}</div>`;
    box.appendChild(c);
  });
  function tick(){
    const diff = dateObj - new Date();
    if(diff <= 0){
      $("#cdLine").innerHTML = `<b>${CONFIG.groom.name}</b> &amp; <b>${CONFIG.bride.name}</b> 의 결혼을 축하합니다`;
      box.querySelectorAll(".cd-num").forEach(n=>n.textContent="0");
      return;
    }
    const dd = Math.floor(diff/864e5);
    const hh = Math.floor(diff%864e5/36e5);
    const mm = Math.floor(diff%36e5/6e4);
    const ss = Math.floor(diff%6e4/1e3);
    const map = {d:dd,h:hh,m:mm,s:ss};
    box.querySelectorAll(".cd-num").forEach(n=> n.textContent = String(map[n.dataset.k]).padStart(2,"0"));
    $("#cdLine").innerHTML = `예식까지 <b>${dd}</b>일 남았습니다`;
  }
  tick(); setInterval(tick, 1000);
})();

// 갤러리 + 라이트박스
let galleryUrls = [], lbIndex = 0;
autoDetect("gallery").then(urls => {
  galleryUrls = urls;
  const g = $("#gallery");
  urls.forEach((u,idx)=>{
    const cell = document.createElement("div"); cell.className="cell";
    const img = document.createElement("img"); img.src=u; img.alt="갤러리 사진"; img.loading="lazy";
    cell.appendChild(img);
    cell.addEventListener("click", ()=> openLightbox(idx));
    g.appendChild(cell);
  });
});
function openLightbox(i){
  if(!galleryUrls.length) return;
  lbIndex = i; $("#lbImg").src = galleryUrls[i];
  $("#lbCount").textContent = `${i+1} / ${galleryUrls.length}`;
  $("#lightbox").classList.add("open");
}
$("#lbClose").onclick = ()=> $("#lightbox").classList.remove("open");
$("#lbPrev").onclick = ()=> openLightbox((lbIndex - 1 + galleryUrls.length) % galleryUrls.length);
$("#lbNext").onclick = ()=> openLightbox((lbIndex + 1) % galleryUrls.length);

// 오시는 길
$("#locVenue").textContent = W.venue;
$("#locHall").textContent = W.hall;
$("#locAddr").innerHTML = `${W.address}<br>${dateKo} ${timeStr}`;
$("#locTel").innerHTML = W.tel ? `Tel. <a href="tel:${W.tel}">${W.tel}</a>` : "";
tryLoad("images/location/1").then(u => {
  if(u){ $("#mapImg").innerHTML = `<img src="${u}" alt="약도">`; }
});
$("#mapBtns").innerHTML =
  (W.mapLinks.kakao ? `<a href="${W.mapLinks.kakao}" target="_blank" rel="noopener">카카오맵</a>` : "") +
  (W.mapLinks.naver ? `<a href="${W.mapLinks.naver}" target="_blank" rel="noopener">네이버지도</a>` : "") +
  (W.mapLinks.tmap ? `<a href="${W.mapLinks.tmap}" target="_blank" rel="noopener">T맵</a>` : "");

// 마음 전하실 곳
function renderAccounts(list, mountId, groupLabel){
  const mount = $(mountId);
  const gid = mountId.replace("#","");
  mount.innerHTML = `
    <button class="acc-toggle" data-target="${gid}-list">${groupLabel} 계좌 안내 <span class="chev">▼</span></button>
    <div class="acc-list" id="${gid}-list">
      ${list.map(a => `
        <div class="acc-item">
          <div>
            <div class="who">${a.role}</div>
            <div class="nm">${a.name}</div>
            <div class="bk">${a.bank} ${a.number}</div>
          </div>
          <button class="copy" data-copy="${a.bank} ${a.number}">복사</button>
        </div>`).join("")}
    </div>`;
}
renderAccounts(CONFIG.accounts.groom, "#accGroom", "신랑측");
renderAccounts(CONFIG.accounts.bride, "#accBride", "신부측");
document.addEventListener("click", e => {
  const tg = e.target.closest(".acc-toggle");
  if(tg){ $("#"+tg.dataset.target).classList.toggle("open");
          tg.querySelector(".chev").style.transform =
            $("#"+tg.dataset.target).classList.contains("open") ? "rotate(180deg)" : ""; }
  const cp = e.target.closest(".copy");
  if(cp){ navigator.clipboard?.writeText(cp.dataset.copy).then(()=>toast("계좌번호가 복사되었습니다")); }
});

// 영상
(function renderVideo(){
  const vid = youtubeId(CONFIG.video && CONFIG.video.youtube);
  if(!vid) return;                       // 영상 없으면 섹션 숨김 유지
  const sec = $("#videoSection"); sec.style.display = "";
  $("#videoTitle").textContent = CONFIG.video.title || "우리의 영상";
  $("#videoCaption").textContent = CONFIG.video.caption || "";
  $("#videoThumb").src = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  $("#videoFrame").addEventListener("click", function once(){
    this.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0"
      title="wedding video"
      referrerpolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen></iframe>`;
    this.style.cursor = "default";
  }, { once:true });
})();

// 푸터
$("#footNames").textContent = `${CONFIG.groom.name} · ${CONFIG.bride.name}`;
$("#footDate").textContent = `${y}. ${String(mo+1).padStart(2,"0")}. ${String(d).padStart(2,"0")}`;
$("#shareBtn").addEventListener("click", async ()=>{
  const url = location.href;
  try{
    if(navigator.share){ await navigator.share({ title: CONFIG.meta.title, text: CONFIG.meta.description, url }); }
    else { await navigator.clipboard.writeText(url); toast("링크가 복사되었습니다"); }
  }catch(e){ /* 취소 등 */ }
});

/* ============================================================
   커튼 열기
============================================================ */
(function initCurtain(){
  if(!CONFIG.useCurtain){ $("#curtain").remove(); return; }
  $("#openBtn").addEventListener("click", ()=>{
    $("#curtain").classList.add("hide");
    setTimeout(()=> $("#curtain").remove(), 1000);
  });
})();

/* ============================================================
   스크롤 등장
============================================================ */
(function initReveal(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en => { if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold:0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();

/* ============================================================
   눈 내리는 연출 (canvas)
============================================================ */
(function initSnow(){
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!CONFIG.snow || !CONFIG.snow.enabled || reduce) return;

  const cv = $("#snow"), ctx = cv.getContext("2d");
  let W2, H2, flakes = [];
  const COUNT = CONFIG.snow.density || 90;

  function resize(){
    W2 = cv.width = window.innerWidth;
    H2 = cv.height = window.innerHeight;
  }
  function makeFlake(){
    const depth = Math.random();          // 0(뒤·작고 느림) ~ 1(앞·크고 빠름)
    return {
      x: Math.random()*W2,
      y: Math.random()*H2,
      r: 1 + depth*2.6,
      spd: 0.4 + depth*1.4,
      drift: (Math.random()-0.5)*0.6,
      sway: Math.random()*Math.PI*2,
      swaySpd: 0.008 + Math.random()*0.02,
      op: 0.35 + depth*0.55
    };
  }
  function init(){
    resize();
    flakes = Array.from({length: COUNT}, makeFlake);
  }
  function draw(){
    ctx.clearRect(0,0,W2,H2);
    for(const f of flakes){
      f.sway += f.swaySpd;
      f.y += f.spd;
      f.x += f.drift + Math.sin(f.sway)*0.4;
      if(f.y > H2 + 5){ f.y = -5; f.x = Math.random()*W2; }
      if(f.x > W2 + 5) f.x = -5; else if(f.x < -5) f.x = W2 + 5;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${f.op})`;
      ctx.shadowColor = "rgba(220,230,240,.6)";
      ctx.shadowBlur = 4;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize", resize);
  init(); draw();
})();
