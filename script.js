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
async function autoDetect(folder, max=60){
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

// 메타 (브라우저 탭 제목)
// 참고: 카카오톡 공유 미리보기(og:title/description/image)는 크롤러가
// 이 스크립트를 실행하지 않으므로 index.html <head>의 정적 og: 태그가
// 담당합니다. config.js의 meta 값을 바꾸면 index.html의 og:title /
// og:description도 함께 맞춰주세요.
document.title = CONFIG.meta.title;

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
  // GROOM/BRIDE 두 줄을 하나의 그리드로 묶어서 렌더링합니다.
  // (각 줄을 따로 감싸지 않고 8개 span을 나란히 두면, 같은 열끼리
  //  너비를 공유하는 CSS 그리드가 되어 "이지원"/"이유정"처럼 마지막
  //  칸의 글자 위치가 위아래 줄에서 정확히 맞춰집니다.)
  $("#parents").innerHTML = `
    <span class="lbl">GROOM</span>
    <span class="names">${nm(g.father, g.fatherDeceased)} · ${nm(g.mother, g.motherDeceased)}</span>
    <span class="rel">의 아들</span>
    <span class="child">${g.name}</span>
    <span class="lbl">BRIDE</span>
    <span class="names">${nm(b.father, b.fatherDeceased)} · ${nm(b.mother, b.motherDeceased)}</span>
    <span class="rel">의 딸</span>
    <span class="child">${b.name}</span>`;
})();

// 스토리 (신랑 → 신부 → 우리, 함께 순서로 자연스럽게 전개)
$("#storyTitle").textContent = CONFIG.story.title;
$("#storyBody").textContent = CONFIG.story.content;

// 신랑/신부 사진을 가로 스와이프 스트립으로 렌더링. 사진이 한 장도 없으면
// 어색한 빈 챕터가 남지 않도록 해당 챕터 전체를 숨김.
function renderChapter({ chapterId, titleId, textId, stripId, countId, folder, title, text, altPrefix }){
  const titleEl = $(titleId), textEl = $(textId);
  if(titleEl) titleEl.textContent = title || "";
  if(textEl) textEl.textContent = text || "";
  autoDetect(folder).then(urls => {
    const chapter = $(chapterId);
    if(!urls.length){ if(chapter) chapter.style.display = "none"; return; }
    const strip = $(stripId);
    const countEl = $(countId);
    const wrap = strip.closest(".strip-wrap");
    const navBtns = wrap ? wrap.querySelectorAll(".strip-nav") : [];

    urls.forEach((u, idx) => {
      const cell = document.createElement("div"); cell.className = "cell";
      const img = document.createElement("img"); img.src = u; img.alt = `${altPrefix} 사진 ${idx+1}`; img.loading = "lazy";
      cell.appendChild(img);
      cell.addEventListener("click", () => openLightbox(urls, idx));
      strip.appendChild(cell);
    });

    // 사진이 한 장뿐이면 넘길 게 없으니 화살표/장수 표시를 숨김
    if(urls.length <= 1){
      navBtns.forEach(b => b.hidden = true);
      return;
    }

    // getBoundingClientRect로 비교합니다 (offsetLeft는 padding 기준,
    // scrollLeft는 border 기준이라 좌우 padding이 있는 스와이프 트랙에서는
    // 서로 좌표계가 어긋나 엉뚱한 장수를 가리키는 문제가 있었습니다).
    const updateCount = () => {
      const cells = strip.querySelectorAll(".cell");
      if(!cells.length) return;
      const stripRect = strip.getBoundingClientRect();
      const centerX = stripRect.left + stripRect.width / 2;
      let closest = 0, min = Infinity;
      cells.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const diff = Math.abs((r.left + r.width / 2) - centerX);
        if(diff < min){ min = diff; closest = i; }
      });
      if(countEl) countEl.textContent = `${closest + 1} / ${cells.length}`;
    };
    updateCount();
    let ticking = false;
    strip.addEventListener("scroll", () => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(() => { updateCount(); ticking = false; });
    }, { passive:true });
  });
}
renderChapter({
  chapterId:"#groomChapter", titleId:"#groomChapterTitle", textId:"#groomChapterText", stripId:"#groomStrip",
  countId:"#groomCount", folder:"groom", title: CONFIG.story.groom?.title, text: CONFIG.story.groom?.text, altPrefix:"신랑"
});
renderChapter({
  chapterId:"#brideChapter", titleId:"#brideChapterTitle", textId:"#brideChapterText", stripId:"#brideStrip",
  countId:"#brideCount", folder:"bride", title: CONFIG.story.bride?.title, text: CONFIG.story.bride?.text, altPrefix:"신부"
});

