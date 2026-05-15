import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2 } from 'lucide-react';
import { fetchAiGuide } from '../lib/aiGuide';
import { triggerHapticFeedback } from '../lib/haptics';

interface Props {
  context: string;
}

export default function AiHelpButton({ context }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  // context가 바뀌면 이전 캐시 초기화
  useEffect(() => {
    setAnswer('');
  }, [context]);

  const handleOpen = async () => {
    triggerHapticFeedback();
    setOpen(true);
    if (answer) return;
    setLoading(true);
    const result = await fetchAiGuide(context);
    setAnswer(result);
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="w-full bg-violet-50 border border-violet-200 text-violet-700 font-bold rounded-2xl
                   flex items-center justify-center gap-2 max-w-md mx-auto"
        style={{ minHeight: '52px', fontSize: '18px' }}
        aria-label="AI 도움 받기"
      >
        <Sparkles size={20} />
        막혔어요, 도움받기
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed inset-x-4 bottom-6 z-50 bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto"
            >
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400"
                aria-label="닫기"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-violet-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles size={22} className="text-violet-600" />
                </div>
                <div>
                  <p className="font-extrabold text-gray-900" style={{ fontSize: '20px' }}>AI 도움말</p>
                  <p className="text-gray-400" style={{ fontSize: '14px' }}>지금 화면에 맞춰 안내해 드려요</p>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={36} className="text-violet-400" />
                  </motion.div>
                  <p className="text-gray-500 font-semibold" style={{ fontSize: '17px' }}>
                    잠시만요, 지금 화면을 보고 도와드릴게요.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-violet-50 rounded-2xl p-4"
                >
                  <p className="text-gray-800 leading-relaxed" style={{ fontSize: '19px' }}>
                    {answer}
                  </p>
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleClose}
                className="w-full bg-gray-100 text-gray-600 font-semibold rounded-2xl mt-4
                           flex items-center justify-center"
                style={{ minHeight: '52px', fontSize: '17px' }}
              >
                닫기
              </motion.button>

              <p className="text-center text-gray-400 mt-3" style={{ fontSize: '13px' }}>
                그래도 어렵다면 보호자에게 도움 요청을 눌러주세요.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
