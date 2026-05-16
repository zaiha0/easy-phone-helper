import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Loader2, UserCheck, ShieldAlert, AlertCircle } from 'lucide-react';
import { checkScam } from '../lib/api';
import { getGuardian } from '../lib/storage';
import { openHelpSms } from '../lib/sms';
import ScamResultCard from '../components/ScamResultCard';
import PressableButton from '../components/PressableButton';
import HelpRequestBar from '../components/HelpRequestBar';
import type { ScamCheckResult } from '../types';

const MAX_LENGTH = 1500;

export default function ScamCheck() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const [guardianError, setGuardianError] = useState('');

  const handleCheck = async () => {
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
        >
          <p className="text-blue-800 font-semibold leading-relaxed" style={{ fontSize: '18px' }}>
            받은 문자 내용을 아래에 붙여넣기 하세요.
            위험한지 알려드릴게요.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="여기에 문자 내용을 붙여넣기 하세요..."
            className="w-full border-2 border-gray-200 focus:border-blue-400 rounded-2xl p-4
                       outline-none resize-none leading-relaxed bg-white shadow-sm transition-colors"
            style={{ fontSize: '19px', minHeight: '160px' }}
          />
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

      <HelpRequestBar aiContext="사용자가 받은 문자가 사기인지 확인하려고 해요. 문자 내용을 붙여넣는 방법이나 결과 해석에 대해 막혔을 수 있어요." />
    </div>
  );
}
