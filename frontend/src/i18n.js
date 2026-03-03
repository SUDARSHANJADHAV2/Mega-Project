import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Adding translation resources for Home Page and Navigation as examples.
const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Crop Recommender": "Crop Recommender",
      "Fertilizer Recommender": "Fertilizer Recommender",
      "Disease Recognition": "Disease Recognition",
      "Dashboard": "Dashboard",
      "Welcome to": "Welcome to",
      "Subtitle": "Your advanced agricultural assistant powered by Artificial Intelligence. Maximize your yield, detect diseases early, and optimize fertilizer use.",
      "Launch Tool": "Launch Tool"
    }
  },
  hi: {
    translation: {
      "Home": "होम",
      "Crop Recommender": "फसल अनुशंसा (Crop)",
      "Fertilizer Recommender": "उर्वरक अनुशंसा (Fertilizer)",
      "Disease Recognition": "रोग पहचान (Disease)",
      "Dashboard": "डैशबोर्ड",
      "Welcome to": "स्वागत है",
      "Subtitle": "कृत्रिम बुद्धिमत्ता (AI) द्वारा संचालित आपका उन्नत कृषि सहायक। अपनी उपज बढ़ाएं, बीमारियों का जल्दी पता लगाएं और उर्वरक का उपयोग अनुकूलित करें।",
      "Launch Tool": "उपकरण लॉन्च करें"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
