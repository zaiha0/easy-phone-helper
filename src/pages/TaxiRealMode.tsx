import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Car, MapPin, ShieldCheck, Send } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';
import { triggerHapticFeedback } from '../lib/haptics';
import { openKakaoTStore } from '../lib/taxiLinks';
import { getGuardian } from '../lib/storage';

const RECENT_KEY = 'deaieum_recent_destinations';
const QUICK_DESTINATIONS = ['집', '병원', '시장', '복지관', '지하철역'];

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch { return []; }
}

function saveRecent(dest: string): void {
  const prev = getRecent().filter(d => d !== dest);
  localStorage.setItem(RECENT_KEY, JSON.stringify([dest, ...prev].slice(0, 3)));
}

const realSteps = [
  { num: 1, text: '카카오T 앱을 열어요.', detail: '노란색 T 모양 아이콘을 찾아 누르세요.' },
  { num: 2, text: '"어디로 갈까요?" 칸을 눌러요.', detail: '화면 가운데 검색 칸을 누르세요.' },
  { num: 3, text: '목적지를 입력해요.', detail: '아래 "목적지 입력"칸에 먼저 써두면 도움이 돼요.' },
  { num: 4, text: '"호출하기" 버튼을 눌러요.', detail: '택시 종류 선택 후 파란 버튼을 누르세요.' },
  { num: 5, text: '기사님을 기다려요.', detail: '차량번호와 기사님 이름을 꼭 확인하세요.' },
];

const safetyChecks = [
  '지금 내가 있는 위치가 맞나요?',
  '목적지가 정확한가요?',
  '예상 요금을 확인했나요?',
  '기사님 차량번호를 눈으로 확인하세요.',
  '모르는 사람이 대신 호출해 주겠다고 하면 조심하세요.',
];

export default function TaxiRealMode() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [recentDests, setRecentDests] = useState<string[]>([]);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    setRecentDests(getRecent());
  }, []);

  const handleDestSelect = (dest: string) => {
    triggerHapticFeedback();
    setDestination(dest);
  };

  const handleOpenKakaoT = () => {
    triggerHapticFeedback();
    if (destination.trim()) saveRecent(destination.trim());
    setRecentDests(getRecent());
    openKakaoTStore();
  };

  const handleGuardianRequest = () => {
    triggerHapticFeedback();
    const guardian = getGuardian();
    if (!guardian) {
      navigate('/guardian');
      return;
    }
    const body = encodeURIComponent(
      `택시를 타야 해요. 목적지: ${destination || '(미입력)'}. 확인 부탁드려요.`
    );
    window.location.href = `sms:${guardian.phone}?body=${body}`;
  };

  const aiContext = `사용자가 실제 택시 부르기 화면에 있어요. 목적지 입력: "${destination || '없음'}". 카카오T 앱을 여는 방법과 실전 주의사항에 대해 막혔을 수 있어요.`;

  return (
    <div className="min-h-screen flex flex-col pb-52" style={{ backgroundColor: '#FAF7F2' }}>
      <header className="px-4 pt-6 pb-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-500 mb-4" style={{ fontSize: '17px' }}>
          <ArrowLeft size={20} /> 홈으로
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <Car size={28} className="text-yellow-600" />
          </div>
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>실제 택시 부르기</h1>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <p className="text-yellow-800 font-semibold leading-relaxed" style={{ fontSize: '19px' }}>
            카카오T 앱을 이용해서 택시를 부르는 방법을 안내해 드려요.
          </p>
        </motion.div>

        {/* 목적지 입력 */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <p className="font-bold text-gray-800" style={{ fontSize: '20px' }}>
            <MapPin size={20} className="inline mr-1 text-yellow-500" />
            어디로 가실 건가요?
          </p>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="목적지를 입력하세요 (예: 서울성모병원)"
            className="w-full border-2 border-gray-200 focus:border-yellow-400 rounded-2xl outline-none bg-gray-50"
            style={{ fontSize: '20px', minHeight: '58px', padding: '12px 16px' }}
          />
          {/* 빠른 선택 */}
          <div className="flex flex-wrap gap-2">
            {[...QUICK_DESTINATIONS, ...recentDests.filter(d => !QUICK_DESTINATIONS.includes(d))].slice(0, 6).map(dest => (
              <button
                key={dest}
                onClick={() => handleDestSelect(dest)}
                className={`px-4 py-2 rounded-2xl font-semibold border-2 transition-colors ${
                  destination === dest ? 'bg-yellow-400 border-yellow-400 text-white' : 'bg-white border-gray-200 text-gray-700'
                }`}
                style={{ fontSize: '18px' }}
              >
                {dest}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 단계별 가이드 */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <p className="font-bold text-gray-800 mb-3" style={{ fontSize: '20px' }}>택시 부르는 순서</p>
          <div className="space-y-3">
            {realSteps.map(step => (
              <div key={step.num} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-yellow-400 text-white font-bold rounded-full flex items-center justify-center" style={{ fontSize: '16px' }}>
                  {step.num}
                </span>
                <div>
                  <p className="font-bold text-gray-900" style={{ fontSize: '18px' }}>{step.text}</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: '15px' }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 카카오T 버튼 */}
        <PressableButton
          label="카카오T 앱 열기 / 설치"
          icon={<Car size={26} />}
          onClick={handleOpenKakaoT}
          variant="primary"
          fullWidth
        />
        <p className="text-gray-400 text-center" style={{ fontSize: '14px' }}>
          앱이 설치되어 있으면 열리고, 없으면 설치 화면으로 이동해요.
        </p>

        {/* 보호자 확인 요청 */}
        <PressableButton
          label="보호자에게 목적지 확인 요청"
          icon={<Send size={24} />}
          onClick={handleGuardianRequest}
          variant="secondary"
          fullWidth
        />

        {/* 안전 확인사항 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={22} className="text-blue-600" />
            <p className="font-bold text-blue-800" style={{ fontSize: '18px' }}>탑승 전 확인하세요</p>
          </div>
          <ul className="space-y-2">
            {safetyChecks.map((check, i) => (
              <li key={i} className="flex items-start gap-2 text-blue-700" style={{ fontSize: '16px' }}>
                <span className="flex-shrink-0 mt-0.5">✓</span>
                {check}
              </li>
            ))}
          </ul>
        </motion.div>
      </main>

      <HelpRequestBar aiContext={aiContext} />
    </div>
  );
}
