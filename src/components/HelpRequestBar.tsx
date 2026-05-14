import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, UserPlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGuardian } from '../lib/storage';
import { triggerHapticFeedback } from '../lib/haptics';
import ConfirmModal from './ConfirmModal';
import AiHelpButton from './AiHelpButton';

interface Props {
  guideTitle?: string;
  aiContext?: string;
}

export default function HelpRequestBar({ guideTitle, aiContext }: Props) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [noGuardianOpen, setNoGuardianOpen] = useState(false);

  const handleHelp = () => {
    triggerHapticFeedback();
    const guardian = getGuardian();
    if (!guardian) {
      setNoGuardianOpen(true);
      return;
    }
    setModalOpen(true);
  };

  const guardian = getGuardian();

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200 p-3 z-40 space-y-2">
        {aiContext && <AiHelpButton context={aiContext} />}
        <motion.button
          onClick={handleHelp}
          whileTap={{ scale: 0.96 }}
          aria-label="보호자에게 도움 요청"
          className="w-full bg-red-600 text-white font-extrabold rounded-2xl shadow-lg
                     flex items-center justify-center gap-3 max-w-md mx-auto"
          style={{ minHeight: '64px', fontSize: '24px' }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <PhoneCall size={28} />
          </motion.span>
          도와줘
        </motion.button>
      </div>

      {/* 보호자 미등록 안내 모달 */}
      <AnimatePresence>
        {noGuardianOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              <button
                onClick={() => setNoGuardianOpen(false)}
                className="absolute top-4 right-4 text-gray-400"
                aria-label="닫기"
              >
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
                  onClick={() => {
                    setNoGuardianOpen(false);
                    navigate('/guardian');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl
                             flex items-center justify-center gap-3 shadow-lg transition-colors"
                  style={{ minHeight: '64px', fontSize: '20px' }}
                >
                  <UserPlus size={24} />
                  보호자 설정하러 가기
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setNoGuardianOpen(false)}
                  className="w-full bg-gray-100 text-gray-600 font-semibold rounded-2xl
                             flex items-center justify-center transition-colors"
                  style={{ minHeight: '52px', fontSize: '18px' }}
                >
                  닫기
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 보호자 등록 시 SOS 확인 모달 */}
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
