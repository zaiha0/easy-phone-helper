// Galaxy One UI 스타일 미니 폰 화면 목업 컴포넌트

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '86px',
        height: '155px',
        border: '3px solid #1a1a1a',
        borderRadius: '14px',
        overflow: 'hidden',
        backgroundColor: '#000',
        flexShrink: 0,
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      {/* 상단 노치 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '18px',
          height: '5px',
          backgroundColor: '#000',
          borderRadius: '0 0 5px 5px',
          zIndex: 10,
        }}
      />
      {children}
    </div>
  );
}

// ── 홈 화면 ─────────────────────────────────────────────────────────
function HomeScreenBase({
  highlightColor,
  highlightEmoji,
  highlightPos,
}: {
  highlightColor: string;
  highlightEmoji: string;
  highlightPos: number; // 0~8
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #1B3D8A 0%, #2E6DD4 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 상태바 */}
      <div
        style={{
          height: '14px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          gap: '2px',
        }}
      >
        <span style={{ color: 'white', fontSize: '5px', fontWeight: 'bold' }}>9:41</span>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          <div style={{ width: '5px', height: '3px', backgroundColor: 'white', borderRadius: '1px', opacity: 0.8 }} />
          <div style={{ width: '6px', height: '4px', border: '1px solid white', borderRadius: '1px', opacity: 0.7, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1px', top: '1px', width: '3px', height: '2px', backgroundColor: 'white' }} />
          </div>
        </div>
      </div>

      {/* 앱 그리드 */}
      <div
        style={{
          flex: 1,
          padding: '4px 6px 2px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          alignContent: 'start',
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const isHighlight = i === highlightPos;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  backgroundColor: isHighlight ? highlightColor : 'rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  boxShadow: isHighlight ? `0 0 10px ${highlightColor}99, 0 0 0 2px white` : 'none',
                  transform: isHighlight ? 'scale(1.12)' : 'scale(1)',
                }}
              >
                {isHighlight ? highlightEmoji : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* 독 */}
      <div
        style={{
          height: '34px',
          backgroundColor: 'rgba(255,255,255,0.12)',
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          padding: '0 10px',
        }}
      >
        {['📞', '💬', '📷', '🌐'].map((e, i) => (
          <div
            key={i}
            style={{
              width: '22px',
              height: '22px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
            }}
          >
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 전화 다이얼러 ────────────────────────────────────────────────────
function DialerScreen({ highlightCall = false }: { highlightCall?: boolean }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 상태바 */}
      <div style={{ height: '12px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', padding: '0 6px' }}>
        <span style={{ fontSize: '5px', color: '#333' }}>9:41</span>
      </div>
      {/* 번호 표시 */}
      <div
        style={{
          padding: '6px 8px 4px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '9px',
          color: '#1a1a1a',
          letterSpacing: '1px',
          minHeight: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {highlightCall ? '010-1234-5678' : '번호를 눌러요'}
      </div>
      {/* 키패드 */}
      <div
        style={{
          flex: 1,
          padding: '2px 6px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3px',
        }}
      >
        {keys.map((k) => (
          <div
            key={k}
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              aspectRatio: '1',
            }}
          >
            {k}
          </div>
        ))}
      </div>
      {/* 통화 버튼 */}
      <div
        style={{
          padding: '4px 0 8px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#34C759',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            boxShadow: highlightCall ? '0 0 10px #34C75980, 0 0 0 3px #34C75940' : '0 2px 6px rgba(52,199,89,0.4)',
            transform: highlightCall ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          📞
        </div>
      </div>
    </div>
  );
}

// ── 문자 목록 ────────────────────────────────────────────────────────
function MessageListScreen({ highlightRow = 0 }: { highlightRow?: number }) {
  const rows = [
    { name: '엄마', preview: '밥은 먹었어?', time: '오전 9:20' },
    { name: '010-5678-9012', preview: '[Web발신] 택배가 도착했...', time: '어제' },
    { name: '병원', preview: '예약일정 안내드립니다', time: '월요일' },
  ];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* 상태바 */}
      <div style={{ height: '12px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', padding: '0 6px' }}>
        <span style={{ fontSize: '5px', color: '#333' }}>9:41</span>
      </div>
      {/* 헤더 */}
      <div style={{ padding: '5px 8px 3px', borderBottom: '1px solid #eee' }}>
        <p style={{ fontSize: '8px', fontWeight: 'bold', color: '#1a1a1a' }}>메시지</p>
      </div>
      {/* 목록 */}
      <div style={{ flex: 1, overflowY: 'hidden' }}>
        {rows.map((row, i) => (
          <div
            key={i}
            style={{
              padding: '5px 8px',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: i === highlightRow ? '#EEF4FF' : 'white',
              display: 'flex',
              gap: '5px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: i === 0 ? '#34C759' : i === 1 ? '#8E8E93' : '#2563EB',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '7px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {row.name[0]}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '6px', fontWeight: 'bold', color: '#1a1a1a' }}>{row.name}</p>
              <p style={{ fontSize: '5px', color: '#8E8E93', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.preview}</p>
            </div>
            <p style={{ fontSize: '4px', color: '#8E8E93', flexShrink: 0 }}>{row.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 사기 문자 경고 ───────────────────────────────────────────────────
function ScamMessageScreen() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '12px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', padding: '0 6px' }}>
        <span style={{ fontSize: '5px', color: '#333' }}>9:41</span>
      </div>
      <div style={{ padding: '4px 8px 3px', borderBottom: '1px solid #eee', display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{ fontSize: '7px' }}>←</span>
        <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#1a1a1a' }}>010-9999-0000</p>
      </div>
      <div style={{ flex: 1, padding: '6px 6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* 수신 버블 */}
        <div
          style={{
            alignSelf: 'flex-start',
            backgroundColor: '#F2F2F7',
            borderRadius: '10px 10px 10px 2px',
            padding: '4px 6px',
            maxWidth: '80%',
          }}
        >
          <p style={{ fontSize: '5px', color: '#1a1a1a', lineHeight: 1.5 }}>
            [국민은행] 보안 업데이트<br />
            <span style={{ color: '#007AFF', textDecoration: 'underline' }}>http://bit.ly/bank-up</span>
          </p>
        </div>
        {/* 경고 배너 */}
        <div
          style={{
            backgroundColor: '#FFF3CD',
            border: '1px solid #FFC107',
            borderRadius: '6px',
            padding: '3px 5px',
            display: 'flex',
            gap: '3px',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '8px' }}>⚠️</span>
          <p style={{ fontSize: '4.5px', color: '#856404', lineHeight: 1.4 }}>
            스팸/사기 의심 번호<br />링크를 누르지 마세요!
          </p>
        </div>
      </div>
    </div>
  );
}

// ── 갤러리 그리드 ────────────────────────────────────────────────────
function GalleryGridScreen({ highlightOne = false }: { highlightOne?: boolean }) {
  const colors = ['#7EC8A4', '#F4A261', '#6B9BD2', '#E76F51', '#52B788', '#FFB4A2'];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '12px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', padding: '0 6px' }}>
        <span style={{ fontSize: '5px', color: '#333' }}>9:41</span>
      </div>
      <div style={{ padding: '4px 6px 2px', borderBottom: '1px solid #eee' }}>
        <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#1a1a1a' }}>갤러리</p>
      </div>
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          backgroundColor: '#ccc',
          overflow: 'hidden',
        }}
      >
        {colors.map((color, i) => (
          <div
            key={i}
            style={{
              backgroundColor: color,
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: (highlightOne && i === 1) ? 'inset 0 0 0 2px white' : 'none',
            }}
          >
            {highlightOne && i === 1 && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: '10px' }}>👆</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 사진 확대 (핀치 제스처) ──────────────────────────────────────────
function PhotoZoomScreen() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* 사진 */}
      <div style={{ width: '72px', height: '90px', backgroundColor: '#7EC8A4', borderRadius: '4px' }} />
      {/* 핀치 제스처 표시 */}
      <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '8px' }}>👆</span>
          </div>
          <span style={{ fontSize: '8px', color: 'white' }}>←</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '8px' }}>👆</span>
          </div>
          <span style={{ fontSize: '8px', color: 'white' }}>→</span>
        </div>
      </div>
      {/* 텍스트 */}
      <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, textAlign: 'center' }}>
        <p style={{ fontSize: '5px', color: 'rgba(255,255,255,0.7)' }}>두 손가락으로 벌리기</p>
      </div>
    </div>
  );
}

// ── 뒤로가기 화면 ────────────────────────────────────────────────────
function PhotoBackScreen() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* 상단 바 */}
      <div style={{ height: '22px', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', padding: '0 6px', gap: '4px', zIndex: 2 }}>
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#34C759',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
          }}
        >
          ←
        </div>
        <span style={{ fontSize: '6px', color: 'white' }}>뒤로 가기</span>
      </div>
      {/* 사진 */}
      <div style={{ flex: 1, backgroundColor: '#6B9BD2' }} />
    </div>
  );
}

