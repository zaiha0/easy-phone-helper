export function triggerHapticFeedback(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(30);
  }
}
