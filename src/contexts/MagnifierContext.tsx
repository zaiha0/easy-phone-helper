import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface MagnifierContextType {
  magnifierOn: boolean;
  toggleMagnifier: () => void;
}

const MagnifierContext = createContext<MagnifierContextType>({
  magnifierOn: false,
  toggleMagnifier: () => {},
});

export function MagnifierProvider({ children }: { children: ReactNode }) {
  const [magnifierOn, setMagnifierOn] = useState(() => {
    return localStorage.getItem('magnifier_on') === 'true';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (magnifierOn) {
      html.classList.add('magnifier-on');
    } else {
      html.classList.remove('magnifier-on');
    }
    localStorage.setItem('magnifier_on', String(magnifierOn));
  }, [magnifierOn]);

  return (
    <MagnifierContext.Provider value={{ magnifierOn, toggleMagnifier: () => setMagnifierOn(v => !v) }}>
      {children}
    </MagnifierContext.Provider>
  );
}

export const useMagnifier = () => useContext(MagnifierContext);
