import { createContext, useContext, useState, type ReactNode } from 'react';

interface MagnifierContextType {
  magnifierOn: boolean;
  toggleMagnifier: () => void;
}

const MagnifierContext = createContext<MagnifierContextType>({
  magnifierOn: false,
  toggleMagnifier: () => {},
});

export function MagnifierProvider({ children }: { children: ReactNode }) {
  const [magnifierOn, setMagnifierOn] = useState(false);

  return (
    <MagnifierContext.Provider value={{ magnifierOn, toggleMagnifier: () => setMagnifierOn(v => !v) }}>
      {children}
    </MagnifierContext.Provider>
  );
}

export const useMagnifier = () => useContext(MagnifierContext);
