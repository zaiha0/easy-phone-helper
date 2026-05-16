import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const LENS_RADIUS = 70;

export default function MagnifierOverlay({ onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [lensPos, setLensPos] = useState<{ x: number; y: number } | null>(null);
  const [zoomedText, setZoomedText] = useState<string>('손가락으로 글자를 가리켜 보세요');
  const rafRef = useRef<number | null>(null);

  const extractTextAt = useCallback((x: number, y: number) => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Temporarily disable pointer events on overlay to see through it
    overlay.style.pointerEvents = 'none';
    const elements = document.elementsFromPoint(x, y);
    overlay.style.pointerEvents = 'auto';

    for (const el of elements) {
      if (el === overlay || overlay.contains(el)) continue;
      const text = (el.textContent ?? '').trim().replace(/\s+/g, ' ');
      if (text.length > 0) {
        setZoomedText(text.slice(0, 120));
        return;
      }
    }
    setZoomedText('(글자가 없는 영역이에요)');
  }, []);

  const handlePointerMove = useCallback((x: number, y: number) => {
    setLensPos({ x, y });
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => extractTextAt(x, y));
  }, [extractTextAt]);

  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      if (t) handlePointerMove(t.clientX, t.clientY);
    };
    const onMouse = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);

    window.addEventListener('touchmove', onTouch, { passive: false });
    window.addEventListener('touchstart', onTouch, { passive: false });
    window.addEventListener('mousemove', onMouse);

    return () => {
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('mousemove', onMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handlePointerMove]);

  const cx = lensPos?.x ?? window.innerWidth / 2;
  const cy = lensPos?.y ?? window.innerHeight / 3;

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200]"
      style={{ touchAction: 'none' }}
    >
      {/* Dimmed backdrop with lens cutout via SVG clip */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="lens-mask">
            <rect width="100%" height="100%" fill="white" />
            <circle cx={cx} cy={cy} r={LENS_RADIUS} fill="black" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.45)"
          mask="url(#lens-mask)"
        />
        {/* Lens ring */}
        <circle
          cx={cx}
          cy={cy}
          r={LENS_RADIUS}
          fill="none"
          stroke="#2563EB"
          strokeWidth="3"
        />
        <circle
          cx={cx}
          cy={cy}
          r={LENS_RADIUS + 1}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          opacity={0.6}
        />
      </svg>

      {/* Zoomed text panel — fixed at bottom above HelpRequestBar */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '84px',
          background: 'rgba(255,255,255,0.97)',
          borderTop: '2px solid #2563EB',
          padding: '14px 18px 16px',
          minHeight: '80px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: '#1a1a2e',
            lineHeight: 1.4,
            wordBreak: 'keep-all',
            width: '100%',
          }}
        >
          {zoomedText}
        </div>
      </div>

      {/* Close button */}
      <button
        onPointerDown={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 flex items-center gap-1.5 bg-white rounded-full shadow-lg px-4 py-2"
        style={{ fontSize: '17px', fontWeight: 700, color: '#374151', zIndex: 10 }}
        aria-label="돋보기 닫기"
      >
        <X size={20} />
        닫기
      </button>

      {/* Instruction badge */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-full px-4 py-1.5 shadow"
        style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', pointerEvents: 'none' }}
      >
        보고 싶은 글자를 손가락으로 가리키세요
      </div>
    </motion.div>
  );
}
