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
      instruction: '여기서 드실 건가요, 아니면 포장하실 건가요?',
      helpText: '가게 안에서 마시면 "매장"을, 밖에서 마시면 "포장"을 누르세요.',
      options: [
        { id: 'dine-in', label: '매장', emoji: '🪑' },
        { id: 'takeout', label: '포장', emoji: '🛍️' },
      ],
      correctOptionId: 'dine-in',
      successMessage: '잘하셨어요! 매장을 선택했어요.',
      retryMessage: '괜찮아요. 이번에는 "매장"을 눌러보세요.',
    },
    {
      id: 'category',
      screenTitle: '메뉴를 선택해 주세요',
      instruction: '어떤 종류의 음료를 드실 건가요?',
      helpText: '커피가 마시고 싶으면 "커피" 버튼을 눌러보세요.',
      options: [
        { id: 'coffee', label: '커피', emoji: '☕' },
        { id: 'tea', label: '차/음료', emoji: '🍵' },
        { id: 'juice', label: '주스', emoji: '🧃' },
      ],
      correctOptionId: 'coffee',
      successMessage: '좋아요! 커피 메뉴로 이동할게요.',
      retryMessage: '괜찮아요. "커피" 버튼을 눌러보세요.',
    },
    {
      id: 'menu',
      screenTitle: '커피 메뉴를 골라주세요',
      instruction: '어떤 커피로 하시겠어요?',
      helpText: '아메리카노는 가장 기본적인 블랙 커피예요. "아메리카노"를 눌러보세요.',
      options: [
        { id: 'americano', label: '아메리카노', emoji: '☕' },
        { id: 'latte', label: '카페라테', emoji: '🥛' },
        { id: 'mocha', label: '카페모카', emoji: '🍫' },
      ],
      correctOptionId: 'americano',
      successMessage: '아메리카노를 선택했어요!',
      retryMessage: '괜찮아요. "아메리카노"를 눌러보세요.',
    },
    {
      id: 'size',
      screenTitle: '크기를 선택해 주세요',
      instruction: '음료 크기를 고르세요.',
      helpText: '"중간"은 보통 사이즈예요. "중간"을 눌러보세요.',
      options: [
        { id: 'small', label: '작게 (S)', emoji: '🥤' },
        { id: 'medium', label: '중간 (M)', emoji: '🧋' },
        { id: 'large', label: '크게 (L)', emoji: '🫙' },
      ],
      correctOptionId: 'medium',
      successMessage: '중간 사이즈를 골랐어요!',
      retryMessage: '괜찮아요. "중간"을 눌러보세요.',
    },
    {
      id: 'payment',
      screenTitle: '결제 방법을 선택해 주세요',
      instruction: '어떻게 계산하실 건가요?',
      helpText: '카드로 계산하려면 "카드 결제"를 누르세요.',
      options: [
        { id: 'card', label: '카드 결제', emoji: '💳' },
        { id: 'cash', label: '현금 결제', emoji: '💵' },
      ],
      correctOptionId: 'card',
      successMessage: '카드 결제를 선택했어요!',
      retryMessage: '괜찮아요. "카드 결제"를 눌러보세요.',
    },
    {
      id: 'confirm',
      screenTitle: '주문을 확인해 주세요',
      instruction: '주문 내용이 맞으면 "주문 확인" 버튼을 눌러주세요.',
      helpText: '"주문 확인" 버튼을 누르면 주문이 완료돼요.',
      options: [
        { id: 'confirm', label: '주문 확인', emoji: '✅' },
        { id: 'cancel', label: '취소하기', emoji: '❌' },
      ],
      correctOptionId: 'confirm',
      successMessage: '완료했어요!',
      retryMessage: '괜찮아요. "주문 확인"을 눌러보세요.',
    },
  ],
};

export const kioskScenarios: KioskScenario[] = [cafeScenario];
