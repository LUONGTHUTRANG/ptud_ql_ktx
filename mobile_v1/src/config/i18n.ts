import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import viTranslations from "../../locales/vi.json";
import enTranslations from "../../locales/en.json";

const resources = {
  vi: {
    translation: viTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "vi",
  lng: "vi",
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

// Load saved language from AsyncStorage
export const initializeLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("appLanguage");
    if (savedLanguage && (savedLanguage === "vi" || savedLanguage === "en")) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error("Error loading language:", error);
  }
};

export default i18n;
