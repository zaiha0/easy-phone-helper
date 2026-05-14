import type { Guardian } from '../types';

export function buildHelpSmsUrl(guardian: Guardian, guideTitle?: string): string {
  const body = guideTitle
    ? `도움이 필요해요.\n지금 '${guideTitle}'에서 막혔어요.\n전화해 주세요.`
    : '도움이 필요해요. 전화해 주세요.';

  const phone = guardian.phone.replace(/[^0-9]/g, '');
  return `sms:${phone}?body=${encodeURIComponent(body)}`;
}

export function openHelpSms(guardian: Guardian, guideTitle?: string): void {
  const url = buildHelpSmsUrl(guardian, guideTitle);
  window.location.href = url;
}
