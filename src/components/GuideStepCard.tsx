import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Progress } from './ui/progress';
import type { GuideStep } from '../types';
import { triggerHapticFeedback } from '../lib/haptics';

interface Props {
  step: GuideStep;
  stepNumber: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function GuideStepCard({
  step,
  stepNumber,
  totalSteps,
  onPrev,
  onNext,
  isFirst,
  isLast,
}: Props) {
  const [direction, setDirection] = useState(0);
  const [key, setKey] = useState(0);
  const progress = (stepNumber / totalSteps) * 100;

  useEffect(() => {
    setKey((k) => k + 1);
  }, [stepNumber]);

  const handlePrev = () => {
    setDirection(-1);
    triggerHapticFeedback();
    onPrev();
  };

  const handleNext = () => {
    setDirection(1);
    triggerHapticFeedback();
    onNext();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 font-semibold" style={{ fontSize: '17px' }}>
            {stepNumber}단계 / 전체 {totalSteps}단계
          </span>
          <span className="text-blue-600 font-bold" style={{ fontSize: '17px' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-3 rounded-full" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="bg-white rounded-3xl shadow-md p-6"
          style={{ minHeight: '200px' }}
        >
          <div className="flex items-start gap-3 mb-4">
            <span
              className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold
                         flex items-center justify-center"
              style={{ fontSize: '18px' }}
            >
              {stepNumber}
            </span>
          </div>
          <p className="font-bold text-gray-900 leading-relaxed" style={{ fontSize: '24px' }}>
            {step.instruction}
          </p>
          {step.detail && (
            <p className="text-gray-500 leading-relaxed mt-3" style={{ fontSize: '19px' }}>
              {step.detail}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePrev}
          disabled={isFirst}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200
                     text-gray-700 font-bold rounded-2xl disabled:opacity-30 transition-colors"
          style={{ minHeight: '72px', fontSize: '20px' }}
        >
          <ChevronLeft size={24} />
          이전
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className={`flex items-center justify-center gap-2 font-bold rounded-2xl
                      text-white transition-colors
                      ${isLast ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          style={{ minHeight: '72px', fontSize: '20px' }}
        >
          {isLast ? (
            <>
              <CheckCircle2 size={24} />
              완료
            </>
          ) : (
            <>
              다음
              <ChevronRight size={24} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