// 우리, 함께 (커플 사진)
$("#togetherChapterTitle").textContent = CONFIG.story.together?.title || "";
autoDetect("story").then(urls => {
  const chapter = $("#togetherChapter");
  if(!urls.length){ if(chapter) chapter.style.display = "none"; return; }
  const box = $("#storyImgs");
  urls.forEach((u, idx) => {
    const div = document.createElement("div"); div.className = "shot";
    // 사진이 홀수 장이면 마지막 한 장은 좌우 대신 가운데 넓게 배치
    if(idx === urls.length - 1 && urls.length % 2 === 1) div.classList.add("full");
    const img = document.createElement("img"); img.src = u; img.alt = "커플 사진"; img.loading="lazy";
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

// 갤러리 (가로 스와이프 슬라이더) + 라이트박스
let galleryUrls = [], lbList = [], lbIndex = 0;
autoDetect("gallery").then(urls => {
  galleryUrls = urls;
  if(!urls.length){ const wrap = $(".gallery-wrap"); if(wrap) wrap.style.display = "none"; return; }
  const g = $("#gallery");
  urls.forEach((u,idx)=>{
    const cell = document.createElement("div"); cell.className="cell";
    const img = document.createElement("img"); img.src=u; img.alt=`갤러리 사진 ${idx+1}`; img.loading="lazy";
    cell.appendChild(img);
    cell.addEventListener("click", ()=> openLightbox(galleryUrls, idx));
    g.appendChild(cell);
  });

  // 스와이프 중 화면 중앙에 걸린 사진 번호를 실시간으로 표시
  // (getBoundingClientRect 기준 비교: offsetLeft/scrollLeft를 섞어 쓰면
  //  좌우 padding이 있는 트랙에서 좌표계가 어긋날 수 있어 이 방식이 더 정확합니다)
  const countEl = $("#galleryCount");
  const updateCount = () => {
    const cells = g.querySelectorAll(".cell");
    if(!cells.length) return;
    const gRect = g.getBoundingClientRect();
    const centerX = gRect.left + gRect.width / 2;
    let closest = 0, min = Infinity;
    cells.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const diff = Math.abs((r.left + r.width / 2) - centerX);
      if(diff < min){ min = diff; closest = i; }
    });
    countEl.textContent = `${closest + 1} / ${cells.length}`;
  };
  updateCount();
  let ticking = false;
  g.addEventListener("scroll", () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateCount(); ticking = false; });
  }, { passive:true });
});
function openLightbox(list, i){
  if(!list || !list.length) return;
  lbList = list; lbIndex = i; $("#lbImg").src = list[i];
  $("#lbCount").textContent = list.length > 1 ? `${i+1} / ${list.length}` : "";
  const box = $("#lightbox");
  box.classList.toggle("single", list.length <= 1);  // 사진 1장이면 화살표 숨김
  box.classList.add("open");
  $("#musicToggle")?.classList.add("hidden");         // 음악 버튼 잠시 숨김 (X와 겹침 방지)
}
$("#lbClose").onclick = ()=>{
  $("#lightbox").classList.remove("open");
  $("#musicToggle")?.classList.remove("hidden");      // 닫으면 음악 버튼 다시 표시
};
$("#lbPrev").onclick = ()=> openLightbox(lbList, (lbIndex - 1 + lbList.length) % lbList.length);
$("#lbNext").onclick = ()=> openLightbox(lbList, (lbIndex + 1) % lbList.length);

