// 실제 갤럭시·iPhone 참고 이미지 기반 미니 목업 컴포넌트

// ── 갤럭시 프레임 (검정 베젤, 작은 상단 카메라 홀) ─────────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '86px', height: '155px',
      border: '3px solid #1a1a1a',
      borderRadius: '14px',
      overflow: 'hidden',
      backgroundColor: '#000',
      flexShrink: 0,
      position: 'relative',
      boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
    }}>
      {/* 전면 카메라 홀 */}
      <div style={{
        position: 'absolute', top: '5px', left: '50%',
        transform: 'translateX(-50%)',
        width: '7px', height: '7px',
        backgroundColor: '#111', borderRadius: '50%', zIndex: 10,
      }} />
      {children}
    </div>
  );
}

// ── 갤럭시 홈 화면 (실제 참고: 바다 배경, Samsung One UI 아이콘, TALK 독) ──
type GalaxyHighlight = 'phone' | 'message' | 'gallery' | 'camera';

function GalaxyHomeScreen({ highlight }: { highlight?: GalaxyHighlight }) {
  const gridRows: { id: string; bg: string; symbol: string; label: string; fg?: string }[][] = [
    [
      { id: 'naverCafe', bg: '#03C75A', symbol: '☕', label: '카페' },
      { id: 'myFiles',   bg: '#FF6D00', symbol: '📂', label: '내파일' },
      { id: 'settings',  bg: '#737373', symbol: '⚙',  label: '설정' },
    ],
    [
      { id: 'clock',    bg: '#5E35B1', symbol: '⏰', label: '시계' },
      { id: 'calendar', bg: '#1B8A5E', symbol: '9',  label: '캘린더' },
      { id: 'samsung',  bg: '#1428A0', symbol: 'M',  label: '뮤직', fg: 'white' },
    ],
    [
      { id: 'calculator', bg: '#00BF63', symbol: '÷',  label: '계산기' },
      { id: 'message',    bg: '#2196F3', symbol: '💬', label: '메시지' },
      { id: 'camera',     bg: '#E53935', symbol: '📷', label: '카메라' },
    ],
  ];

  const dockApps = [
    { id: 'phone',    bg: '#34C759', symbol: '📞', fg: 'white' },
    { id: 'internet', bg: '#1C4FBE', symbol: 'e',  fg: 'white' },
    { id: 'gallery',  bg: '#E91E8C', symbol: '🌸', fg: 'white' },
    { id: 'kakao',    bg: '#FEE500', symbol: 'T',  fg: '#3A1D1D', label: 'TALK' },
  ];

  const hl = (id: string) => id === highlight;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #051525 0%, #0D3554 28%, #185A8C 58%, #2680B8 82%, #3A96CC 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* 상태바 */}
      <div style={{ height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px', marginTop: '2px' }}>
        <span style={{ color: 'white', fontSize: '4.5px', fontWeight: 'bold' }}>오전 10:30</span>
        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1px' }}>
            {[3,4,5,5].map((h,i)=>(
              <div key={i} style={{ width: '1.5px', height: `${h}px`, backgroundColor: 'white', borderRadius: '0.5px', opacity: 0.9 }} />
            ))}
          </div>
          <div style={{ width: '5px', height: '4px', border: '0.7px solid white', borderRadius: '0.7px', position: 'relative', opacity: 0.9 }}>
            <div style={{ position: 'absolute', left: '0.5px', top: '0.5px', width: '3px', height: '2.5px', backgroundColor: 'white' }} />
          </div>
        </div>
      </div>

      {/* 앱 그리드 (하단 정렬) */}
      <div style={{ flex: 1 }} />
      <div style={{ padding: '0 5px', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '4px' }}>
        {gridRows.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {row.map(app => (
              <div key={app.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5px' }}>
                <div style={{
                  width: '23px', height: '23px',
                  backgroundColor: app.bg,
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 'bold',
                  color: app.fg ?? 'white',
                  boxShadow: hl(app.id) ? '0 0 0 2px white, 0 0 10px rgba(255,255,255,0.85)' : 'none',
                  transform: hl(app.id) ? 'scale(1.18)' : 'scale(1)',
                }}>
                  {app.symbol}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: '4px', textShadow: '0 1px 3px rgba(0,0,0,0.9)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {app.label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 독 */}
      <div style={{
        height: '40px', margin: '0 4px 5px',
        backgroundColor: 'rgba(255,255,255,0.17)',
        borderRadius: '14px', border: '0.5px solid rgba(255,255,255,0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', padding: '0 4px',
      }}>
        {dockApps.map(app => (
          <div key={app.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
            <div style={{
              width: '26px', height: '26px',
              backgroundColor: app.bg,
              borderRadius: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: app.label === 'TALK' ? '6px' : '12px',
              fontWeight: 'bold', color: app.fg,
              boxShadow: hl(app.id) ? '0 0 0 2.5px white, 0 0 12px rgba(255,255,255,0.9)' : 'none',
              transform: hl(app.id) ? 'scale(1.22)' : 'scale(1)',
            }}>
              {app.label === 'TALK' ? 'TALK' : app.symbol}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 갤럭시 다이얼러 (Samsung One UI 스타일) ─────────────────────────────
function GalaxyDialerScreen({ highlightCall = false }: { highlightCall?: boolean }) {
  const keys = ['1','2','3','4','5','6','7','8','9','*','0','#'];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* 상태바 */}
      <div style={{ height: '12px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px', borderBottom: '0.5px solid #eee' }}>
        <span style={{ fontSize: '4.5px', color: '#1a1a1a', fontWeight: 'bold' }}>오전 10:30</span>
        <span style={{ fontSize: '4.5px', color: '#1a1a1a' }}>●●● 🔋</span>
      </div>
      {/* 번호 표시 */}
      <div style={{ padding: '8px 8px 4px', textAlign: 'center', minHeight: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: highlightCall ? '8px' : '7px', fontWeight: 'bold', color: '#1a1a1a', letterSpacing: '1px' }}>
          {highlightCall ? '010-1234-5678' : '번호를 눌러요'}
        </span>
      </div>
      {/* 키패드 */}
      <div style={{ flex: 1, padding: '2px 8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', alignContent: 'center' }}>
        {keys.map(k => (
          <div key={k} style={{
            height: '16px', backgroundColor: '#F5F5F5',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '7px', fontWeight: 'bold', color: '#1a1a1a',
          }}>
            {k}
          </div>
        ))}
      </div>
      {/* 통화 버튼 */}
      <div style={{ padding: '4px 0 8px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          backgroundColor: '#34C759',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px',
          boxShadow: highlightCall
            ? '0 0 12px rgba(52,199,89,0.7), 0 0 0 3px rgba(52,199,89,0.3)'
            : '0 2px 8px rgba(52,199,89,0.45)',
          transform: highlightCall ? 'scale(1.15)' : 'scale(1)',
        }}>
          📞
        </div>
      </div>
    </div>
  );
}

// ── 갤럭시 문자 목록 (Samsung Messages) ─────────────────────────────────
function GalaxyMessageListScreen() {
  const rows = [
    { name: '엄마',          preview: '밥은 먹었어?',            time: '오전 9:20', color: '#34C759', unread: true },
    { name: '010-5678-9012', preview: '[Web발신] 택배가 도착했…', time: '어제',     color: '#8E8E93', unread: false },
    { name: '병원',          preview: '예약일정 안내드립니다',    time: '월요일',   color: '#2563EB', unread: false },
  ];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '12px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', padding: '0 6px', borderBottom: '0.5px solid #eee' }}>
        <span style={{ fontSize: '4.5px', color: '#1a1a1a', fontWeight: 'bold' }}>오전 10:30</span>
      </div>
      <div style={{ padding: '5px 7px 4px', borderBottom: '0.5px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '8px', fontWeight: 'bold', color: '#1a1a1a' }}>메시지</p>
        <div style={{ width: '12px', height: '12px', backgroundColor: '#2196F3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: '8px', lineHeight: 1 }}>✎</span>
        </div>
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{
          padding: '5px 7px', borderBottom: '0.5px solid #F0F0F0',
          backgroundColor: i === 0 ? '#EFF6FF' : 'white',
          display: 'flex', gap: '5px', alignItems: 'center',
        }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: row.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', color: 'white', fontWeight: 'bold' }}>
            {row.name[0]}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '6px', fontWeight: row.unread ? 'bold' : 'normal', color: '#1a1a1a' }}>{row.name}</p>
              <p style={{ fontSize: '4px', color: '#8E8E93' }}>{row.time}</p>
            </div>
            <p style={{ fontSize: '5px', color: '#8E8E93', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.preview}</p>
          </div>
          {row.unread && <div style={{ width: '6px', height: '6px', backgroundColor: '#2196F3', borderRadius: '50%', flexShrink: 0 }} />}
        </div>
      ))}
    </div>
  );
}

// ── 갤럭시 사기 문자 화면 ────────────────────────────────────────────────
function GalaxyScamScreen() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '12px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', padding: '0 6px', borderBottom: '0.5px solid #eee' }}>
        <span style={{ fontSize: '4.5px', color: '#1a1a1a', fontWeight: 'bold' }}>오전 10:30</span>
      </div>
      <div style={{ padding: '4px 7px 3px', borderBottom: '0.5px solid #eee', backgroundColor: '#fff', display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{ fontSize: '8px', color: '#2196F3' }}>←</span>
        <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#1a1a1a' }}>010-9999-0000</p>
      </div>
      <div style={{ flex: 1, padding: '6px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ alignSelf: 'flex-start', backgroundColor: '#E8E8E8', borderRadius: '10px 10px 10px 2px', padding: '4px 6px', maxWidth: '78%' }}>
          <p style={{ fontSize: '5px', color: '#1a1a1a', lineHeight: 1.6 }}>
            [국민은행] 보안 업데이트<br />
            <span style={{ color: '#007AFF', textDecoration: 'underline' }}>http://bit.ly/bank-up</span>
          </p>
        </div>
        <div style={{ backgroundColor: '#FFF3CD', border: '1px solid #FFC107', borderRadius: '6px', padding: '3px 5px', display: 'flex', gap: '3px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '8px' }}>⚠️</span>
          <p style={{ fontSize: '4.5px', color: '#856404', lineHeight: 1.5 }}>스팸 의심 번호<br />링크를 누르지 마세요!</p>
        </div>
      </div>
    </div>
  );
}

// ── 갤럭시 갤러리 화면 ──────────────────────────────────────────────────
function GalaxyGalleryScreen({ highlightOne = false }: { highlightOne?: boolean }) {
  const colors = ['#7EC8A4','#F4A261','#6B9BD2','#E76F51','#52B788','#FFB4A2'];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '12px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', padding: '0 6px', borderBottom: '0.5px solid #eee' }}>
        <span style={{ fontSize: '4.5px', color: '#1a1a1a', fontWeight: 'bold' }}>오전 10:30</span>
      </div>
      <div style={{ padding: '4px 6px 3px', borderBottom: '0.5px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#1a1a1a' }}>갤러리</p>
        <span style={{ fontSize: '7px', color: '#2196F3' }}>≡</span>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#ddd', overflow: 'hidden' }}>
        {colors.map((color, i) => (
          <div key={i} style={{ backgroundColor: color, aspectRatio: '1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {highlightOne && i === 1 && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px' }}>👆</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 사진 확대 (핀치 제스처) ──────────────────────────────────────────────
function PhotoZoomScreen() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ width: '70px', height: '88px', backgroundColor: '#7EC8A4', borderRadius: '3px' }} />
      <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: '16px' }}>
        {[{arrow:'←'},{arrow:'→'}].map(({arrow},i)=>(
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '8px' }}>👆</span>
            </div>
            <span style={{ fontSize: '8px', color: 'white', fontWeight: 'bold' }}>{arrow}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '7px', left: 0, right: 0, textAlign: 'center' }}>
        <p style={{ fontSize: '5px', color: 'rgba(255,255,255,0.75)' }}>두 손가락으로 벌리기</p>
      </div>
    </div>
  );
}

// ── 뒤로가기 화면 ────────────────────────────────────────────────────────
function PhotoBackScreen() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ height: '24px', backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', padding: '0 6px', gap: '4px', zIndex: 2 }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white', fontWeight: 'bold' }}>←</div>
        <span style={{ fontSize: '6px', color: 'white' }}>뒤로 가기</span>
      </div>
      <div style={{ flex: 1, backgroundColor: '#6B9BD2' }} />
    </div>
  );
}

