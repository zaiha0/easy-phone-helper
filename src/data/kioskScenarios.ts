export interface PracticeOption {
  id: string;
  label: string;
  emoji?: string;
}

export interface PracticeStep {
  id: string;
  screenTitle: string;
  instruction: string;
  helpText: string;
  options: PracticeOption[];
  correctOptionId: string;
  successMessage: string;
  retryMessage: string;
}

export interface KioskScenario {
  id: string;
  title: string;
  description: string;
  steps: PracticeStep[];
}

export const cafeScenario: KioskScenario = {
  id: 'cafe',
  title: '카페 음료 주문하기',
  description: '키오스크로 커피를 주문하는 연습이에요.',
  steps: [
    {
      id: 'dine-or-takeout',
      screenTitle: '이용 방법을 선택해 주세요',
      instruction: '오늘은 카페 안에서 마실 거예요. 아래에서 "매장" 버튼을 눌러보세요.',
      helpText: '"매장"은 카페 안에서 마시는 것, "포장"은 들고 나가는 것이에요.',
      options: [
        { id: 'dine-in', label: '매장', emoji: '🪑' },
        { id: 'takeout', label: '포장', emoji: '🛍️' },
      ],
      correctOptionId: 'dine-in',
      successMessage: '잘하셨어요! 매장을 선택했어요.',
      retryMessage: '이번에는 "매장" 버튼을 눌러보세요.',
    },
    {
      id: 'category',
      screenTitle: '메뉴를 선택해 주세요',
      instruction: '오늘은 커피를 마실 거예요. 아래에서 "커피" 버튼을 눌러보세요.',
      helpText: '"커피"를 누르면 아메리카노, 라테 같은 커피 메뉴가 나와요.',
      options: [
        { id: 'coffee', label: '커피', emoji: '☕' },
        { id: 'tea', label: '차/음료', emoji: '🍵' },
        { id: 'juice', label: '주스', emoji: '🧃' },
      ],
      correctOptionId: 'coffee',
      successMessage: '좋아요! 커피 메뉴로 이동할게요.',
      retryMessage: '"커피" 버튼을 눌러보세요.',
    },
    {
      id: 'menu',
      screenTitle: '커피 메뉴를 골라주세요',
      instruction: '오늘은 아메리카노를 주문할 거예요. "아메리카노" 버튼을 눌러보세요.',
      helpText: '아메리카노는 가장 기본적인 블랙 커피예요.',
      options: [
        { id: 'americano', label: '아메리카노', emoji: '☕' },
        { id: 'latte', label: '카페라테', emoji: '🥛' },
        { id: 'mocha', label: '카페모카', emoji: '🍫' },
      ],
      correctOptionId: 'americano',
      successMessage: '아메리카노를 선택했어요!',
      retryMessage: '"아메리카노" 버튼을 눌러보세요.',
    },
    {
      id: 'size',
      screenTitle: '크기를 선택해 주세요',
      instruction: '보통 크기로 주문할 거예요. "중간 (M)" 버튼을 눌러보세요.',
      helpText: '"중간(M)"은 가장 일반적인 사이즈예요. 작게(S)는 더 적고, 크게(L)는 더 많아요.',
      options: [
        { id: 'small', label: '작게 (S)', emoji: '🥤' },
        { id: 'medium', label: '중간 (M)', emoji: '🧋' },
        { id: 'large', label: '크게 (L)', emoji: '🫙' },
      ],
      correctOptionId: 'medium',
      successMessage: '중간 사이즈를 골랐어요!',
      retryMessage: '"중간 (M)" 버튼을 눌러보세요.',
    },
    {
      id: 'payment',
      screenTitle: '결제 방법을 선택해 주세요',
      instruction: '카드로 계산할 거예요. "카드 결제" 버튼을 눌러보세요.',
      helpText: '카드를 단말기에 대거나 꽂으면 계산이 돼요.',
      options: [
        { id: 'card', label: '카드 결제', emoji: '💳' },
        { id: 'cash', label: '현금 결제', emoji: '💵' },
      ],
      correctOptionId: 'card',
      successMessage: '카드 결제를 선택했어요!',
      retryMessage: '"카드 결제" 버튼을 눌러보세요.',
    },
    {
      id: 'confirm',
      screenTitle: '주문을 확인해 주세요',
      instruction: '주문 내용이 맞으면 "주문 확인" 버튼을 눌러주세요.',
      helpText: '"주문 확인"을 누르면 주문이 완료돼요. "취소하기"는 처음부터 다시 시작해요.',
      options: [
        { id: 'confirm', label: '주문 확인', emoji: '✅' },
        { id: 'cancel', label: '취소하기', emoji: '❌' },
      ],
      correctOptionId: 'confirm',
      successMessage: '완료했어요!',
      retryMessage: '"주문 확인" 버튼을 눌러보세요.',
    },
  ],
};

export const kioskScenarios: KioskScenario[] = [cafeScenario];
