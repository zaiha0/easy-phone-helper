const KAKAO_T_ANDROID = 'https://play.google.com/store/apps/details?id=com.kakao.taxi';
const KAKAO_T_IOS = 'https://apps.apple.com/kr/app/kakao-t/id981110422';

export function getKakaoTStoreLink(): string {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return KAKAO_T_IOS;
  return KAKAO_T_ANDROID;
}

export function openKakaoTStore(): void {
  window.open(getKakaoTStoreLink(), '_blank', 'noopener,noreferrer');
}
