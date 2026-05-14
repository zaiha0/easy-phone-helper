import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import type { IncomingMessage, ServerResponse } from 'http'
import path from 'path'

const FALLBACK = {
  level: 'caution',
  summary: '지금은 분석 기능을 사용할 수 없어요.',
  reasons: ['서버 설정이 완료되지 않았어요.'],
  doNot: ['의심되는 링크를 누르지 마세요.', '인증번호를 알려주지 마세요.'],
  nextAction: '보호자에게 먼저 확인하세요.',
}

const SYSTEM_PROMPT = `너는 시니어 사용자를 돕는 보안 안내 도우미다.
사용자가 입력한 문자 메시지가 사기, 피싱, 스미싱 위험이 있는지 판단한다.

규칙:
- 100% 확정 표현을 쓰지 않는다. "위험할 수 있어요", "주의가 필요해요" 등의 표현을 사용한다.
- 쉬운 한국어로 설명한다. 어려운 용어를 쓰지 않는다.
- 시니어가 바로 행동할 수 있는 안전 수칙을 알려준다.
- 링크 클릭, 송금, 인증번호 전달, 앱 설치 요청이 있으면 강하게 경고한다.
- 결과는 반드시 JSON으로만 반환한다.

반환 형식:
{
  "level": "safe | caution | danger",
  "summary": "한 문장 요약",
  "reasons": ["이유1", "이유2"],
  "doNot": ["하지 말아야 할 행동1", "하지 말아야 할 행동2"],
  "nextAction": "다음 행동"
}`

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk: Buffer) => { body += chunk.toString() })
    req.on('end', () => resolve(body))
  })
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: '쉬운폰 도우미',
          short_name: '쉬운폰',
          description: '시니어를 위한 스마트폰 도우미',
          theme_color: '#2563eb',
          background_color: '#f8f9fa',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
      }),
      {
        name: 'api-dev-middleware',
        configureServer(server) {
          server.middlewares.use(
            '/api/check-scam',
            async (req: IncomingMessage, res: ServerResponse) => {
              res.setHeader('Content-Type', 'application/json')

              if (req.method !== 'POST') {
                res.writeHead(405)
                res.end(JSON.stringify({ error: 'Method not allowed' }))
                return
              }

              const apiKey = env.GROQ_API_KEY
              if (!apiKey) {
                res.writeHead(200)
                res.end(JSON.stringify(FALLBACK))
                return
              }

              try {
                const raw = await readBody(req)
                const { message } = JSON.parse(raw) as { message?: string }

                if (!message || typeof message !== 'string' || message.length > 1500) {
                  res.writeHead(400)
                  res.end(JSON.stringify({ error: 'message 필드가 필요해요.' }))
                  return
                }

                const Groq = (await import('groq-sdk')).default
                const groq = new Groq({ apiKey })
                const completion = await groq.chat.completions.create({
                  model: 'llama-3.3-70b-versatile',
                  messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: message },
                  ],
                  response_format: { type: 'json_object' },
                  temperature: 0.2,
                  max_tokens: 800,
                })

                const text = completion.choices[0]?.message?.content ?? ''
                const parsed = JSON.parse(text)
                if (!parsed.level || !parsed.summary) throw new Error('invalid response')

                res.writeHead(200)
                res.end(JSON.stringify(parsed))
              } catch (err) {
                console.error('[api-dev] error:', err)
                res.writeHead(200)
                res.end(JSON.stringify(FALLBACK))
              }
            }
          )
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
