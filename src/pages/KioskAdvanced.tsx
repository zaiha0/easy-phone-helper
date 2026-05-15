import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── 데이터 ────────────────────────────────────────────────────────────────

const MENU_CATEGORIES = ['세트메뉴', '버거', '사이드', '음료'];

interface MenuItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  tag?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'bulgogi-set', name: '불고기버거 세트', price: 6500, emoji: '🍔', category: '세트메뉴', tag: '인기' },
  { id: 'chicken-set', name: '치킨버거 세트', price: 6800, emoji: '🍗', category: '세트메뉴' },
  { id: 'cheese-set', name: '치즈버거 세트', price: 6000, emoji: '🧀', category: '세트메뉴' },
  { id: 'whopper-set', name: '와퍼 세트', price: 8500, emoji: '🍔', category: '세트메뉴', tag: '베스트' },
  { id: 'bulgogi', name: '불고기버거', price: 4000, emoji: '🍔', category: '버거' },
  { id: 'chicken', name: '치킨버거', price: 4300, emoji: '🍗', category: '버거' },
  { id: 'cheese', name: '치즈버거', price: 3800, emoji: '🧀', category: '버거' },
  { id: 'whopper', name: '와퍼', price: 5800, emoji: '🍔', category: '버거' },
  { id: 'fries-r', name: '감자튀김 (R)', price: 2000, emoji: '🍟', category: '사이드' },
  { id: 'fries-l', name: '감자튀김 (L)', price: 2500, emoji: '🍟', category: '사이드' },
  { id: 'chicken-tender', name: '치킨텐더 3조각', price: 3500, emoji: '🍗', category: '사이드' },
  { id: 'cola-r', name: '콜라 (R)', price: 1500, emoji: '🥤', category: '음료' },
  { id: 'cola-l', name: '콜라 (L)', price: 2000, emoji: '🥤', category: '음료' },
  { id: 'sprite', name: '사이다 (R)', price: 1500, emoji: '🫧', category: '음료' },
];

interface BulgogiOption {
  id: string;
  name: string;
  desc: string;
  price: number;
}

const BULGOGI_OPTIONS: BulgogiOption[] = [
  { id: 'large-set', name: '불고기버거 라지세트', desc: '불고기버거+감자튀김(L)+콜라(L)', price: 7500 },
  { id: 'set', name: '불고기버거 세트', desc: '불고기버거+감자튀김(R)+콜라(R)', price: 6500 },
  { id: 'single', name: '불고기버거', desc: '단품', price: 4000 },
];

// ─── 타입 ────────────────────────────────────────────────────────────────

type Screen = 'language' | 'menu' | 'itemOptions' | 'cart' | 'payment' | 'cardInsert' | 'complete';

interface CartItem {
  name: string;
  price: number;
  qty: number;
}

// ─── 미션 설정 ───────────────────────────────────────────────────────────

const MISSION_TEXT: Record<Screen, string> = {
  language: '한국어를 선택해 보세요.',
  menu: '불고기버거 세트를 찾아 눌러보세요.',
  itemOptions: "'세트'를 선택하고 확인을 눌러보세요.",
  cart: "'결제하기' 버튼을 눌러보세요.",
  payment: "'신용카드'를 눌러보세요.",
  cardInsert: '카드 단말기에 신용카드를 꽂아 결제를 완료해 보세요.',
  complete: '주문 완료! 잘하셨어요.',
};

const PROGRESS: Record<Screen, number> = {
  language: 15,
  menu: 35,
  itemOptions: 55,
  cart: 75,
  payment: 88,
  cardInsert: 95,
  complete: 100,
};

// ─── 메인 컴포넌트 ──────────────────────────────────────────────────────

