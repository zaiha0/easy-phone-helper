import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  Phone, MessageSquare, Image, Hospital,
  BookOpen, ShieldAlert, Settings, HeartHandshake, Car,
} from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import { triggerHapticFeedback } from '../lib/haptics';

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
  { label: '택시 부르기', icon: Car, iconBg: '#FFEDD5', iconColor: '#EA580C', route: '/taxi-practice' },
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

export default function Home() {
  const navigate = useNavigate();

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
          쉬운폰 도우미
        </h1>
        <p className="text-blue-200 text-center mt-1" style={{ fontSize: '16px' }}>무엇을 도와드릴까요?</p>
      </motion.header>

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
