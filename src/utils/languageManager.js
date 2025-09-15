// Language Management Utility
// This file handles all language-related operations for the BioLabs platform

export const SUPPORTED_LANGUAGES = {
  KO: 'ko',
  EN: 'en'
};

export const LANGUAGE_LABELS = {
  [SUPPORTED_LANGUAGES.KO]: '🇰🇷 한국어',
  [SUPPORTED_LANGUAGES.EN]: '🇺🇸 English'
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.KO;

// Language storage key for localStorage
const LANGUAGE_STORAGE_KEY = 'biolabs-preferred-language';

/**
 * Get the current language from localStorage or return default
 * @returns {string} Current language code
 */
export const getCurrentLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage && Object.values(SUPPORTED_LANGUAGES).includes(savedLanguage) 
      ? savedLanguage 
      : DEFAULT_LANGUAGE;
  } catch (error) {
    console.warn('Failed to get language from localStorage:', error);
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Save language preference to localStorage
 * @param {string} language - Language code to save
 * @returns {boolean} Success status
 */
export const setLanguage = (language) => {
  try {
    if (Object.values(SUPPORTED_LANGUAGES).includes(language)) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      // Update document language attribute
      document.documentElement.lang = language;
      return true;
    } else {
      console.warn(`Unsupported language: ${language}`);
      return false;
    }
  } catch (error) {
    console.error('Failed to save language to localStorage:', error);
    return false;
  }
};

/**
 * Get language label with flag emoji
 * @param {string} language - Language code
 * @returns {string} Formatted language label
 */
export const getLanguageLabel = (language) => {
  return LANGUAGE_LABELS[language] || LANGUAGE_LABELS[DEFAULT_LANGUAGE];
};

/**
 * Check if a language is supported
 * @param {string} language - Language code to check
 * @returns {boolean} Whether language is supported
 */
export const isLanguageSupported = (language) => {
  return Object.values(SUPPORTED_LANGUAGES).includes(language);
};

/**
 * Get all supported languages as array
 * @returns {Array} Array of supported language codes
 */
export const getSupportedLanguages = () => {
  return Object.values(SUPPORTED_LANGUAGES);
};

/**
 * Initialize language system
 * Sets up initial language and document attributes
 */
export const initializeLanguage = () => {
  const currentLang = getCurrentLanguage();
  document.documentElement.lang = currentLang;
  
  // Add language change event listener
  window.addEventListener('storage', (e) => {
    if (e.key === LANGUAGE_STORAGE_KEY) {
      const newLanguage = e.newValue;
      if (isLanguageSupported(newLanguage)) {
        document.documentElement.lang = newLanguage;
        // Dispatch custom event for components to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', { 
          detail: { language: newLanguage } 
        }));
      }
    }
  });
  
  return currentLang;
};

/**
 * Language change handler with validation
 * @param {string} newLanguage - New language to set
 * @returns {boolean} Success status
 */
export const changeLanguage = (newLanguage) => {
  if (!isLanguageSupported(newLanguage)) {
    console.warn(`Attempted to set unsupported language: ${newLanguage}`);
    return false;
  }
  
  const success = setLanguage(newLanguage);
  if (success) {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: newLanguage } 
    }));
  }
  
  return success;
};

/**
 * Get language-specific configuration
 * @param {string} language - Language code
 * @returns {object} Language configuration
 */
export const getLanguageConfig = (language = getCurrentLanguage()) => {
  const configs = {
    [SUPPORTED_LANGUAGES.KO]: {
      direction: 'ltr',
      rtl: false,
      dateFormat: 'YYYY-MM-DD',
      numberFormat: 'ko-KR',
      currency: 'KRW'
    },
    [SUPPORTED_LANGUAGES.EN]: {
      direction: 'ltr', 
      rtl: false,
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'en-US',
      currency: 'USD'
    }
  };
  
  return configs[language] || configs[DEFAULT_LANGUAGE];
};

/**
 * Format text based on current language direction
 * @param {string} text - Text to format
 * @param {string} language - Language code (optional)
 * @returns {object} Formatted text with direction info
 */
export const formatText = (text, language = getCurrentLanguage()) => {
  const config = getLanguageConfig(language);
  return {
    text,
    direction: config.direction,
    isRTL: config.rtl
  };
};

// Export default language manager object
export default {
  SUPPORTED_LANGUAGES,
  LANGUAGE_LABELS,
  DEFAULT_LANGUAGE,
  getCurrentLanguage,
  setLanguage,
  getLanguageLabel,
  isLanguageSupported,
  getSupportedLanguages,
  initializeLanguage,
  changeLanguage,
  getLanguageConfig,
  formatText
};
