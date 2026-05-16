import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, Home, Mic, UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGuardian } from '../lib/storage';
import { triggerHapticFeedback } from '../lib/haptics';
import ConfirmModal from './ConfirmModal';
import VoiceAssistant from './VoiceAssistant';

interface Props {
  guideTitle?: string;
  aiContext?: string;
}

export default function HelpRequestBar({ guideTitle }: Props) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [noGuardianOpen, setNoGuardianOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const guardian = getGuardian();

  const handleHelp = () => {
    triggerHapticFeedback();
    if (!guardian) { setNoGuardianOpen(true); return; }
    setModalOpen(true);
  };

  const handleHome = () => {
    triggerHapticFeedback();
    navigate('/');
  };

  const handleVoice = () => {
    triggerHapticFeedback();
    setVoiceOpen(true);
  };

  return (
    <>
      {/* ── 3버튼 하단 바 ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="flex items-stretch max-w-md mx-auto" style={{ height: '76px' }}>

          {/* 왼쪽: 홈 */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleHome}
            className="flex flex-col items-center justify-center gap-1 flex-1"
            aria-label="홈으로"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
              <Home size={24} style={{ color: '#2563EB' }} />
            </div>
            <span className="font-bold" style={{ fontSize: '12px', color: '#2563EB' }}>홈</span>
          </motion.button>

          {/* 가운데: 도와줘 (강조) */}
          <div className="flex items-center justify-center px-3" style={{ flex: 2 }}>
            <motion.button
              onClick={handleHelp}
              whileTap={{ scale: 0.95 }}
              aria-label="보호자에게 도움 요청"
              className="w-full text-white font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2"
              style={{
                minHeight: '58px',
                fontSize: '22px',
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <PhoneCall size={24} />
              </motion.span>
              도와줘
            </motion.button>
          </div>

          {/* 오른쪽: AI 비서 */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleVoice}
            className="flex flex-col items-center justify-center gap-1 flex-1"
            aria-label="AI 비서 열기"
          >
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
              <Mic size={24} style={{ color: '#4F46E5' }} />
            </div>
            <span className="font-bold" style={{ fontSize: '12px', color: '#4F46E5' }}>AI 비서</span>
          </motion.button>

        </div>
      </div>

      {/* ── AI 음성 비서 모달 ── */}
      <AnimatePresence>
        {voiceOpen && <VoiceAssistant onClose={() => setVoiceOpen(false)} />}
      </AnimatePresence>

      {/* ── 보호자 미등록 안내 모달 ── */}
      <AnimatePresence>
        {noGuardianOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setNoGuardianOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed inset-x-4 bottom-8 z-50 bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto"
            >
              <button onClick={() => setNoGuardianOpen(false)} className="absolute top-4 right-4 text-gray-400" aria-label="닫기">
                <X size={24} />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus size={32} className="text-amber-600" />
                </div>
                <h2 className="font-extrabold text-gray-900 mb-2" style={{ fontSize: '22px' }}>
                  보호자 연락처가 없어요
                </h2>
                <p className="text-gray-500 leading-relaxed" style={{ fontSize: '17px' }}>
                  도와줘 버튼을 사용하려면 먼저 보호자 연락처를 저장해야 해요.
                </p>
              </div>
              <div className="space-y-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setNoGuardianOpen(false); navigate('/guardian'); }}
                  className="w-full bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg"
                  style={{ minHeight: '64px', fontSize: '20px' }}
                >
                  <UserPlus size={24} /> 보호자 설정하러 가기
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setNoGuardianOpen(false)}
                  className="w-full bg-gray-100 text-gray-600 font-semibold rounded-2xl flex items-center justify-center"
                  style={{ minHeight: '52px', fontSize: '18px' }}
                >
                  닫기
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SOS 확인 모달 ── */}
      {guardian && (
        <ConfirmModal
          open={modalOpen}
          guardianName={guardian.name}
          guardianPhone={guardian.phone}
          guideTitle={guideTitle}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
