import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ChevronLeft, RotateCcw, Home, PartyPopper,
  Search, MapPin, Navigation, Star, Clock, AlertTriangle,
} from 'lucide-react';
import { Progress } from '../components/ui/progress';
import HelpRequestBar from '../components/HelpRequestBar';
import { triggerHapticFeedback } from '../lib/haptics';

const KAKAO_YELLOW = '#FFD700';
const DARK_NAV = '#1C2340';

// ── 탭 가능한 하이라이트 래퍼 ────────────────────────────────
function TapTarget({ children, onTap, color = 'rgba(255,215,0,0.9)' }: {
  children: React.ReactNode; onTap: () => void; color?: string;
}) {
  const rgb = color.includes('255,215') ? '255,215,0' : '255,215,0';
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 0 0px rgba(${rgb},0.9)`,
          `0 0 0 12px rgba(${rgb},0)`,
          `0 0 0 0px rgba(${rgb},0.9)`,
        ],
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
      style={{ borderRadius: 12, cursor: 'pointer' }}
      onClick={() => { triggerHapticFeedback(); onTap(); }}
    >
      {children}
    </motion.div>
  );
}

// ── 가짜 지도 배경 ───────────────────────────────────────────
function MapBackground({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: '#E8EAD3' }}>
      {/* 도로 */}
      <div className="absolute inset-0">
        <div className="absolute bg-white opacity-80" style={{ top: '35%', left: 0, right: 0, height: 8 }} />
        <div className="absolute bg-white opacity-60" style={{ top: '65%', left: 0, right: 0, height: 5 }} />
        <div className="absolute bg-white opacity-80" style={{ left: '30%', top: 0, bottom: 0, width: 8 }} />
        <div className="absolute bg-white opacity-60" style={{ left: '70%', top: 0, bottom: 0, width: 5 }} />
        {/* 블록 */}
        <div className="absolute rounded" style={{ top: '8%', left: '5%', width: '22%', height: '25%', backgroundColor: '#D4D8BD', opacity: 0.8 }} />
        <div className="absolute rounded" style={{ top: '8%', left: '35%', width: '30%', height: '25%', backgroundColor: '#D4D8BD', opacity: 0.8 }} />
        <div className="absolute rounded" style={{ top: '8%', right: '5%', width: '20%', height: '25%', backgroundColor: '#D4D8BD', opacity: 0.8 }} />
        <div className="absolute rounded" style={{ top: '42%', left: '5%', width: '20%', height: '20%', backgroundColor: '#D4D8BD', opacity: 0.8 }} />
        <div className="absolute rounded" style={{ top: '42%', left: '35%', width: '30%', height: '20%', backgroundColor: '#D4D8BD', opacity: 0.8 }} />
        <div className="absolute rounded" style={{ top: '72%', left: '5%', width: '22%', height: '22%', backgroundColor: '#C8E6C9', opacity: 0.8 }} />
        <div className="absolute rounded" style={{ top: '72%', left: '35%', width: '25%', height: '22%', backgroundColor: '#D4D8BD', opacity: 0.8 }} />
      </div>
      {children}
    </div>
  );
}

// ── 1단계: KakaoT 홈 (지도 + 목적지 입력) ────────────────────
function KakaoTHomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: DARK_NAV }}>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white" style={{ fontSize: '18px' }}>kakaoT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center" style={{ fontSize: '14px' }}>👤</div>
        </div>
      </div>

      {/* 지도 */}
      <div className="flex-1 relative">
        <MapBackground>
          {/* 현재 위치 마커 */}
          <div className="absolute" style={{ bottom: '40%', left: '45%' }}>
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            <div className="w-8 h-8 bg-blue-200 rounded-full absolute -top-2 -left-2 opacity-40 animate-ping" />
          </div>
        </MapBackground>
      </div>

      {/* 하단 목적지 입력 */}
      <div className="bg-white px-4 pt-4 pb-4 shadow-2xl" style={{ borderRadius: '20px 20px 0 0' }}>
        <TapTarget onTap={onNext}>
          <div className="flex items-center gap-3 border-2 border-yellow-400 rounded-2xl px-4 py-3" style={{ backgroundColor: '#FFFEF0' }}>
            <Search size={20} className="text-gray-400" />
            <span style={{ fontSize: '16px', color: '#999' }}>어디로 갈까요?</span>
          </div>
        </TapTarget>
        <div className="flex gap-3 mt-3">
          {[['🏠', '집'], ['⭐', '즐겨찾기'], ['🏢', '회사']].map(([icon, label]) => (
            <div key={label} className="flex-1 bg-gray-100 rounded-xl py-2 flex flex-col items-center gap-1">
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <span className="text-gray-600" style={{ fontSize: '11px' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 2단계: 목적지 검색 ───────────────────────────────────────
function SearchScreen({ onNext }: { onNext: () => void }) {
  const suggestions = [
    { name: '서울성모병원', addr: '서울 서초구 반포대로', highlight: true },
    { name: '강남성심병원', addr: '서울 강남구 논현로' },
    { name: '삼성서울병원', addr: '서울 강남구 일원로' },
  ];
  return (
    <div className="flex flex-col h-full bg-white">
      {/* 검색 헤더 */}
      <div className="flex items-center gap-2 px-3 py-3" style={{ backgroundColor: DARK_NAV }}>
        <ChevronLeft size={22} className="text-white" />
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400" />
          <span className="text-gray-700 font-semibold" style={{ fontSize: '15px' }}>병원</span>
          <span className="text-gray-400 animate-pulse">|</span>
        </div>
      </div>

      {/* 최근/추천 */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-gray-500 font-semibold" style={{ fontSize: '12px' }}>검색 결과</p>
      </div>

      <div className="flex-1 overflow-hidden">
        {suggestions.map((s) => {
          const row = (
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50"
              style={{ backgroundColor: s.highlight ? 'rgba(255,215,0,0.12)' : 'white' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: s.highlight ? '#FFF9C4' : '#F5F5F5' }}>
                <MapPin size={18} className={s.highlight ? 'text-yellow-600' : 'text-gray-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900" style={{ fontSize: '15px' }}>{s.name}</p>
                <p className="text-gray-400 truncate" style={{ fontSize: '12px' }}>{s.addr}</p>
              </div>
            </div>
          );
          return s.highlight
            ? <TapTarget key={s.name} onTap={onNext}>{row}</TapTarget>
            : <div key={s.name}>{row}</div>;
        })}

        {/* 최근 목적지 */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-gray-400 font-semibold" style={{ fontSize: '12px' }}>최근 목적지</p>
        </div>
        {[['🏠', '집', '서울 송파구'], ['⭐', '단골 마트', '서울 송파구']].map(([icon, name, addr]) => (
          <div key={name} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center" style={{ fontSize: '18px' }}>{icon}</div>
            <div>
              <p className="font-semibold text-gray-800" style={{ fontSize: '14px' }}>{name}</p>
              <p className="text-gray-400" style={{ fontSize: '12px' }}>{addr}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 3단계: 택시 종류 선택 ─────────────────────────────────────
function TaxiTypeScreen({ onNext }: { onNext: () => void }) {
  const types = [
    { id: '일반', label: '일반택시', price: '약 8,500원', time: '3분', emoji: '🚕', highlight: true },
    { id: '블랙', label: '블랙', price: '약 24,000원', time: '5분', emoji: '🚙', highlight: false },
    { id: '벤티', label: '벤티', price: '약 13,500원', time: '8분', emoji: '🚐', highlight: false },
  ];
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-3" style={{ backgroundColor: DARK_NAV }}>
        <ChevronLeft size={22} className="text-white" />
        <span className="font-bold text-white flex-1" style={{ fontSize: '16px' }}>서울성모병원</span>
      </div>

      {/* 축소 지도 (경로 표시) */}
      <div className="relative" style={{ height: '160px' }}>
        <MapBackground>
          {/* 출발지 */}
          <div className="absolute" style={{ bottom: '30%', left: '20%' }}>
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow" />
          </div>
          {/* 경로 선 */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <path d="M 80 110 Q 140 90 200 70" stroke="#4285F4" strokeWidth="3" fill="none" strokeDasharray="6 3" />
          </svg>
          {/* 목적지 */}
          <div className="absolute flex flex-col items-center" style={{ top: '25%', right: '25%' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FF5252' }}>
              <MapPin size={14} className="text-white" />
            </div>
          </div>
        </MapBackground>
        {/* 거리/시간 배지 */}
        <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 shadow">
          <p className="font-bold text-gray-800" style={{ fontSize: '12px' }}>4.2 km · 약 15분</p>
        </div>
      </div>

      {/* 택시 종류 */}
      <div className="flex-1 bg-white overflow-hidden px-3 py-3 space-y-2">
        <p className="text-gray-500 font-semibold" style={{ fontSize: '12px' }}>택시 종류를 골라요</p>
        {types.map((t) => {
          const card = (
            <div className="flex items-center gap-3 rounded-2xl px-3 py-3 border-2"
              style={{ borderColor: t.highlight ? KAKAO_YELLOW : '#F0F0F0', backgroundColor: t.highlight ? '#FFFEF0' : 'white' }}>
              <span style={{ fontSize: '26px' }}>{t.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-gray-900" style={{ fontSize: '15px' }}>{t.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock size={12} className="text-gray-400" />
                  <span className="text-gray-400" style={{ fontSize: '12px' }}>{t.time} 후 도착</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold" style={{ fontSize: '14px', color: t.highlight ? '#B8860B' : '#333' }}>{t.price}</p>
                {t.highlight && <Star size={12} className="text-yellow-500 ml-auto" fill="#FFD700" />}
              </div>
            </div>
          );
          return t.highlight
            ? <TapTarget key={t.id} onTap={onNext}>{card}</TapTarget>
            : <div key={t.id}>{card}</div>;
        })}
      </div>
    </div>
  );
}

// ── 4단계: 호출하기 ───────────────────────────────────────────
function CallScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-2 px-3 py-3" style={{ backgroundColor: DARK_NAV }}>
        <ChevronLeft size={22} className="text-white" />
        <span className="font-bold text-white flex-1" style={{ fontSize: '16px' }}>일반택시 · 호출 확인</span>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* 경로 요약 */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />
            <div>
              <p className="text-gray-500" style={{ fontSize: '11px' }}>출발</p>
              <p className="font-bold text-gray-900" style={{ fontSize: '14px' }}>현재 위치</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0" />
            <div>
              <p className="text-gray-500" style={{ fontSize: '11px' }}>도착</p>
              <p className="font-bold text-gray-900" style={{ fontSize: '14px' }}>서울성모병원</p>
            </div>
          </div>
        </div>

        {/* 요금/시간 정보 */}
        <div className="grid grid-cols-3 gap-2">
          {[['🚕', '일반택시', ''], ['💰', '약 8,500원', ''], ['⏱️', '약 15분', '']].map(([icon, value], i) => (
            <div key={i} className="bg-gray-50 rounded-xl py-3 flex flex-col items-center gap-1">
              <span style={{ fontSize: '20px' }}>{icon}</span>
              <span className="font-bold text-gray-800 text-center" style={{ fontSize: '12px' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* 배차 예상 */}
        <div className="bg-blue-50 rounded-xl px-3 py-2 flex items-center gap-2">
          <Navigation size={16} className="text-blue-500" />
          <span className="text-blue-700 font-semibold" style={{ fontSize: '13px' }}>3분 후 도착 예정 · 주변 택시 7대</span>
        </div>

        {/* 호출하기 버튼 */}
        <TapTarget onTap={onNext}>
          <div className="w-full rounded-2xl flex items-center justify-center font-extrabold shadow-lg"
            style={{ backgroundColor: KAKAO_YELLOW, minHeight: '56px', fontSize: '20px', color: '#333' }}>
            🚕 호출하기
          </div>
        </TapTarget>
      </div>
    </div>
  );
}

// ── 5단계: 배차 대기 ─────────────────────────────────────────
function WaitingScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: DARK_NAV }}>
      <div className="px-4 pt-5 pb-3">
        <p className="text-gray-400 font-semibold" style={{ fontSize: '12px' }}>배차 중</p>
        <p className="font-extrabold text-white" style={{ fontSize: '20px' }}>택시를 배정하고 있어요</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        {/* 택시 애니메이션 */}
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '64px' }}
        >
          🚕
        </motion.div>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
              className="w-3 h-3 rounded-full bg-yellow-400"
            />
          ))}
        </div>
        <p className="text-gray-300 text-center" style={{ fontSize: '15px' }}>잠시만 기다려 주세요...</p>
      </div>

      <div className="px-4 pb-5">
        <TapTarget onTap={onNext}>
          <div className="w-full rounded-2xl flex items-center justify-center font-bold"
            style={{ backgroundColor: KAKAO_YELLOW, minHeight: '52px', fontSize: '17px', color: '#333' }}>
            연습 완료! ✓
          </div>
        </TapTarget>
      </div>
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────

const steps = [
  { hint: '노란 테두리의 "어디로 갈까요?" 칸을 눌러 보세요', Component: KakaoTHomeScreen },
  { hint: '노란 테두리가 있는 서울성모병원을 눌러 보세요', Component: SearchScreen },
  { hint: '노란 테두리가 있는 일반택시를 눌러 보세요', Component: TaxiTypeScreen },
  { hint: '노란 "호출하기" 버튼을 눌러 보세요', Component: CallScreen },
  { hint: '"연습 완료!" 버튼을 눌러 마무리해 보세요', Component: WaitingScreen },
];

export default function TaxiPractice() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const handleNext = () => {
    triggerHapticFeedback();
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setDone(true);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  if (done) {
    return (
      <div className="flex flex-col min-h-screen pb-36" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-6">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
            <div className="w-28 h-28 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper size={56} className="text-orange-500" />
            </div>
            <h2 className="font-extrabold text-gray-900 mb-3" style={{ fontSize: '28px' }}>잘하셨어요!</h2>
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: '20px' }}>
              택시 부르기 연습을{'\n'}완료했습니다.
            </p>
          </motion.div>
          <div className="w-full max-w-sm space-y-3">
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => { triggerHapticFeedback(); setCurrentStep(0); setDone(false); }}
              className="w-full font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3"
              style={{ minHeight: '72px', fontSize: '20px', backgroundColor: KAKAO_YELLOW, color: '#333' }}>
              <RotateCcw size={24} /> 다시 연습하기
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 font-bold rounded-2xl flex items-center justify-center gap-3"
              style={{ minHeight: '64px', fontSize: '20px' }}>
              <Home size={22} /> 처음으로
            </motion.button>
          </div>
        </div>
        <HelpRequestBar aiContext="사용자가 카카오T 택시 부르기 연습을 완료했어요. 실제 앱 사용에 대해 궁금한 점이 있을 수 있어요." />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-36" style={{ backgroundColor: '#FAF7F2' }}>
      <header className="px-4 pt-5 pb-2 flex-shrink-0">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-500 mb-3" style={{ fontSize: '16px' }}>
          <ArrowLeft size={20} /> 홈으로
        </button>

        {/* 연습용 경고 */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
          <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
          <p className="text-amber-700 font-semibold" style={{ fontSize: '12px' }}>연습용 화면이에요. 실제 택시는 호출되지 않아요.</p>
        </div>

        <h1 className="font-extrabold text-gray-900 mb-2" style={{ fontSize: '21px' }}>택시 부르기 연습</h1>
        <div className="flex justify-between mb-1">
          <span className="text-gray-500 font-semibold" style={{ fontSize: '13px' }}>{currentStep + 1}/{steps.length}단계</span>
          <span className="font-bold" style={{ fontSize: '13px', color: '#B8860B' }}>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </header>

      <main className="flex-1 px-4 space-y-3 flex flex-col">
        {/* 힌트 카드 */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep + '-hint'}
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="bg-yellow-50 border border-yellow-300 rounded-2xl px-4 py-3 flex-shrink-0">
            <p className="text-yellow-800 font-bold" style={{ fontSize: '16px' }}>👆 {step.hint}</p>
          </motion.div>
        </AnimatePresence>

        {/* 폰 목업 */}
        <AnimatePresence mode="wait">
          <motion.div key={currentStep}
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="mx-auto flex-1 w-full overflow-hidden"
            style={{ maxWidth: '320px', height: '420px', borderRadius: 24, border: '4px solid #1a1a1a', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <step.Component onNext={handleNext} />
          </motion.div>
        </AnimatePresence>
      </main>

      <HelpRequestBar aiContext={`사용자가 카카오T 택시 부르기 연습 중이에요. 지금 ${currentStep + 1}단계: ${step.hint}`} />
    </div>
  );
}