// ── 공개 exports ─────────────────────────────────────────────────────

// ── 제스처 목업들 ─────────────────────────────────────────────────────

function GestureTapScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #1B3D8A 0%, #2E6DD4 100%)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '14px', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
        <span style={{ color: 'white', fontSize: '5px', fontWeight: 'bold' }}>9:41</span>
      </div>
      <div style={{ flex: 1, padding: '8px 6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', alignContent: 'start' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '26px', height: '26px', backgroundColor: i === 4 ? '#34C759' : 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
              {i === 4 ? '📞' : ''}
            </div>
            {i === 4 && (
              <div style={{ position: 'absolute', bottom: '-6px', right: '-2px', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.85)', border: '2px solid #FFD400', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>
                👆
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ margin: '0 8px 10px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '4px 6px', textAlign: 'center' }}>
        <p style={{ fontSize: '5px', color: 'white', fontWeight: 'bold' }}>가볍게 한 번 눌러요</p>
      </div>
    </div>
  );
}

function GestureScrollScreen() {
  const rows = ['엄마', '병원', '은행', '친구'];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '12px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', padding: '0 6px' }}>
        <span style={{ fontSize: '5px', color: '#333' }}>9:41</span>
      </div>
      <div style={{ padding: '4px 8px 2px', borderBottom: '1px solid #eee' }}>
        <p style={{ fontSize: '7px', fontWeight: 'bold' }}>메시지</p>
      </div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {rows.map((name, i) => (
          <div key={i} style={{ padding: '5px 8px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '5px', alignItems: 'center' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#6C63FF', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6px', color: 'white' }}>{name[0]}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '6px', fontWeight: 'bold', color: '#1a1a1a' }}>{name}</p>
              <p style={{ fontSize: '4.5px', color: '#8E8E93' }}>안녕하세요...</p>
            </div>
          </div>
        ))}
        {/* 스크롤 손가락 */}
        <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '6px', color: '#6C63FF', fontWeight: 'bold' }}>↑</span>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'rgba(108,99,255,0.2)', border: '1.5px solid #6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px' }}>👆</div>
        </div>
      </div>
    </div>
  );
}

