// 네이버지도 URL 빌더
export function naverMapSearch(query: string): string {
  const encoded = encodeURIComponent(query);
  return `nmap://search?query=${encoded}&appname=com.deaieum`;
}

export function naverMapTransit(destName: string, destLat?: number, destLng?: number): string {
  if (destLat && destLng) {
    return `nmap://route/public?dlat=${destLat}&dlng=${destLng}&dname=${encodeURIComponent(destName)}&appname=com.deaieum`;
  }
  return `https://map.naver.com/v5/search/${encodeURIComponent(destName)}`;
}

export function naverMapBusStop(lat?: number, lng?: number): string {
  if (lat && lng) {
    return `nmap://search?query=버스정류장&lat=${lat}&lng=${lng}&appname=com.deaieum`;
  }
  return `https://map.naver.com/v5/search/버스정류장`;
}

export function naverMapFallback(query: string): string {
  return `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
}

// 카카오맵 URL 빌더
export function kakaoMapSearch(query: string): string {
  return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
}

export function kakaoMapTransit(destName: string, destLat?: number, destLng?: number): string {
  if (destLat && destLng) {
    return `kakaomap://route?ep=${destLat},${destLng}&by=PUBLICTRANSIT`;
  }
  return `https://map.kakao.com/link/to/${encodeURIComponent(destName)}`;
}
