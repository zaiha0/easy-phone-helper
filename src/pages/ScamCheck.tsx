import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Loader2, UserCheck, ShieldAlert, AlertCircle, Mic, MicOff, Trash2 } from 'lucide-react';
import { checkScam } from '../lib/api';
import { getGuardian } from '../lib/storage';
import { openHelpSms } from '../lib/sms';
import ScamResultCard from '../components/ScamResultCard';
import PressableButton from '../components/PressableButton';
import HelpRequestBar from '../components/HelpRequestBar';
import type { ScamCheckResult } from '../types';

const MAX_LENGTH = 1500;

interface SRResult { transcript: string; }
interface SRResultList { length: number; [index: number]: { 0: SRResult } }
interface SREvent { results: SRResultList }
interface SR {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SREvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
interface SRConstructor { new(): SR }

declare global {
  interface Window {
    SpeechRecognition: SRConstructor | undefined;
    webkitSpeechRecognition: SRConstructor | undefined;
  }
}

export default function ScamCheck() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const [guardianError, setGuardianError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<SR | null>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    setVoiceSupported(!!SR);
  }, []);

  const startListening = () => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = 'ko-KR';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onresult = (e: SREvent) => {
      const parts: string[] = [];
      for (let i = 0; i < e.results.length; i++) parts.push(e.results[i][0].transcript);
      const transcript = parts.join('');
      setMessage((prev) => (prev + ' ' + transcript).trimStart().slice(0, MAX_LENGTH));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleVoiceToggle = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const handleCheck = async () => {
    if (isListening) stopListening();
    const trimmed = message.trim();
    if (!trimmed) return;
    setLoading(true);
    setResult(null);
    const res = await checkScam(trimmed);
    setResult(res);
    setLoading(false);
  };

  const handleAskGuardian = () => {
    const guardian = getGuardian();
    if (!guardian) {
      setGuardianError('보호자 연락처가 없어요. 설정에서 먼저 저장해 주세요.');
      return;
    }
    setGuardianError('');
    openHelpSms(guardian, '사기 문자 확인');
  };

  return (
    <div className="min-h-screen flex flex-col pb-52" style={{ background: 'linear-gradient(160deg, #fef2f2 0%, #f8f9fa 60%)' }}>
      <header className="px-4 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-gray-500 mb-4 hover:text-gray-700 transition-colors"
            style={{ fontSize: '17px' }}
          >
            <ArrowLeft size={20} />
            홈으로
          </button>
          <div className="flex items-center gap-3">
            <ShieldAlert size={32} className="text-red-500" />
            <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>
              사기 문자 확인
            </h1>
          </div>
        </motion.div>
      </header>

      <main className="flex-1 px-4 pb-8 space-y-5 max-w-lg mx-auto w-full">
        {/* 안내 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
        >
          <p className="text-blue-800 font-semibold leading-relaxed" style={{ fontSize: '18px' }}>
            받은 문자 내용을 알려주세요.<br />
            <span className="text-blue-600">말로 불러주시거나 직접 입력</span>하셔도 됩니다.
          </p>
        </motion.div>

        {/* 음성 입력 버튼 (지원 기기에서만) */}
        {voiceSupported && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleVoiceToggle}
              className="w-full rounded-2xl flex items-center justify-center gap-3 font-bold shadow-md"
              style={{
                minHeight: '72px',
                fontSize: '20px',
                background: isListening
                  ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
                  : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                color: 'white',
              }}
              aria-label={isListening ? '음성 입력 중지' : '음성으로 말하기'}
            >
              {isListening ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <MicOff size={28} />
                  </motion.div>
                  듣고 있어요... 탭해서 중지
                </>
              ) : (
                <>
                  <Mic size={28} />
                  🎤 말로 불러주세요
                </>
              )}
            </motion.button>
            {isListening && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-red-600 font-semibold mt-2"
                style={{ fontSize: '16px' }}
              >
                문자 내용을 천천히 말씀해 주세요
              </motion.p>
            )}
          </motion.div>
        )}

        {/* 텍스트 입력 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
              placeholder={voiceSupported
                ? '위 버튼을 눌러 말씀하시거나, 여기에 직접 입력하세요...'
                : '여기에 문자 내용을 입력하세요...'}
              className="w-full border-2 border-gray-200 focus:border-blue-400 rounded-2xl p-4
                         outline-none resize-none leading-relaxed bg-white shadow-sm transition-colors"
              style={{ fontSize: '19px', minHeight: '140px', paddingRight: message ? '52px' : '16px' }}
            />
            {message.length > 0 && (
              <button
                onClick={() => { setMessage(''); setResult(null); }}
                className="absolute top-3 right-3 p-2 rounded-xl bg-gray-100 text-gray-500"
                aria-label="입력 지우기"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
          <p className="text-right text-gray-400 mt-1" style={{ fontSize: '15px' }}>
            {message.length} / {MAX_LENGTH}자
          </p>
        </motion.div>

        <PressableButton
          label={loading ? '확인 중이에요...' : '확인하기'}
          icon={loading ? <Loader2 size={26} className="animate-spin" /> : <Search size={26} />}
          onClick={handleCheck}
          variant="primary"
          disabled={loading || message.trim().length === 0}
          fullWidth
        />

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-md p-8 flex flex-col items-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={48} className="text-blue-500" />
              </motion.div>
              <p className="text-gray-600 font-semibold text-center" style={{ fontSize: '19px' }}>
                분석 중이에요.
                <br />잠깐만 기다려 주세요...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <ScamResultCard result={result} />
              <PressableButton
                label="보호자에게 확인 요청하기"
                icon={<UserCheck size={26} />}
                onClick={handleAskGuardian}
                variant="warning"
                fullWidth
              />
              <AnimatePresence>
                {guardianError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3"
                  >
                    <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
                    <p className="text-amber-700 font-semibold" style={{ fontSize: '16px' }}>{guardianError}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white/70 border border-gray-200 rounded-2xl p-4">
          <p className="font-bold text-gray-700 mb-2" style={{ fontSize: '18px' }}>주의하세요</p>
          <ul className="space-y-1 text-gray-600" style={{ fontSize: '16px' }}>
            <li>· 개인정보(주민번호, 비밀번호)는 입력하지 마세요.</li>
            <li>· 결과는 참고용이에요. 확실하지 않으면 보호자에게 물어보세요.</li>
          </ul>
        </div>
      </main>

      <HelpRequestBar aiContext="사용자가 받은 문자가 사기인지 확인하려고 해요. 문자 내용을 말로 입력하거나 붙여넣는 방법, 결과 해석에 대해 막혔을 수 있어요." />
    </div>
  );
}
