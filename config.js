/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
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
    father: "이명한",
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
    content: "서로 다른 길을 걸어온 두 사람이\n이제 같은 길을 함께 걸어가려 합니다.\n\n저희의 새로운 시작을\n축복해 주시면 감사하겠습니다."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "우리의 이야기",
    content: "서로 다른 길을 걷던 두 사람이\n하나의 길을 함께 걷게 되었습니다.\n\n여러분을 소중한 자리에 초대합니다."
  },

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
      { role: "신랑", name: "이지원", bank: "우리은행", number: "010-3376-9625" },
      { role: "어머니", name: "조현주", bank: "국민은행", number: "010-5034-9625" }
    ],
    bride: [
      { role: "신부", name: "이유정", bank: "하나은행", number: "000-000-000000" },
      { role: "아버지", name: "이명한", bank: "기업은행", number: "000-000-000000" },
      { role: "어머니", name: "박은주", bank: "농협은행", number: "000-000-000000" }
    ]
  },

  // ── 영상 (마음 전하실 곳 다음에 표시) ──
  // youtube 값에는 전체 링크 또는 영상 ID 중 아무거나 넣으면 됩니다.
  //   예) "https://youtu.be/dQw4w9WgXcQ"
  //   예) "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  //   예) "dQw4w9WgXcQ"
  // 영상이 없으면 youtube 값을 "" (빈 문자열)로 두면 섹션이 자동으로 숨겨집니다.
  video: {
    title: "우리의 영상",
    caption: "두 사람의 이야기를 영상으로 담았습니다.",
    youtube: "https://youtu.be/nKbdGTWYtd0?si=37KCEjqQDWDjX7yj"
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "이지원 ♥ 이유정 결혼합니다",
    description: "2026년 11월 14일, 소중한 분들을 초대합니다."
  }
};
