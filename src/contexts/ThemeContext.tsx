import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);

  // 시스템 테마 감지
  const getSystemTheme = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // 실제 테마 계산 (system 모드일 때는 시스템 테마 사용)
  const getActualTheme = (): boolean => {
    if (themeMode === 'system') {
      return getSystemTheme();
    }
    return themeMode === 'dark';
  };

  // 테마 모드 설정
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('biolabs_theme_mode', mode);
    
    // 실제 테마 적용
    const actualTheme = getActualTheme();
    setIsDark(actualTheme);
    applyTheme(actualTheme);
  };

  // 테마 토글
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  // 테마 적용 (CSS 변수 설정)
  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    
    // data-theme 속성 설정 - 이것이 CSS 변수를 제어합니다
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    
    // CSS 변수 직접 설정은 제거 - index.css의 변수들이 자동으로 적용됩니다
    console.log(`Theme applied: ${dark ? 'dark' : 'light'}`);
  };

  // 시스템 테마 변경 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (themeMode === 'system') {
        const actualTheme = getSystemTheme();
        setIsDark(actualTheme);
        applyTheme(actualTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  // 초기화
  useEffect(() => {
    // 저장된 테마 모드 복원
    const savedThemeMode = localStorage.getItem('biolabs_theme_mode') as ThemeMode;
    if (savedThemeMode && ['light', 'dark', 'system'].includes(savedThemeMode)) {
      setThemeModeState(savedThemeMode);
    }

    // 실제 테마 적용
    const actualTheme = getActualTheme();
    setIsDark(actualTheme);
    applyTheme(actualTheme);
  }, []);

  // 테마 모드 변경 시 테마 재적용
  useEffect(() => {
    const actualTheme = getActualTheme();
    setIsDark(actualTheme);
    applyTheme(actualTheme);
  }, [themeMode]);

  const value: ThemeContextType = {
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