function GestureLongPressScreen() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #1B3D8A 0%, #2E6DD4 100%)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '14px', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
        <span style={{ color: 'white', fontSize: '5px', fontWeight: 'bold' }}>9:41</span>
      </div>
      <div style={{ flex: 1, padding: '8px 6px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', alignContent: 'start', position: 'relative' }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '26px', height: '26px', backgroundColor: i === 1 ? '#FF9F0A' : 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {i === 1 ? '📸' : ''}
            </div>
          </div>
        ))}
        {/* 길게 누르기 메뉴 팝업 */}
        <div style={{ position: 'absolute', top: '30px', left: '28px', backgroundColor: 'white', borderRadius: '6px', padding: '3px 6px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', zIndex: 2 }}>
          <p style={{ fontSize: '5px', color: '#1a1a1a', borderBottom: '1px solid #eee', paddingBottom: '2px', marginBottom: '2px' }}>삭제</p>
          <p style={{ fontSize: '5px', color: '#1a1a1a' }}>이동</p>
        </div>
        <div style={{ position: 'absolute', top: '22px', left: '32px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)', border: '1.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', zIndex: 3 }}>
          👆
        </div>
      </div>
      <div style={{ margin: '0 8px 10px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', padding: '4px 6px', textAlign: 'center' }}>
        <p style={{ fontSize: '5px', color: 'white', fontWeight: 'bold' }}>꾹 누르면 메뉴가 나와요</p>
      </div>
    </div>
  );
}

