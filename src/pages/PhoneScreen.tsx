import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, PhoneCall, ChevronLeft } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';
import {
  PhoneHomeScreenMockup, DialerMockup, CallButtonMockup,
  IPhonePhoneHomeMockup, IPhoneDialerMockup, IPhoneCallButtonMockup,
} from '../components/GalaxyMockup';

type Platform = 'android' | 'ios';

const androidSteps = [
  { num: 1, text: '초록색 전화 앱을 찾아요.', detail: '화면에서 전화기 모양 아이콘을 찾아 누르세요.', mockup: <PhoneHomeScreenMockup /> },
  { num: 2, text: '숫자 버튼을 눌러요.', detail: '통화하고 싶은 번호를 하나씩 눌러요.', mockup: <DialerMockup /> },
  { num: 3, text: '초록 전화 버튼을 눌러요.', detail: '번호를 다 입력한 뒤 통화 버튼을 누르면 전화가 걸려요.', mockup: <CallButtonMockup /> },
];

const iosSteps = [
  { num: 1, text: '초록색 전화 앱을 찾아요.', detail: 'iPhone 홈 화면 하단 도크에 있는 초록색 전화기 아이콘을 누르세요.', mockup: <IPhonePhoneHomeMockup /> },
  { num: 2, text: '키패드 탭을 눌러요.', detail: '화면 하단의 "키패드" 버튼을 누르면 숫자판이 나와요.', mockup: <IPhoneDialerMockup /> },
  { num: 3, text: '초록 통화 버튼을 눌러요.', detail: '번호를 다 누른 뒤 초록색 전화기 버튼을 누르면 전화가 걸려요.', mockup: <IPhoneCallButtonMockup /> },
];

export default function PhoneScreen() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform | null>(null);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const steps = platform === 'android' ? androidSteps : iosSteps;
  const accentColor = '#2563EB';

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
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Phone size={28} className="text-blue-600" />
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>전화하기</h1>
            {platform && (
              <button onClick={() => setPlatform(null)} className="flex items-center gap-0.5 text-blue-500" style={{ fontSize: '14px' }}>
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
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-blue-800 font-semibold" style={{ fontSize: '19px' }}>
                  내 스마트폰 종류를 골라주세요
                </p>
                <p className="text-blue-600 mt-1" style={{ fontSize: '15px' }}>
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
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
              >
                <p className="text-blue-800 font-semibold leading-relaxed" style={{ fontSize: '19px' }}>
                  {platform === 'android' ? '갤럭시' : 'iPhone'}에서 전화 거는 방법이에요.
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
                        <span
                          className="flex-shrink-0 w-7 h-7 text-white font-bold rounded-full flex items-center justify-center"
                          style={{ fontSize: '15px', backgroundColor: accentColor }}
                        >
                          {step.num}
                        </span>
                        <p className="font-bold text-gray-900 leading-tight" style={{ fontSize: '18px' }}>{step.text}</p>
                      </div>
                      <p className="text-gray-500 leading-relaxed" style={{ fontSize: '15px', paddingLeft: '36px' }}>{step.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-2">
                <PressableButton
                  label="전화 앱 열기"
                  icon={<PhoneCall size={26} />}
                  onClick={() => { window.location.href = 'tel:'; }}
                  variant="primary"
                  fullWidth
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <HelpRequestBar aiContext="사용자가 스마트폰으로 전화 거는 방법을 보고 있어요. 전화 앱 찾기, 번호 누르기, 통화 버튼 누르기 단계에서 막혔을 수 있어요." />
    </div>
  );
}
