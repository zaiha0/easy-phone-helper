import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, PhoneCall } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';

const steps = [
  { num: 1, text: '초록색 전화 앱을 찾아요.', detail: '화면에서 전화기 모양 아이콘을 찾아 누르세요.' },
  { num: 2, text: '숫자 버튼을 눌러요.', detail: '통화하고 싶은 번호를 하나씩 눌러요.' },
  { num: 3, text: '초록 전화 버튼을 눌러요.', detail: '번호를 다 입력한 뒤 통화 버튼을 누르면 전화가 걸려요.' },
];

export default function PhoneScreen() {
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
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Phone size={28} className="text-blue-600" />
          </div>
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>전화하기</h1>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
        >
          <p className="text-blue-800 font-semibold leading-relaxed" style={{ fontSize: '19px' }}>
            전화를 걸고 싶을 때 사용해요.{'\n'}
            휴대폰의 전화 앱을 열어 번호를 누르거나 연락처를 선택하세요.
          </p>
        </motion.div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex gap-4 items-start"
            >
              <span
                className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white font-bold rounded-full
                           flex items-center justify-center"
                style={{ fontSize: '18px' }}
              >
                {step.num}
              </span>
              <div>
                <p className="font-bold text-gray-900" style={{ fontSize: '21px' }}>{step.text}</p>
                <p className="text-gray-500 mt-1 leading-relaxed" style={{ fontSize: '17px' }}>{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-2"
        >
          <PressableButton
            label="전화 앱 열기"
            icon={<PhoneCall size={26} />}
            onClick={() => { window.location.href = 'tel:'; }}
            variant="primary"
            fullWidth
          />
        </motion.div>
      </main>

      <HelpRequestBar aiContext="사용자가 스마트폰으로 전화 거는 방법을 보고 있어요. 전화 앱 찾기, 번호 누르기, 통화 버튼 누르기 단계에서 막혔을 수 있어요." />
    </div>
  );
}
