import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

interface ScamCheckResult {
  level: 'safe' | 'caution' | 'danger';
  summary: string;
  reasons: string[];
  doNot: string[];
  nextAction: string;
}

const FALLBACK_CAUTION: ScamCheckResult = {
  level: 'caution',
  summary: '지금은 분석 기능을 사용할 수 없어요.',
  reasons: ['서버 설정이 완료되지 않았어요.'],
  doNot: ['의심되는 링크를 누르지 마세요.', '인증번호를 알려주지 마세요.'],
  nextAction: '보호자에게 먼저 확인하세요.',
};

const SYSTEM_PROMPT = `너는 시니어 사용자를 돕는 보안 안내 도우미다.
사용자가 입력한 문자 메시지가 사기, 피싱, 스미싱 위험이 있는지 판단한다.

규칙:
- 100% 확정 표현을 쓰지 않는다. "위험할 수 있어요", "주의가 필요해요" 등의 표현을 사용한다.
- 쉬운 한국어로 설명한다. 어려운 용어를 쓰지 않는다.
- 시니어가 바로 행동할 수 있는 안전 수칙을 알려준다.
- 링크 클릭, 송금, 인증번호 전달, 앱 설치 요청이 있으면 강하게 경고한다.
- 결과는 반드시 JSON으로만 반환한다. 다른 텍스트는 포함하지 않는다.

반환 형식:
{
  "level": "safe | caution | danger",
  "summary": "한 문장 요약 (쉬운 한국어)",
  "reasons": ["쉬운 이유 1", "쉬운 이유 2"],
  "doNot": ["하지 말아야 할 행동 1", "하지 말아야 할 행동 2"],
  "nextAction": "다음 행동 (보호자 확인 유도 등)"
}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(200).json(FALLBACK_CAUTION);
  }

  const { message } = (req.body ?? {}) as { message?: unknown };

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message 필드가 필요해요.' });
  }

  if (message.length > 1500) {
    return res.status(400).json({ error: '문자 내용이 너무 길어요. 1500자 이하로 입력해 주세요.' });
  }

  try {
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    const parsed = JSON.parse(raw) as ScamCheckResult;

    if (!parsed.level || !parsed.summary) {
      return res.status(200).json(FALLBACK_CAUTION);
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error('[check-scam] error:', err);
    return res.status(200).json(FALLBACK_CAUTION);
  }
}
