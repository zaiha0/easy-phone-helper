import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, CheckCircle2, AlertCircle, Watch } from 'lucide-react';
import HelpRequestBar from '../components/HelpRequestBar';
import { getGuardian } from '../lib/storage';
import { triggerHapticFeedback } from '../lib/haptics';

const btSupported = 'bluetooth' in (navigator as Navigator & { bluetooth?: unknown });

export default function EmergencyReady() {
  const navigate = useNavigate();
  const guardian = getGuardian();

  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [threshold, setThreshold] = useState(120);
  const [btConnected, setBtConnected] = useState(false);
  const [btConnecting, setBtConnecting] = useState(false);
  const demoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (demoMode) {
      demoIntervalRef.current = setInterval(() => {
        setHeartRate(Math.floor(Math.random() * 21) + 70); // 70~90
      }, 1500);
    } else {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current);
        demoIntervalRef.current = null;
      }
      if (!btConnected) setHeartRate(null);
    }
    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [demoMode, btConnected]);

  const handleConnectBluetooth = async () => {
    if (!btSupported) {
      alert('이 브라우저는 Bluetooth를 지원하지 않아요.\nChrome(크롬) 브라우저를 사용해 주세요.');
      return;
    }
    triggerHapticFeedback();
    setBtConnecting(true);
    try {
      const nav = navigator as Navigator & { bluetooth?: { requestDevice: (opts: unknown) => Promise<unknown> } };
      await nav.bluetooth?.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['heart_rate'],
      });
      setBtConnected(true);
    } catch {
      // 사용자가 취소하거나 실패해도 앱 멈추지 않음
    } finally {
      setBtConnecting(false);
    }
  };

  const isHeartRateDanger = heartRate !== null && heartRate > threshold;

  return (
    <div className="flex flex-col min-h-screen pb-32" style={{ backgroundColor: '#FAF7F2' }}>
      {/* 헤더 */}
      <header className="px-4 pt-4 pb-3">
        <button
          onClick={() => { triggerHapticFeedback(); navigate('/'); }}
          className="flex items-center gap-1 text-gray-500 mb-4"
          style={{ fontSize: '17px' }}
        >
          <ArrowLeft size={20} /> 홈으로
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
            <Heart size={28} color="#DC2626" />
          </div>
          <h1 className="font-extrabold text-gray-900" style={{ fontSize: '26px' }}>
            응급 도움
          </h1>
        </div>
      </header>

      <main className="flex-1 px-4 space-y-5 max-w-lg mx-auto w-full">

        {/* 섹션 1: 지금 바로 도움 요청 */}
        <section>
          <p className="font-bold text-gray-600 mb-3" style={{ fontSize: '16px' }}>지금 바로 도움 요청</p>
          <div className="space-y-3">
            {/* 119 응급신고 버튼 */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                triggerHapticFeedback();
                window.location.href = 'tel:119';
              }}
              className="w-full text-white font-extrabold rounded-3xl flex items-center justify-center gap-3 shadow-lg"
              style={{
                minHeight: '80px',
                fontSize: '24px',
                background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
              }}
            >
              🚨 119 응급신고
            </motion.button>

            {/* 보호자 전화 버튼 */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                triggerHapticFeedback();
                if (!guardian) {
                  navigate('/guardian');
                } else {
                  window.location.href = `tel:${guardian.phone}`;
                }
              }}
              className="w-full text-white font-extrabold rounded-3xl flex items-center justify-center gap-3 shadow-lg"
              style={{
                minHeight: '72px',
                fontSize: '22px',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              }}
            >
              📞 {guardian ? `${guardian.name}에게 전화` : '보호자 설정하기'}
            </motion.button>
          </div>
        </section>

        {/* 섹션 2: 응급 기능 상태 */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
          <p className="font-bold text-gray-800 mb-4" style={{ fontSize: '18px' }}>현재 응급 기능 상태</p>
          <div className="space-y-4">
            {/* 보호자 연락처 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {guardian
                  ? <CheckCircle2 size={24} color="#16A34A" />
                  : <AlertCircle size={24} color="#D97706" />
                }
                <div>
                  <p className="font-semibold text-gray-800" style={{ fontSize: '17px' }}>보호자 연락처</p>
                  {guardian && (
                    <p className="text-gray-500" style={{ fontSize: '14px' }}>{guardian.name} ({guardian.phone})</p>
                  )}
                </div>
              </div>
              {!guardian && (
                <button
                  onClick={() => { triggerHapticFeedback(); navigate('/guardian'); }}
                  className="text-blue-600 font-bold underline"
                  style={{ fontSize: '16px' }}
                >
                  설정
                </button>
              )}
            </div>

            {/* 스마트워치 연결 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Watch size={24} color={btConnected ? '#16A34A' : '#9CA3AF'} />
                <div>
                  <p className="font-semibold text-gray-800" style={{ fontSize: '17px' }}>스마트워치</p>
                  <p className="text-gray-500" style={{ fontSize: '14px' }}>
                    {btConnected ? '연결됨' : demoMode ? '데모 모드' : '연결 안됨'}
                  </p>
                </div>
              </div>
              {(btConnected || demoMode) && (
                <span
                  className="font-bold text-green-700 rounded-full px-3 py-1"
                  style={{ fontSize: '14px', backgroundColor: '#DCFCE7' }}
                >
                  준비됨
                </span>
              )}
            </div>
          </div>
        </section>

        {/* 섹션 3: 스마트워치 연동 */}
        <section className="rounded-3xl shadow-sm border p-5" style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}>
          <p className="font-bold mb-4" style={{ fontSize: '18px', color: '#4C1D95' }}>스마트워치 연동</p>

          {/* 심박수 표시 */}
          <div
            className="rounded-2xl p-5 mb-4 flex flex-col items-center justify-center"
            style={{
              backgroundColor: isHeartRateDanger ? '#FEF2F2' : '#EDE9FE',
              minHeight: '100px',
            }}
          >
            {heartRate !== null ? (
              <>
                <p
                  className="font-extrabold"
                  style={{
                    fontSize: '48px',
                    color: isHeartRateDanger ? '#DC2626' : '#6D28D9',
                    lineHeight: 1,
                  }}
                >
                  {heartRate}
                </p>
                <p
                  className="font-bold mt-1"
                  style={{ fontSize: '16px', color: isHeartRateDanger ? '#DC2626' : '#7C3AED' }}
                >
                  {isHeartRateDanger ? '⚠️ 위험 심박수!' : '💓 BPM (심박수)'}
                </p>
              </>
            ) : (
              <p className="font-semibold text-purple-400" style={{ fontSize: '18px' }}>
                심박수 측정 대기 중...
              </p>
            )}
          </div>

          {/* 위험 심박수 기준 설정 */}
          <div className="bg-white rounded-2xl p-4 mb-4">
            <p className="font-bold text-gray-700 mb-3" style={{ fontSize: '16px' }}>
              위험 심박수 기준
            </p>
            <div className="flex items-center justify-center gap-5">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  triggerHapticFeedback();
                  setThreshold(t => Math.max(90, t - 10));
                }}
                disabled={threshold <= 90}
                className="w-14 h-14 rounded-2xl font-extrabold text-white flex items-center justify-center"
                style={{
                  backgroundColor: threshold <= 90 ? '#E5E7EB' : '#7C3AED',
                  fontSize: '28px',
                  color: threshold <= 90 ? '#9CA3AF' : 'white',
                }}
              >
                −
              </motion.button>
              <div className="text-center">
                <p className="font-extrabold" style={{ fontSize: '32px', color: '#4C1D95' }}>
                  {threshold}
                </p>
                <p className="text-gray-500" style={{ fontSize: '14px' }}>BPM</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  triggerHapticFeedback();
                  setThreshold(t => Math.min(180, t + 10));
                }}
                disabled={threshold >= 180}
                className="w-14 h-14 rounded-2xl font-extrabold flex items-center justify-center"
                style={{
                  backgroundColor: threshold >= 180 ? '#E5E7EB' : '#7C3AED',
                  fontSize: '28px',
                  color: threshold >= 180 ? '#9CA3AF' : 'white',
                }}
              >
                +
              </motion.button>
            </div>
            <p className="text-center text-gray-400 mt-2" style={{ fontSize: '13px' }}>
              범위: 90 ~ 180 BPM
            </p>
          </div>

          {/* 스마트워치 연결 버튼 */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleConnectBluetooth}
            disabled={btConnecting || !btSupported}
            className="w-full text-white font-bold rounded-2xl mb-3 flex items-center justify-center gap-2"
            style={{
              minHeight: '64px',
              fontSize: '20px',
              backgroundColor: btConnected ? '#16A34A' : btConnecting ? '#6B7280' : '#6D28D9',
            }}
          >
            <Watch size={22} />
            {btConnected
              ? '✅ 연결됨'
              : btConnecting
              ? '연결 중...'
              : btSupported
              ? '스마트워치 연결하기'
              : 'Bluetooth 미지원 브라우저'}
          </motion.button>

          {/* 데모 버튼 */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              triggerHapticFeedback();
              setDemoMode(d => !d);
            }}
            className="w-full font-bold rounded-2xl mb-4 flex items-center justify-center gap-2"
            style={{
              minHeight: '56px',
              fontSize: '18px',
              backgroundColor: demoMode ? '#FEE2E2' : '#EDE9FE',
              color: demoMode ? '#DC2626' : '#6D28D9',
            }}
          >
            {demoMode ? '⏹ 데모 중지' : '▶ 데모로 미리보기'}
          </motion.button>

          {/* 지원 예정 기기 안내 */}
          <div className="bg-purple-100 rounded-2xl p-3">
            <p className="font-semibold text-purple-700 mb-1" style={{ fontSize: '14px' }}>지원 예정 기기</p>
            <p className="text-purple-600 leading-relaxed" style={{ fontSize: '13px' }}>
              갤럭시워치, 애플워치, 핏빗 등 Bluetooth 심박수 센서를 지원하는 기기와 연동 예정이에요.
            </p>
          </div>
        </section>

        {/* 섹션 4: 준비 중인 기능 */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-4">
          <p className="font-bold text-gray-800 mb-4" style={{ fontSize: '18px' }}>준비 중인 기능</p>
          <div className="space-y-4">
            {[
              { icon: '💓', title: '심박수 이상 시 자동 119 신고', desc: '위험 심박수 감지 시 자동으로 신고해요' },
              { icon: '🩺', title: '혈압 자동 측정 연동', desc: 'Bluetooth 혈압계와 연결해 수치를 저장해요' },
              { icon: '📍', title: 'GPS 위치 공유', desc: '긴급 시 보호자에게 실시간 위치를 전송해요' },
              { icon: '😴', title: '낙상 감지', desc: '스마트워치 가속도 센서로 낙상을 감지해요' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <span style={{ fontSize: '28px', lineHeight: 1.3 }}>{item.icon}</span>
                <div>
                  <p className="font-bold text-gray-700" style={{ fontSize: '16px' }}>{item.title}</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: '14px' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <HelpRequestBar aiContext="사용자가 응급 도움 및 스마트워치 연동 설정 화면에 있어요." />
    </div>
  );
}