function GestureBackScreen() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '12px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', padding: '0 6px' }}>
        <span style={{ fontSize: '5px', color: '#333' }}>9:41</span>
      </div>
      <div style={{ padding: '5px 8px 3px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white', fontWeight: 'bold', flexShrink: 0 }}>←</div>
        <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#3B82F6' }}>뒤로 가기</p>
      </div>
      <div style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }} />
        <div style={{ height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', width: '80%' }} />
        <div style={{ height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', width: '60%' }} />
      </div>
      <div style={{ padding: '4px 8px 8px', textAlign: 'center' }}>
        <p style={{ fontSize: '5px', color: '#6B7280' }}>← 버튼을 눌러 이전 화면으로</p>
      </div>
    </div>
  );
}

export function GestureTapMockup() {
  return <PhoneFrame><GestureTapScreen /></PhoneFrame>;
}
export function GestureScrollMockup() {
  return <PhoneFrame><GestureScrollScreen /></PhoneFrame>;
}
export function GestureLongPressMockup() {
  return <PhoneFrame><GestureLongPressScreen /></PhoneFrame>;
}
export function GestureBackMockup() {
  return <PhoneFrame><GestureBackScreen /></PhoneFrame>;
}

// ── 공개 exports ─────────────────────────────────────────────────────

export function PhoneHomeScreenMockup() {
  return <PhoneFrame><HomeScreenBase highlightColor="#34C759" highlightEmoji="📞" highlightPos={0} /></PhoneFrame>;
}

export function DialerMockup() {
  return <PhoneFrame><DialerScreen /></PhoneFrame>;
}

export function CallButtonMockup() {
  return <PhoneFrame><DialerScreen highlightCall /></PhoneFrame>;
}

export function MessageHomeScreenMockup() {
  return <PhoneFrame><HomeScreenBase highlightColor="#6C63FF" highlightEmoji="💬" highlightPos={1} /></PhoneFrame>;
}

export function MessageListMockup() {
  return <PhoneFrame><MessageListScreen highlightRow={0} /></PhoneFrame>;
}

export function ScamWarningMockup() {
  return <PhoneFrame><ScamMessageScreen /></PhoneFrame>;
}

export function GalleryHomeScreenMockup() {
  return <PhoneFrame><HomeScreenBase highlightColor="#FF9F0A" highlightEmoji="🖼️" highlightPos={3} /></PhoneFrame>;
}

export function GalleryGridMockup() {
  return <PhoneFrame><GalleryGridScreen /></PhoneFrame>;
}

export function GalleryHighlightMockup() {
  return <PhoneFrame><GalleryGridScreen highlightOne /></PhoneFrame>;
}

export function PhotoZoomMockup() {
  return <PhoneFrame><PhotoZoomScreen /></PhoneFrame>;
}

export function PhotoBackMockup() {
  return <PhoneFrame><PhotoBackScreen /></PhoneFrame>;
}

// ── iPhone 스타일 프레임 ─────────────────────────────────────────────
function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '86px',
        height: '155px',
        border: '3px solid #C8C8C8',
        borderRadius: '18px',
        overflow: 'hidden',
        backgroundColor: '#000',
        flexShrink: 0,
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '22px',
          height: '6px',
          backgroundColor: '#000',
          borderRadius: '4px',
          zIndex: 10,
        }}
      />
      {children}
    </div>
  );
}

