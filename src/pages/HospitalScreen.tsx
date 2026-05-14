import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Hospital, MapPin, ExternalLink } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import { triggerHapticFeedback } from '../lib/haptics';

const mapLinks = [
  {
    label: '가까운 병원 찾기',
    subLabel: '네이버 지도에서 찾기',
    icon: '🏥',
    color: 'from-red-500 to-rose-500',
    url: 'https://map.naver.com/v5/search/%EB%82%B4%20%EC%A3%BC%EB%B3%80%20%EB%B3%91%EC%9B%90',
  },
  {
    label: '가까운 약국 찾기',
    subLabel: '네이버 지도에서 찾기',
    icon: '💊',
    color: 'from-emerald-500 to-green-500',
    url: 'https://map.naver.com/v5/search/%EB%82%B4%20%EC%A3%BC%EB%B3%80%20%EC%95%BD%EA%B5%AD',
  },
];

export default function HospitalScreen() {
  const navigate = useNavigate();

  const handleOpen = (url: string) => {
    triggerHapticFeedback();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ backgroundColor: '#FAF7F2' }}>
      <header className="px-4 pt-6 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-500 mb-4"
          style={{ fontSize: '17px' }}
        >
          <ArrowLeft size={20} /> 홈으로
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Hospital size={28} className="text-emerald-600" />
          </div>
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>병원/약국</h1>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4"
        >
          <p className="text-emerald-800 font-semibold leading-relaxed" style={{ fontSize: '19px' }}>
            가까운 병원이나 약국을 찾을 때 사용해요.
            아래 버튼을 누르면 지도가 열려요.
          </p>
        </motion.div>

        <div className="space-y-4">
          {mapLinks.map((link, i) => (
            <motion.button
              key={link.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleOpen(link.url)}
              className={`w-full bg-gradient-to-r ${link.color} text-white rounded-3xl shadow-lg
                          flex items-center gap-4 text-left`}
              style={{ minHeight: '90px', padding: '20px 24px' }}
            >
              <span style={{ fontSize: '36px' }}>{link.icon}</span>
              <div className="flex-1">
                <p className="font-extrabold" style={{ fontSize: '22px' }}>{link.label}</p>
                <p className="opacity-90 flex items-center gap-1 mt-1" style={{ fontSize: '15px' }}>
                  <MapPin size={14} /> {link.subLabel}
                </p>
              </div>
              <ExternalLink size={22} className="opacity-80" />
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
        >
          <p className="text-amber-800 font-semibold" style={{ fontSize: '17px' }}>
            📍 버튼을 누르면 지도 앱이 열려요.
            현재 위치에서 가장 가까운 곳을 찾아볼 수 있어요.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5"
        >
          <p className="font-bold text-gray-800 mb-3" style={{ fontSize: '19px' }}>응급 상황에는</p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { triggerHapticFeedback(); window.location.href = 'tel:119'; }}
            className="w-full bg-red-600 text-white font-extrabold rounded-2xl
                       flex items-center justify-center gap-3"
            style={{ minHeight: '64px', fontSize: '22px' }}
          >
            📞 119 응급전화 바로 걸기
          </motion.button>
        </motion.div>
      </main>

      <HelpRequestBar aiContext="사용자가 가까운 병원이나 약국을 찾으려고 해요. 네이버 지도 버튼 누르는 방법이나 응급 상황 119 전화에 대해 막혔을 수 있어요." />
    </div>
  );
}
