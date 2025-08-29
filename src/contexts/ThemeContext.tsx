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
    
    // data-theme 속성 설정
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    
    if (dark) {
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#121212');
      root.style.setProperty('--bg-tertiary', '#1a1a1a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#cccccc');
      root.style.setProperty('--text-muted', '#888888');
      root.style.setProperty('--border-primary', '#333333');
      root.style.setProperty('--border-secondary', '#ffffff');
      root.style.setProperty('--accent-primary', '#4CAF50');
      root.style.setProperty('--accent-secondary', '#2196F3');
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f5f5f5');
      root.style.setProperty('--bg-tertiary', '#e0e0e0');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#333333');
      root.style.setProperty('--text-muted', '#666666');
      root.style.setProperty('--border-primary', '#e0e0e0');
      root.style.setProperty('--border-secondary', '#000000');
      root.style.setProperty('--accent-primary', '#4CAF50');
      root.style.setProperty('--accent-secondary', '#2196F3');
    }
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
