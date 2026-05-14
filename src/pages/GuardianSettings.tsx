import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Send, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { getGuardian, setGuardian } from '../lib/storage';
import { openHelpSms } from '../lib/sms';
import PressableButton from '../components/PressableButton';

const inputClass =
  'w-full border-2 border-gray-200 focus:border-blue-400 rounded-2xl outline-none bg-white transition-colors';

const isValidPhone = (p: string) => /^[0-9]{9,11}$/.test(p.replace(/[-\s]/g, ''));

export default function GuardianSettings() {
  const navigate = useNavigate();
  const existing = getGuardian();
  const [name, setName] = useState(existing?.name ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [relation, setRelation] = useState(existing?.relation ?? '');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [testError, setTestError] = useState('');

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      setSaveError('이름과 전화번호를 모두 입력해 주세요.');
      return;
    }
    if (!isValidPhone(phone)) {
      setSaveError('전화번호 형식이 올바르지 않아요. (예: 010-1234-5678)');
      return;
    }
    setSaveError('');
    setGuardian({ name: name.trim(), phone: phone.trim(), relation: relation.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleTest = () => {
    const guardian = getGuardian();
    if (!guardian) {
      setTestError('먼저 보호자 정보를 저장해 주세요.');
      return;
    }
    setTestError('');
    openHelpSms(guardian, '테스트');
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #eff6ff 0%, #f8f9fa 60%)' }}>
      <header className="px-4 pt-6 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-gray-500 mb-4 hover:text-gray-700 transition-colors"
          style={{ fontSize: '17px' }}
        >
          <ArrowLeft size={20} />
          홈으로
        </button>
        <div className="flex items-center gap-3">
          <Shield size={30} className="text-blue-600" />
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>보호자 설정</h1>
        </div>
      </header>

      <main className="flex-1 px-4 pb-8 space-y-5 max-w-lg mx-auto w-full">
        <p className="text-gray-500 leading-relaxed" style={{ fontSize: '17px' }}>
          도움이 필요할 때 연락할 분의 정보를 저장해 두세요.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-md p-5 space-y-4"
        >
          <div>
            <label className="block font-bold text-gray-700 mb-2" style={{ fontSize: '19px' }}>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 김영희 (딸)"
              className={inputClass}
              style={{ fontSize: '20px', minHeight: '58px', padding: '12px 16px' }}
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-2" style={{ fontSize: '19px' }}>전화번호</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="예: 010-1234-5678"
              className={inputClass}
              style={{ fontSize: '20px', minHeight: '58px', padding: '12px 16px' }}
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-2" style={{ fontSize: '19px' }}>
              관계 <span className="font-normal text-gray-400">(선택)</span>
            </label>
            <input
              type="text"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="예: 딸, 아들, 배우자"
              className={inputClass}
              style={{ fontSize: '20px', minHeight: '58px', padding: '12px 16px' }}
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {saveError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3"
            >
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-semibold" style={{ fontSize: '16px' }}>{saveError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <PressableButton
          label={saved ? '저장되었어요!' : '저장하기'}
          icon={saved ? <CheckCircle2 size={26} /> : <Save size={26} />}
          onClick={handleSave}
          variant={saved ? 'safe' : 'primary'}
          fullWidth
        />

        <AnimatePresence>
          {testError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3"
            >
              <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
              <p className="text-amber-700 font-semibold" style={{ fontSize: '16px' }}>{testError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <PressableButton
          label="테스트 문자 보내기"
          icon={<Send size={24} />}
          onClick={handleTest}
          variant="secondary"
          fullWidth
        />

        <p className="text-gray-400 text-center" style={{ fontSize: '15px' }}>
          저장된 정보는 이 기기에만 보관돼요.
        </p>
      </main>
    </div>
  );
}
