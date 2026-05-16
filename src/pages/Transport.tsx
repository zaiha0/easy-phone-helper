import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bus, MapPin, Navigation, ExternalLink, Send, AlertCircle } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import PressableButton from '../components/PressableButton';
import { triggerHapticFeedback } from '../lib/haptics';
import { naverMapFallback, naverMapTransit, naverMapBusStop, kakaoMapSearch, kakaoMapTransit } from '../lib/mapLinks';
import { getGuardian } from '../lib/storage';

interface GeoState {
  lat?: number;
  lng?: number;
  error?: string;
  loading?: boolean;
}

const QUICK_PLACES = ['집', '병원', '시장', '복지관', '지하철역', '약국'];

export default function Transport() {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [destination, setDestination] = useState('');
  const [geo, setGeo] = useState<GeoState>({});

  const handleGetLocation = () => {
    triggerHapticFeedback();
    setGeo({ loading: true });
    if (!navigator.geolocation) {
      setGeo({ error: '이 기기는 위치 기능을 지원하지 않아요.' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setGeo({ error: '위치를 가져오지 못했어요. 그래도 목적지 검색은 할 수 있어요.' })
    );
  };

  const openNaver = () => {
    triggerHapticFeedback();
    const dest = destination.trim();
    const url = dest
      ? naverMapTransit(dest, geo.lat, geo.lng)
      : naverMapFallback('길찾기');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openKakao = () => {
    triggerHapticFeedback();
    const dest = destination.trim();
    const url = dest
      ? kakaoMapTransit(dest, geo.lat, geo.lng)
      : kakaoMapSearch('길찾기');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openBusStop = () => {
    triggerHapticFeedback();
    window.open(naverMapBusStop(geo.lat, geo.lng), '_blank', 'noopener,noreferrer');
  };

  const handleGuardianRequest = () => {
    triggerHapticFeedback();
    const guardian = getGuardian();
    if (!guardian) { navigate('/guardian'); return; }
    const geoText = geo.lat ? `(위치 확인됨)` : '(위치 미확인)';
    const body = encodeURIComponent(`어디로 가야 할지 확인이 필요해요. 목적지: ${destination || '미입력'} ${geoText}. 길찾기를 도와주세요.`);
    window.location.href = `sms:${guardian.phone}?body=${body}`;
  };

  const hasGeo = !!(geo.lat && geo.lng);
  const aiContext = `사용자가 버스/지하철 길찾기 화면에 있어요. 목적지: "${destination || '없음'}". 현재 위치: ${hasGeo ? '확인됨' : '미확인'}. 네이버지도 또는 카카오맵 버튼을 누르는 방법에 대해 막혔을 수 있어요.`;

  return (
    <div className="min-h-screen flex flex-col pb-52" style={{ backgroundColor: '#FAF7F2' }}>
      <header className="px-4 pt-6 pb-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-1 text-gray-500 mb-4" style={{ fontSize: '17px' }}>
          <ArrowLeft size={20} /> 홈으로
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
            <Bus size={28} className="text-green-600" />
          </div>
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>버스/지하철 길찾기</h1>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-4 max-w-lg mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-green-800 font-semibold leading-relaxed" style={{ fontSize: '19px' }}>
            목적지를 입력하면 지도 앱에서 버스·지하철 길을 찾아드려요.
          </p>
        </motion.div>

        {/* 내 위치 */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation size={20} className="text-green-600" />
              <p className="font-bold text-gray-800" style={{ fontSize: '19px' }}>내 위치</p>
            </div>
            {hasGeo && <span className="text-green-600 font-semibold" style={{ fontSize: '15px' }}>✓ 확인됨</span>}
          </div>

          {geo.loading && <p className="text-gray-500" style={{ fontSize: '17px' }}>위치를 가져오는 중이에요...</p>}

          <AnimatePresence>
            {geo.error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-3">
                <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700" style={{ fontSize: '16px' }}>{geo.error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!hasGeo && !geo.loading && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleGetLocation}
              className="w-full bg-green-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
              style={{ minHeight: '64px', fontSize: '20px' }}
            >
              <Navigation size={22} /> 내 위치 사용하기
            </motion.button>
          )}
          {hasGeo && (
            <p className="text-gray-500" style={{ fontSize: '16px' }}>현재 위치를 기준으로 길찾기를 할 수 있어요.</p>
          )}
        </motion.div>

        {/* 목적지 입력 */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 space-y-3">
          <p className="font-bold text-gray-800" style={{ fontSize: '19px' }}>
            <MapPin size={18} className="inline mr-1 text-green-500" />
            어디로 가고 싶으세요?
          </p>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder="예: 서울역, 강남구청, 이마트"
            className="w-full border-2 border-gray-200 focus:border-green-400 rounded-2xl outline-none bg-gray-50"
            style={{ fontSize: '20px', minHeight: '58px', padding: '12px 16px' }}
          />
          <div className="flex flex-wrap gap-2">
            {QUICK_PLACES.map(place => (
              <button
                key={place}
                onClick={() => { triggerHapticFeedback(); setDestination(place); }}
                className={`px-4 py-2 rounded-2xl font-semibold border-2 transition-colors ${
                  destination === place ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-700'
                }`}
                style={{ fontSize: '18px' }}
              >
                {place}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 지도 버튼들 */}
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={openNaver}
            className="w-full bg-green-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 shadow-md"
            style={{ minHeight: '72px', fontSize: '22px' }}
          >
            <ExternalLink size={24} /> 네이버지도에서 길찾기
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={openKakao}
            className="w-full font-extrabold rounded-2xl flex items-center justify-center gap-3 shadow-md text-gray-900"
            style={{ minHeight: '72px', fontSize: '22px', backgroundColor: '#FEE500' }}
          >
            <ExternalLink size={24} /> 카카오맵에서 길찾기
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={openBusStop}
            className="w-full bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md"
            style={{ minHeight: '64px', fontSize: '20px' }}
          >
            <Bus size={22} /> 가까운 버스정류장 찾기
          </motion.button>
        </div>

        <PressableButton
          label="보호자에게 길 확인 요청"
          icon={<Send size={24} />}
          onClick={handleGuardianRequest}
          variant="secondary"
          fullWidth
        />
      </main>

      <HelpRequestBar aiContext={aiContext} />
    </div>
  );
}
