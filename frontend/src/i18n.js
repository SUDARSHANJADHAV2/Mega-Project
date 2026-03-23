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
      "Farm Maps": "Farm Maps",
      "Krushi Mandi": "Krushi Mandi",
      "Ledger": "Ledger",
      "Rent Equipment": "Rent Equipment",
      "Govt Schemes": "Govt Schemes",
      "Data Dashboard": "Data Dashboard",
      "Enterprise AI": "Enterprise AI",
      "Welcome to": "Welcome to",
      "Subtitle": "Your advanced agricultural assistant powered by Artificial Intelligence. Maximize your yield, detect diseases early, and optimize fertilizer use.",
      "Launch Tool": "Launch Tool",
      "Yield Predictor": "Yield Predictor",
      "Weed Detector": "Weed Detector",
      "Pest Recognition": "Pest Recognition",
      "Irrigation Forecaster": "Irrigation Forecaster"
    }
  },
  hi: {
    translation: {
      "Home": "होम",
      "Crop Recommender": "फसल अनुशंसा",
      "Fertilizer Recommender": "उर्वरक अनुशंसा",
      "Disease Recognition": "रोग पहचान",
      "Dashboard": "डैशबोर्ड",
      "Farm Maps": "खेत के नक्शे",
      "Krushi Mandi": "कृषि मंडी",
      "Ledger": "खाता-बही",
      "Rent Equipment": "उपकरण किराए पर लें",
      "Govt Schemes": "सरकारी योजनाएं",
      "Data Dashboard": "डेटा डैशबोर्ड",
      "Enterprise AI": "एंटरप्राइज़ AI",
      "Welcome to": "स्वागत है",
      "Subtitle": "कृत्रिम बुद्धिमत्ता (AI) द्वारा संचालित आपका उन्नत कृषि सहायक। अपनी उपज बढ़ाएं, बीमारियों का जल्दी पता लगाएं और उर्वरक का उपयोग अनुकूलित करें।",
      "Launch Tool": "लॉन्च करें",
      "Yield Predictor": "उपज भविष्यवक्ता",
      "Weed Detector": "खरपतवार डिटेक्टर",
      "Pest Recognition": "कीट पहचान",
      "Irrigation Forecaster": "सिंचाई पूर्वानुमान"
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
