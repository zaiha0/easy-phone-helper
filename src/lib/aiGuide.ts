export async function fetchAiGuide(context: string): Promise<string> {
  try {
    const res = await fetch('/api/ai-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    });
    const data = (await res.json()) as { answer?: string };
    return data.answer ?? '지금은 도움말을 불러올 수 없어요. 잠시 후 다시 눌러 보세요.';
  } catch {
    return '인터넷 연결을 확인하고 다시 눌러 보세요.';
  }
}
