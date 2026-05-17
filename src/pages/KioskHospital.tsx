import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerHapticFeedback } from '../lib/haptics';

// ─── 타입 ────────────────────────────────────────────────────────────────────

type Screen = 'intro' | 'language' | 'purpose' | 'department' | 'confirm' | 'complete';

// ─── 미션 텍스트 ─────────────────────────────────────────────────────────────

const MISSION_TEXT: Record<Screen, string> = {
  intro:      '화면을 눌러서 시작하세요.',
  language:   '한국어를 선택해 보세요.',
  purpose:    "'진료 접수'를 눌러보세요.",
  department: "'내과'를 눌러보세요.",
  confirm:    "'접수 확인' 버튼을 눌러보세요.",
  complete:   '접수가 완료됐어요! 잘하셨어요.',
};

const PROGRESS: Record<Screen, number> = {
  intro:      10,
  language:   25,
  purpose:    50,
  department: 70,
  confirm:    90,
  complete:   100,
};

// ─── 헬퍼: 오늘 날짜 ─────────────────────────────────────────────────────────

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}년 ${m}월 ${day}일`;
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export default function KioskHospital() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [screen, setScreen] = useState<Screen>('intro');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const missionText = MISSION_TEXT[screen];
  const progress = PROGRESS[screen];

  const handleReset = () => {
    setScreen('intro');
    setToast('');
  };

  // ─── 헤더 (병원 파란색) ──────────────────────────────────────────────────

  const Header = () => (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ backgroundColor: '#1D4ED8' }}
    >
      <button
        onClick={handleReset}
        style={{
          backgroundColor: '#1E40AF',
          color: 'white',
          fontSize: '15px',
          fontWeight: 'bold',
          padding: '8px 14px',
          borderRadius: '8px',
          minHeight: '44px',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        처음화면
      </button>
      <span style={{ fontSize: '20px', fontWeight: 900, color: 'white' }}>
        더이음 내과의원 💊
      </span>
      <button
        onClick={() => navigate('/kiosk-practice')}
        style={{
          backgroundColor: '#374151',
          color: 'white',
          fontSize: '15px',
          fontWeight: 'bold',
          padding: '8px 14px',
          borderRadius: '8px',
          minHeight: '44px',
        }}
      >
        나가기
      </button>
    </div>
  );

  // ─── 미션 바 (파란색) ────────────────────────────────────────────────────

  const MissionBar = () => (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{ backgroundColor: '#DBEAFE', borderTop: '2px solid #93C5FD' }}
    >
      <div className="px-4 py-3 flex items-end gap-3">
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E3A8A', flex: 1, lineHeight: 1.4 }}>
          {missionText}
        </p>
        <span style={{ fontSize: '36px' }}>💊</span>
      </div>
      <div className="h-6 flex items-center px-3" style={{ backgroundColor: '#BFDBFE' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1E40AF', marginRight: '8px' }}>
          진행 {progress}%
        </span>
        <div className="flex-1 bg-white rounded-full h-3">
          <div
            className="rounded-full h-3 transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#2563EB' }}
          />
        </div>
      </div>
    </div>
  );

  // ─── 토스트 ──────────────────────────────────────────────────────────────

  const Toast = () =>
    toast ? (
      <div
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-xl px-5 py-3 text-center shadow-xl"
        style={{ fontSize: '17px', fontWeight: 'bold', maxWidth: '85%' }}
      >
        {toast}
      </div>
    ) : null;

  // ─── 연습 배너 ───────────────────────────────────────────────────────────

  const PracticeBanner = () => (
    <div className="bg-amber-400 text-center py-1.5 font-bold text-amber-900" style={{ fontSize: '14px' }}>
      연습 화면이에요 — 실제 접수되지 않아요
    </div>
  );

  // ─── 인트로 화면 ─────────────────────────────────────────────────────────

  if (screen === 'intro') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F9FF' }}>
        <PracticeBanner />
        <Header />
        <motion.div
          className="flex-1 flex flex-col items-center justify-center gap-6 p-6 pb-36 cursor-pointer"
          onClick={() => { triggerHapticFeedback(); setScreen('language'); }}
          whileTap={{ scale: 0.98 }}
          style={{ backgroundColor: '#1E3A8A' }}
        >
          <div className="text-center">
            <p style={{ fontSize: '48px', lineHeight: 1.2 }}>🏥</p>
            <p style={{ fontSize: '36px', fontWeight: 900, color: 'white', marginTop: '16px', lineHeight: 1.3 }}>
              더이음 내과의원
            </p>
            <p style={{ fontSize: '22px', color: '#93C5FD', marginTop: '12px' }}>
              무인접수기
            </p>
          </div>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="mt-4 rounded-2xl px-8 py-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)' }}
          >
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
              화면을 눌러주세요
            </p>
          </motion.div>
          <p style={{ fontSize: '14px', color: '#93C5FD' }}>TOUCH TO START</p>
        </motion.div>
        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 언어 선택 화면 ──────────────────────────────────────────────────────

  if (screen === 'language') {
    const langs = [
      { emoji: '🇰🇷', label: '한국어', correct: true },
      { emoji: '🇺🇸', label: 'English', correct: false },
      { emoji: '🇨🇳', label: '中文',   correct: false },
      { emoji: '🇯🇵', label: '日本語', correct: false },
    ];

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EFF6FF' }}>
        <PracticeBanner />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-36 gap-5">
          <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#1E3A8A' }}>언어를 선택해 주세요</p>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>SELECT LANGUAGE</p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-2">
            {langs.map((lang) => (
              <motion.button
                key={lang.label}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  triggerHapticFeedback();
                  if (lang.correct) {
                    setScreen('purpose');
                  } else {
                    showToast('이 연습에서는 한국어를 선택해 보세요.');
                  }
                }}
                className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl shadow-sm border-2 border-blue-200"
                style={{ minHeight: '110px' }}
              >
                <span style={{ fontSize: '44px' }}>{lang.emoji}</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1E3A8A' }}>{lang.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 방문 목적 화면 ──────────────────────────────────────────────────────

  if (screen === 'purpose') {
    const purposes = [
      { emoji: '👨‍⚕️', label: '진료 접수',  correct: true },
      { emoji: '💰', label: '수납/수납',   correct: false },
      { emoji: '📄', label: '증명서 발급', correct: false },
    ];

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EFF6FF' }}>
        <PracticeBanner />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-36 gap-5">
          <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#1E3A8A', textAlign: 'center' }}>
            무엇을 하러 오셨나요?
          </p>
          <div className="space-y-3 w-full max-w-sm mt-2">
            {purposes.map((p) => (
              <motion.button
                key={p.label}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  triggerHapticFeedback();
                  if (p.correct) {
                    setScreen('department');
                  } else {
                    showToast("이번 연습에서는 '진료 접수'를 눌러보세요.");
                  }
                }}
                className="w-full bg-white rounded-2xl shadow-sm border-2 border-blue-200 flex items-center gap-4 px-5"
                style={{ minHeight: '80px' }}
              >
                <span style={{ fontSize: '36px' }}>{p.emoji}</span>
                <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#1E3A8A' }}>{p.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 진료과 선택 화면 ────────────────────────────────────────────────────

  if (screen === 'department') {
    const depts = [
      { emoji: '🫁', label: '내과',    correct: true },
      { emoji: '🔪', label: '외과',    correct: false },
      { emoji: '🦴', label: '정형외과', correct: false },
      { emoji: '🌿', label: '피부과',  correct: false },
    ];

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EFF6FF' }}>
        <PracticeBanner />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-36 gap-5">
          <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#1E3A8A', textAlign: 'center' }}>
            어느 진료과목이세요?
          </p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-2">
            {depts.map((d) => (
              <motion.button
                key={d.label}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  triggerHapticFeedback();
                  if (d.correct) {
                    setScreen('confirm');
                  } else {
                    showToast("이번 연습에서는 '내과'를 눌러보세요.");
                  }
                }}
                className="bg-white rounded-2xl shadow-sm border-2 border-blue-200 flex flex-col items-center justify-center gap-2"
                style={{ minHeight: '100px' }}
              >
                <span style={{ fontSize: '36px' }}>{d.emoji}</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E3A8A' }}>{d.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 접수 확인 화면 ──────────────────────────────────────────────────────

  if (screen === 'confirm') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EFF6FF' }}>
        <PracticeBanner />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-36 gap-5">
          <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#1E3A8A' }}>
            접수 내용을 확인해 주세요
          </p>

          {/* 확인 카드 */}
          <div className="bg-white rounded-3xl shadow-md border border-blue-200 w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 text-center" style={{ backgroundColor: '#1D4ED8' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>접수 정보</p>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: '진료과', value: '내과 🫁' },
                { label: '접수일', value: todayStr() },
                { label: '대기번호', value: '7번 🔢' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span style={{ fontSize: '17px', color: '#6B7280', fontWeight: 'bold' }}>{row.label}</span>
                  <span style={{ fontSize: '19px', fontWeight: 'bold', color: '#1E3A8A' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 접수 확인 버튼 */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { triggerHapticFeedback(); setScreen('complete'); }}
            className="w-full max-w-sm text-white font-extrabold rounded-2xl shadow-lg"
            style={{ minHeight: '72px', fontSize: '24px', backgroundColor: '#DC2626' }}
          >
            접수 확인
          </motion.button>
        </div>
        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 완료 화면 ───────────────────────────────────────────────────────────

  // screen === 'complete'
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#EFF6FF' }}>
      <PracticeBanner />
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-36 gap-6 text-center">
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <p style={{ fontSize: '64px' }}>🎉</p>
            <p style={{ fontSize: '32px', fontWeight: 900, color: '#1E3A8A', marginTop: '12px' }}>
              접수 완료!
            </p>
          </motion.div>
        </AnimatePresence>

        {/* 대기번호 강조 */}
        <div
          className="rounded-3xl px-10 py-5 flex flex-col items-center"
          style={{ backgroundColor: '#1D4ED8' }}
        >
          <p style={{ fontSize: '16px', color: '#93C5FD', fontWeight: 'bold' }}>대기번호</p>
          <p style={{ fontSize: '72px', fontWeight: 900, color: 'white', lineHeight: 1 }}>7</p>
          <p style={{ fontSize: '16px', color: '#93C5FD' }}>번</p>
        </div>

        <p style={{ fontSize: '18px', color: '#374151', lineHeight: 1.7 }}>
          접수가 완료됐어요.{'\n'}대기 번호가 불릴 때까지 기다려 주세요.
        </p>

        <div className="w-full max-w-sm space-y-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { triggerHapticFeedback(); handleReset(); }}
            className="w-full text-white font-bold rounded-2xl"
            style={{ minHeight: '72px', fontSize: '22px', backgroundColor: '#2563EB' }}
          >
            처음부터 다시하기
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { triggerHapticFeedback(); navigate('/'); }}
            className="w-full bg-gray-100 text-gray-700 font-bold rounded-2xl"
            style={{ minHeight: '64px', fontSize: '20px' }}
          >
            홈으로 가기
          </motion.button>
        </div>
      </div>
      <MissionBar />
      <Toast />
    </div>
  );
}