// ── 제스처 목업들 ─────────────────────────────────────────────────────────
function GestureTapScreen() {
  return (
    <div style={{ width:'100%',height:'100%',background:'linear-gradient(160deg,#051525 0%,#185A8C 100%)',display:'flex',flexDirection:'column' }}>
      <div style={{ height:'14px',display:'flex',alignItems:'center',padding:'0 8px' }}>
        <span style={{ color:'white',fontSize:'5px',fontWeight:'bold' }}>오전 10:30</span>
      </div>
      <div style={{ flex:1,padding:'8px 6px',display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'8px',alignContent:'start' }}>
        {Array.from({length:9}).map((_,i)=>(
          <div key={i} style={{ display:'flex',justifyContent:'center',position:'relative' }}>
            <div style={{ width:'26px',height:'26px',backgroundColor:i===4?'#34C759':'rgba(255,255,255,0.18)',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px' }}>
              {i===4?'📞':''}
            </div>
            {i===4&&(
              <div style={{ position:'absolute',bottom:'-6px',right:'-2px',width:'16px',height:'16px',borderRadius:'50%',backgroundColor:'rgba(255,255,255,0.85)',border:'2px solid #FFD400',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'8px' }}>
                👆
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ margin:'0 8px 10px',backgroundColor:'rgba(255,255,255,0.15)',borderRadius:'8px',padding:'4px 6px',textAlign:'center' }}>
        <p style={{ fontSize:'5px',color:'white',fontWeight:'bold' }}>가볍게 한 번 눌러요</p>
      </div>
    </div>
  );
}

function GestureScrollScreen() {
  const rows = ['엄마','병원','은행','친구'];
  return (
    <div style={{ width:'100%',height:'100%',backgroundColor:'#fff',display:'flex',flexDirection:'column' }}>
      <div style={{ height:'12px',backgroundColor:'#f5f5f5',display:'flex',alignItems:'center',padding:'0 6px' }}>
        <span style={{ fontSize:'5px',color:'#333' }}>오전 10:30</span>
      </div>
      <div style={{ padding:'4px 8px 2px',borderBottom:'1px solid #eee' }}>
        <p style={{ fontSize:'7px',fontWeight:'bold' }}>메시지</p>
      </div>
      <div style={{ flex:1,position:'relative',overflow:'hidden' }}>
        {rows.map((name,i)=>(
          <div key={i} style={{ padding:'5px 8px',borderBottom:'1px solid #f0f0f0',display:'flex',gap:'5px',alignItems:'center' }}>
            <div style={{ width:'16px',height:'16px',borderRadius:'50%',backgroundColor:'#6C63FF',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'6px',color:'white' }}>{name[0]}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:'6px',fontWeight:'bold',color:'#1a1a1a' }}>{name}</p>
              <p style={{ fontSize:'4.5px',color:'#8E8E93' }}>안녕하세요...</p>
            </div>
          </div>
        ))}
        <div style={{ position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',display:'flex',flexDirection:'column',alignItems:'center',gap:'2px' }}>
          <span style={{ fontSize:'6px',color:'#6C63FF',fontWeight:'bold' }}>↑</span>
          <div style={{ width:'14px',height:'14px',borderRadius:'50%',backgroundColor:'rgba(108,99,255,0.2)',border:'1.5px solid #6C63FF',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'7px' }}>👆</div>
        </div>
      </div>
    </div>
  );
}

function GestureLongPressScreen() {
  return (
    <div style={{ width:'100%',height:'100%',background:'linear-gradient(160deg,#051525 0%,#185A8C 100%)',display:'flex',flexDirection:'column' }}>
      <div style={{ height:'14px',display:'flex',alignItems:'center',padding:'0 8px' }}>
        <span style={{ color:'white',fontSize:'5px',fontWeight:'bold' }}>오전 10:30</span>
      </div>
      <div style={{ flex:1,padding:'8px 6px',display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'8px',alignContent:'start',position:'relative' }}>
        {Array.from({length:9}).map((_,i)=>(
          <div key={i} style={{ display:'flex',justifyContent:'center' }}>
            <div style={{ width:'26px',height:'26px',backgroundColor:i===1?'#FF9F0A':'rgba(255,255,255,0.18)',borderRadius:'8px',fontSize:'12px',display:'flex',alignItems:'center',justifyContent:'center' }}>
              {i===1?'📸':''}
            </div>
          </div>
        ))}
        <div style={{ position:'absolute',top:'30px',left:'28px',backgroundColor:'white',borderRadius:'6px',padding:'3px 6px',boxShadow:'0 2px 8px rgba(0,0,0,0.3)',zIndex:2 }}>
          <p style={{ fontSize:'5px',color:'#1a1a1a',borderBottom:'1px solid #eee',paddingBottom:'2px',marginBottom:'2px' }}>삭제</p>
          <p style={{ fontSize:'5px',color:'#1a1a1a' }}>이동</p>
        </div>
        <div style={{ position:'absolute',top:'22px',left:'32px',width:'14px',height:'14px',borderRadius:'50%',backgroundColor:'rgba(255,255,255,0.3)',border:'1.5px solid white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'7px',zIndex:3 }}>👆</div>
      </div>
      <div style={{ margin:'0 8px 10px',backgroundColor:'rgba(255,255,255,0.15)',borderRadius:'8px',padding:'4px 6px',textAlign:'center' }}>
        <p style={{ fontSize:'5px',color:'white',fontWeight:'bold' }}>꾹 누르면 메뉴가 나와요</p>
      </div>
    </div>
  );
}

function GestureBackScreen() {
  return (
    <div style={{ width:'100%',height:'100%',backgroundColor:'#fff',display:'flex',flexDirection:'column' }}>
      <div style={{ height:'12px',backgroundColor:'#f5f5f5',display:'flex',alignItems:'center',padding:'0 6px' }}>
        <span style={{ fontSize:'5px',color:'#333' }}>오전 10:30</span>
      </div>
      <div style={{ padding:'5px 8px 3px',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',gap:'4px' }}>
        <div style={{ width:'18px',height:'18px',borderRadius:'50%',backgroundColor:'#3B82F6',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',color:'white',fontWeight:'bold',flexShrink:0 }}>←</div>
        <p style={{ fontSize:'7px',fontWeight:'bold',color:'#3B82F6' }}>뒤로 가기</p>
      </div>
      <div style={{ flex:1,padding:'8px',display:'flex',flexDirection:'column',gap:'4px' }}>
        <div style={{ height:'8px',backgroundColor:'#f0f0f0',borderRadius:'4px' }} />
        <div style={{ height:'8px',backgroundColor:'#f0f0f0',borderRadius:'4px',width:'80%' }} />
        <div style={{ height:'8px',backgroundColor:'#f0f0f0',borderRadius:'4px',width:'60%' }} />
      </div>
      <div style={{ padding:'4px 8px 8px',textAlign:'center' }}>
        <p style={{ fontSize:'5px',color:'#6B7280' }}>← 버튼을 눌러 이전 화면으로</p>
      </div>
    </div>
  );
}

// ── iPhone X 프레임 (실버 베젤, 넓은 노치) ─────────────────────────────
function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: '86px', height: '155px',
      border: '3px solid #B0B0B0',
      borderRadius: '18px',
      overflow: 'hidden',
      backgroundColor: '#000',
      flexShrink: 0,
      position: 'relative',
      boxShadow: '0 4px 14px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.15)',
    }}>
      {/* iPhone X 넓은 노치 */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '40px', height: '13px',
        backgroundColor: '#000',
        borderRadius: '0 0 12px 12px', zIndex: 10,
      }} />
      {children}
    </div>
  );
}

// ── iPhone X 홈 화면 (실제 참고: 어두운 배경, iOS 아이콘, 하단 독) ────────
type IPhoneHighlight = 'phone' | 'message' | 'photos' | 'camera';

function IPhoneXHomeScreen({ highlight }: { highlight?: IPhoneHighlight }) {
  const gridRows: { id: string; bg: string; symbol: string; label: string; border?: boolean }[][] = [
    [
      { id: 'mail',     bg: '#007AFF', symbol: '✉',  label: '메일' },
      { id: 'calendar', bg: '#FF3B30', symbol: '12', label: '캘린더' },
      { id: 'photos',   bg: '#fff',   symbol: '🌈',  label: '사진', border: true },
      { id: 'camera',   bg: '#8E8E93', symbol: '📷', label: '카메라' },
    ],
    [
      { id: 'maps',     bg: '#34C759', symbol: '🗺',  label: '지도' },
      { id: 'clock',    bg: '#1C1C1E', symbol: '🕐',  label: '시계' },
      { id: 'weather',  bg: '#007AFF', symbol: '⛅',  label: '날씨' },
      { id: 'home_app', bg: '#FF9500', symbol: '🏠',  label: '홈' },
    ],
    [
      { id: 'notes',     bg: '#FFCC02', symbol: '📝', label: '메모' },
      { id: 'stocks',    bg: '#1C1C1E', symbol: '📈', label: '주식' },
      { id: 'reminders', bg: '#fff',   symbol: '✓',  label: '미리알림', border: true },
      { id: 'settings',  bg: '#8E8E93', symbol: '⚙', label: '설정' },
    ],
  ];

  const dockApps = [
    { id: 'phone',    bg: '#34C759', symbol: '📞' },
    { id: 'safari',   bg: '#007AFF', symbol: '🧭' },
    { id: 'message',  bg: '#34C759', symbol: '💬' },
    { id: 'music',    bg: '#FC3C44', symbol: '♫',  fg: 'white' },
  ];

  const hl = (id: string) => id === highlight;

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #1C1C1E 0%, #2C2C2E 60%, #3A3A3C 100%)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* 상태바 (노치 아래) */}
      <div style={{ height: '18px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 7px 2px' }}>
        <span style={{ color: 'white', fontSize: '5px', fontWeight: 'bold' }}>9:41</span>
        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1px' }}>
            {[3,4,5,5].map((h,i)=>(
              <div key={i} style={{ width:'1.5px', height:`${h}px`, backgroundColor:'white', borderRadius:'0.5px', opacity: 0.9 }} />
            ))}
          </div>
          <span style={{ color:'white', fontSize:'5px' }}>▲</span>
          <div style={{ width:'7px', height:'4px', border:'0.8px solid white', borderRadius:'1px', position:'relative', opacity:0.9 }}>
            <div style={{ position:'absolute', left:'0.5px', top:'0.5px', width:'5px', height:'2.5px', backgroundColor:'white' }} />
          </div>
        </div>
      </div>

      {/* 앱 그리드 (4열) */}
      <div style={{ flex: 1, padding: '4px 5px 2px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {gridRows.map((row, ri) => (
          <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px' }}>
            {row.map(app => (
              <div key={app.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5px' }}>
                <div style={{
                  width: '19px', height: '19px',
                  backgroundColor: app.bg,
                  borderRadius: '5px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 'bold', color: '#1a1a1a',
                  border: app.border ? '0.5px solid #ddd' : 'none',
                  boxShadow: hl(app.id) ? '0 0 0 2px white, 0 0 10px rgba(255,255,255,0.8)' : 'none',
                  transform: hl(app.id) ? 'scale(1.18)' : 'scale(1)',
                }}>
                  {app.symbol}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: '3.5px', textAlign: 'center', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}>
                  {app.label}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 독 */}
      <div style={{
        height: '38px', margin: '0 5px 5px',
        backgroundColor: 'rgba(255,255,255,0.13)',
        borderRadius: '14px', border: '0.5px solid rgba(255,255,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',
      }}>
        {dockApps.map(app => (
          <div key={app.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '26px', height: '26px',
              backgroundColor: app.bg,
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', color: app.fg ?? '#1a1a1a',
              boxShadow: hl(app.id) ? '0 0 0 2.5px white, 0 0 12px rgba(255,255,255,0.9)' : 'none',
              transform: hl(app.id) ? 'scale(1.22)' : 'scale(1)',
            }}>
              {app.symbol}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── iPhone X 다이얼러 ─────────────────────────────────────────────────────
function IPhoneDialerScreen({ highlightCall = false }: { highlightCall?: boolean }) {
  const keys = ['1','2','3','4','5','6','7','8','9','*','0','#'];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '16px', backgroundColor: '#fff', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 7px 2px' }}>
        <span style={{ fontSize: '5px', color: '#1a1a1a', fontWeight: 'bold' }}>9:41</span>
        <span style={{ fontSize: '5px', color: '#1a1a1a' }}>●●● 🔋</span>
      </div>
      <div style={{ padding: '6px 8px 3px', textAlign: 'center', minHeight: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: highlightCall ? '8px' : '7px', fontWeight: 'bold', color: '#1a1a1a', letterSpacing: '0.5px' }}>
          {highlightCall ? '010-1234-5678' : '키패드'}
        </span>
      </div>
      <div style={{ flex: 1, padding: '2px 10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', alignContent: 'center' }}>
        {keys.map(k => (
          <div key={k} style={{
            height: '15px',
            backgroundColor: '#F2F2F7',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '7px', fontWeight: '500', color: '#1a1a1a',
          }}>
            {k}
          </div>
        ))}
      </div>
      <div style={{ padding: '3px 0 8px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          backgroundColor: '#34C759',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px',
          boxShadow: highlightCall ? '0 0 12px rgba(52,199,89,0.7), 0 0 0 3px rgba(52,199,89,0.3)' : '0 2px 8px rgba(52,199,89,0.45)',
          transform: highlightCall ? 'scale(1.15)' : 'scale(1)',
        }}>📞</div>
      </div>
    </div>
  );
}

// ── iPhone X 메시지 목록 ──────────────────────────────────────────────────
function IPhoneMessagesScreen() {
  const rows = [
    { name: '엄마', preview: '밥은 먹었어?', color: '#34C759', unread: true },
    { name: '010-5678-9012', preview: '[광고] 대출 관련 안내', color: '#8E8E93', unread: false },
    { name: '병원', preview: '예약일정 안내드립니다', color: '#2563EB', unread: false },
  ];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '16px', backgroundColor: '#fff', display: 'flex', alignItems: 'flex-end', padding: '0 7px 2px' }}>
        <span style={{ fontSize: '5px', color: '#1a1a1a', fontWeight: 'bold' }}>9:41</span>
      </div>
      <div style={{ padding: '4px 8px 4px', borderBottom: '0.5px solid #C6C6C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '8px', fontWeight: 'bold', color: '#1a1a1a' }}>메시지</p>
        <div style={{ width: '13px', height: '13px', backgroundColor: '#007AFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: '8px', lineHeight: 1 }}>✎</span>
        </div>
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{
          padding: '5px 8px', borderBottom: '0.5px solid #F2F2F7',
          backgroundColor: i === 0 ? '#F0F9FF' : 'white',
          display: 'flex', gap: '5px', alignItems: 'center',
        }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: row.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: 'white', fontWeight: 'bold' }}>
            {row.name[0]}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '6px', fontWeight: row.unread ? 'bold' : 'normal', color: '#1a1a1a' }}>{row.name}</p>
            </div>
            <p style={{ fontSize: '5px', color: '#8E8E93', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.preview}</p>
          </div>
          {row.unread && <div style={{ width: '7px', height: '7px', backgroundColor: '#007AFF', borderRadius: '50%', flexShrink: 0 }} />}
        </div>
      ))}
    </div>
  );
}

// ── iPhone X 사진 앱 ──────────────────────────────────────────────────────
function IPhonePhotosScreen({ highlightOne = false }: { highlightOne?: boolean }) {
  const colors = ['#7EC8A4','#F4A261','#6B9BD2','#E76F51','#52B788','#FFB4A2'];
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '16px', backgroundColor: '#fff', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 7px 2px' }}>
        <span style={{ fontSize: '5px', color: '#1a1a1a', fontWeight: 'bold' }}>9:41</span>
      </div>
      <div style={{ padding: '3px 7px 3px', borderBottom: '0.5px solid #C6C6C8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#1a1a1a' }}>사진</p>
        <p style={{ fontSize: '6px', color: '#007AFF' }}>선택</p>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#ccc', overflow: 'hidden' }}>
        {colors.map((color, i) => (
          <div key={i} style={{ backgroundColor: color, aspectRatio: '1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {highlightOne && i === 1 && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '12px' }}>👆</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 화면 캡처 (스크린샷) ─────────────────────────────────────────────────
function ScreenshotScreen() {
  return (
    <div style={{ width:'100%', height:'100%', position:'relative', overflow:'hidden' }}>
      <div style={{ width:'100%', height:'100%', background:'linear-gradient(160deg,#051525 0%,#185A8C 100%)', display:'flex', flexDirection:'column' }}>
        <div style={{ height:'14px', display:'flex', alignItems:'center', padding:'0 8px' }}>
          <span style={{ color:'white', fontSize:'5px', fontWeight:'bold' }}>오전 10:30</span>
        </div>
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'4px' }}>
          <span style={{ fontSize:'18px' }}>🏠</span>
          <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'5px' }}>홈 화면</span>
        </div>
      </div>
      {/* 캡처 테두리 flash */}
      <div style={{ position:'absolute', inset:0, border:'2.5px solid white', borderRadius:'11px', opacity:0.85 }} />
      {/* 캡처 완료 알림 */}
      <div style={{ position:'absolute', bottom:'7px', left:'4px', right:'4px', backgroundColor:'white', borderRadius:'6px', padding:'4px 6px', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
        <p style={{ fontSize:'5px', color:'#1a1a1a', fontWeight:'bold' }}>📸 캡처 완료</p>
        <p style={{ fontSize:'4px', color:'#8E8E93', marginTop:'1px' }}>갤러리에 저장됐어요</p>
      </div>
      {/* 버튼 표시 (전원 + 볼륨) */}
      <div style={{ position:'absolute', right:'0', top:'28px', display:'flex', flexDirection:'column', gap:'6px' }}>
        <div style={{ width:'3px', height:'10px', backgroundColor:'#FFD400', borderRadius:'2px 0 0 2px', opacity:0.9 }} />
        <div style={{ width:'3px', height:'10px', backgroundColor:'#FFD400', borderRadius:'2px 0 0 2px', opacity:0.9 }} />
      </div>
    </div>
  );
}

// ── 화면 밝기 조절 (알림창) ────────────────────────────────────────────────
function BrightnessScreen() {
  return (
    <div style={{ width:'100%', height:'100%', position:'relative' }}>
      <div style={{ width:'100%', height:'100%', background:'linear-gradient(160deg,#051525 0%,#185A8C 100%)' }} />
      {/* 알림 그늘막 */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'95px', backgroundColor:'rgba(20,22,35,0.97)', borderRadius:'0 0 12px 12px', padding:'8px 7px 6px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
          <span style={{ color:'white', fontSize:'5px', fontWeight:'bold' }}>오전 10:30</span>
          <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'5px' }}>🔋</span>
        </div>
        {/* 빠른 설정 아이콘 */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'3px', marginBottom:'7px' }}>
          {['📶','📡','🔔','🔄','✈️'].map((icon, i) => (
            <div key={i} style={{ height:'16px', backgroundColor:i===0?'rgba(37,99,235,0.6)':'rgba(255,255,255,0.12)', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'7px' }}>
              {icon}
            </div>
          ))}
        </div>
        {/* 밝기 슬라이더 */}
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <span style={{ fontSize:'7px' }}>🌙</span>
          <div style={{ flex:1, height:'7px', backgroundColor:'rgba(255,255,255,0.18)', borderRadius:'4px', overflow:'hidden', position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'70%', background:'linear-gradient(90deg,#6366F1,#818CF8)', borderRadius:'4px' }} />
          </div>
          <span style={{ fontSize:'8px' }}>☀️</span>
        </div>
      </div>
      {/* 손가락 + 화살표 */}
      <div style={{ position:'absolute', top:'95px', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'1px' }}>
        <span style={{ fontSize:'9px' }}>👆</span>
        <span style={{ fontSize:'6px', color:'rgba(255,255,255,0.6)' }}>↑ 쓸어내렸어요</span>
      </div>
    </div>
  );
}

// ── 소리 크기 조절 (볼륨 바) ───────────────────────────────────────────────
function VolumeScreen() {
  return (
    <div style={{ width:'100%', height:'100%', position:'relative' }}>
      <div style={{ width:'100%', height:'100%', background:'linear-gradient(160deg,#051525 0%,#185A8C 100%)', display:'flex', flexDirection:'column' }}>
        <div style={{ height:'14px', display:'flex', alignItems:'center', padding:'0 8px' }}>
          <span style={{ color:'white', fontSize:'5px', fontWeight:'bold' }}>오전 10:30</span>
        </div>
      </div>
      {/* 볼륨 팝업 (우측 상단) */}
      <div style={{ position:'absolute', top:'18px', right:'7px', backgroundColor:'rgba(255,255,255,0.95)', borderRadius:'10px', padding:'5px 4px', display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', boxShadow:'0 3px 10px rgba(0,0,0,0.4)', width:'16px' }}>
        <span style={{ fontSize:'7px' }}>🔊</span>
        <div style={{ width:'4px', height:'52px', backgroundColor:'#e5e7eb', borderRadius:'2px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'60%', backgroundColor:'#2563EB', borderRadius:'2px' }} />
        </div>
        <span style={{ fontSize:'5px', color:'#374151' }}>60</span>
      </div>
      {/* 볼륨 물리 버튼 표시 */}
      <div style={{ position:'absolute', right:'0', top:'16px', display:'flex', flexDirection:'column', gap:'2px' }}>
        <div style={{ width:'3px', height:'12px', background:'linear-gradient(180deg,#FFD400,#FFA500)', borderRadius:'2px 0 0 2px', boxShadow:'0 0 4px rgba(255,212,0,0.6)' }} />
        <div style={{ width:'3px', height:'12px', background:'linear-gradient(180deg,#FFD400,#FFA500)', borderRadius:'2px 0 0 2px', boxShadow:'0 0 4px rgba(255,212,0,0.6)' }} />
      </div>
      <div style={{ position:'absolute', right:'5px', top:'14px', display:'flex', flexDirection:'column', gap:'2px' }}>
        <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'3.5px', textAlign:'right' }}>▲ 크게</p>
        <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'3.5px', textAlign:'right', marginTop:'8px' }}>▼ 작게</p>
      </div>
    </div>
  );
}

// ── 화면 잠금 / 잠금 해제 ─────────────────────────────────────────────────
function LockScreen() {
  return (
    <div style={{ width:'100%', height:'100%', background:'linear-gradient(180deg,#0F0C29 0%,#302B63 50%,#24243E 100%)', display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
      <div style={{ display:'flex', justifyContent:'space-between', width:'100%', padding:'5px 8px 0' }}>
        <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'4.5px' }}>오전 10:30</span>
        <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'4.5px' }}>🔋</span>
      </div>
      {/* 시간 */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px' }}>
        <p style={{ color:'white', fontSize:'22px', fontWeight:700, lineHeight:1, letterSpacing:'-1px' }}>10:30</p>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'4.5px' }}>2026년 5월 17일 일요일</p>
        <div style={{ marginTop:'8px', fontSize:'14px' }}>🔒</div>
        <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'4px', marginTop:'2px' }}>밀어서 잠금 해제</p>
      </div>
      {/* 전원 버튼 강조 */}
      <div style={{ position:'absolute', right:'0', top:'35px' }}>
        <div style={{ width:'3px', height:'18px', background:'linear-gradient(180deg,#FFD400,#FFA500)', borderRadius:'2px 0 0 2px', boxShadow:'0 0 6px rgba(255,212,0,0.7)' }} />
      </div>
      <p style={{ position:'absolute', right:'5px', top:'38px', color:'rgba(255,255,255,0.6)', fontSize:'3.5px', textAlign:'right' }}>전원<br/>버튼</p>
    </div>
  );
}

// ── 앱 전환기 (최근 앱 / 멀티태스킹) ────────────────────────────────────
function AppSwitcherScreen() {
  const cards = [
    { label:'카카오톡', bg:'#FEE500', symbol:'💬', fg:'#3A1D1D' },
    { label:'문자',     bg:'#2196F3', symbol:'✉', fg:'white' },
    { label:'갤러리',   bg:'#E91E8C', symbol:'🌸', fg:'white' },
  ];
  return (
    <div style={{ width:'100%', height:'100%', backgroundColor:'#111', display:'flex', flexDirection:'column' }}>
      <div style={{ height:'12px', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 8px' }}>
        <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'4.5px' }}>오전 10:30</span>
        <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'4.5px' }}>최근 앱</span>
      </div>
      {/* 앱 카드들 */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', padding:'4px 5px' }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            width:'24px', height:'68px', backgroundColor:'#1E1E1E',
            borderRadius:'7px', overflow:'hidden',
            boxShadow: i===1 ? '0 0 0 1.5px #3B82F6, 0 4px 12px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.5)',
            display:'flex', flexDirection:'column',
          }}>
            <div style={{ height:'12px', backgroundColor:card.bg, display:'flex', alignItems:'center', justifyContent:'center', gap:'2px' }}>
              <span style={{ fontSize:'7px' }}>{card.symbol}</span>
            </div>
            <div style={{ flex:1, padding:'2px', display:'flex', flexDirection:'column', gap:'2px' }}>
              {[70,90,55].map((w,j) => (
                <div key={j} style={{ height:'4px', backgroundColor:'rgba(255,255,255,0.1)', borderRadius:'2px', width:`${w}%` }} />
              ))}
            </div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'3.5px', textAlign:'center', paddingBottom:'2px' }}>{card.label}</p>
          </div>
        ))}
      </div>
      {/* 위로 쓸기 안내 */}
      <div style={{ padding:'0 0 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:'1px' }}>
        <div style={{ display:'flex', gap:'4px', alignItems:'center' }}>
          <span style={{ fontSize:'6px' }}>☝️</span>
          <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'3.5px' }}>위로 밀면 앱 종료</span>
        </div>
      </div>
    </div>
  );
}

