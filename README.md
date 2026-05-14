# 쉬운폰 도우미 (EasyPhone Helper)

> 스마트폰 사용이 어려운 시니어를 위한 디지털 자립·안전 도우미 웹앱

## 프로젝트 소개

단순히 글씨만 크게 만든 앱이 아닙니다.
실제 어르신들이 겪는 스마트폰 사용 불편함을 해결하는 것이 핵심입니다.

- **헷갈리지 않는** UI/UX — 한 화면에 한 가지 목적
- **실수해도 괜찮은** 구조 — 항상 처음으로 돌아갈 수 있어요
- **사기 문자 AI 분석** — Groq API 기반 실시간 위험도 판별
- **S.O.S 도와줘** — 한 번에 보호자에게 연락

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| 홈 화면 | 큰 버튼, 컬러 카드, 빠른 가이드 |
| 전화하기 | 전화 앱 사용법 안내 + 전화 앱 바로 열기 |
| 문자 보기 | 문자 확인 단계별 안내 + 사기 문자 경고 |
| 카톡 연습 | 카카오톡 사진 보내기 인터랙티브 연습 모드 |
| 사진 보기 | 갤러리 사용법 단계별 안내 |
| 병원/약국 | 네이버 지도 바로 연결 + 119 긴급전화 |
| 택시 연습 | 카카오T 사용법 인터랙티브 연습 모드 |
| 가이드 목록 | 7가지 상세 단계별 가이드 |
| 사기 문자 확인 | Groq AI로 실시간 위험도 분석 |
| 보호자 설정 | localStorage 기반 보호자 연락처 저장 |
| 도와줘 버튼 | 모든 화면 하단 고정 SOS 버튼 + 확인 모달 |

---

## 기술 스택

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **PWA**: vite-plugin-pwa
- **AI API**: Groq API (llama-3.3-70b-versatile)
- **Backend**: Vercel Serverless Functions
- **Storage**: localStorage (MVP)
- **Deployment**: Vercel

---

## 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행 (로컬 Groq API 포함)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 환경변수 설정

### 로컬 개발

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```
GROQ_API_KEY=여기에_Groq_API_키를_입력하세요
```

`.env.local`은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

### Vercel 배포

Vercel Dashboard → Project Settings → Environment Variables에서 추가:

```
GROQ_API_KEY = 여기에_Groq_API_키를_입력하세요
```

---

## Groq API Key 발급 방법

1. [console.groq.com](https://console.groq.com) 접속
2. 회원가입 또는 로그인
3. API Keys → Create API Key
4. 발급된 키를 `.env.local`에 저장

---

## 배포 방법 (Vercel)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

또는 GitHub 저장소를 Vercel에 연결하면 push 시 자동 배포됩니다.

---

## 해커톤 제출용 설명

### 문제 정의

한국의 65세 이상 고령층 스마트폰 보급률은 높지만 실제 활용률은 낮습니다.
가장 큰 장벽은 "잘못 누르면 어떻게 되지?" 라는 불안감입니다.
또한 매년 증가하는 스미싱 피해의 주요 대상이 어르신입니다.

### 해결책

- 헷갈리지 않는 최소한의 UI — 한 화면 한 목적
- AI 기반 사기 문자 실시간 분석 (Groq llama-3.3-70b)
- 언제든 보호자에게 SOS를 보낼 수 있는 안심 구조
- 인터랙티브 연습 모드로 실수 없이 배울 수 있는 환경

### 차별화 포인트

1. **단순함 우선** — 기능을 줄이고 안심을 늘렸습니다
2. **AI 안전망** — Groq API로 사기 문자를 즉시 분석
3. **연습 모드** — 실제 앱 없이 카톡·택시 사용법 연습
4. **S.O.S** — 보호자와 연결되는 단 한 번의 버튼

---

## AI/Vibe Coding 활용 과정

이 프로젝트는 Claude Code (Anthropic)를 활용하여 개발되었습니다.

- 전체 프로젝트 아키텍처 설계
- 컴포넌트 구조 및 타입 정의
- Groq API 연동 및 시니어 친화적 프롬프트 설계
- Framer Motion 애니메이션 및 shadcn/ui 통합
- Tailwind CSS 기반 시니어 UX 원칙 적용

---

## 향후 확장 계획

### Phase 2
- Supabase 도입 (users, guardian_links, help_requests 테이블)
- 보호자 대시보드 (어르신 활동 모니터링)
- 실제 SMS 발송 API 연동

### Phase 3
- React Native 네이티브 앱
- 음성 안내 기능 (Web Speech API)
- 사기 문자 패턴 학습 데이터베이스

---

## 프로젝트 구조

```
easy-phone-helper/
├── api/
│   └── check-scam.ts          # Vercel Serverless Function
├── src/
│   ├── components/
│   │   ├── ConfirmModal.tsx    # SOS 확인 모달
│   │   ├── ErrorBoundary.tsx   # 전역 에러 경계
│   │   ├── HelpRequestBar.tsx  # 하단 고정 도와줘 버튼
│   │   ├── PressableButton.tsx # 공통 버튼 컴포넌트
│   │   └── ScamResultCard.tsx  # 사기 문자 결과 카드
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── PhoneScreen.tsx
│   │   ├── MessageScreen.tsx
│   │   ├── PhotoScreen.tsx
│   │   ├── HospitalScreen.tsx
│   │   ├── KakaoPractice.tsx
│   │   ├── TaxiPractice.tsx
│   │   ├── GuideList.tsx
│   │   ├── GuideDetail.tsx
│   │   ├── GuardianSettings.tsx
│   │   └── ScamCheck.tsx
│   └── lib/
│       ├── api.ts
│       ├── haptics.ts
│       ├── sms.ts
│       └── storage.ts
├── .env.local                  # 환경변수 (Git 제외)
├── vercel.json
└── README.md
```

---

## 보안 규칙

- `GROQ_API_KEY`는 절대 프론트엔드 코드에 노출되지 않습니다
- API 키는 `api/check-scam.ts`에서만 `process.env.GROQ_API_KEY`로 접근합니다
- `.env.local`은 `.gitignore`로 보호됩니다
