import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, ShieldAlert, AlertTriangle } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';
import { triggerHapticFeedback } from '../lib/haptics';
import { MessageHomeScreenMockup, MessageListMockup, ScamWarningMockup } from '../components/GalaxyMockup';

const steps = [
  {
    num: 1,
    text: '문자 앱을 열어요.',
    detail: '화면에서 말풍선 모양의 문자 앱을 찾아 누르세요.',
    mockup: <MessageHomeScreenMockup />,
  },
  {
    num: 2,
    text: '받은 문자를 눌러요.',
    detail: '목록에서 읽고 싶은 문자를 눌러요.',
    mockup: <MessageListMockup />,
  },
  {
    num: 3,
    text: '이상한 링크는 누르지 말아요.',
    detail: '모르는 번호에서 온 파란색 링크는 절대 누르지 마세요.',
    mockup: <ScamWarningMockup />,
  },
];

export default function MessageScreen() {
  const navigate = useNavigate();

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
          <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center">
            <MessageSquare size={28} className="text-violet-600" />
          </div>
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>문자 보기</h1>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-violet-50 border border-violet-200 rounded-2xl p-4"
        >
          <p className="text-violet-800 font-semibold leading-relaxed" style={{ fontSize: '19px' }}>
            받은 문자를 확인하는 방법이에요.
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
                    className="flex-shrink-0 w-7 h-7 bg-violet-600 text-white font-bold rounded-full flex items-center justify-center"
                    style={{ fontSize: '15px' }}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3"
        >
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
      </main>

      <HelpRequestBar aiContext="사용자가 스마트폰으로 문자 메시지 확인하는 방법을 보고 있어요. 문자 앱 열기, 받은 문자 누르기, 이상한 링크 주의하기 단계에서 막혔을 수 있어요." />
    </div>
  );
}
