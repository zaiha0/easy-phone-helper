import type { Guide } from '../types';

export const guides: Guide[] = [
  {
    id: 'kakaotalk-photo',
    title: '카톡 사진 보내기',
    description: '카카오톡으로 사진을 보내는 방법을 알려드려요.',
    steps: [
      {
        instruction: '카카오톡을 엽니다.',
        detail: '화면에서 노란색 카카오톡 아이콘을 찾아 누르세요.',
      },
      {
        instruction: '사진을 보낼 사람을 누릅니다.',
        detail: '아래 "채팅" 목록에서 상대방 이름을 찾아 누르세요.',
      },
      {
        instruction: '채팅 화면 왼쪽 아래 "+" 버튼을 누릅니다.',
        detail: '메시지 입력창 왼쪽에 있는 더하기(+) 버튼이에요.',
      },
      {
        instruction: '"앨범"을 누릅니다.',
        detail: '사진 아이콘과 함께 "앨범"이라고 쓰여 있는 버튼을 누르세요.',
      },
      {
        instruction: '보낼 사진을 골라서 누릅니다.',
        detail: '원하는 사진을 한 번 누르면 선택이 돼요.',
      },
      {
        instruction: '"보내기" 버튼을 누릅니다.',
        detail: '화면 오른쪽 아래 파란색 "보내기" 버튼을 누르세요.',
      },
    ],
  },
  {
    id: 'check-message',
    title: '문자 확인하기',
    description: '받은 문자 메시지를 확인하는 방법이에요.',
    steps: [
      {
        instruction: '화면에서 "메시지" 앱을 찾아 누릅니다.',
        detail: '말풍선 모양의 아이콘이에요. "문자" 또는 "메시지"라고 쓰여 있을 수 있어요.',
      },
      {
        instruction: '받은 문자 목록이 보입니다.',
        detail: '가장 위에 있는 것이 가장 최근에 받은 문자예요.',
      },
      {
        instruction: '읽고 싶은 문자를 누릅니다.',
        detail: '보내는 사람 이름이나 번호를 누르세요.',
      },
      {
        instruction: '문자 내용이 보입니다.',
        detail: '다 읽으셨으면 왼쪽 위의 뒤로 가기 버튼(←)을 누르세요.',
      },
    ],
  },
  {
    id: 'save-contact',
    title: '전화번호 저장하기',
    description: '새로운 전화번호를 연락처에 저장하는 방법이에요.',
    steps: [
      {
        instruction: '"연락처" 앱을 찾아 누릅니다.',
        detail: '사람 모양 아이콘이에요. "전화"나 "연락처"라고 쓰여 있어요.',
      },
      {
        instruction: '화면 오른쪽 위 "+" 버튼을 누릅니다.',
        detail: '새 연락처를 추가하는 버튼이에요.',
      },
      {
        instruction: '이름과 전화번호를 입력합니다.',
        detail: '이름 칸에 이름을, 전화번호 칸에 번호를 입력하세요.',
      },
      {
        instruction: '저장 버튼을 누릅니다.',
        detail: '화면 오른쪽 위 "저장" 또는 체크 표시(✓)를 누르세요.',
      },
      {
        instruction: '연락처가 저장되었어요.',
        detail: '이제 전화할 때 이름으로 찾을 수 있어요.',
      },
    ],
  },
  {
    id: 'find-photo',
    title: '사진 찾기',
    description: '내 스마트폰에 저장된 사진을 찾는 방법이에요.',
    steps: [
      {
        instruction: '"갤러리" 또는 "사진" 앱을 찾아 누릅니다.',
        detail: '꽃이나 사진 모양의 아이콘을 찾으세요.',
      },
      {
        instruction: '사진 목록이 보입니다.',
        detail: '가장 최근 사진이 위쪽에 있어요.',
      },
      {
        instruction: '보고 싶은 사진을 누릅니다.',
        detail: '사진을 한 번 누르면 크게 볼 수 있어요.',
      },
      {
        instruction: '손가락 두 개로 화면을 벌리면 사진이 커져요.',
        detail: '손가락을 오므리면 다시 작아져요.',
      },
    ],
  },
  {
    id: 'taxi',
    title: '택시 앱 사용하기',
    description: '카카오T 앱으로 택시를 부르는 방법이에요.',
    steps: [
      {
        instruction: '"카카오T" 앱을 찾아 누릅니다.',
        detail: '노란색 T 모양 아이콘을 찾으세요.',
      },
      {
        instruction: '"어디로 갈까요?" 칸을 누릅니다.',
        detail: '가운데 검색 칸을 누르면 목적지를 입력할 수 있어요.',
      },
      {
        instruction: '가고 싶은 곳을 입력합니다.',
        detail: '예: 강남역, 서울대병원, 집 주소 등을 입력하세요.',
      },
      {
        instruction: '목적지를 선택한 후 "택시 호출" 버튼을 누릅니다.',
        detail: '파란색 "호출" 버튼을 누르면 택시를 찾아드려요.',
      },
      {
        instruction: '택시가 배정되면 기사님 정보가 보여요.',
        detail: '차 번호와 기사님 이름이 나와요. 조금 기다리시면 돼요.',
      },
    ],
  },
  {
    id: 'hospital',
    title: '병원/약국 찾기',
    description: '가까운 병원이나 약국을 찾는 방법이에요.',
    steps: [
      {
        instruction: '인터넷 검색창에 찾고 싶은 곳을 입력합니다.',
        detail: '예: "근처 내과", "가까운 약국", "서울 정형외과"',
      },
      {
        instruction: '검색 결과에서 원하는 병원을 누릅니다.',
        detail: '병원 이름, 위치, 진료 시간이 나와요.',
      },
      {
        instruction: '전화 아이콘을 누르면 바로 전화할 수 있어요.',
        detail: '전화 모양 아이콘을 누르면 병원에 전화가 연결돼요.',
      },
      {
        instruction: '길 찾기를 누르면 가는 길을 알려줘요.',
        detail: '"길 찾기" 또는 "지도" 버튼을 누르세요.',
      },
    ],
  },
  {
    id: 'scam-check',
    title: '사기 문자 확인하기',
    description: '의심스러운 문자가 왔을 때 확인하는 방법이에요.',
    steps: [
      {
        instruction: '의심스러운 문자를 받으셨나요?',
        detail: '링크 클릭, 돈 요구, 인증번호 요청이 있는 문자는 조심하세요.',
      },
      {
        instruction: '"사기 문자 확인" 기능을 사용해 보세요.',
        detail: '문자 내용을 붙여넣기 하면 위험한지 알려드려요.',
      },
      {
        instruction: '혼자 판단하기 어려우면 보호자에게 먼저 물어보세요.',
        detail: '"도와줘" 버튼을 누르면 보호자에게 확인 요청을 보낼 수 있어요.',
      },
    ],
  },
];

export function getGuideById(id: string): Guide | undefined {
  return guides.find((g) => g.id === id);
}