export default function KioskAdvanced() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('language');
  const [selectedCategory, setSelectedCategory] = useState('세트메뉴');
  const [selectedOption, setSelectedOption] = useState<string>('set');
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleReset = () => {
    setScreen('language');
    setSelectedCategory('세트메뉴');
    setSelectedOption('set');
    setCartItem(null);
    setToast('');
  };

  const handleBack = () => {
    const order: Screen[] = ['language', 'menu', 'itemOptions', 'cart', 'payment', 'cardInsert', 'complete'];
    const idx = order.indexOf(screen);
    if (idx > 0) {
      setScreen(order[idx - 1]);
    } else {
      navigate('/kiosk-practice');
    }
  };

  const missionText = MISSION_TEXT[screen];
  const progress = PROGRESS[screen];

  // ─── 헤더 ──────────────────────────────────────────────────────────────
  const Header = () => (
    <div style={{ backgroundColor: '#FFD400' }} className="flex items-center justify-between px-3 py-3">
      <button
        onClick={handleReset}
        style={{ backgroundColor: '#DC2626', color: 'white', fontSize: '16px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', minHeight: '44px' }}
      >
        처음화면
      </button>
      <span style={{ fontSize: '22px', fontWeight: 900 }}>더이음🐻버거</span>
      <button
        onClick={handleBack}
        style={{ backgroundColor: '#374151', color: 'white', fontSize: '16px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', minHeight: '44px' }}
      >
        이전으로
      </button>
    </div>
  );

  // ─── 미션 바 ────────────────────────────────────────────────────────────
  const MissionBar = () => (
    <div style={{ backgroundColor: '#FFD400' }} className="fixed bottom-0 left-0 right-0 z-30">
      <div className="px-4 py-3 flex items-end gap-3">
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a', flex: 1, lineHeight: 1.4 }}>
          {missionText}
        </p>
        <span style={{ fontSize: '40px' }}>🐻</span>
      </div>
      <div className="bg-gray-300 h-6 flex items-center px-3">
        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151', marginRight: '8px' }}>
          진행 {progress}%
        </span>
        <div className="flex-1 bg-white rounded-full h-3">
          <div
            className="bg-red-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );

  // ─── 토스트 ─────────────────────────────────────────────────────────────
  const Toast = () =>
    toast ? (
      <div
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white rounded-xl px-5 py-3 text-center shadow-xl"
        style={{ fontSize: '17px', fontWeight: 'bold', maxWidth: '85%' }}
      >
        {toast}
      </div>
    ) : null;

  // ─── 언어 선택 화면 ─────────────────────────────────────────────────────
  if (screen === 'language') {
    const flags = [
      { code: 'kr', emoji: '🇰🇷', label: '한국어', correct: true },
      { code: 'us', emoji: '🇺🇸', label: 'English', correct: false },
      { code: 'cn', emoji: '🇨🇳', label: '中文', correct: false },
      { code: 'jp', emoji: '🇯🇵', label: '日本語', correct: false },
    ];

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="bg-amber-400 text-center py-1.5 font-bold text-amber-900" style={{ fontSize: '14px' }}>
          연습 화면이에요 — 실제 결제되지 않아요
        </div>
        <Header />
        <div className="flex-1 flex flex-col bg-black pb-32">
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>화면을 눌러주세요</p>
            <p style={{ color: '#9CA3AF', fontSize: '14px' }}>LANGUAGE SELECTION</p>
            <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-sm">
              {flags.map((f) => (
                <button
                  key={f.code}
                  onClick={() => {
                    if (f.correct) {
                      setScreen('menu');
                    } else {
                      showToast('이 연습에서는 한국어를 선택해 보세요.');
                    }
                  }}
                  className="flex flex-col items-center justify-center gap-2 bg-gray-800 rounded-2xl border-2 border-gray-700 active:opacity-70"
                  style={{ minHeight: '100px' }}
                >
                  <span style={{ fontSize: '44px' }}>{f.emoji}</span>
                  <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 메뉴 화면 ──────────────────────────────────────────────────────────
  if (screen === 'menu') {
    const filtered = MENU_ITEMS.filter((m) => m.category === selectedCategory);

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="bg-amber-400 text-center py-1.5 font-bold text-amber-900" style={{ fontSize: '14px' }}>
          연습 화면이에요 — 실제 결제되지 않아요
        </div>
        <Header />

        {/* 카테고리 탭 */}
        <div className="flex overflow-x-auto bg-white border-b border-gray-200 shrink-0">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="shrink-0 px-5 py-3 font-bold relative"
              style={{
                fontSize: '17px',
                color: selectedCategory === cat ? '#DC2626' : '#6B7280',
                borderBottom: selectedCategory === cat ? '3px solid #DC2626' : '3px solid transparent',
                minHeight: '52px',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 메뉴 그리드 */}
        <main className="flex-1 overflow-y-auto pb-32 p-3">
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'bulgogi-set') {
                    setScreen('itemOptions');
                  } else {
                    showToast("이번 연습에서는 '불고기버거 세트'를 선택해 보세요.");
                  }
                }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col items-center gap-2 active:opacity-70 relative"
                style={{ minHeight: '140px' }}
              >
                {item.tag && (
                  <span
                    className="absolute top-2 right-2 text-white rounded-full px-2 py-0.5"
                    style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: '#DC2626' }}
                  >
                    {item.tag}
                  </span>
                )}
                <span style={{ fontSize: '44px' }}>{item.emoji}</span>
                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#DC2626' }}>
                  {item.price.toLocaleString()}원
                </span>
              </button>
            ))}
          </div>
        </main>

        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 옵션 선택 화면 ─────────────────────────────────────────────────────
  if (screen === 'itemOptions') {
    const chosen = BULGOGI_OPTIONS.find((o) => o.id === selectedOption)!;

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="bg-amber-400 text-center py-1.5 font-bold text-amber-900" style={{ fontSize: '14px' }}>
          연습 화면이에요 — 실제 결제되지 않아요
        </div>
        <Header />

        <main className="flex-1 overflow-y-auto pb-32 flex items-center justify-center p-4">
          {/* 모달 스타일 */}
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
            <div style={{ backgroundColor: '#FFD400' }} className="px-5 py-4 text-center">
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>불고기버거 세트</p>
              <p style={{ fontSize: '14px', color: '#374151' }}>옵션을 선택해 주세요</p>
            </div>

            <div className="p-4 space-y-3">
              {BULGOGI_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 active:opacity-70"
                  style={{
                    borderColor: selectedOption === opt.id ? '#DC2626' : '#E5E7EB',
                    backgroundColor: selectedOption === opt.id ? '#FFF5F5' : 'white',
                    minHeight: '80px',
                  }}
                >
                  {/* 라디오 */}
                  <div
                    className="shrink-0 rounded-full border-2 flex items-center justify-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderColor: selectedOption === opt.id ? '#DC2626' : '#9CA3AF',
                    }}
                  >
                    {selectedOption === opt.id && (
                      <div className="rounded-full bg-red-600" style={{ width: '12px', height: '12px' }} />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a1a' }}>{opt.name}</p>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>{opt.desc}</p>
                  </div>
                  <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#DC2626' }}>
                    {opt.price.toLocaleString()}원
                  </p>
                </button>
              ))}
            </div>

            <div className="px-4 pb-5">
              <button
                onClick={() => {
                  setCartItem({ name: chosen.name, price: chosen.price, qty: 1 });
                  setScreen('cart');
                }}
                className="w-full text-white rounded-2xl font-bold"
                style={{ backgroundColor: '#DC2626', minHeight: '72px', fontSize: '22px' }}
              >
                확인 ({chosen.price.toLocaleString()}원)
              </button>
            </div>
          </div>
        </main>

        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 장바구니 화면 ──────────────────────────────────────────────────────
  if (screen === 'cart') {
    const item = cartItem!;
    const total = item.price * item.qty;

    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="bg-amber-400 text-center py-1.5 font-bold text-amber-900" style={{ fontSize: '14px' }}>
          연습 화면이에요 — 실제 결제되지 않아요
        </div>
        <Header />

        <main className="flex-1 overflow-y-auto pb-32 p-4 space-y-4">
          <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a' }}>🛒 장바구니</p>

          {/* 아이템 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontSize: '19px', fontWeight: 'bold', color: '#1a1a1a' }}>{item.name}</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#DC2626' }}>
                {item.price.toLocaleString()}원
              </p>
            </div>

            {/* 수량 조절 */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setCartItem((prev) => prev ? { ...prev, qty: Math.max(1, prev.qty - 1) } : prev)}
                className="bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700 active:opacity-70"
                style={{ width: '52px', height: '52px', fontSize: '28px' }}
              >
                −
              </button>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', minWidth: '32px', textAlign: 'center' }}>
                {item.qty}
              </span>
              <button
                onClick={() => setCartItem((prev) => prev ? { ...prev, qty: Math.min(9, prev.qty + 1) } : prev)}
                className="bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700 active:opacity-70"
                style={{ width: '52px', height: '52px', fontSize: '28px' }}
              >
                +
              </button>
            </div>
          </div>

          {/* 총 금액 */}
          <div className="bg-gray-800 rounded-2xl p-4 flex items-center justify-between">
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>총 금액</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD400' }}>
              {total.toLocaleString()}원
            </span>
          </div>

          {/* 버튼 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setScreen('menu')}
              className="bg-gray-200 text-gray-700 rounded-2xl font-bold"
              style={{ minHeight: '72px', fontSize: '20px' }}
            >
              취소
            </button>
            <button
              onClick={() => setScreen('payment')}
              className="text-white rounded-2xl font-bold"
              style={{ backgroundColor: '#DC2626', minHeight: '72px', fontSize: '20px' }}
            >
              결제하기
            </button>
          </div>
        </main>

        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 결제 화면 ──────────────────────────────────────────────────────────
  if (screen === 'payment') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="bg-amber-400 text-center py-1.5 font-bold text-amber-900" style={{ fontSize: '14px' }}>
          연습 화면이에요 — 실제 결제되지 않아요
        </div>
        <Header />

        <main className="flex-1 overflow-y-auto pb-32 flex flex-col items-center justify-center p-6 gap-6">
          <div className="text-center">
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a' }}>결제 수단을 선택해 주세요</p>
            <p style={{ fontSize: '15px', color: '#6B7280', marginTop: '6px' }}>이 키오스크는 카드 결제만 가능해요</p>
          </div>

          <div className="w-full max-w-sm">
            {/* 신용카드 — 유일한 선택지 */}
            <button
              onClick={() => setScreen('cardInsert')}
              className="w-full bg-white border-4 rounded-2xl flex items-center justify-center gap-4 shadow-md active:opacity-70"
              style={{ minHeight: '120px', borderColor: '#DC2626' }}
            >
              <span style={{ fontSize: '48px' }}>💳</span>
              <div className="text-left">
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>신용카드</p>
                <p style={{ fontSize: '14px', color: '#DC2626', fontWeight: 'bold', marginTop: '2px' }}>← 이것을 누르세요</p>
              </div>
            </button>
          </div>

          <div className="w-full max-w-sm bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p style={{ fontSize: '16px', color: '#1D4ED8', fontWeight: 'bold' }}>
              💡 실제 키오스크에서도 현금 결제는 대부분 안 돼요.<br />카드를 꼭 챙겨가세요!
            </p>
          </div>
        </main>

        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 카드 투입 안내 화면 ────────────────────────────────────────────────
  if (screen === 'cardInsert') {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>
        <div className="bg-amber-400 text-center py-1.5 font-bold text-amber-900" style={{ fontSize: '14px' }}>
          연습 화면이에요 — 실제 결제되지 않아요
        </div>
        <Header />

        <main className="flex-1 overflow-y-auto pb-36 p-5 flex flex-col gap-5">
          {/* 제목 */}
          <div className="text-center">
            <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#DC2626', lineHeight: 1.3 }}>
              신용카드를
            </p>
            <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#1a1a1a', lineHeight: 1.3 }}>
              투입구에 꽂아주세요
            </p>
            <p style={{ fontSize: '15px', color: '#6B7280', marginTop: '6px' }}>
              결제 오류 시 마그네틱을 아래로 향하게 꽂으세요
            </p>
          </div>

          {/* 카드 단말기 일러스트 */}
          <div className="flex flex-col items-center gap-3">
            {/* 단말기 본체 */}
            <div
              className="flex flex-col items-center rounded-2xl shadow-lg"
              style={{ backgroundColor: '#374151', width: '160px', padding: '16px 12px 20px' }}
            >
              {/* 화면 */}
              <div
                className="w-full rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: '#1D4ED8', height: '56px' }}
              >
                <p style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', lineHeight: 1.3 }}>
                  카드를<br />꽂아주세요
                </p>
              </div>
              {/* 투입구 슬롯 */}
              <div
                className="w-full rounded-sm flex items-center justify-center mb-2"
                style={{ backgroundColor: '#111827', height: '22px' }}
              >
                <p style={{ color: '#9CA3AF', fontSize: '10px', letterSpacing: '1px' }}>▼ 투입구 ▼</p>
              </div>
              {/* 카드가 꽂히는 모습 */}
              <div
                className="rounded"
                style={{
                  width: '100px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 60%, #1E40AF 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  position: 'relative',
                  border: '2px solid #60A5FA',
                  transform: 'translateY(-8px)',
                }}
              >
                {/* 카드 칩 */}
                <div
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '10px',
                    width: '24px',
                    height: '18px',
                    backgroundColor: '#FCD34D',
                    borderRadius: '3px',
                    border: '1px solid #D97706',
                  }}
                />
                {/* 카드 번호 줄 */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '10px',
                    right: '10px',
                    height: '5px',
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    borderRadius: '2px',
                  }}
                />
              </div>
            </div>
            {/* 화살표 안내 */}
            <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>
              ↑ 단말기 투입구에 카드를 꽂으세요
            </p>
          </div>

          {/* 순서 안내 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-4">
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a' }}>카드 결제 순서</p>
            {[
              { step: '1', text: '카드 앞면이 위를 향하도록 잡으세요', sub: '긁는 면(마그네틱)이 아래를 향하게 하세요' },
              { step: '2', text: '단말기 투입구에 카드를 끝까지 꽂으세요', sub: '투입구는 키오스크 오른쪽 또는 아래쪽에 있어요' },
              { step: '3', text: '"삐" 소리가 나면 카드를 빼주세요', sub: '소리가 날 때까지 카드를 빼지 마세요' },
              { step: '4', text: '영수증 출력 여부를 선택하세요', sub: '필요 없으면 "미출력"을 누르세요' },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start">
                <div
                  className="shrink-0 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ width: '32px', height: '32px', backgroundColor: '#DC2626', fontSize: '16px' }}
                >
                  {item.step}
                </div>
                <div>
                  <p style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a1a', lineHeight: 1.3 }}>
                    {item.text}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '2px' }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 연습 완료 버튼 */}
          <button
            onClick={() => setScreen('complete')}
            className="w-full text-white rounded-2xl font-bold"
            style={{ backgroundColor: '#DC2626', minHeight: '72px', fontSize: '22px' }}
          >
            결제 완료 (연습 끝내기)
          </button>
        </main>

        <MissionBar />
        <Toast />
      </div>
    );
  }

  // ─── 완료 화면 ──────────────────────────────────────────────────────────
  // screen === 'complete'
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="bg-amber-400 text-center py-1.5 font-bold text-amber-900" style={{ fontSize: '14px' }}>
        연습 화면이에요 — 실제 결제되지 않아요
      </div>
      <Header />

      <main className="flex-1 overflow-y-auto pb-32 flex flex-col items-center justify-center p-6 gap-6 text-center">
        <div>
          <p style={{ fontSize: '64px' }}>🎉</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', marginTop: '12px' }}>
            주문 완료!
          </p>
          <p style={{ fontSize: '18px', color: '#6B7280', marginTop: '8px', lineHeight: 1.6 }}>
            주문이 완료되었어요!{'\n'}(연습이에요, 실제 결제 아님)
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={handleReset}
            className="w-full text-white rounded-2xl font-bold"
            style={{ backgroundColor: '#DC2626', minHeight: '72px', fontSize: '22px' }}
          >
            처음부터 다시하기
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-100 text-gray-700 rounded-2xl font-bold"
            style={{ minHeight: '64px', fontSize: '20px' }}
          >
            홈으로 가기
          </button>
        </div>
      </main>

      <MissionBar />
      <Toast />
    </div>
  );
}
