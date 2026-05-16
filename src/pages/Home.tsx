import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  Phone, MessageSquare, Image, Hospital,
  BookOpen, ShieldAlert, Settings, HeartHandshake, Car, MapPin, Bus, Monitor, Smartphone,
} from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import { triggerHapticFeedback } from '../lib/haptics';
import { useFontSize } from '../contexts/FontSizeContext';
import type { UserSettings } from '../types';

const featuredGuides = [
  { label: '문자 확인\n가이드', icon: MessageSquare, bg: 'from-orange-400 to-orange-500', route: '/message' },
  { label: '병원/약국\n가이드', icon: Hospital, bg: 'from-red-400 to-rose-500', route: '/hospital' },
  { label: '카톡\n연습하기', icon: HeartHandshake, bg: 'from-yellow-400 to-amber-400', route: '/kakao-practice' },
];

const mainButtons = [
  { label: '전화하기', icon: Phone, iconBg: '#DBEAFE', iconColor: '#2563EB', route: '/phone' },
  { label: '문자 보기', icon: MessageSquare, iconBg: '#EDE9FE', iconColor: '#7C3AED', route: '/message' },
  { label: '사진 보기', icon: Image, iconBg: '#FDE8F3', iconColor: '#E91E63', route: '/photo' },
  { label: '가이드 목록', icon: BookOpen, iconBg: '#DCFCE7', iconColor: '#16A34A', route: '/guides' },
  { label: '보호자 설정', icon: Settings, iconBg: '#FEF9C3', iconColor: '#CA8A04', route: '/guardian' },
  { label: '사기 문자\n확인', icon: ShieldAlert, iconBg: '#FEE2E2', iconColor: '#DC2626', route: '/scam-check' },
  { label: '택시 연습하기', icon: Car, iconBg: '#FFEDD5', iconColor: '#EA580C', route: '/taxi-practice' },
  { label: '병원/약국\n찾기', icon: MapPin, iconBg: '#FCE7F3', iconColor: '#DB2777', route: '/hospital' },
  { label: '버스/지하철\n길찾기', icon: Bus, iconBg: '#DCFCE7', iconColor: '#16A34A', route: '/transport' },
  { label: '키오스크\n연습', icon: Monitor, iconBg: '#FFF7ED', iconColor: '#EA580C', route: '/kiosk-practice' },
  { label: '실제 택시\n부르기', icon: Car, iconBg: '#FEF9C3', iconColor: '#CA8A04', route: '/taxi-real' },
  { label: '화면 조작법\n배우기', icon: Smartphone, iconBg: '#DBEAFE', iconColor: '#2563EB', route: '/basics' },
];

const featuredVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const featuredItem: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};
const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const gridItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 24 } },
};

type FontSize = UserSettings['fontSize'];

const fontSizeOptions: { value: FontSize; label: string }[] = [
  { value: 'normal', label: '가' },
  { value: 'large', label: '가' },
  { value: 'xlarge', label: '가' },
];

export default function Home() {
  const navigate = useNavigate();
  const { fontSize, setFontSize } = useFontSize();

  const handleNav = (route: string) => {
    triggerHapticFeedback();
    navigate(route);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ backgroundColor: '#FAF7F2' }}>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-4 mt-5 mb-4 rounded-3xl px-5 py-4 shadow-md"
        style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' }}
      >
        <h1 className="font-extrabold text-white text-center" style={{ fontSize: '28px', letterSpacing: '-0.5px' }}>
          더이음
        </h1>
        <p className="text-blue-200 text-center mt-1" style={{ fontSize: '16px' }}>디지털 세상과 나를 이어드릴게요</p>
      </motion.header>

      {/* 글자 크기 조절 바 */}
      <div className="mx-4 mb-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3">
          <span className="text-gray-500 font-medium flex-shrink-0" style={{ fontSize: '13px' }}>글자 크기</span>
          <div className="flex gap-2 flex-1">
            {fontSizeOptions.map((opt, idx) => (
              <button
                key={opt.value}
                onClick={() => { triggerHapticFeedback(); setFontSize(opt.value); }}
                className="flex-1 rounded-xl font-bold transition-all border-2"
                style={{
                  fontSize: idx === 0 ? '14px' : idx === 1 ? '18px' : '22px',
                  height: '44px',
                  backgroundColor: fontSize === opt.value ? '#2563EB' : '#F3F4F6',
                  color: fontSize === opt.value ? 'white' : '#6B7280',
                  borderColor: fontSize === opt.value ? '#2563EB' : 'transparent',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 space-y-5">
        <div>
          <p className="font-bold text-gray-500 mb-3 px-1" style={{ fontSize: '15px' }}>빠른 가이드</p>
          <motion.div variants={featuredVariants} initial="hidden" animate="show" className="grid grid-cols-3 gap-3">
            {featuredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <motion.button
                  key={guide.label}
                  variants={featuredItem}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => handleNav(guide.route)}
                  className={`bg-gradient-to-br ${guide.bg} rounded-2xl shadow-md
                              flex flex-col items-center justify-center gap-2 select-none`}
                  style={{ minHeight: '90px', padding: '12px 8px' }}
                >
                  <div className="w-11 h-11 rounded-2xl bg-white/30 flex items-center justify-center">
                    <Icon size={24} color="white" strokeWidth={2.2} />
                  </div>
                  <span className="text-white font-bold text-center leading-tight whitespace-pre-line" style={{ fontSize: '13px' }}>
                    {guide.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div>
          <p className="font-bold text-gray-500 mb-3 px-1" style={{ fontSize: '15px' }}>주요 기능</p>
          <motion.div variants={gridVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
            {mainButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <motion.button
                  key={btn.label}
                  variants={gridItem}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => handleNav(btn.route)}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100
                             flex flex-col items-center justify-center gap-3 select-none"
                  style={{ minHeight: '100px' }}
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: btn.iconBg }}>
                    <Icon size={28} color={btn.iconColor} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-gray-800 text-center leading-tight whitespace-pre-line" style={{ fontSize: '17px' }}>
                    {btn.label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

      </main>

      <HelpRequestBar />
    </div>
  );
}