function IPhoneHomeScreen({ highlightIdx }: { highlightIdx: number }) {
  const apps = [
    { emoji: '📞', color: '#34C759' },  // 0 Phone
    { emoji: '💬', color: '#34C759' },  // 1 Messages
    { emoji: '🗺️', color: '#3B82F6' },  // 2 Maps
    { emoji: '🖼️', color: '#E91E63' },  // 3 Photos
    { emoji: '📷', color: '#8E8E93' },  // 4 Camera
    { emoji: '⚙️', color: '#8E8E93' },  // 5 Settings
    { emoji: '🎵', color: '#FC3C44' },  // 6 Music
    { emoji: '📅', color: '#FF3B30' },  // 7 Calendar
    { emoji: '🌤️', color: '#3B82F6' },  // 8 Weather
  ];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ height: '16px', display: 'flex', alignItems: 'flex-end', padding: '0 8px 2px', justifyContent: 'space-between' }}>
        <span style={{ color: 'white', fontSize: '5px', fontWeight: 'bold' }}>9:41</span>
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          <div style={{ width: '5px', height: '3px', backgroundColor: 'white', borderRadius: '1px', opacity: 0.8 }} />
          <div style={{ width: '6px', height: '4px', border: '1px solid white', borderRadius: '1px', opacity: 0.7, position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1px', top: '1px', width: '3px', height: '2px', backgroundColor: 'white' }} />
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '4px 8px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', alignContent: 'start' }}>
        {apps.map((app, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '7px',
                backgroundColor: i === highlightIdx ? app.color : 'rgba(255,255,255,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                boxShadow: i === highlightIdx ? `0 0 10px ${app.color}99, 0 0 0 2px white` : 'none',
                transform: i === highlightIdx ? 'scale(1.15)' : 'scale(1)',
              }}
            >
              {i === highlightIdx ? app.emoji : ''}
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: '30px', margin: '0 6px 6px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', padding: '0 4px' }}>
        {['📞', '💬', '🌐', '📷'].map((e, i) => (
          <div key={i} style={{ width: '20px', height: '20px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>{e}</div>
        ))}
      </div>
    </div>
  );
}

