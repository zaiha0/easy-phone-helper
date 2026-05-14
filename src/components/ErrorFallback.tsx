import { motion } from 'framer-motion';
import { Home, RefreshCw, Frown } from 'lucide-react';

interface Props {
  onReset?: () => void;
}

export default function ErrorFallback({ onReset }: Props) {
  const goHome = () => {
    if (onReset) onReset();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="max-w-sm w-full space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <Frown size={48} className="text-blue-400" />
          </div>
        </div>

        <div>
          <h1 className="font-extrabold text-gray-900 mb-3" style={{ fontSize: '26px' }}>
            일시적인 오류가 발생했어요
          </h1>
          <p className="text-gray-500 leading-relaxed" style={{ fontSize: '19px' }}>
            걱정하지 마세요.<br />
            스마트폰이 고장난 것은 아니에요.
          </p>
        </div>

        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={goHome}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg
                       flex items-center justify-center gap-3 transition-colors"
            style={{ minHeight: '72px', fontSize: '22px' }}
          >
            <Home size={26} />
            처음으로 돌아가기
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => window.location.reload()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl
                       flex items-center justify-center gap-3 transition-colors"
            style={{ minHeight: '64px', fontSize: '20px' }}
          >
            <RefreshCw size={22} />
            다시 시도하기
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
