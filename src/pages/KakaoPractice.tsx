import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ChevronLeft, RotateCcw, Home, PartyPopper,
  Search, Phone, MoreVertical, Plus, Send, Smile,
} from 'lucide-react';
import { Progress } from '../components/ui/progress';
import HelpRequestBar from '../components/HelpRequestBar';
import { triggerHapticFeedback } from '../lib/haptics';

const KAKAO_YELLOW = '#FEE500';
const CHAT_BG = '#B2C7D9';

// ── 탭 가능한 하이라이트 래퍼 ────────────────────────────────
function TapTarget({ children, onTap }: { children: React.ReactNode; onTap: () => void }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 0 0px rgba(254,229,0,0.9)',
          '0 0 0 12px rgba(254,229,0,0)',
          '0 0 0 0px rgba(254,229,0,0.9)',
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

function StatusBar() {
  return (
    <div className="flex justify-between items-center px-4 py-1 bg-[#F9F9F9]" style={{ fontSize: '11px' }}>
      <span className="font-bold text-gray-800">9:41</span>
      <div className="flex gap-1 text-gray-600 items-center">
        <span>●●●●</span>
        <span className="text-xs">WiFi</span>
        <span>🔋</span>
      </div>
    </div>
  );
}

// ── 1단계: 채팅 목록 ─────────────────────────────────────────
function ChatListScreen({ onNext }: { onNext: () => void }) {
  const chats = [
    { name: '아들', msg: '네 알겠어요 어머니!', time: '오전 10:30', unread: 2, avatar: '👦', highlight: true },
    { name: '딸', msg: '밥은 먹었어?', time: '어제', unread: 0, avatar: '👧', highlight: false },
    { name: '동네 슈퍼', msg: '감사합니다~', time: '월요일', unread: 0, avatar: '🏪', highlight: false },
    { name: '경로당 모임', msg: '내일 봬요~', time: '화요일', unread: 0, avatar: '🏛️', highlight: false },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="flex items-center justify-between px-4 py-2 bg-[#F9F9F9] border-b border-gray-100">
        <span className="font-extrabold text-gray-900" style={{ fontSize: '20px' }}>카카오톡</span>
        <div className="flex items-center gap-3">
          <Search size={20} className="text-gray-600" />
          <span className="font-bold text-gray-700" style={{ fontSize: '20px' }}>+</span>
        </div>
      </div>
      {/* 채팅 탭 */}
      <div className="flex border-b border-gray-200 bg-white">
        {['친구', '채팅', '오픈채팅'].map((tab, i) => (
          <div
            key={tab}
            className="flex-1 py-2 text-center font-semibold"
            style={{ fontSize: '13px', color: i === 1 ? '#000' : '#888', borderBottom: i === 1 ? '2px solid #333' : 'none' }}
          >
            {tab}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {chats.map((chat) => {
          const row = (
            <div
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-50"
              style={{ backgroundColor: chat.highlight ? 'rgba(254,229,0,0.18)' : 'white' }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f5f5f5', fontSize: '22px' }}>
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-0.5">
                  <span className="font-bold text-gray-900" style={{ fontSize: '15px' }}>{chat.name}</span>
                  <span className="text-gray-400" style={{ fontSize: '11px' }}>{chat.time}</span>
                </div>
                <span className="text-gray-500 truncate block" style={{ fontSize: '13px' }}>{chat.msg}</span>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold" style={{ fontSize: '11px' }}>{chat.unread}</span>
                </div>
              )}
            </div>
          );
          return chat.highlight
            ? <TapTarget key={chat.name} onTap={onNext}>{row}</TapTarget>
            : <div key={chat.name}>{row}</div>;
        })}
      </div>
      <div className="bg-white border-t border-gray-200 flex justify-around py-2">
        {[['👥', '친구'], ['💬', '채팅'], ['🛒', '쇼핑'], ['⋯', '더보기']].map(([icon, label]) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <span style={{ fontSize: '18px' }}>{icon}</span>
            <span style={{ fontSize: '10px', color: label === '채팅' ? '#000' : '#999' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 2단계: 채팅방 ─────────────────────────────────────────────
function ChatRoomScreen({ onNext }: { onNext: () => void }) {
  const messages = [
    { text: '어머니 요즘 잘 지내세요? 😊', mine: false, time: '오전 10:20' },
    { text: '그래, 잘 지내지. 너는?', mine: true, time: '오전 10:22' },
    { text: '저도 잘 있어요! 예쁜 꽃 사진 보내드릴게요', mine: false, time: '오전 10:28' },
  ];
  return (
    <div className="flex flex-col h-full">
      <StatusBar />
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F9F9F9] border-b border-gray-100">
        <ChevronLeft size={22} className="text-gray-600" />
        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0" style={{ fontSize: '16px' }}>👦</div>
        <span className="font-bold text-gray-900 flex-1" style={{ fontSize: '16px' }}>아들</span>
        <Phone size={18} className="text-gray-500 mr-1" />
        <Search size={18} className="text-gray-500 mr-1" />
        <MoreVertical size={18} className="text-gray-500" />
      </div>
      <div className="flex-1 p-3 space-y-3 overflow-hidden" style={{ backgroundColor: CHAT_BG }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'} items-end gap-1.5`}>
            {!msg.mine && (
              <div className="w-7 h-7 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0" style={{ fontSize: '13px' }}>👦</div>
            )}
            <div
              className="px-3 py-2"
              style={{
                backgroundColor: msg.mine ? KAKAO_YELLOW : 'white',
                borderRadius: msg.mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                maxWidth: '180px',
                fontSize: '13px',
                lineHeight: '1.4',
              }}
            >
              {msg.text}
            </div>
            <span style={{ fontSize: '10px', color: '#555', flexShrink: 0 }}>{msg.time}</span>
          </div>
        ))}
      </div>
      <div className="bg-white border-t border-gray-200 flex items-center gap-2 px-2 py-2">
        <TapTarget onTap={onNext}>
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Plus size={20} className="text-gray-600" />
          </div>
        </TapTarget>
        <div className="flex-1 bg-gray-100 rounded-2xl px-3 py-2" style={{ fontSize: '13px', color: '#999' }}>
          메시지 보내기
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <Smile size={20} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

// ── 3단계: 첨부 메뉴 ─────────────────────────────────────────
function AttachmentScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <StatusBar />
      <div className="flex items-center gap-2 px-3 py-2 bg-[#F9F9F9] border-b border-gray-100">
        <ChevronLeft size={22} className="text-gray-600" />
        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center" style={{ fontSize: '16px' }}>👦</div>
        <span className="font-bold text-gray-900 flex-1" style={{ fontSize: '16px' }}>아들</span>
        <Phone size={18} className="text-gray-500 mr-1" />
        <MoreVertical size={18} className="text-gray-500" />
      </div>
      <div className="flex-1 p-3" style={{ backgroundColor: CHAT_BG }}>
        <div className="flex justify-end">
          <div className="px-3 py-2" style={{ backgroundColor: KAKAO_YELLOW, borderRadius: '18px 18px 4px 18px', fontSize: '13px' }}>
            그래, 잘 지내지. 너는?
          </div>
        </div>
      </div>
      <div className="bg-white border-t border-gray-200 flex items-center gap-2 px-2 py-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: KAKAO_YELLOW }}>
          <Plus size={20} className="text-gray-700" />
        </div>
        <div className="flex-1 bg-gray-100 rounded-2xl px-3 py-2" style={{ fontSize: '13px', color: '#999' }}>
          메시지 보내기
        </div>
        <Smile size={20} className="text-gray-400" />
      </div>
      {/* 첨부 옵션 */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          <TapTarget onTap={onNext}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400 flex items-center justify-center" style={{ fontSize: '22px' }}>🖼️</div>
              <span className="text-gray-700 text-center font-bold" style={{ fontSize: '10px' }}>사진/동영상</span>
            </div>
          </TapTarget>
          {([['📁', '파일'], ['📍', '위치'], ['📅', '일정']] as [string, string][]).map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center" style={{ fontSize: '22px' }}>{icon}</div>
              <span className="text-gray-400 text-center" style={{ fontSize: '10px' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 4단계: 사진 갤러리 ───────────────────────────────────────
function PhotoGalleryScreen({ onNext }: { onNext: () => void }) {
  const photos = [
    { bg: '#FFB7C5', emoji: '🌸', highlight: true },
    { bg: '#FBD9AD', emoji: '🌅' },
    { bg: '#C8E6C9', emoji: '🌿' },
    { bg: '#F3CDF8', emoji: '🌺' },
    { bg: '#FFF9C4', emoji: '🌻' },
    { bg: '#B2EBF2', emoji: '🌊' },
  ];
  return (
    <div className="flex flex-col h-full bg-white">
      <StatusBar />
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
        <ChevronLeft size={22} className="text-gray-600" />
        <span className="font-bold text-gray-900 flex-1" style={{ fontSize: '16px' }}>사진 선택</span>
        <span className="text-blue-500 font-semibold" style={{ fontSize: '14px' }}>전송(0)</span>
      </div>
      <div className="flex border-b border-gray-200">
        {['전체', '즐겨찾기', '최근'].map((tab, i) => (
          <div key={tab} className="flex-1 py-2 text-center font-semibold"
            style={{ fontSize: '12px', color: i === 0 ? '#000' : '#888', borderBottom: i === 0 ? '2px solid #333' : 'none' }}>
            {tab}
          </div>
        ))}
      </div>
      <div className="flex-1 p-1">
        <div className="grid grid-cols-3 gap-1">
          {photos.map((photo, i) => {
            const inner = (
              <div className="relative flex items-center justify-center"
                style={{ backgroundColor: photo.bg, aspectRatio: '1', fontSize: '28px', borderRadius: 4 }}>
                {photo.emoji}
                {photo.highlight && (
                  <div className="absolute inset-0" style={{ border: '3px solid #FEE500', borderRadius: 4 }} />
                )}
              </div>
            );
            return (photo as { highlight?: boolean }).highlight
              ? <TapTarget key={i} onTap={onNext}>{inner}</TapTarget>
              : <div key={i}>{inner}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

// ── 5단계: 보내기 ─────────────────────────────────────────────
function SendPhotoScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center gap-2 px-3 py-3">
        <ChevronLeft size={22} className="text-white" />
        <span className="font-bold text-white flex-1" style={{ fontSize: '16px' }}>1장 선택됨</span>
      </div>
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#FFB7C5' }}>
        <span style={{ fontSize: '80px' }}>🌸</span>
      </div>
      <div className="bg-black flex items-center gap-2 px-3 py-3">
        <div className="flex-1 bg-gray-800 rounded-full px-4 py-2" style={{ fontSize: '13px', color: '#666' }}>
          문구를 입력해 주세요.
        </div>
        <TapTarget onTap={onNext}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: KAKAO_YELLOW }}>
            <Send size={19} className="text-gray-800" />
          </div>
        </TapTarget>
      </div>
    </div>
  );
}

// ── 메인 ──────────────────────────────────────────────────────

const steps = [
  { hint: '노란 테두리가 빛나는 아들 이름을 눌러 보세요', Component: ChatListScreen },
  { hint: '아래쪽 + 버튼을 눌러 보세요', Component: ChatRoomScreen },
  { hint: '🖼️ 사진/동영상을 눌러 보세요', Component: AttachmentScreen },
  { hint: '노란 테두리가 있는 꽃 사진을 눌러 보세요', Component: PhotoGalleryScreen },
  { hint: '노란 보내기(→) 버튼을 눌러 보세요', Component: SendPhotoScreen },
];

export default function KakaoPractice() {
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
            <div className="w-28 h-28 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PartyPopper size={56} className="text-yellow-500" />
            </div>
            <h2 className="font-extrabold text-gray-900 mb-3" style={{ fontSize: '28px' }}>잘하셨어요!</h2>
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: '20px' }}>
              카톡 사진 보내기 연습을{'\n'}완료했습니다.
            </p>
          </motion.div>
          <div className="w-full max-w-sm space-y-3">
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => { triggerHapticFeedback(); setCurrentStep(0); setDone(false); }}
              className="w-full text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3"
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
        <HelpRequestBar aiContext="사용자가 카카오톡 사진 보내기 연습을 완료했어요. 실제 카카오톡 앱 사용에 대해 궁금한 점이 있을 수 있어요." />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-36" style={{ backgroundColor: '#FAF7F2' }}>
      <header className="px-4 pt-5 pb-2 flex-shrink-0">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-500 mb-3" style={{ fontSize: '16px' }}>
          <ArrowLeft size={20} /> 홈으로
        </button>
        <h1 className="font-extrabold text-gray-900 mb-2" style={{ fontSize: '21px' }}>카톡 사진 보내기 연습</h1>
        <div className="flex justify-between mb-1">
          <span className="text-gray-500 font-semibold" style={{ fontSize: '13px' }}>{currentStep + 1}/{steps.length}단계</span>
          <span className="text-yellow-600 font-bold" style={{ fontSize: '13px' }}>{Math.round(progress)}%</span>
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

      <HelpRequestBar aiContext={`사용자가 카카오톡 사진 보내기 연습 중이에요. 지금 ${currentStep + 1}단계: ${step.hint}`} />
    </div>
  );
}
