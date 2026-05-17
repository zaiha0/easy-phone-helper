import type { ScamCheckResult } from '../types';

const CHAT_FALLBACK = '죄송해요, 지금 답변을 드리기 어려워요.';

export async function chatWithAI(message: string, context?: string): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });
    if (!res.ok) return CHAT_FALLBACK;
    const data = await res.json() as { answer?: string };
    return data.answer ?? CHAT_FALLBACK;
  } catch {
    return CHAT_FALLBACK;
  }
}

const FALLBACK: ScamCheckResult = {
  level: 'caution',
  summary: '지금은 분석을 할 수 없어요.',
  reasons: ['서버에 연결할 수 없어요.'],
  doNot: ['의심되는 링크를 누르지 마세요.'],
  nextAction: '보호자에게 먼저 확인하세요.',
};

export async function checkScam(message: string): Promise<ScamCheckResult> {
  try {
    const res = await fetch('/api/check-scam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) return FALLBACK;

    const data = await res.json();
    if (!data || !['safe', 'caution', 'danger'].includes(data.level)) return FALLBACK;
    return data as ScamCheckResult;
  } catch {
    return FALLBACK;
  }
}
