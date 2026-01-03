import i18n from "../config/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LanguageService = {
  getCurrentLanguage: (): string => {
    return i18n.language || "vi";
  },

  setLanguage: async (language: string): Promise<void> => {
    try {
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem("appLanguage", language);
    } catch (error) {
      console.error("Error setting language:", error);
    }
  },

  getSupportedLanguages: () => [
    { code: "vi", name: "Tiếng Việt" },
    { code: "en", name: "English" },
  ],
};
