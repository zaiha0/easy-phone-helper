import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';
import { guides } from '../data/guides';
import HelpRequestBar from '../components/HelpRequestBar';
import { triggerHapticFeedback } from '../lib/haptics';

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 24 } },
};

export default function GuideList() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8f9fa 60%)' }}>
      <header className="px-4 pt-6 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-500 mb-4 hover:text-gray-700 transition-colors"
          style={{ fontSize: '17px' }}
        >
          <ArrowLeft size={20} />
          홈으로
        </button>
        <div className="flex items-center gap-3">
          <BookOpen size={30} className="text-blue-600" />
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>
            무엇을 배우고 싶나요?
          </h1>
        </div>
      </header>

      <main className="flex-1 px-4">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3 max-w-lg mx-auto"
        >
          {guides.map((guide) => (
            <motion.button
              key={guide.id}
              variants={item}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                triggerHapticFeedback();
                navigate(`/guide/${guide.id}`);
              }}
              className="w-full bg-white rounded-3xl shadow-md p-5
                         flex items-center gap-4 text-left border border-transparent
                         hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="flex-1">
                <p className="font-bold text-gray-900" style={{ fontSize: '21px' }}>
                  {guide.title}
                </p>
                <p className="text-gray-500 mt-1" style={{ fontSize: '16px' }}>
                  {guide.description}
                </p>
              </div>
              <ChevronRight size={24} className="text-blue-400 flex-shrink-0" />
            </motion.button>
          ))}
        </motion.div>
      </main>

      <HelpRequestBar />
    </div>
  );
}
