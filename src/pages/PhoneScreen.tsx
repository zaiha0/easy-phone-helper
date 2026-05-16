import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, PhoneCall } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';
import { triggerHapticFeedback } from '../lib/haptics';
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
  const [platform, setPlatform] = useState<Platform>('android');
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const steps = platform === 'android' ? androidSteps : iosSteps;
  const accentColor = '#2563EB';

  return (
    <div className="flex flex-col min-h-screen pb-52" style={{ backgroundColor: '#FAF7F2' }}>
      <header className="px-4 pt-6 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-500 mb-4"
          style={{ fontSize: '17px' }}
        >
          <ArrowLeft size={20} /> 홈으로
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Phone size={28} className="text-blue-600" />
          </div>
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>전화하기</h1>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        {/* 플랫폼 토글 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3">
          <span className="text-gray-500 font-medium flex-shrink-0" style={{ fontSize: '13px' }}>기기 종류</span>
          <div className="flex gap-2 flex-1">
            {(['android', 'ios'] as Platform[]).map((p) => (
              <button
                key={p}
                onClick={() => { triggerHapticFeedback(); setPlatform(p); }}
                className="flex-1 rounded-xl font-bold transition-all"
                style={{
                  height: '44px',
                  fontSize: '15px',
                  backgroundColor: platform === p ? accentColor : '#F3F4F6',
                  color: platform === p ? 'white' : '#6B7280',
                }}
              >
                {p === 'android' ? '🤖 안드로이드' : '🍎 아이폰'}
              </button>
            ))}
          </div>
        </div>

        {/* 단계 카드 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="space-y-3"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
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

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="pt-2">
              <PressableButton
                label="전화 앱 열기"
                icon={<PhoneCall size={26} />}
                onClick={() => { window.location.href = 'tel:'; }}
                variant="primary"
                fullWidth
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      <HelpRequestBar aiContext="사용자가 스마트폰으로 전화 거는 방법을 보고 있어요. 전화 앱 찾기, 번호 누르기, 통화 버튼 누르기 단계에서 막혔을 수 있어요." />
    </div>
  );
}
