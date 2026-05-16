import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Monitor, RotateCcw } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import { triggerHapticFeedback } from '../lib/haptics';
import { cafeScenario } from '../data/kioskScenarios';

type Mode = 'select' | 'simple';

export default function KioskPractice() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const scenario = cafeScenario;
  const [mode, setMode] = useState<Mode>('select');
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [done, setDone] = useState(false);

  const currentStep = scenario.steps[stepIndex];

  const handleOption = (optionId: string) => {
    triggerHapticFeedback();
    if (optionId === currentStep.correctOptionId) {
      setFeedback({ correct: true, message: currentStep.successMessage });
      setTimeout(() => {
        setFeedback(null);
        if (stepIndex < scenario.steps.length - 1) {
          setStepIndex((i) => i + 1);
        } else {
          setDone(true);
        }
      }, 1400);
    } else {
      setFeedback({ correct: false, message: currentStep.retryMessage });
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setFeedback(null);
    setDone(false);
    setMode('select');
  };

  // ─── 선택 화면 ──────────────────────────────────────────────────────────
  if (mode === 'select') {
    return (
      <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#FAF7F2' }}>
        <header className="px-4 pt-4 pb-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-gray-500 mb-4"
            style={{ fontSize: '17px' }}
          >
            <ArrowLeft size={20} /> 홈으로
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Monitor size={28} className="text-orange-600" />
            </div>
            <h1 className="font-extrabold text-gray-900" style={{ fontSize: '24px' }}>
              키오스크 연습
            </h1>
          </div>
        </header>

        <main className="flex-1 px-4 space-y-5 max-w-lg mx-auto w-full">
          <p className="text-gray-600 leading-relaxed" style={{ fontSize: '18px' }}>
            키오스크는 식당이나 카페에서 직접 주문하는 기계예요.{'\n'}
            원하는 연습 방식을 골라보세요.
          </p>

          {/* 간단 연습 */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setMode('simple')}
            className="w-full bg-white border-2 border-orange-300 rounded-3xl p-5 text-left shadow-sm"
            style={{ minHeight: '110px' }}
          >
            <div className="flex items-start gap-4">
              <span style={{ fontSize: '40px' }}>☕</span>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a' }}>
                  간단 연습 (카페 음료 주문)
                </p>
                <p style={{ fontSize: '16px', color: '#6B7280', marginTop: '4px' }}>
                  초보자용 — 큰 버튼으로 간단하게 연습해요
                </p>
              </div>
            </div>
          </motion.button>

          {/* 심화 연습 */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/kiosk-advanced')}
            className="w-full bg-white border-2 border-yellow-400 rounded-3xl p-5 text-left shadow-sm"
            style={{ minHeight: '110px' }}
          >
            <div className="flex items-start gap-4">
              <span style={{ fontSize: '40px' }}>🍔</span>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a' }}>
                  심화 연습 (실제 키오스크처럼)
                </p>
                <p style={{ fontSize: '16px', color: '#6B7280', marginTop: '4px' }}>
                  실제 패스트푸드 키오스크와 비슷한 화면으로 연습해요
                </p>
              </div>
            </div>
          </motion.button>
        </main>
      </div>
    );
  }

  // ─── 간단 연습 완료 ─────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex flex-col pb-24" style={{ backgroundColor: '#FAF7F2' }}>
        {/* 연습 배너 */}
        <div className="bg-amber-400 text-amber-900 font-bold text-center py-2" style={{ fontSize: '15px' }}>
          연습 화면이에요. 실제 결제되지 않아요.
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <p className="font-extrabold text-gray-900 mb-3" style={{ fontSize: '28px' }}>
              잘하셨어요!
            </p>
            <p className="text-gray-600 leading-relaxed" style={{ fontSize: '20px' }}>
              이제 실제 키오스크에서도 천천히 따라 하시면 돼요.
            </p>
          </motion.div>
          <div className="w-full max-w-sm space-y-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              className="w-full bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3"
              style={{ minHeight: '72px', fontSize: '22px' }}
            >
              <RotateCcw size={26} /> 다시 연습하기
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 font-bold rounded-2xl flex items-center justify-center"
              style={{ minHeight: '64px', fontSize: '20px' }}
            >
              홈으로 가기
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ─── 간단 연습 (카페 시나리오) ─────────────────────────────────────────
  const correctLabel = currentStep.options.find(o => o.id === currentStep.correctOptionId)?.label ?? '';
  const aiContext = `사용자가 카페 키오스크 연습 중이에요. 현재 단계: ${stepIndex + 1}/${scenario.steps.length} — "${currentStep.screenTitle}". 지금 화면에는 "${currentStep.options.map(o => o.label).join('", "')}" 버튼이 있어요. 정답은 "${correctLabel}" 버튼이에요. 도움말: ${currentStep.helpText}`;

  return (
    <div className="min-h-screen flex flex-col pb-52" style={{ backgroundColor: '#FAF7F2' }}>
      {/* 연습 배너 */}
      <div className="bg-amber-400 text-amber-900 font-bold text-center py-2" style={{ fontSize: '15px' }}>
        연습 화면이에요. 실제 결제되지 않아요.
      </div>

      <header className="px-4 pt-4 pb-3">
        <button
          onClick={() => setMode('select')}
          className="flex items-center gap-1 text-gray-500 mb-3"
          style={{ fontSize: '17px' }}
        >
          <ArrowLeft size={20} /> 연습 선택으로
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
            <Monitor size={28} className="text-orange-600" />
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900" style={{ fontSize: '22px' }}>{scenario.title}</h1>
            <p className="text-gray-500" style={{ fontSize: '14px' }}>
              {stepIndex + 1} / {scenario.steps.length} 단계
            </p>
          </div>
        </div>
        {/* 진행 바 */}
        <div className="mt-3 bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-orange-400 rounded-full h-2"
            animate={{ width: `${((stepIndex + 1) / scenario.steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        {/* 가상 키오스크 화면 */}
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 overflow-hidden"
        >
          {/* 키오스크 상단 바 */}
          <div className="bg-gray-800 text-white text-center py-3" style={{ fontSize: '16px' }}>
            더이음 카페 ☕
          </div>

          {/* 키오스크 화면 내용 */}
          <div className="p-5">
            <p className="font-extrabold text-gray-900 text-center mb-5" style={{ fontSize: '22px' }}>
              {currentStep.screenTitle}
            </p>
            <div className="space-y-3">
              {currentStep.options.map((option) => (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOption(option.id)}
                  disabled={!!feedback}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-800 flex items-center justify-center gap-3 disabled:opacity-60"
                  style={{ minHeight: '72px', fontSize: '22px' }}
                >
                  {option.emoji && <span style={{ fontSize: '28px' }}>{option.emoji}</span>}
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 도움말 카드 */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-blue-800 font-semibold leading-relaxed" style={{ fontSize: '18px' }}>
            💡 {currentStep.instruction}
          </p>
        </div>

        {/* 피드백 */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-2xl p-4 text-center font-bold ${
                feedback.correct
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-orange-100 text-orange-800 border border-orange-300'
              }`}
              style={{ fontSize: '20px' }}
            >
              {feedback.correct ? '✅ ' : '😊 '}
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <HelpRequestBar aiContext={aiContext} />
    </div>
  );
}