// 오시는 길
$("#locVenue").textContent = W.venue;
$("#locHall").textContent = W.hall;
$("#locAddr").innerHTML = `${W.address}<br>${dateKo} ${timeStr}`;
$("#locTel").innerHTML = W.tel ? `Tel. <a href="tel:${W.tel}">${W.tel}</a>` : "";
tryLoad("images/location/1").then(u => {
  if(u){
    $("#mapImg").innerHTML = `<img src="${u}" alt="약도">`;
    $("#mapImg").style.cursor = "zoom-in";
    $("#mapImg").addEventListener("click", ()=> openLightbox([u], 0));
  }
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

  // 신랑/신부 사진 스트립의 ‹ › 화살표: 카드 한 장 폭만큼 스크롤 이동
  const nav = e.target.closest(".strip-nav");
  if(nav){
    const strip = $("#" + nav.dataset.strip);
    if(strip){
      const cell = strip.querySelector(".cell");
      const gap = 10; // .chapter-strip의 gap 값과 동일하게 맞춤
      const step = cell ? cell.getBoundingClientRect().width + gap : strip.clientWidth * 0.6;
      strip.scrollBy({ left: nav.classList.contains("strip-prev") ? -step : step, behavior: "smooth" });
    }
  }
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
    document.dispatchEvent(new Event("bgm:pause"));   // 영상 재생 시 배경음악 정지
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

/* ============================================================
   카카오톡 공유 (선택 기능)
   config.js에 kakao.jsKey를 채우고 index.html의 SDK 스크립트를
   켜두면, 공유 버튼이 og:image의 작은 썸네일 대신 큼직한 이미지
   카드로 카카오톡 공유를 시도합니다. 둘 중 하나라도 설정 안 돼
   있으면(=Kakao가 로드/초기화되지 않으면) 기존 방식(네이티브 공유
   시트 또는 링크 복사)으로 조용히 대체됩니다.
============================================================ */
let kakaoReady = false;
(function initKakao(){
  const K = CONFIG.kakao;
  if(!K || !K.enabled || !K.jsKey) return;      // 미설정 시 그대로 종료
  if(typeof Kakao === "undefined") return;      // SDK 스크립트 태그가 꺼져있거나 로드 실패
  try{
    if(!Kakao.isInitialized()) Kakao.init(K.jsKey);
    kakaoReady = Kakao.isInitialized();
  }catch(e){ kakaoReady = false; }
})();

(function renderShareButton(){
  const btn = $("#shareBtn");
  if(kakaoReady) btn.textContent = "💬 카카오톡으로 공유하기";

  btn.addEventListener("click", async ()=>{
    const url = location.href;

    if(kakaoReady){
      try{
        const ogImg = document.querySelector('meta[property="og:image"]');
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: CONFIG.meta.title,
            description: CONFIG.meta.description,
            imageUrl: ogImg ? ogImg.content : "",
            link: { mobileWebUrl: url, webUrl: url }
          }
        });
        return;
      }catch(e){ /* 카카오 공유 실패 시 아래 기본 방식으로 대체 */ }
    }

    try{
      if(navigator.share){ await navigator.share({ title: CONFIG.meta.title, text: CONFIG.meta.description, url }); }
      else { await navigator.clipboard.writeText(url); toast("링크가 복사되었습니다"); }
    }catch(e){ /* 취소 등 */ }
  });
})();

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
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener("resize", resize);
  init(); draw();
})();

/* ============================================================
   배경 음악
============================================================ */
(function initMusic(){
  const M = CONFIG.music;
  const audio = $("#bgm");
  const btn = $("#musicToggle");
  if(!M || !M.enabled || !M.src){ btn && btn.remove(); return; }

  audio.src = M.src;
  audio.volume = 0.6;
  let playing = false;

  function render(){
    btn.classList.toggle("playing", playing);
    btn.classList.toggle("paused", !playing);
    btn.title = playing ? "음악 끄기" : "음악 켜기";
  }
  function play(){
    audio.play().then(()=>{ playing = true; render(); }).catch(()=>{ playing = false; render(); });
  }
  function pause(){ audio.pause(); playing = false; render(); }

  btn.classList.add("show");
  render();
  btn.addEventListener("click", ()=> playing ? pause() : play());

  // 영상 재생 등 외부에서 정지 신호가 오면 음악을 멈춤
  document.addEventListener("bgm:pause", pause);

  if(M.autoplay){
    const openBtn = $("#openBtn");
    if(openBtn && CONFIG.useCurtain){
      // "초대장 열기" 클릭 = 사용자 동작 → 이때 재생하면 자동재생 차단을 피할 수 있음
      openBtn.addEventListener("click", play);
    } else {
      // 커튼 미사용 시: 화면을 처음 누를 때 시작
      const startOnce = ()=>{ play(); document.removeEventListener("click", startOnce); document.removeEventListener("touchstart", startOnce); };
      document.addEventListener("click", startOnce);
      document.addEventListener("touchstart", startOnce);
    }
  }
})();
