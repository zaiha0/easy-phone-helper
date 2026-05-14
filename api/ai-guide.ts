import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

const FALLBACK = '지금은 AI 도움 기능을 사용할 수 없어요. 보호자에게 연락해 도움을 요청해 보세요.';

const SYSTEM_PROMPT = `너는 스마트폰 사용이 어려운 어르신(65세 이상)을 돕는 친절한 안내 도우미다.
사용자가 현재 어떤 화면에 있는지 알려주면, 그 화면에서 막혔을 때 도움이 되는 안내를 한다.

규칙:
- 반드시 쉽고 짧은 한국어로 답한다. 어려운 용어를 쓰지 않는다.
- 2~3 문장을 넘지 않는다.
- 친근하고 따뜻한 말투를 사용한다. (예: "~해 보세요", "~하면 돼요")
- 어르신이 겁먹지 않도록 "걱정 마세요", "천천히 해도 괜찮아요" 같은 표현을 자연스럽게 넣는다.
- 기술 용어(UI, 버튼, 클릭 등) 대신 "누르세요", "화면을 눌러요" 같은 말을 쓴다.
- JSON이나 특수 형식 없이 평문 한국어로만 답한다.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ answer: FALLBACK });
  }

  const { context } = (req.body ?? {}) as { context?: unknown };

  if (!context || typeof context !== 'string' || context.length > 500) {
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
      max_tokens: 200,
    });

    const answer = completion.choices[0]?.message?.content?.trim() ?? FALLBACK;
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('[ai-guide] error:', err);
    return res.status(200).json({ answer: FALLBACK });
  }
}
