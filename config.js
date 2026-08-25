/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/groom/1.jpg, 2.jpg, ...  - 신랑 사진 모음 (순번, 자동 감지, 사진 없으면 해당 챕터 자동 숨김)
 *   images/bride/1.jpg, 2.jpg, ...  - 신부 사진 모음 (순번, 자동 감지, 사진 없으면 해당 챕터 자동 숨김)
 *   images/story/1.jpg, 2.jpg, ...  - 우리, 함께(커플) 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 사진첩 갤러리 (순번, 자동 감지, 최대 60장)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장, 반드시 .jpg 로 저장, 1200x630px 권장)
 *
 * ⚠️ 카카오톡 공유 미리보기(썸네일/제목/설명)는 이 파일이 아니라
 *    index.html <head>의 og: 메타 태그가 담당합니다.
 *    아래 meta 값을 바꾸면 index.html의 og:title / og:description도
 *    함께 맞춰주고, og:url / og:image는 실제 배포 주소로 채워주세요.
 */
const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: true,   // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 눈 내리는 연출 ──
  snow: {
    enabled: true,    // 눈 애니메이션 사용 여부
    density: 50       // 눈송이 개수 (많을수록 촘촘, 40~140 권장)
  },
  
// ── 배경 음악 ──
  music: {
    enabled: true,       // 음악 사용 여부
    src: "bgm.mp3",      // 1단계에서 올린 음악 파일 이름과 똑같이
    autoplay: true       // 초대장 열 때 자동 재생
  },
  
  // ── 메인 (히어로) ──
  groom: {
    name: "이지원",
    nameEn: "JI WON",
    father: "이형복",
    mother: "조현주",
    fatherDeceased: false,
    motherDeceased: false
  },
  bride: {
    name: "이유정",
    nameEn: "YOU JEONG",
    father: "이명환",
    mother: "박은주",
    fatherDeceased: false,
    motherDeceased: false
  },
  wedding: {
    date: "2026-11-14",
    time: "15:00",
    venue: "아이벡스컨벤션",
    hall: "AK플라자 광명점 5층(단독홀)",
    address: "경기 광명시 양지로 17 AK플라자 광명점 5층",
    tel: "02-897-1002",
    mapLinks: {
      kakao: "https://kko.to/Z9A98Kioup",
      naver: "https://naver.me/GkURxNA2",
      tmap: "https://tmap.life/fb7930ed"
    }
  },

// ── 인사말 ──
  greeting: {
    title: "소중한 분들을 초대합니다",
    content: "서로에게 가장 편안한 쉼터가 되어\n평생의 보금자리를 함께 지어갑니다.\n\n저희의 첫 출발을 축복해 주세요."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "Home, Sweet Home",
    content: "하루의 끝에 늘 서로가 있었습니다.\n언제든 기댈 수 있는 다정한 집이 되어\n평생을 함께하기로 약속합니다.",

  // 신랑 소개 (신부가 바라본 신랑)
    groom: {
      title: "유쾌하고 든든한 쉼터, 지원",
      text: "늘 웃음을 선물하는 장난기 가득한 사람이지만,\n기댈 땐 누구보다 크고 든든한 나무가 되어줍니다."
    },

    // 신부 소개 (신랑이 바라본 신부)
    bride: {
      title: "따스한 햇살 같은 온기, 유정",
      text: "지친 하루 끝에 늘 미소를 건네는 사람.\n존재만으로도 마음을 편안하게 해주는 사람입니다."
    },

    // 커플 사진 챕터 제목
    together: {
      title: "서로에게 쉼터가 되어준 날들"
    }
  },

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "이지원", bank: "우리은행", number: "1002-648-410441" },
      { role: "아버지", name: "이형복", bank: "시티뱅크", number: "120-73578-261" },      
      { role: "어머니", name: "조현주", bank: "국민은행", number: "060-210473-622" }
    ],
    bride: [
      { role: "신부", name: "이유정", bank: "하나은행", number: "2579-107-0744207" },
      { role: "아버지", name: "이명환", bank: "농협은행", number: "351-038-4278193" },
      { role: "어머니", name: "박은주", bank: "하나은행", number: "240-890-90339607" }
    ]
  },

  // ── 영상 (마음 전하실 곳 다음에 표시) ──
  // youtube 값에는 전체 링크 또는 영상 ID 중 아무거나 넣으면 됩니다.
  //   예) "https://youtu.be/dQw4w9WgXcQ"
  //   예) "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  //   예) "dQw4w9WgXcQ"
  // 영상이 없으면 youtube 값을 "" (빈 문자열)로 두면 섹션이 자동으로 숨겨집니다.
  video: {
    title: "우리의 찬란한 한 페이지가 될 수 있게",
    caption: "직접 부른 노랫말에 진심을 담았습니다.\n가볍게 재생해 보시고, 본식에서 함께 즐겨주세요.",
    youtube: "https://youtu.be/nKbdGTWYtd0?si=37KCEjqQDWDjX7yj"
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "지원❤유정 결혼합니다.",
    // 카카오톡 채팅방 미리보기는 "줄"이 아니라 "전체 글자수"로 자릅니다.
    // 실측해보니 대략 35자를 넘어가면 뒷부분이 "..."으로 잘렸어요.
    // 문구를 바꾸실 땐 아래처럼 전체를 30자 안팎으로 짧게 유지해주세요.
    // (줄바꿈 \n을 넣어도 카카오 미리보기에서는 그냥 이어서 표시되고,
    //  총 글자수 제한은 그대로 적용됩니다. index.html의 og:description도
    //  함께 맞춰주세요)
    description: "서로의 쉼터가 된 두 사람의 시작을 축복해 주세요."
  },

  // ── 카카오톡 공유하기 (선택 기능) ──
  // index.html 하단의 "카카오톡 공유하기" 안내(1~3단계)를 먼저 진행한 뒤,
  // 아래 jsKey에 발급받은 JavaScript 키를 붙여넣으면, 공유 버튼을 눌렀을 때
  // 작은 썸네일이 아니라 큼직한 이미지 카드로 카카오톡 공유가 됩니다.
  // 설정하지 않으면(비워두면) 공유 버튼은 자동으로 기존 "링크 복사하기"
  // 방식으로 동작하니, 지금 당장 설정하지 않아도 청첩장은 정상 작동합니다.
  kakao: {
    enabled: true,
    jsKey: "" // 예: "1a2b3c4d5e6f7g8h9i0j..." (여기에 붙여넣기 전엔 빈 문자열로 두세요)
  }
};
