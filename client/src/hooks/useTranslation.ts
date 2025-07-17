
import { useUserPreferences } from './useLocalStorage';
import en from '../locales/en.json';
import tn from '../locales/tn.json';

export type SupportedLanguage = 'en' | 'tn';

const translations: Record<SupportedLanguage, any> = { en, tn };

function getNested(obj: any, path: string[]): any {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export const useTranslation = () => {
  const { preferences, updatePreference } = useUserPreferences();
  const language = (preferences.language || 'en') as SupportedLanguage;

  const t = (key: string): string => {
    const path = key.split('.');
    let value = getNested(translations[language], path);
    if (value === undefined) {
      value = getNested(translations.en, path);
    }
    return typeof value === 'string' ? value : key;
  };

  const setLanguage = (lang: SupportedLanguage) => {
    updatePreference('language', lang);
  };

  return { t, language, setLanguage };
};
