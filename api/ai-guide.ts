import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const FALLBACK = '지금은 AI 도움 기능을 사용할 수 없어요. 보호자에게 연락해 도움을 요청해 보세요.';

const SYSTEM_PROMPT = `너는 스마트폰 사용이 어려운 어르신(65세 이상)을 돕는 친절한 안내 도우미다.
사용자가 지금 보고 있는 화면과 단계를 알려주면, 그 단계에서 막혔을 때 도움이 되는 안내를 제공한다.

중요 규칙:
- 반드시 지금 화면/단계에서 막혔을 때만 도움을 준다. 이전 단계나 다른 화면 설명을 반복하지 않는다.
- 쉽고 짧은 한국어로 답한다. 어려운 용어를 쓰지 않는다.
- 최대 3문장으로 답한다.
- 친근하고 따뜻한 말투를 사용한다.
- "누르세요", "화면을 눌러요" 같은 표현을 쓴다. "클릭", "UI" 같은 용어는 쓰지 않는다.
- 사용자가 지금 봐야 할 것, 지금 눌러야 할 것을 명확히 알려준다.
- 마지막 문장은 "그래도 어려우시면 보호자에게 도움을 요청해 보세요."를 자연스럽게 포함한다.
- JSON 형식 없이 평문 한국어로만 답한다.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ answer: FALLBACK });
  }

  const { context } = (req.body ?? {}) as { context?: unknown };

  if (!context || typeof context !== 'string' || context.length > 800) {
    return res.status(400).json({ error: 'context 필드가 필요해요.' });
  }

  try {
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: context },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? FALLBACK;
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('[ai-guide] error:', err);
    return res.status(200).json({ answer: FALLBACK });
  }
}
