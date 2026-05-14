import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSettings, setSettings } from '../lib/storage';
import type { UserSettings } from '../types';

type FontSize = UserSettings['fontSize'];

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: 'normal',
  setFontSize: () => {},
});

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => getSettings().fontSize);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('font-size-large', 'font-size-xlarge');
    if (fontSize === 'large') html.classList.add('font-size-large');
    if (fontSize === 'xlarge') html.classList.add('font-size-xlarge');
  }, [fontSize]);

  const setFontSize = (size: FontSize) => {
    setSettings({ ...getSettings(), fontSize: size });
    setFontSizeState(size);
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext);
