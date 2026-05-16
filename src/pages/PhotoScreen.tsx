import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Image } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';
import { triggerHapticFeedback } from '../lib/haptics';
import {
  GalleryHomeScreenMockup, GalleryHighlightMockup, PhotoZoomMockup, PhotoBackMockup,
  IPhonePhotoHomeMockup, IPhonePhotoHighlightMockup, IPhonePhotoZoomMockup, IPhonePhotoBackMockup,
} from '../components/GalaxyMockup';

type Platform = 'android' | 'ios';

const androidSteps = [
  { num: 1, text: '사진 앱을 열어요.', detail: '꽃 모양이나 사진 모양 아이콘을 찾아 눌러요.', mockup: <GalleryHomeScreenMockup /> },
  { num: 2, text: '보고 싶은 사진을 눌러요.', detail: '사진을 한 번 누르면 크게 볼 수 있어요.', mockup: <GalleryHighlightMockup /> },
  { num: 3, text: '손가락 두 개로 크게 볼 수 있어요.', detail: '두 손가락을 사진 위에 놓고 벌리면 더 크게 보여요.', mockup: <PhotoZoomMockup /> },
  { num: 4, text: '← 뒤로 가기를 눌러요.', detail: '다 봤으면 뒤로 가기를 눌러 목록으로 돌아와요.', mockup: <PhotoBackMockup /> },
];

const iosSteps = [
  { num: 1, text: '사진 앱을 열어요.', detail: 'iPhone 홈 화면에서 색깔 꽃잎 모양의 "사진" 앱을 찾아 누르세요.', mockup: <IPhonePhotoHomeMockup /> },
  { num: 2, text: '보고 싶은 사진을 눌러요.', detail: '사진을 한 번 누르면 크게 볼 수 있어요.', mockup: <IPhonePhotoHighlightMockup /> },
  { num: 3, text: '손가락 두 개로 크게 볼 수 있어요.', detail: '두 손가락을 사진 위에 놓고 벌리면 더 크게 보여요. 오므리면 원래대로 돌아와요.', mockup: <IPhonePhotoZoomMockup /> },
  { num: 4, text: '왼쪽 위 "뒤로"를 눌러요.', detail: '다 봤으면 왼쪽 위 화살표를 눌러 목록으로 돌아와요.', mockup: <IPhonePhotoBackMockup /> },
];

function openGallery(platform: Platform) {
  triggerHapticFeedback();
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || platform === 'ios';
  const isAndroid = /Android/.test(ua) || platform === 'android';

  if (isIOS) {
    window.location.href = 'photos-redirect://';
  } else if (isAndroid) {
    window.location.href = 'intent:#Intent;action=android.intent.action.VIEW;type=image/*;end';
  }
}

export default function PhotoScreen() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform>('android');
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const steps = platform === 'android' ? androidSteps : iosSteps;
  const accent = '#E91E63';

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
                  backgroundColor: platform === p ? accent : '#F3F4F6',
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
                    <span className="flex-shrink-0 w-7 h-7 text-white font-bold rounded-full flex items-center justify-center" style={{ fontSize: '15px', backgroundColor: accent }}>
                      {step.num}
                    </span>
                    <p className="font-bold text-gray-900 leading-tight" style={{ fontSize: '18px' }}>{step.text}</p>
                  </div>
                  <p className="text-gray-500 leading-relaxed" style={{ fontSize: '15px', paddingLeft: '36px' }}>{step.detail}</p>
                </div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-blue-800 font-semibold" style={{ fontSize: '17px' }}>
                💡 두 손가락으로 사진을 오므리면 다시 작게 돌아와요.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <PressableButton
                label="갤러리(사진 앱) 열기"
                icon={<Image size={26} />}
                onClick={() => openGallery(platform)}
                variant="primary"
                fullWidth
              />
              <p className="text-gray-400 text-center mt-2" style={{ fontSize: '14px' }}>
                버튼을 눌러도 앱이 안 열리면 홈 화면에서 직접 찾아 눌러 주세요.
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      <HelpRequestBar aiContext="사용자가 스마트폰으로 사진 보는 방법을 보고 있어요. 사진 앱 열기, 사진 누르기, 두 손가락으로 크게 보기 단계에서 막혔을 수 있어요." />
    </div>
  );
}
