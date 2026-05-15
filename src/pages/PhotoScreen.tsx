import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Image } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';
import { triggerHapticFeedback } from '../lib/haptics';
import { GalleryHomeScreenMockup, GalleryHighlightMockup, PhotoZoomMockup, PhotoBackMockup } from '../components/GalaxyMockup';

const steps = [
  {
    num: 1,
    text: '사진 앱을 열어요.',
    detail: '꽃 모양이나 사진 모양 아이콘을 찾아 눌러요.',
    mockup: <GalleryHomeScreenMockup />,
  },
  {
    num: 2,
    text: '보고 싶은 사진을 눌러요.',
    detail: '사진을 한 번 누르면 크게 볼 수 있어요.',
    mockup: <GalleryHighlightMockup />,
  },
  {
    num: 3,
    text: '손가락 두 개로 크게 볼 수 있어요.',
    detail: '두 손가락을 사진 위에 놓고 벌리면 더 크게 보여요.',
    mockup: <PhotoZoomMockup />,
  },
  {
    num: 4,
    text: '← 뒤로 가기를 눌러요.',
    detail: '다 봤으면 뒤로 가기를 눌러 목록으로 돌아와요.',
    mockup: <PhotoBackMockup />,
  },
];

function openGallery() {
  triggerHapticFeedback();
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);

  if (isIOS) {
    window.location.href = 'photos-redirect://';
  } else if (isAndroid) {
    window.location.href = 'intent:#Intent;action=android.intent.action.VIEW;type=image/*;end';
  } else {
    // PC 미리보기 등 비모바일 환경 — 아무것도 안 함
  }
}

export default function PhotoScreen() {
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
          <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
            <Image size={28} className="text-pink-600" />
          </div>
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>사진 보기</h1>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-pink-50 border border-pink-200 rounded-2xl p-4"
        >
          <p className="text-pink-800 font-semibold leading-relaxed" style={{ fontSize: '19px' }}>
            사진을 보고 싶을 때는 갤러리 또는 사진 앱을 열면 돼요.
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
                    className="flex-shrink-0 w-7 h-7 bg-pink-500 text-white font-bold rounded-full flex items-center justify-center"
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
          transition={{ delay: 0.5 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
        >
          <p className="text-blue-800 font-semibold" style={{ fontSize: '17px' }}>
            💡 두 손가락으로 사진을 오므리면 다시 작게 돌아와요.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <PressableButton
            label="갤러리(사진 앱) 열기"
            icon={<Image size={26} />}
            onClick={openGallery}
            variant="primary"
            fullWidth
          />
          <p className="text-gray-400 text-center mt-2" style={{ fontSize: '14px' }}>
            버튼을 눌러도 앱이 안 열리면 홈 화면에서 직접 찾아 눌러 주세요.
          </p>
        </motion.div>
      </main>

      <HelpRequestBar aiContext="사용자가 스마트폰으로 사진 보는 방법을 보고 있어요. 사진 앱 열기, 사진 누르기, 두 손가락으로 크게 보기 단계에서 막혔을 수 있어요." />
    </div>
  );
}
