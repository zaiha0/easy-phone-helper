import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, X } from 'lucide-react';
import { triggerHapticFeedback } from '../lib/haptics';

interface Props {
  open: boolean;
  guardianName: string;
  guardianPhone: string;
  guideTitle?: string;
  onClose: () => void;
}

export default function ConfirmModal({ open, guardianName, guardianPhone, guideTitle, onClose }: Props) {
  const handleSms = () => {
    triggerHapticFeedback();
    const text = guideTitle
      ? `도움이 필요해요.\n지금 '${guideTitle}'에서 막혔어요.\n전화해 주세요.`
      : '도움이 필요합니다. 더이음 앱에서 도움 요청을 보냈습니다. 가능하면 전화해 주세요.';
    const body = encodeURIComponent(text);
    window.location.href = `sms:${guardianPhone}?body=${body}`;
    onClose();
  };

  const handleCall = () => {
    triggerHapticFeedback();
    window.location.href = `tel:${guardianPhone}`;
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span style={{ fontSize: 32 }}>🆘</span>
              </div>
              <h2 className="font-extrabold text-gray-900 mb-2" style={{ fontSize: '24px' }}>
                보호자에게 도움을 요청할까요?
              </h2>
              <p className="text-gray-500" style={{ fontSize: '18px' }}>
                {guardianName} 님에게 연락해요
              </p>
            </div>

            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSms}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl
                           flex items-center justify-center gap-3 shadow-lg transition-colors"
                style={{ minHeight: '64px', fontSize: '20px' }}
              >
                <MessageCircle size={26} />
                문자로 도움 요청
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleCall}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl
                           flex items-center justify-center gap-3 shadow-lg transition-colors"
                style={{ minHeight: '64px', fontSize: '20px' }}
              >
                <Phone size={26} />
                전화 걸기
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-2xl
                           flex items-center justify-center transition-colors"
                style={{ minHeight: '56px', fontSize: '18px' }}
              >
                아니요, 취소할게요
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
