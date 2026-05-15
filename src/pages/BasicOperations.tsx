import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import {
  GestureTapMockup,
  GestureScrollMockup,
  GestureLongPressMockup,
  PhotoZoomMockup,
  GestureBackMockup,
} from '../components/GalaxyMockup';

const steps = [
  {
    num: 1,
    title: '누르기 (탭)',
    desc: '손가락 끝으로 화면을 한 번 가볍게 눌러요.',
    tip: '버튼이나 앱 아이콘을 열 때 사용해요.',
    color: '#2563EB',
    mockup: <GestureTapMockup />,
  },
  {
    num: 2,
    title: '스크롤 (위아래 넘기기)',
    desc: '손가락을 화면에 대고 위아래로 쓸어올려요.',
    tip: '내용이 많을 때 아래 내용을 볼 수 있어요.',
    color: '#7C3AED',
    mockup: <GestureScrollMockup />,
  },
  {
    num: 3,
    title: '길게 누르기',
    desc: '손가락을 화면에 1~2초 동안 올려놓아요.',
    tip: '메뉴가 나타나거나 삭제 옵션이 보여요.',
    color: '#D97706',
    mockup: <GestureLongPressMockup />,
  },
  {
    num: 4,
    title: '두 손가락으로 크게 보기',
    desc: '두 손가락을 화면에 올리고 바깥쪽으로 벌려요.',
    tip: '사진이나 지도를 크게 볼 때 사용해요. 다시 모으면 작아져요.',
    color: '#16A34A',
    mockup: <PhotoZoomMockup />,
  },
  {
    num: 5,
    title: '뒤로 가기',
    desc: "화면 위쪽의 '←' 버튼을 눌러요.",
    tip: '이전 화면으로 돌아가고 싶을 때 사용해요.',
    color: '#DC2626',
    mockup: <GestureBackMockup />,
  },
];

export default function BasicOperations() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen pb-36" style={{ backgroundColor: '#FAF7F2' }}>
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
            <Smartphone size={28} className="text-blue-600" />
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>기본 화면 조작법</h1>
            <p className="text-gray-500" style={{ fontSize: '15px' }}>스마트폰 사용의 기초예요</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
        >
          <p className="text-blue-800 font-semibold leading-relaxed" style={{ fontSize: '17px' }}>
            스마트폰은 손가락으로 화면을 직접 조작해요.{'\n'}
            아래 5가지만 익히면 대부분의 앱을 쓸 수 있어요!
          </p>
        </motion.div>

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
                  style={{ fontSize: '15px', backgroundColor: step.color }}
                >
                  {step.num}
                </span>
                <p className="font-bold text-gray-900 leading-tight" style={{ fontSize: '18px' }}>{step.title}</p>
              </div>
              <p className="text-gray-700 leading-snug" style={{ fontSize: '15px', paddingLeft: '36px' }}>{step.desc}</p>
              <p className="text-gray-400 mt-1 leading-snug" style={{ fontSize: '13px', paddingLeft: '36px' }}>💡 {step.tip}</p>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-4"
        >
          <p className="text-green-800 font-semibold leading-relaxed" style={{ fontSize: '17px' }}>
            처음에는 천천히 연습해도 돼요.{'\n'}
            틀려도 괜찮아요, 스마트폰은 망가지지 않아요! 😊
          </p>
        </motion.div>
      </main>

      <HelpRequestBar aiContext="사용자가 스마트폰 기본 조작법(누르기, 스크롤, 길게 누르기, 핀치줌, 뒤로가기)을 배우고 있어요." />
    </div>
  );
}
