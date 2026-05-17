import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun, Info } from 'lucide-react';
import { triggerHapticFeedback } from '../lib/haptics';

// ── Types ──────────────────────────────────────────────────
type Stage = 'pre-permission' | 'ready' | 'screen-fallback';

interface TorchConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

// ── Brightness Step Slider ──────────────────────────────────
const STEPS = [1, 2, 3, 4, 5] as const;
type BrightnessLevel = (typeof STEPS)[number];

function BrightnessSlider({
  value,
  onChange,
  disabled,
}: {
  value: BrightnessLevel;
  onChange: (v: BrightnessLevel) => void;
  disabled?: boolean;
}) {
  return (
    <div className="w-full px-2">
      {/* Row label */}
      <div className="flex justify-between mb-3 px-1">
        <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)' }}>낮음</span>
        <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.45)' }}>밝음</span>
      </div>

      {/* Track + dots */}
      <div className="relative flex items-center" style={{ height: '56px' }}>
        {/* Background track */}
        <div
          className="absolute left-0 right-0 rounded-full"
          style={{ height: '6px', background: 'rgba(255,255,255,0.12)', top: '50%', transform: 'translateY(-50%)' }}
        />
        {/* Active track */}
        <div
          className="absolute left-0 rounded-full transition-all duration-200"
          style={{
            height: '6px',
            width: `${((value - 1) / 4) * 100}%`,
            background: disabled
              ? 'rgba(255,255,255,0.2)'
              : 'linear-gradient(90deg, #FACC15, #FDE68A)',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />

        {/* Dots */}
        <div className="relative flex justify-between w-full">
          {STEPS.map((step) => {
            const active = step <= value;
            const selected = step === value;
            return (
              <button
                key={step}
                onClick={() => { triggerHapticFeedback(); onChange(step); }}
                disabled={disabled}
                aria-label={`밝기 ${step}단계`}
                className="flex items-center justify-center"
                style={{ width: '52px', height: '52px' }}
              >
                <motion.div
                  animate={{ scale: selected ? 1.25 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{
                    width: selected ? '26px' : '18px',
                    height: selected ? '26px' : '18px',
                    borderRadius: '50%',
                    background: active
                      ? (disabled ? 'rgba(255,255,255,0.3)' : '#FACC15')
                      : 'rgba(255,255,255,0.18)',
                    border: selected
                      ? '3px solid rgba(255,255,255,0.5)'
                      : '2px solid transparent',
                    boxShadow: selected && !disabled
                      ? '0 0 12px 4px rgba(250,204,21,0.5)'
                      : 'none',
                    transition: 'all 0.15s',
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Step numbers */}
      <div className="flex justify-between px-1 mt-1">
        {STEPS.map((step) => (
          <span
            key={step}
            style={{
              width: '52px',
              textAlign: 'center',
              fontSize: '13px',
              color: step === value ? '#FACC15' : 'rgba(255,255,255,0.3)',
              fontWeight: step === value ? 700 : 400,
              transition: 'color 0.15s',
            }}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
export default function FlashScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('pre-permission');
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState<BrightnessLevel>(3);
  const [requesting, setRequesting] = useState(false);
  const [fallbackMsg, setFallbackMsg] = useState('');

  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  const cleanup = useCallback(() => {
    trackRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    trackRef.current = null;
    streamRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const applyTorch = async (on: boolean) => {
    if (!trackRef.current) return;
    try {
      await trackRef.current.applyConstraints({
        advanced: [{ torch: on } as TorchConstraintSet],
      });
    } catch { /* ignore */ }
  };

  // 첫 번째 켜기 (권한 요청 포함)
  const requestAndTurnOn = async () => {
    triggerHapticFeedback();
    setRequesting(true);
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
        cleanup();
        setStage('screen-fallback');
        setIsOn(true);
        setFallbackMsg('이 기기는 앱에서 LED를 켤 수 없어요. 화면을 밝게 켜드려요.');
      }
    } catch {
      setStage('screen-fallback');
      setIsOn(true);
      setFallbackMsg('카메라 권한 없이 화면 밝기 모드로 켜드려요.');
    } finally {
      setRequesting(false);
    }
  };

  const turnOn = async () => {
    triggerHapticFeedback();
    await applyTorch(true);
    setIsOn(true);
  };

  const turnOff = async () => {
    triggerHapticFeedback();
    if (stage === 'ready') await applyTorch(false);
    setIsOn(false);
  };

  const handleBack = () => { cleanup(); navigate('/'); };

  // ── 화면별 배경색 (screen-fallback) ─────────────────────
  const screenBg: Record<BrightnessLevel, string> = {
    1: '#B0B0B0', 2: '#D0D0D0', 3: '#E8E8E8', 4: '#F5F5F5', 5: '#FFFFFF',
  };

  // ═══════════════════════════════════════════════════════
  // Stage 1 — 사전 안내 화면
  // ═══════════════════════════════════════════════════════
  if (stage === 'pre-permission') {
    return (
      <div className="min-h-screen flex flex-col"
           style={{ background: 'linear-gradient(180deg, #0C0C18 0%, #1A1A2E 100%)' }}>
        <header className="px-4 pt-5 pb-2 flex items-center">
          <button onClick={handleBack} className="flex items-center gap-1 font-semibold"
                  style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)' }}>
            <ArrowLeft size={22} /> 홈으로
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
              width: '120px', height: '120px',
              background: 'radial-gradient(circle at 38% 32%, #FDE047, #CA8A04)',
              boxShadow: '0 0 50px 12px rgba(250,204,21,0.3)',
            }}
          >
            <Sun size={60} color="white" strokeWidth={2} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-extrabold text-white text-center mb-6"
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
            <div className="flex gap-3 items-center mb-3">
              <Info size={20} color="#FDE047" />
              <p className="font-bold text-yellow-300" style={{ fontSize: '17px' }}>카메라 권한 안내</p>
            </div>
            <p style={{ fontSize: '17px', color: 'white', lineHeight: 1.7 }}>
              손전등을 켜려면{' '}
              <span className="text-yellow-300 font-bold">카메라 권한</span>이 필요해요.
            </p>
            <p className="mt-2" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
              사진을 찍는 게 아니라, 카메라 옆 LED 불빛을 켜기 위한 거예요. 걱정 마세요!
            </p>
          </motion.div>

          {/* 켜기 버튼 */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            whileTap={{ scale: 0.96 }}
            onClick={requestAndTurnOn}
            disabled={requesting}
            className="w-full max-w-sm rounded-2xl font-extrabold text-white flex items-center justify-center gap-3"
            style={{
              minHeight: '72px', fontSize: '22px',
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              boxShadow: '0 0 30px rgba(34,197,94,0.4)',
              opacity: requesting ? 0.7 : 1,
            }}
          >
            <Sun size={28} />
            {requesting ? '켜는 중...' : '확인, 손전등 켜기'}
          </motion.button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // Stage 2 — Screen-fallback (화면 밝기 모드)
  // ═══════════════════════════════════════════════════════
  if (stage === 'screen-fallback') {
    const bg = isOn ? screenBg[brightness] : '#111827';
    const dark = isOn;

    return (
      <div className="min-h-screen flex flex-col select-none transition-colors duration-400"
           style={{ background: bg }}>
        <header className="px-4 pt-5 pb-2 flex items-center gap-2">
          <button onClick={handleBack} className="flex items-center gap-1 font-semibold"
                  style={{ fontSize: '17px', color: dark ? '#374151' : 'rgba(255,255,255,0.7)' }}>
            <ArrowLeft size={22} /> 홈으로
          </button>
          <span className="ml-1 font-extrabold" style={{ fontSize: '22px', color: dark ? '#111827' : 'white' }}>
            손전등
          </span>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-10 px-6 pb-10">
          {/* ON/OFF 버튼 */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={isOn ? turnOff : () => { triggerHapticFeedback(); setIsOn(true); }}
            className="rounded-full flex flex-col items-center justify-center shadow-2xl"
            style={{
              width: '210px', height: '210px',
              background: isOn
                ? 'radial-gradient(circle at 38% 32%, #86EFAC, #16A34A)'
                : 'radial-gradient(circle at 38% 32%, #FCA5A5, #DC2626)',
              boxShadow: isOn
                ? '0 0 60px 20px rgba(34,197,94,0.35)'
                : '0 0 40px 10px rgba(220,38,38,0.3)',
            }}
          >
            <div className="absolute inset-4 rounded-full" style={{ border: '2.5px solid rgba(255,255,255,0.2)' }} />
            <Sun size={58} color="white" strokeWidth={2} />
            <span className="font-extrabold mt-2" style={{ fontSize: '30px', color: 'white' }}>
              {isOn ? '끄기' : '켜기'}
            </span>
          </motion.button>

          {/* 밝기 슬라이더 */}
          <div className="w-full max-w-sm rounded-3xl p-5"
               style={{ background: 'rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.1)' }}>
            <p className="font-bold mb-4 text-center"
               style={{ fontSize: '18px', color: dark ? '#374151' : 'rgba(255,255,255,0.7)' }}>
              밝기
            </p>
            {/* Screen-mode slider uses lighter colors */}
            <div className="w-full px-2">
              <div className="flex justify-between mb-3 px-1">
                <span style={{ fontSize: '15px', color: '#9CA3AF' }}>낮음</span>
                <span style={{ fontSize: '15px', color: '#9CA3AF' }}>밝음</span>
              </div>
              <div className="relative flex items-center" style={{ height: '56px' }}>
                <div className="absolute left-0 right-0 rounded-full"
                     style={{ height: '6px', background: '#E5E7EB', top: '50%', transform: 'translateY(-50%)' }} />
                <div className="absolute left-0 rounded-full transition-all duration-200"
                     style={{
                       height: '6px',
                       width: `${((brightness - 1) / 4) * 100}%`,
                       background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                       top: '50%', transform: 'translateY(-50%)',
                     }} />
                <div className="relative flex justify-between w-full">
                  {STEPS.map((step) => {
                    const active = step <= brightness;
                    const selected = step === brightness;
                    return (
                      <button key={step} onClick={() => { triggerHapticFeedback(); setBrightness(step); }}
                              aria-label={`밝기 ${step}단계`}
                              className="flex items-center justify-center"
                              style={{ width: '52px', height: '52px' }}>
                        <motion.div
                          animate={{ scale: selected ? 1.25 : 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          style={{
                            width: selected ? '26px' : '18px',
                            height: selected ? '26px' : '18px',
                            borderRadius: '50%',
                            background: active ? '#2563EB' : '#D1D5DB',
                            border: selected ? '3px solid rgba(37,99,235,0.3)' : '2px solid transparent',
                            boxShadow: selected ? '0 0 10px 4px rgba(37,99,235,0.25)' : 'none',
                            transition: 'all 0.15s',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {fallbackMsg && (
            <p className="text-center" style={{ fontSize: '15px', color: dark ? '#6B7280' : 'rgba(255,255,255,0.45)' }}>
              {fallbackMsg}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // Stage 3 — 메인 화면 (Torch ready)
  // ═══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col select-none"
         style={{ background: 'linear-gradient(180deg, #0C0C18 0%, #141426 60%, #0C0C18 100%)' }}>
      {/* Header */}
      <header className="px-4 pt-5 pb-2 flex items-center gap-3 z-10">
        <button onClick={handleBack} className="flex items-center gap-1 font-semibold"
                style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)' }}>
          <ArrowLeft size={22} /> 홈으로
        </button>
        <span className="ml-1 font-extrabold" style={{ fontSize: '22px', color: 'white' }}>손전등</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center pb-6 px-5 gap-10 relative z-10">

        {/* 글로우 */}
        <AnimatePresence>
          {isOn && (
            <motion.div
              key="glow"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.1, 1] }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(253,230,60,0.85) 0%, rgba(255,180,30,0.3) 45%, transparent 70%)',
                filter: 'blur(22px)',
              }}
            />
          )}
        </AnimatePresence>

        {/* ── ON / OFF 버튼 ── */}
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
          <div className="absolute inset-4 rounded-full"
               style={{ border: '2.5px solid rgba(255,255,255,0.2)' }} />
          <Sun
            size={60} color="white" strokeWidth={isOn ? 2.5 : 1.8}
            style={{ filter: isOn ? 'drop-shadow(0 0 14px rgba(255,255,255,0.9))' : 'none' }}
          />
          <span className="font-extrabold mt-2"
                style={{ fontSize: '30px', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {isOn ? '끄기' : '켜기'}
          </span>
        </motion.button>

        {/* ── 밝기 조절 패널 (삼성 스타일) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm rounded-3xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* 사용 중 토글 행 */}
          <div className="flex items-center justify-between px-6 py-4"
               style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="font-bold text-white" style={{ fontSize: '19px' }}>사용 중</span>
            {/* Toggle switch */}
            <button
              onClick={isOn ? turnOff : turnOn}
              aria-label={isOn ? '끄기' : '켜기'}
              className="relative rounded-full transition-all duration-300"
              style={{
                width: '54px', height: '30px',
                background: isOn ? '#22C55E' : 'rgba(255,255,255,0.2)',
              }}
            >
              <motion.div
                animate={{ x: isOn ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute rounded-full bg-white shadow"
                style={{ width: '26px', height: '26px', top: '2px' }}
              />
            </button>
          </div>

          {/* 밝기 슬라이더 행 */}
          <div className="px-4 pt-4 pb-5">
            <p className="font-bold text-white mb-4 px-2" style={{ fontSize: '19px' }}>밝기</p>
            <BrightnessSlider
              value={brightness}
              onChange={setBrightness}
              disabled={!isOn}
            />
          </div>

          {/* 완료 버튼 */}
          <button
            onClick={handleBack}
            className="w-full py-4 font-bold text-white transition-colors"
            style={{
              fontSize: '18px',
              background: 'rgba(255,255,255,0.05)',
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            완료
          </button>
        </motion.div>

        {/* 안내 */}
        {!isOn && (
          <p className="text-center" style={{ fontSize: '16px', color: 'rgba(255,255,255,0.3)' }}>
            버튼을 누르면 손전등이 켜져요
          </p>
        )}
      </div>
    </div>
  );
}
