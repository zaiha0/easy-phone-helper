import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setValue = useCallback(
    (val: T) => {
      setStored(val);
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch {
        // 저장 실패 무시
      }
    },
    [key]
  );

  return [stored, setValue];
}
