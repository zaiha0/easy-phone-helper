import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun, ChevronDown, Info } from 'lucide-react';
import { triggerHapticFeedback } from '../lib/haptics';

// ── Types ──────────────────────────────────────────────────
type Stage =
  | 'pre-permission'   // 첫 화면: 권한 사전 안내
  | 'ready'            // 메인 ON/OFF 화면 (torch 사용 가능)
  | 'screen-fallback'; // 화면 밝기 모드 (권한 거부 or torch 미지원)

interface TorchConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

// ── Component ───────────────────────────────────────────────
export default function FlashScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('pre-permission');
  const [isOn, setIsOn] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [deniedMsg, setDeniedMsg] = useState('');

  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  // Cleanup torch on unmount
  const cleanup = useCallback(() => {
    trackRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    trackRef.current = null;
    streamRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  // ── Torch helpers ────────────────────────────────────────
  const applyTorch = async (on: boolean) => {
    if (!trackRef.current) return;
    try {
      await trackRef.current.applyConstraints({
        advanced: [{ torch: on } as TorchConstraintSet],
      });
    } catch { /* ignore */ }
  };

  // ── 권한 요청 + 켜기 ─────────────────────────────────────
  const requestAndTurnOn = async () => {
    triggerHapticFeedback();
    setRequesting(true);
    setDeniedMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } },
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      trackRef.current = track;

      const caps = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
      if (caps.torch) {
        await applyTorch(true);
        setStage('ready');
        setIsOn(true);
      } else {
        // Torch not available on this device (e.g. front-only camera)
        cleanup();
        setStage('screen-fallback');
        setIsOn(true);
        setDeniedMsg('이 기기는 앱에서 LED를 직접 켤 수 없어요. 대신 화면을 밝게 켜드려요.');
      }
    } catch {
      // Permission denied
      setStage('screen-fallback');
      setIsOn(true);
      setDeniedMsg('카메라 권한을 허용하지 않으셨어요.\n대신 화면을 밝게 켜드려요.');
    } finally {
      setRequesting(false);
    }
  };

  // ── 켜기 (권한 이미 있을 때) ─────────────────────────────
  const turnOn = async () => {
    triggerHapticFeedback();
    await applyTorch(true);
    setIsOn(true);
  };

  // ── 끄기 ────────────────────────────────────────────────
  const turnOff = async () => {
    triggerHapticFeedback();
    await applyTorch(false);
    setIsOn(false);
  };

  const handleBack = () => {
    cleanup();
    navigate('/');
  };

  // ── Pre-permission 화면 ──────────────────────────────────
  if (stage === 'pre-permission') {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(180deg, #0C0C18 0%, #1A1A2E 100%)' }}
      >
        <header className="px-4 pt-5 pb-2 flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 font-semibold"
            style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)' }}
          >
            <ArrowLeft size={22} />
            홈으로
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
          {/* 아이콘 */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="mb-8 rounded-full flex items-center justify-center"
            style={{
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle at 40% 35%, #FDE047, #CA8A04)',
              boxShadow: '0 0 50px 10px rgba(250,204,21,0.35)',
            }}
          >
            <Sun size={60} color="white" strokeWidth={2} />
          </motion.div>

          {/* 제목 */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-extrabold text-white text-center mb-4"
            style={{ fontSize: '30px' }}
          >
            손전등
          </motion.h1>

          {/* 안내 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="w-full max-w-sm rounded-3xl p-6 mb-8"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="flex gap-3 items-start mb-4">
              <Info size={22} className="mt-0.5 flex-shrink-0" color="#FDE047" />
              <p className="font-bold text-yellow-300" style={{ fontSize: '18px' }}>
                카메라 권한 안내
              </p>
            </div>
            <p className="text-white leading-relaxed" style={{ fontSize: '17px', lineHeight: 1.7 }}>
              손전등을 켜려면 <span className="text-yellow-300 font-bold">카메라 권한</span>이 필요해요.
            </p>
            <p className="mt-2 leading-relaxed" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              사진을 찍는 게 아니라, 카메라 옆에 있는{' '}
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>LED 불빛</span>을 켜기 위해 필요한 거예요.
              걱정하지 마세요!
            </p>
          </motion.div>

          {/* CTA 버튼 */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            whileTap={{ scale: 0.96 }}
            onClick={requestAndTurnOn}
            disabled={requesting}
            className="w-full max-w-sm rounded-2xl font-extrabold text-white flex items-center justify-center gap-3 shadow-xl"
            style={{
              minHeight: '72px',
              fontSize: '22px',
              background: requesting
                ? 'rgba(255,255,255,0.15)'
                : 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              boxShadow: requesting ? 'none' : '0 0 30px rgba(34,197,94,0.4)',
              transition: 'all 0.2s',
            }}
          >
            {requesting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Sun size={26} />
              </motion.div>
            ) : (
              <Sun size={28} />
            )}
            {requesting ? '켜는 중...' : '확인했어요, 손전등 켜기'}
          </motion.button>
        </div>
      </div>
    );
  }

  // ── Screen-fallback 화면 ─────────────────────────────────
  if (stage === 'screen-fallback') {
    return (
      <div
        className="min-h-screen flex flex-col transition-colors duration-500"
        style={{ background: isOn ? '#FFFFFF' : '#111827' }}
      >
        <header className="px-4 pt-5 pb-2 flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 font-semibold"
            style={{ fontSize: '17px', color: isOn ? '#374151' : 'rgba(255,255,255,0.7)' }}
          >
            <ArrowLeft size={22} />
            홈으로
          </button>
          <span className="ml-2 font-extrabold" style={{ fontSize: '22px', color: isOn ? '#111827' : 'white' }}>
            손전등
          </span>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10 gap-6">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={isOn ? turnOff : () => { triggerHapticFeedback(); setIsOn(true); }}
            className="rounded-full flex flex-col items-center justify-center shadow-2xl"
            style={{
              width: '200px', height: '200px',
              background: isOn
                ? 'radial-gradient(circle at 40% 35%, #4ADE80, #16A34A)'
                : 'radial-gradient(circle at 40% 35%, #F87171, #DC2626)',
              boxShadow: isOn
                ? '0 0 60px 20px rgba(34,197,94,0.35)'
                : '0 0 40px 8px rgba(220,38,38,0.3)',
            }}
          >
            <Sun size={56} color="white" strokeWidth={2} />
            <span className="font-extrabold mt-2" style={{ fontSize: '28px', color: 'white' }}>
              {isOn ? '끄기' : '켜기'}
            </span>
          </motion.button>

          {deniedMsg && (
            <p className="text-center leading-relaxed"
               style={{ fontSize: '16px', color: isOn ? '#6B7280' : 'rgba(255,255,255,0.5)', whiteSpace: 'pre-line' }}>
              {deniedMsg}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── 메인 화면 (ready / torch 사용 가능) ──────────────────
  return (
    <div
      className="min-h-screen flex flex-col select-none"
      style={{ background: 'linear-gradient(180deg, #0C0C18 0%, #141426 60%, #0C0C18 100%)' }}
    >
      {/* Header */}
      <header className="px-4 pt-5 pb-2 flex items-center gap-3 z-10">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 font-semibold"
          style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)' }}
          aria-label="홈으로"
        >
          <ArrowLeft size={22} />
          홈으로
        </button>
        <span className="font-extrabold ml-2" style={{ fontSize: '22px', color: 'white' }}>
          손전등
        </span>
      </header>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center pb-6 relative z-10">

        {/* 상태 뱃지 */}
        <motion.div
          key={isOn ? 'on' : 'off'}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-8 py-2 rounded-full font-bold"
          style={{
            fontSize: '22px',
            background: isOn ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
            color: isOn ? '#4ADE80' : '#F87171',
            border: `2.5px solid ${isOn ? '#4ADE80' : '#F87171'}`,
          }}
        >
          {isOn ? '켜짐 ●' : '꺼짐 ○'}
        </motion.div>

        {/* 글로우 효과 */}
        <AnimatePresence>
          {isOn && (
            <motion.div
              key="glow"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.1, 1] }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '280px', height: '280px',
                background: 'radial-gradient(circle, rgba(253,230,60,0.85) 0%, rgba(255,180,30,0.35) 45%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── 메인 토글 버튼 ── */}
        <motion.button
          whileTap={{ scale: 0.91 }}
          onClick={isOn ? turnOff : turnOn}
          className="relative flex flex-col items-center justify-center rounded-full shadow-2xl"
          aria-label={isOn ? '손전등 끄기' : '손전등 켜기'}
          style={{
            width: '210px', height: '210px',
            background: isOn
              ? 'radial-gradient(circle at 38% 32%, #86EFAC, #16A34A)'
              : 'radial-gradient(circle at 38% 32%, #FCA5A5, #DC2626)',
            boxShadow: isOn
              ? '0 0 70px 25px rgba(34,197,94,0.45), inset 0 2px 8px rgba(255,255,255,0.2)'
              : '0 0 45px 10px rgba(220,38,38,0.4), inset 0 2px 8px rgba(255,255,255,0.1)',
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        >
          {/* 안쪽 링 */}
          <div className="absolute inset-4 rounded-full"
               style={{ border: '2.5px solid rgba(255,255,255,0.2)' }} />

          <Sun
            size={60}
            color="white"
            strokeWidth={isOn ? 2.5 : 1.8}
            style={{ filter: isOn ? 'drop-shadow(0 0 12px rgba(255,255,255,0.9))' : 'none' }}
          />
          <span
            className="font-extrabold mt-2"
            style={{ fontSize: '30px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)', letterSpacing: '-0.5px' }}
          >
            {isOn ? '끄기' : '켜기'}
          </span>
        </motion.button>

        {/* ── 밝기 조절 안내 카드 ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-5 mt-10 rounded-3xl p-5 w-full max-w-sm"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <p className="font-bold text-yellow-300 mb-3" style={{ fontSize: '17px' }}>
            💡 밝기 조절 방법
          </p>
          <div className="space-y-3">
            {[
              { step: '1', text: '화면 위쪽에서 아래로 쓸어내리세요' },
              { step: '2', text: '손전등 아이콘을 꾹 길게 누르세요' },
              { step: '3', text: '밝기 조절 화면이 나타나요' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className="rounded-full flex items-center justify-center flex-shrink-0 font-bold"
                  style={{ width: '30px', height: '30px', background: 'rgba(253,224,71,0.2)', color: '#FDE047', fontSize: '14px' }}
                >
                  {step}
                </div>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <ChevronDown size={16} color="rgba(255,255,255,0.35)" />
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>
              앱에서는 ON/OFF만 제어할 수 있어요
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
