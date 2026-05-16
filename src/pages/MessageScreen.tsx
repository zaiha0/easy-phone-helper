import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, ShieldAlert, AlertTriangle, ChevronLeft } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';
import { triggerHapticFeedback } from '../lib/haptics';
import {
  MessageHomeScreenMockup, MessageListMockup, ScamWarningMockup,
  IPhoneMessageHomeMockup, IPhoneMessageListMockup, IPhoneScamWarningMockup,
} from '../components/GalaxyMockup';

type Platform = 'android' | 'ios';

const androidSteps = [
  { num: 1, text: '문자 앱을 열어요.', detail: '화면에서 말풍선 모양의 문자 앱을 찾아 누르세요.', mockup: <MessageHomeScreenMockup /> },
  { num: 2, text: '받은 문자를 눌러요.', detail: '목록에서 읽고 싶은 문자를 눌러요.', mockup: <MessageListMockup /> },
  { num: 3, text: '이상한 링크는 누르지 말아요.', detail: '모르는 번호에서 온 파란색 링크는 절대 누르지 마세요.', mockup: <ScamWarningMockup /> },
];

const iosSteps = [
  { num: 1, text: '초록 메시지 앱을 열어요.', detail: 'iPhone 홈 화면에서 초록색 말풍선 모양의 "메시지" 앱을 찾아 누르세요.', mockup: <IPhoneMessageHomeMockup /> },
  { num: 2, text: '받은 문자를 눌러요.', detail: '목록에서 읽고 싶은 문자를 한 번 눌러요.', mockup: <IPhoneMessageListMockup /> },
  { num: 3, text: '이상한 링크는 누르지 말아요.', detail: '모르는 번호에서 온 파란 링크나 첨부파일은 절대 누르지 마세요.', mockup: <IPhoneScamWarningMockup /> },
];

export default function MessageScreen() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform | null>(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const steps = platform === 'android' ? androidSteps : iosSteps;
  const accent = '#7C3AED';

  return (
    <div className="flex flex-col min-h-screen pb-52" style={{ backgroundColor: '#FAF7F2' }}>
      <header className="px-4 pt-6 pb-4">
        <button
          onClick={() => platform ? setPlatform(null) : navigate('/')}
          className="flex items-center gap-1 text-gray-500 mb-4"
          style={{ fontSize: '17px' }}
        >
          <ArrowLeft size={20} /> {platform ? '기기 선택으로' : '홈으로'}
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
            <MessageSquare size={28} className="text-violet-600" />
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>문자 보기</h1>
            {platform && (
              <button onClick={() => setPlatform(null)} className="flex items-center gap-0.5 text-violet-500" style={{ fontSize: '14px' }}>
                <ChevronLeft size={14} />
                {platform === 'android' ? '안드로이드' : 'iPhone'} 선택됨
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {!platform ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
                <p className="text-violet-800 font-semibold" style={{ fontSize: '19px' }}>
                  내 스마트폰 종류를 골라주세요
                </p>
                <p className="text-violet-600 mt-1" style={{ fontSize: '15px' }}>
                  기기에 맞는 설명을 보여드릴게요.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPlatform('android')}
                  className="bg-white rounded-3xl shadow-md border-2 border-transparent hover:border-green-400 flex flex-col items-center justify-center gap-3 transition-all"
                  style={{ minHeight: '140px' }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center" style={{ fontSize: '36px' }}>🤖</div>
                  <div className="text-center">
                    <p className="font-extrabold text-gray-900" style={{ fontSize: '18px' }}>안드로이드</p>
                    <p className="text-gray-400" style={{ fontSize: '13px' }}>삼성 갤럭시 등</p>
                  </div>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPlatform('ios')}
                  className="bg-white rounded-3xl shadow-md border-2 border-transparent hover:border-gray-400 flex flex-col items-center justify-center gap-3 transition-all"
                  style={{ minHeight: '140px' }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center" style={{ fontSize: '36px' }}>🍎</div>
                  <div className="text-center">
                    <p className="font-extrabold text-gray-900" style={{ fontSize: '18px' }}>아이폰</p>
                    <p className="text-gray-400" style={{ fontSize: '13px' }}>Apple iPhone</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-violet-50 border border-violet-200 rounded-2xl p-4">
                <p className="text-violet-800 font-semibold leading-relaxed" style={{ fontSize: '19px' }}>
                  {platform === 'android' ? '갤럭시' : 'iPhone'}에서 문자 확인하는 방법이에요.
                </p>
              </motion.div>

              <div className="space-y-3">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 flex gap-4 items-center"
                  >
                    {step.mockup}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="flex-shrink-0 w-7 h-7 text-white font-bold rounded-full flex items-center justify-center" style={{ fontSize: '15px', backgroundColor: accent }}>
                          {step.num}
                        </span>
                        <p className="font-bold text-gray-900 leading-tight" style={{ fontSize: '18px' }}>{step.text}</p>
                      </div>
                      <p className="text-gray-500 leading-relaxed" style={{ fontSize: '15px', paddingLeft: '36px' }}>{step.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
                <AlertTriangle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 font-semibold leading-relaxed" style={{ fontSize: '17px' }}>
                  모르는 번호에서 온 링크나 첨부파일은 절대 누르지 마세요.
                </p>
              </motion.div>

              <PressableButton
                label="문자 앱 열기"
                icon={<MessageSquare size={26} />}
                onClick={() => { triggerHapticFeedback(); window.location.href = 'sms:'; }}
                variant="primary"
                fullWidth
              />
              <PressableButton
                label="사기 문자 확인하러 가기"
                icon={<ShieldAlert size={26} />}
                onClick={() => navigate('/scam-check')}
                variant="danger"
                fullWidth
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <HelpRequestBar aiContext="사용자가 스마트폰으로 문자 메시지 확인하는 방법을 보고 있어요. 문자 앱 열기, 받은 문자 누르기, 이상한 링크 주의하기 단계에서 막혔을 수 있어요." />
    </div>
  );
}