// ── 제스처 공개 exports ───────────────────────────────────────────────────
export function GestureTapMockup() { return <PhoneFrame><GestureTapScreen /></PhoneFrame>; }
export function GestureScrollMockup() { return <PhoneFrame><GestureScrollScreen /></PhoneFrame>; }
export function GestureLongPressMockup() { return <PhoneFrame><GestureLongPressScreen /></PhoneFrame>; }
export function GestureBackMockup() { return <PhoneFrame><GestureBackScreen /></PhoneFrame>; }

// ── 갤럭시 공개 exports ───────────────────────────────────────────────────
export function PhoneHomeScreenMockup() {
  return <PhoneFrame><GalaxyHomeScreen highlight="phone" /></PhoneFrame>;
}
export function DialerMockup() {
  return <PhoneFrame><GalaxyDialerScreen /></PhoneFrame>;
}
export function CallButtonMockup() {
  return <PhoneFrame><GalaxyDialerScreen highlightCall /></PhoneFrame>;
}
export function MessageHomeScreenMockup() {
  return <PhoneFrame><GalaxyHomeScreen highlight="message" /></PhoneFrame>;
}
export function MessageListMockup() {
  return <PhoneFrame><GalaxyMessageListScreen /></PhoneFrame>;
}
export function ScamWarningMockup() {
  return <PhoneFrame><GalaxyScamScreen /></PhoneFrame>;
}
export function GalleryHomeScreenMockup() {
  return <PhoneFrame><GalaxyHomeScreen highlight="gallery" /></PhoneFrame>;
}
export function GalleryGridMockup() {
  return <PhoneFrame><GalaxyGalleryScreen /></PhoneFrame>;
}
export function GalleryHighlightMockup() {
  return <PhoneFrame><GalaxyGalleryScreen highlightOne /></PhoneFrame>;
}
export function PhotoZoomMockup() {
  return <PhoneFrame><PhotoZoomScreen /></PhoneFrame>;
}
export function PhotoBackMockup() {
  return <PhoneFrame><PhotoBackScreen /></PhoneFrame>;
}

