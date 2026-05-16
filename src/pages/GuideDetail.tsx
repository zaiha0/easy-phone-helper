import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PartyPopper, RotateCcw, Home } from 'lucide-react';
import { getGuideById } from '../data/guides';
import GuideStepCard from '../components/GuideStepCard';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const guide = id ? getGuideById(id) : undefined;
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <p className="text-xl text-gray-600 mb-6">가이드를 찾을 수 없어요.</p>
        <PressableButton label="홈으로" onClick={() => navigate('/')} />
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col pb-52" style={{ background: 'linear-gradient(160deg, #ecfdf5 0%, #f8f9fa 60%)' }}>
        <header className="px-4 pt-6 pb-4">
          <h1 className="font-bold text-gray-700" style={{ fontSize: '20px' }}>{guide.title}</h1>
        </header>
        <div className="flex-1 p-4 flex flex-col items-center justify-center gap-6 max-w-lg mx-auto w-full">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center">
              <PartyPopper size={56} className="text-emerald-600" />
            </div>
            <p className="font-extrabold text-gray-900 text-center" style={{ fontSize: '28px' }}>잘하셨어요!</p>
            <p className="text-gray-500 text-center leading-relaxed" style={{ fontSize: '19px' }}>
              {guide.title}를 끝까지 따라하셨어요.
            </p>
          </motion.div>
          <div className="w-full space-y-3">
            <PressableButton
              label="처음부터 다시 보기"
              icon={<RotateCcw size={24} />}
              onClick={() => { setCurrentStep(0); setDone(false); }}
              variant="secondary"
              fullWidth
            />
            <PressableButton
              label="홈으로"
              icon={<Home size={24} />}
              onClick={() => navigate('/')}
              fullWidth
            />
          </div>
        </div>
        <HelpRequestBar
          guideTitle={guide.title}
          aiContext={`사용자가 '${guide.title}' 가이드를 완료했어요. 실제로 따라하다 막힌 부분이 있을 수 있어요.`}
        />
      </div>
    );
  }

  const step = guide.steps[currentStep];

  const handleNext = () => {
    if (currentStep < guide.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setDone(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  return (
    <div className="min-h-screen flex flex-col pb-52" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8f9fa 60%)' }}>
      <header className="px-4 pt-6 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 mb-4 hover:text-gray-700 transition-colors"
          style={{ fontSize: '17px' }}
        >
          <ArrowLeft size={20} />
          뒤로 가기
        </button>
        <h1 className="font-extrabold text-gray-900" style={{ fontSize: '24px' }}>{guide.title}</h1>
      </header>

      <main className="flex-1 px-4 max-w-lg mx-auto w-full space-y-5">
        <GuideStepCard
          step={step}
          stepNumber={currentStep + 1}
          totalSteps={guide.steps.length}
          onPrev={handlePrev}
          onNext={handleNext}
          isFirst={currentStep === 0}
          isLast={currentStep === guide.steps.length - 1}
        />

        <PressableButton
          label="처음부터 다시 보기"
          icon={<RotateCcw size={22} />}
          onClick={() => setCurrentStep(0)}
          variant="secondary"
          fullWidth
        />
      </main>

      <HelpRequestBar
          guideTitle={guide.title}
          aiContext={`사용자가 '${guide.title}' 가이드의 ${currentStep + 1}번째 단계를 보고 있어요. 단계 내용: ${step.instruction}${step.detail ? ` — ${step.detail}` : ''}`}
        />
    </div>
  );
}
