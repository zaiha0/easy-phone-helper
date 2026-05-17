import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, VolumeX, RotateCcw, X, Loader2, AlertCircle } from 'lucide-react';
import { triggerHapticFeedback } from '../lib/haptics';
import { chatWithAI } from '../lib/api';

type Status = 'idle' | 'listening' | 'thinking' | 'done' | 'error' | 'unsupported';

// SpeechRecognition 타입 선언
interface SREvent extends Event {
  results: { [i: number]: { [i: number]: { transcript: string } } };
}
interface SRInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (e: SREvent) => void;
  onerror: (e: Event) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognition(): (new () => SRInstance) | null {
  const w = window as typeof window & {
    SpeechRecognition?: new () => SRInstance;
    webkitSpeechRecognition?: new () => SRInstance;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

interface Props {
  onClose: () => void;
  context?: string;
}

export default function VoiceAssistant({ onClose, context }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState('');
  const [answer, setAnswer] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const srRef = useRef<SRInstance | null>(null);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  // 언마운트 시 TTS + SpeechRecognition 클린업
  useEffect(() => () => {
    window.speechSynthesis?.cancel();
    srRef.current?.stop();
  }, []);

  const speakAnswer = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    stopSpeaking();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ko-KR';
    utt.rate = 0.82;
    utt.pitch = 1.0;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [stopSpeaking]);

  const sendToAI = useCallback(async (text: string) => {
    setStatus('thinking');
    const result = await chatWithAI(text, context);
    setAnswer(result);
    setStatus('done');
    speakAnswer(result);
  }, [speakAnswer, context]);

  const startListening = useCallback(() => {
    triggerHapticFeedback();
    const SRClass = getSpeechRecognition();
    if (!SRClass) { setStatus('unsupported'); return; }

    stopSpeaking();
    setTranscript('');
    setAnswer('');
    setStatus('listening');

    const sr = new SRClass();
    sr.lang = 'ko-KR';
    sr.continuous = false;
    sr.interimResults = false;

    let gotResult = false;

    sr.onresult = (e: SREvent) => {
      gotResult = true;
      const text = e.results[0][0].transcript;
      setTranscript(text);
      sendToAI(text);
    };

    sr.onerror = () => {
      if (!gotResult) setStatus('error');
    };

    sr.onend = () => {
      if (!gotResult) setStatus('error');
    };

    sr.start();
    srRef.current = sr;
  }, [stopSpeaking, sendToAI]);

  const handleClose = useCallback(() => {
    stopSpeaking();
    srRef.current?.stop();
    onClose();
  }, [stopSpeaking, onClose]);

  const toggleSpeak = () => {
    triggerHapticFeedback();
    if (speaking) { stopSpeaking(); } else { speakAnswer(answer); }
  };

  const statusLabel: Record<Status, string> = {
    idle:        '마이크 버튼을 누르고\n말씀해 보세요',
    listening:   '듣고 있어요...\n말씀이 끝나면 자동으로 처리해요',
    thinking:    '잠깐만 기다려 주세요...',
    done:        '답변이 준비됐어요',
    error:       '소리가 잘 들리지 않았어요.\n조금 더 크게 천천히 말씀해 주세요.',
    unsupported: '이 기기는 음성 인식을\n지원하지 않아요',
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/50 z-50"
      />

      {/* 메인 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-x-4 bottom-6 z-50 bg-white rounded-3xl shadow-2xl p-6 max-w-md mx-auto"
      >
        {/* 닫기 */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400" aria-label="닫기">
          <X size={26} />
        </button>

        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
            <Mic size={24} style={{ color: '#4F46E5' }} />
          </div>
          <div>
            <p className="font-extrabold text-gray-900" style={{ fontSize: '20px' }}>AI 비서</p>
            <p className="text-gray-400" style={{ fontSize: '14px' }}>말씀하시면 답해드려요</p>
          </div>
        </div>

        {/* 상태 표시 영역 */}
        <div className="flex flex-col items-center gap-5 py-4">

          {/* 마이크 버튼 (idle / error) */}
          {(status === 'idle' || status === 'error') && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={startListening}
              className="flex flex-col items-center gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: status === 'error' ? '#FEE2E2' : '#4F46E5' }}
              >
                {status === 'error'
                  ? <AlertCircle size={44} style={{ color: '#DC2626' }} />
                  : <Mic size={44} color="white" />
                }
              </motion.div>
              <p className="font-bold text-center whitespace-pre-line"
                style={{ fontSize: '18px', color: status === 'error' ? '#DC2626' : '#4F46E5' }}>
                {status === 'error' ? '다시 말하기' : '누르고 말하기'}
              </p>
            </motion.button>
          )}

          {/* 듣는 중 애니메이션 */}
          {status === 'listening' && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-24 h-24 flex items-center justify-center">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border-2"
                    style={{ borderColor: '#4F46E5', opacity: 0.3 }}
                    animate={{ scale: [1, 1 + i * 0.35], opacity: [0.4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
                    initial={{ width: '96px', height: '96px' }}
                  />
                ))}
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4F46E5' }}>
                  <Mic size={44} color="white" />
                </div>
              </div>
              <p className="font-bold text-center" style={{ fontSize: '18px', color: '#4F46E5' }}>듣고 있어요...</p>
            </div>
          )}

          {/* 생각 중 */}
          {status === 'thinking' && (
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={56} style={{ color: '#4F46E5' }} />
              </motion.div>
              <p className="font-bold" style={{ fontSize: '18px', color: '#4F46E5' }}>생각 중이에요...</p>
            </div>
          )}

          {/* 지원 안 함 */}
          {status === 'unsupported' && (
            <div className="flex flex-col items-center gap-3 py-2">
              <AlertCircle size={48} style={{ color: '#9CA3AF' }} />
              <p className="text-center text-gray-500 leading-relaxed" style={{ fontSize: '17px' }}>
                이 기기는 음성 인식을 지원하지 않아요.{'\n'}보호자에게 직접 문자로 도움을 요청해 보세요.
              </p>
            </div>
          )}

          {/* 상태 안내 문구 */}
          {status !== 'done' && status !== 'unsupported' && (
            <p className="text-gray-400 text-center whitespace-pre-line" style={{ fontSize: '15px' }}>
              {statusLabel[status]}
            </p>
          )}
        </div>

        {/* 답변 완료 */}
        <AnimatePresence>
          {status === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {/* 사용자가 말한 내용 */}
              {transcript && (
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <p className="text-gray-500" style={{ fontSize: '13px' }}>내가 한 말</p>
                  <p className="text-gray-700 font-medium" style={{ fontSize: '16px' }}>"{transcript}"</p>
                </div>
              )}

              {/* AI 답변 */}
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#EEF2FF' }}>
                <p className="text-gray-800 leading-relaxed" style={{ fontSize: '19px' }}>
                  {answer}
                </p>
              </div>

              {/* TTS 토글 */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={toggleSpeak}
                className="w-full rounded-2xl font-bold flex items-center justify-center gap-2 border-2"
                style={{
                  minHeight: '52px', fontSize: '18px',
                  backgroundColor: speaking ? '#4F46E5' : '#EEF2FF',
                  color: speaking ? 'white' : '#4F46E5',
                  borderColor: '#4F46E5',
                }}
              >
                {speaking ? <><VolumeX size={22} /> 읽기 멈추기</> : <><Volume2 size={22} /> 다시 읽어주기</>}
              </motion.button>

              {/* 다시 묻기 */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={startListening}
                className="w-full bg-gray-100 text-gray-600 font-bold rounded-2xl flex items-center justify-center gap-2"
                style={{ minHeight: '52px', fontSize: '18px' }}
              >
                <RotateCcw size={20} /> 다시 물어보기
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 닫기 버튼 (항상 맨 아래) */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleClose}
          className="w-full bg-gray-100 text-gray-600 font-semibold rounded-2xl flex items-center justify-center mt-3"
          style={{ minHeight: '52px', fontSize: '17px' }}
        >
          닫기
        </motion.button>
      </motion.div>
    </>
  );
}
