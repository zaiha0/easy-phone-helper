import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6"
      style={{ backgroundColor: '#FAF7F2' }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex flex-col items-center gap-4"
      >
        <div
          className="w-28 h-28 bg-blue-100 rounded-full flex items-center justify-center"
          style={{ fontSize: '56px' }}
        >
          🏠
        </div>
        <h1 className="font-extrabold text-gray-900" style={{ fontSize: '28px' }}>
          페이지를 찾을 수 없어요
        </h1>
        <p className="text-gray-500 leading-relaxed" style={{ fontSize: '19px' }}>
          걱정하지 마세요.<br />스마트폰이 고장난 게 아니에요.
        </p>
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate('/')}
        className="bg-blue-600 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3 w-full"
        style={{ minHeight: '72px', fontSize: '22px', maxWidth: '320px' }}
      >
        <Home size={26} />
        처음으로 돌아가기
      </motion.button>
    </div>
  );
}