// ── iPhone X 공개 exports ─────────────────────────────────────────────────
export function IPhonePhoneHomeMockup() {
  return <IPhoneFrame><IPhoneXHomeScreen highlight="phone" /></IPhoneFrame>;
}
export function IPhoneDialerMockup() {
  return <IPhoneFrame><IPhoneDialerScreen /></IPhoneFrame>;
}
export function IPhoneCallButtonMockup() {
  return <IPhoneFrame><IPhoneDialerScreen highlightCall /></IPhoneFrame>;
}
export function IPhoneMessageHomeMockup() {
  return <IPhoneFrame><IPhoneXHomeScreen highlight="message" /></IPhoneFrame>;
}
export function IPhoneMessageListMockup() {
  return <IPhoneFrame><IPhoneMessagesScreen /></IPhoneFrame>;
}
export function IPhoneScamWarningMockup() {
  return <IPhoneFrame><IPhoneMessagesScreen /></IPhoneFrame>;
}
export function IPhonePhotoHomeMockup() {
  return <IPhoneFrame><IPhoneXHomeScreen highlight="photos" /></IPhoneFrame>;
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

// ── 신규 기능 exports ─────────────────────────────────────────────────────
export function ScreenshotMockup() { return <PhoneFrame><ScreenshotScreen /></PhoneFrame>; }
export function BrightnessMockup() { return <PhoneFrame><BrightnessScreen /></PhoneFrame>; }
export function VolumeMockup() { return <PhoneFrame><VolumeScreen /></PhoneFrame>; }
export function LockScreenMockup() { return <PhoneFrame><LockScreen /></PhoneFrame>; }
export function AppSwitcherMockup() { return <PhoneFrame><AppSwitcherScreen /></PhoneFrame>; }