function IPhoneDialerScreen({ highlightCall = false }: { highlightCall?: boolean }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '14px', backgroundColor: '#f8f8f8', display: 'flex', alignItems: 'center', padding: '0 6px' }}>
        <span style={{ fontSize: '5px', color: '#333', fontWeight: 'bold' }}>9:41</span>
      </div>
      <div style={{ padding: '4px 8px 2px', textAlign: 'center', fontSize: '9px', fontWeight: 'bold', color: '#1a1a1a', minHeight: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {highlightCall ? '010-1234-5678' : '전화 키패드'}
      </div>
      <div style={{ flex: 1, padding: '2px 8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
        {keys.map((k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: '#1a1a1a', backgroundColor: '#F2F2F7', borderRadius: '50%', aspectRatio: '1' }}>
            {k}
          </div>
        ))}
      </div>
      <div style={{ padding: '3px 0 6px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#34C759', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', boxShadow: highlightCall ? '0 0 10px #34C75980, 0 0 0 3px #34C75940' : '0 2px 6px rgba(52,199,89,0.4)', transform: highlightCall ? 'scale(1.15)' : 'scale(1)' }}>📞</div>
      </div>
    </div>
  );
}

function IPhoneMessagesScreen() {
  const rows = [
    { name: '엄마', preview: '밥은 먹었어?', color: '#34C759' },
    { name: '010-5678-9012', preview: '[광고] 대출 관련 안내', color: '#8E8E93' },
    { name: '병원', preview: '예약일정 안내드립니다', color: '#2563EB' },
  ];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '14px', backgroundColor: '#f8f8f8', display: 'flex', alignItems: 'center', padding: '0 6px' }}>
        <span style={{ fontSize: '5px', color: '#333', fontWeight: 'bold' }}>9:41</span>
      </div>
      <div style={{ padding: '4px 8px 3px', borderBottom: '0.5px solid #C6C6C8' }}>
        <p style={{ fontSize: '8px', fontWeight: 'bold', color: '#1a1a1a' }}>메시지</p>
      </div>
      <div style={{ flex: 1 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ padding: '5px 8px', borderBottom: '0.5px solid #F2F2F7', display: 'flex', gap: '4px', alignItems: 'center', backgroundColor: i === 0 ? '#F0F9FF' : 'white' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: row.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: 'white', fontWeight: 'bold' }}>{row.name[0]}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ fontSize: '6px', fontWeight: 'bold', color: '#1a1a1a' }}>{row.name}</p>
              <p style={{ fontSize: '5px', color: '#8E8E93', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IPhonePhotosScreen({ highlightOne = false }: { highlightOne?: boolean }) {
  const colors = ['#7EC8A4', '#F4A261', '#6B9BD2', '#E76F51', '#52B788', '#FFB4A2'];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '14px', backgroundColor: '#f8f8f8', display: 'flex', alignItems: 'center', padding: '0 6px' }}>
        <span style={{ fontSize: '5px', color: '#333', fontWeight: 'bold' }}>9:41</span>
      </div>
      <div style={{ padding: '3px 6px 2px', borderBottom: '0.5px solid #C6C6C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#1a1a1a' }}>사진</p>
        <p style={{ fontSize: '5px', color: '#007AFF' }}>선택</p>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#ccc', overflow: 'hidden' }}>
        {colors.map((color, i) => (
          <div key={i} style={{ backgroundColor: color, aspectRatio: '1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: (highlightOne && i === 1) ? 'inset 0 0 0 2px white' : 'none' }}>
            {highlightOne && i === 1 && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px' }}>👆</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// iPhone export mockups
export function IPhonePhoneHomeMockup() {
  return <IPhoneFrame><IPhoneHomeScreen highlightIdx={0} /></IPhoneFrame>;
}
export function IPhoneDialerMockup() {
  return <IPhoneFrame><IPhoneDialerScreen /></IPhoneFrame>;
}
export function IPhoneCallButtonMockup() {
  return <IPhoneFrame><IPhoneDialerScreen highlightCall /></IPhoneFrame>;
}
export function IPhoneMessageHomeMockup() {
  return <IPhoneFrame><IPhoneHomeScreen highlightIdx={1} /></IPhoneFrame>;
}
export function IPhoneMessageListMockup() {
  return <IPhoneFrame><IPhoneMessagesScreen /></IPhoneFrame>;
}
export function IPhoneScamWarningMockup() {
  return <IPhoneFrame><IPhoneMessagesScreen /></IPhoneFrame>;
}
export function IPhonePhotoHomeMockup() {
  return <IPhoneFrame><IPhoneHomeScreen highlightIdx={3} /></IPhoneFrame>;
}
export function IPhonePhotoGridMockup() {
  return <IPhoneFrame><IPhonePhotosScreen /></IPhoneFrame>;
}
export function IPhonePhotoHighlightMockup() {
  return <IPhoneFrame><IPhonePhotosScreen highlightOne /></IPhoneFrame>;
}
export function IPhonePhotoZoomMockup() {
  return <IPhoneFrame><PhotoZoomScreen /></IPhoneFrame>;
}
export function IPhonePhotoBackMockup() {
  return <IPhoneFrame><PhotoBackScreen /></IPhoneFrame>;
}
