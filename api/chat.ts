import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const FALLBACK = '죄송해요, 지금 답변을 드리기 어려워요. 보호자에게 도움을 요청해 보세요.';

const SYSTEM_PROMPT = `당신은 스마트폰 사용이 어려운 어르신(65세 이상)을 돕는 친절한 AI 비서입니다.

규칙:
- 항상 쉬운 한국어로, 짧고 명확하게 답변합니다.
- 어려운 용어는 쓰지 않습니다.
- 구체적인 행동 방법을 알려줄 때는 번호를 붙여 설명합니다.
- 답변은 3~5문장으로 간결하게 해주세요.
- 모르는 것은 솔직하게 "잘 모르겠어요"라고 말합니다.
- 항상 따뜻하고 친절한 말투를 사용합니다.
- "100% 확실해요", "무조건" 같은 단정 표현을 쓰지 않습니다.
- 스마트폰 사용법, 건강, 일상 궁금증 등을 친절하게 도와줍니다.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = (req.body ?? {}) as { message?: unknown; context?: unknown };

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ answer: FALLBACK });
  }

  if (message.length > 500) {
    return res.status(400).json({ answer: FALLBACK });
  }

  // 현재 화면 컨텍스트를 유저 메시지 앞에 주입
  const userContent = (context && typeof context === 'string' && context.trim())
    ? `[현재 화면 상황: ${context.trim().slice(0, 200)}]\n\n사용자 질문: ${message.trim()}`
    : message.trim();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ answer: FALLBACK });
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      temperature: 0.6,
      max_tokens: 300,
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? FALLBACK;
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('[chat] error:', err);
    return res.status(200).json({ answer: FALLBACK });
  }
}
