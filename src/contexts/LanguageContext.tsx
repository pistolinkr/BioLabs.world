import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import languageManager, { 
  getCurrentLanguage, 
  changeLanguage, 
  getLanguageLabel,
  initializeLanguage,
  SUPPORTED_LANGUAGES 
} from '../utils/languageManager';
import koTranslations from '../locales/ko.json';
import enTranslations from '../locales/en.json';

// 언어 타입 정의
export type Language = 'ko' | 'en';

// 언어 컨텍스트 타입 정의
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  getLanguageLabel: (language?: Language) => string;
  supportedLanguages: string[];
}

// 언어 컨텍스트 생성
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 언어별 번역 객체
const translations = {
  ko: koTranslations,
  en: enTranslations,
};

// 언어 컨텍스트 프로바이더 컴포넌트
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // 기본 언어를 language manager에서 가져오기
  const [language, setLanguageState] = useState<Language>(() => {
    return getCurrentLanguage() as Language;
  });

  // 언어 변경 함수
  const setLanguage = (newLanguage: Language) => {
    const success = changeLanguage(newLanguage);
    if (success) {
      setLanguageState(newLanguage);
    }
  };

  // 번역 함수
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    // 중첩된 키를 순회하여 값을 찾기
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 키를 찾을 수 없으면 키 자체를 반환
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  // 언어 변경 시 문서 언어 속성 업데이트 및 언어 매니저 초기화
  useEffect(() => {
    initializeLanguage();
    
    // 언어 변경 이벤트 리스너
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguageState(event.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    getLanguageLabel: (lang?: Language) => getLanguageLabel(lang || language),
    supportedLanguages: Object.values(SUPPORTED_LANGUAGES),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// 언어 컨텍스트 사용을 위한 커스텀 훅
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
