# 쉬운폰 도우미 (EasyPhone Helper) — CLAUDE.md

## 프로젝트 목표

스마트폰 사용이 어려운 시니어(65세 이상)를 위한 웹앱 MVP.
큰 버튼, 단계별 가이드, 사기 문자 분석, 보호자 도움 요청 기능을 제공한다.

## 기술 스택

- 프론트엔드: React 19 + Vite + TypeScript
- 스타일: Tailwind CSS v3
- 라우팅: React Router DOM
- PWA: vite-plugin-pwa
- 백엔드: Vercel Functions (`/api`)
- AI API: Groq API (llama-3.3-70b-versatile)
- 데이터 저장: localStorage (MVP)
- 배포: GitHub + Vercel

## 폴더 구조

```
easy-phone-helper/
├─ api/check-scam.ts       Vercel Function — Groq API 호출
├─ src/
│  ├─ components/          공통 컴포넌트
│  ├─ data/guides.ts       가이드 데이터
│  ├─ hooks/               커스텀 훅
│  ├─ lib/                 유틸 함수 (haptics, sms, storage, api)
│  ├─ pages/               화면 컴포넌트
│  ├─ types/index.ts       공통 타입 정의
│  ├─ App.tsx              라우터 루트
│  └─ main.tsx             진입점
```

## 보안 규칙 (절대 위반 금지)

1. `VITE_GROQ_API_KEY` 또는 `NEXT_PUBLIC_GROQ_API_KEY` 변수를 절대 만들지 마라.
2. Groq API 키는 오직 `api/check-scam.ts`에서 `process.env.GROQ_API_KEY`로만 읽는다.
3. 프론트엔드에서 Groq API를 직접 호출하지 않는다.
4. `.env.local` 파일은 절대 Git에 커밋하지 않는다. `.gitignore`에 `.env*` 포함 필수.
5. AI 분석 결과에 "100% 사기입니다", "무조건 안전합니다" 같은 확정 표현을 쓰지 않는다.

## 시니어 UX 원칙

- 버튼 높이: 최소 72px
- 글자 크기: 최소 20px (본문), 22px+ (버튼), 26px+ (제목)
- 한 화면에 하나의 목적
- 텍스트 없는 아이콘 버튼 금지
- 오류 발생 시 하얀 화면 금지 — ErrorBoundary가 친절한 복구 화면을 보여줌
- 버튼 클릭 시 시각적 눌림 효과 + navigator.vibrate(30) 진동 (미지원 기기 무시)

## 빌드 / 실행 명령어

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run preview   # 빌드 결과 미리보기
```

## 환경 변수

```
# .env.local (절대 커밋 금지)
GROQ_API_KEY=your_groq_api_key_here
```

Vercel Dashboard → Project Settings → Environment Variables에서 동일하게 등록.

## 로컬 개발 시 Groq 연동

로컬에서 `/api/check-scam`을 테스트하려면 Vercel CLI가 필요하다:

```bash
npx vercel dev
```

`npm run dev`만으로는 Vercel Function이 실행되지 않으므로,
Groq API 미연결 상태에서는 FALLBACK_CAUTION 응답이 반환된다.

## Phase 2 확장 예정

- Supabase 도입 (users, guardian_links, help_requests 테이블)
- 보호자 대시보드
- 연습 모드 (카톡 사진 보내기, 사기 문자 구별)
- PWA 고도화 (오프라인 지원, 홈 화면 설치)
- React Native 네이티브 앱 검토
