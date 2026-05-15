# 더이음 — CLAUDE.md

## 기술 스택 (Tech Stack)

- **언어**: TypeScript (strict 모드 — `any` 사용 금지)
- **프레임워크**: React 19 + Vite 8
- **스타일**: Tailwind CSS v3 (인라인 style={{ }} 병행)
- **애니메이션**: Framer Motion 12
- **라우팅**: React Router DOM v6
- **AI**: Groq API (llama-3.3-70b-versatile) — 서버리스 함수에서만 호출
- **배포**: GitHub (master 브랜치) → Vercel 자동 배포
- **PWA**: vite-plugin-pwa

> 다중 파일 수정 후에는 반드시 `npm run build`로 타입 오류 확인 후 다음 단계 진행

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

## 시니어 UX 원칙 (Senior UX — 절대 준수)

- 버튼 높이: 최소 72px (탭 타겟 최소 56px)
- 글자 크기: 최소 17px (본문), 20px+ (버튼), 26px+ (제목)
- 한 화면에 하나의 목적
- 텍스트 없는 아이콘 버튼 금지
- 오류 발생 시 하얀 화면 금지 — ErrorBoundary가 친절한 복구 화면을 보여줌
- 버튼 클릭 시 시각적 눌림 효과 + navigator.vibrate(30) 진동 (미지원 기기 무시)
- 텍스트 heavy 화면에는 TTS(글자 읽어주기) 제공 — Web Speech API 사용
- GPS는 사용자가 직접 요청할 때만 작동 (페이지 진입 시 자동 수집 금지)
- 진행 상황은 프로그레스 바로 시각화
- 갤럭시 UI 목업으로 각 단계의 실제 화면을 시각적으로 안내

## 배포 절차 (Deployment)

배포는 반드시 아래 순서로 진행하고, 각 단계 성공을 확인한 뒤 다음 단계로 넘어간다.

```bash
# 1. 빌드 확인 (실패 시 중단)
npm run build

# 2. 커밋 & 푸시
git add -A
git commit -m "feat/fix/docs: 변경 내용 요약"
git push origin master

# 3. Vercel 배포 (자동 트리거 실패 시 수동 실행)
npx vercel --prod

# 4. 배포 확인
npx vercel ls   # 최신 배포 상태 Ready 여부 확인
```

> ⚠️ `git push` 후 Vercel 자동 배포가 트리거되지 않을 수 있음
> → 변경사항이 반영되지 않으면 `npx vercel --prod` 로 수동 재배포
> → `/deploy` 슬래시 명령어 사용 시 자동으로 위 절차 실행됨

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
