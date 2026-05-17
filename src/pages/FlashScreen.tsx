import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sun } from 'lucide-react';
import { triggerHapticFeedback } from '../lib/haptics';

type Level = 1 | 2 | 3;
type TorchMode = 'idle' | 'torch' | 'screen';

// Extend MediaTrackConstraintSet to include torch (non-standard but widely supported)
interface TorchConstraintSet extends MediaTrackConstraintSet {
  torch?: boolean;
}

// Screen-mode background per level
const SCREEN_BG: Record<Level, string> = {
  1: '#D4D4D4',
  2: '#EFEFEF',
  3: '#FFFFFF',
};

// Glow size per level
const GLOW_SIZE: Record<Level, string> = {
  1: '120px',
  2: '180px',
  3: '260px',
};

export default function FlashScreen() {
  const navigate = useNavigate();
  const [isOn, setIsOn] = useState(false);
  const [level, setLevel] = useState<Level>(3);
  const [mode, setMode] = useState<TorchMode>('idle');
  const [notice, setNotice] = useState('');

  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  // Cleanup on unmount / navigate away
  const cleanup = useCallback(() => {
    trackRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    trackRef.current = null;
    streamRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  // Apply torch constraint to current track
  const applyTorch = async (on: boolean) => {
    if (!trackRef.current) return;
    try {
      await trackRef.current.applyConstraints({
        advanced: [{ torch: on } as TorchConstraintSet],
      });
    } catch {
      /* ignore — some browsers throw even when torch is supported */
    }
  };

  const turnOn = async (lvl: Level) => {
    triggerHapticFeedback();
    setLevel(lvl);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } },
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      trackRef.current = track;

      // Check torch capability
      const caps = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
      if (caps.torch) {
        await applyTorch(true);
        setMode('torch');
        setNotice('');
      } else {
        // Torch not supported — fall back to bright screen
        cleanup();
        setMode('screen');
        setNotice('이 기기는 앱에서 손전등을 직접 켤 수 없어요.\n대신 화면을 밝게 켜드려요.');
      }
    } catch {
      // Camera permission denied or not available
      setMode('screen');
      setNotice('카메라 권한이 없어 화면 밝기 모드로 켜드려요.');
    }
    setIsOn(true);
  };

  const turnOff = async () => {
    triggerHapticFeedback();
    if (mode === 'torch') await applyTorch(false);
    cleanup();
    setIsOn(false);
    setMode('idle');
  };

  const handleToggle = () => {
    if (isOn) turnOff();
    else turnOn(level);
  };

  const handleLevel = (lvl: Level) => {
    triggerHapticFeedback();
    setLevel(lvl);
    // Level is visual for torch mode (LED brightness not controllable via web API)
    // For screen mode the background color updates automatically via SCREEN_BG[level]
  };

  const handleBack = () => {
    turnOff();
    navigate('/');
  };

  // Screen-mode background color
  const screenOn = isOn && mode === 'screen';
  const pageBg = screenOn
    ? SCREEN_BG[level]
    : 'linear-gradient(180deg, #0C0C18 0%, #141426 60%, #0C0C18 100%)';

  const textColor = screenOn ? '#111827' : '#FFFFFF';

  return (
    <motion.div
      className="min-h-screen flex flex-col select-none"
      animate={{ background: screenOn ? SCREEN_BG[level] : undefined }}
      style={{
        background: pageBg,
        transition: 'background 0.4s',
      }}
    >
      {/* Header */}
      <header className="px-4 pt-5 pb-2 flex items-center gap-3 relative z-10">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 font-semibold"
          style={{ fontSize: '17px', color: screenOn ? '#374151' : 'rgba(255,255,255,0.7)' }}
          aria-label="홈으로"
        >
          <ArrowLeft size={22} />
          홈으로
        </button>
        <span
          className="font-extrabold ml-2"
          style={{ fontSize: '22px', color: textColor }}
        >
          손전등
        </span>
      </header>

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center pb-10 relative z-10">

        {/* Status label */}
        <motion.div
          key={isOn ? 'on' : 'off'}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 px-6 py-2 rounded-full font-bold"
          style={{
            fontSize: '20px',
            background: isOn ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
            color: isOn ? '#22C55E' : '#F87171',
            border: `2px solid ${isOn ? '#22C55E' : '#F87171'}`,
          }}
        >
          {isOn ? '켜짐' : '꺼짐'}
        </motion.div>

        {/* Glow backdrop (torch mode only) */}
        <AnimatePresence>
          {isOn && mode === 'torch' && (
            <motion.div
              key="glow"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.08, 1] }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: GLOW_SIZE[level],
                height: GLOW_SIZE[level],
                background: 'radial-gradient(circle, rgba(250,240,130,0.9) 0%, rgba(255,200,50,0.4) 40%, transparent 70%)',
                filter: 'blur(16px)',
              }}
            />
          )}
        </AnimatePresence>

        {/* Main toggle button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleToggle}
          className="relative flex flex-col items-center justify-center rounded-full shadow-2xl"
          aria-label={isOn ? '손전등 끄기' : '손전등 켜기'}
          style={{
            width: '200px',
            height: '200px',
            background: isOn
              ? 'radial-gradient(circle at 40% 35%, #4ADE80, #16A34A)'
              : 'radial-gradient(circle at 40% 35%, #F87171, #DC2626)',
            boxShadow: isOn
              ? '0 0 60px 20px rgba(34,197,94,0.4), 0 8px 32px rgba(0,0,0,0.4)'
              : '0 0 40px 8px rgba(220,38,38,0.35), 0 8px 32px rgba(0,0,0,0.4)',
            transition: 'background 0.35s, box-shadow 0.35s',
          }}
        >
          {/* Inner ring */}
          <div
            className="absolute inset-3 rounded-full"
            style={{
              border: `3px solid ${isOn ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'}`,
            }}
          />

          {/* Icon */}
          <motion.div
            animate={isOn ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Sun
              size={56}
              color="white"
              strokeWidth={isOn ? 2.5 : 1.8}
              style={{ filter: isOn ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none' }}
            />
          </motion.div>

          {/* Label */}
          <span
            className="font-extrabold mt-2"
            style={{
              fontSize: '28px',
              color: 'white',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              letterSpacing: '-0.5px',
            }}
          >
            {isOn ? '끄기' : '켜기'}
          </span>
        </motion.button>

        {/* Brightness selector */}
        <div className="mt-10 w-full px-8 max-w-xs">
          <p
            className="text-center mb-4 font-semibold"
            style={{ fontSize: '17px', color: screenOn ? '#6B7280' : 'rgba(255,255,255,0.5)' }}
          >
            밝기 조절
          </p>
          <div className="flex gap-3 justify-center">
            {([1, 2, 3] as Level[]).map((lvl) => {
              const active = level === lvl;
              return (
                <motion.button
                  key={lvl}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLevel(lvl)}
                  className="flex-1 flex flex-col items-center justify-center rounded-2xl gap-2 font-bold"
                  style={{
                    height: '80px',
                    background: active
                      ? (screenOn ? '#1D4ED8' : 'rgba(250,230,80,0.25)')
                      : (screenOn ? '#E5E7EB' : 'rgba(255,255,255,0.07)'),
                    border: active
                      ? `2px solid ${screenOn ? '#2563EB' : '#FACC15'}`
                      : '2px solid transparent',
                    color: active
                      ? (screenOn ? '#2563EB' : '#FDE047')
                      : (screenOn ? '#9CA3AF' : 'rgba(255,255,255,0.35)'),
                    transition: 'all 0.2s',
                  }}
                  aria-label={`밝기 ${lvl}단계`}
                  aria-pressed={active}
                >
                  {/* Sun icon scaled by level */}
                  <Sun
                    size={lvl === 1 ? 18 : lvl === 2 ? 24 : 30}
                    strokeWidth={active ? 2.5 : 1.8}
                    color={active ? (screenOn ? '#2563EB' : '#FACC15') : (screenOn ? '#9CA3AF' : 'rgba(255,255,255,0.35)')}
                  />
                  <span style={{ fontSize: '14px' }}>
                    {lvl === 1 ? '낮음' : lvl === 2 ? '보통' : '밝음'}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Notice (screen fallback) */}
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 mx-6 rounded-2xl px-5 py-4 text-center"
              style={{
                background: screenOn ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
                border: screenOn ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: screenOn ? '#374151' : 'rgba(255,255,255,0.55)',
                  whiteSpace: 'pre-line',
                }}
              >
                {notice}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tip at bottom */}
      {!isOn && (
        <p
          className="text-center pb-8 px-6"
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.6,
          }}
        >
          가운데 버튼을 누르면 손전등이 켜져요
        </p>
      )}
    </motion.div>
  );
}
