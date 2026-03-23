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
      "Subtitle": "Your advanced agricultural assistant powered by Artificial Intelligence. Maximize your yield, detect diseases early, and optimize fertilizer use.",
      "Launch Tool": "Launch Tool",
      "Yield Predictor": "Yield Predictor",
      "Weed Detector": "Weed Detector",
      "Pest Recognition": "Pest Recognition",
      "Irrigation Forecaster": "Irrigation Forecaster",
      "edition": "KrushiAI Enterprise Edition V2.0 🚀",
      "hero_title": "Farming Intelligence for the Modern Era.",
      "hero_desc": "Leverage NASA-grade satellite metrics, state-of-the-art Convolutional Neural Networks, and Random Forest classifiers to guarantee maximum land yield.",
      "Start Analysis": "Start Analysis",
      "AI Accuracy": "AI Accuracy",
      "PWA Offline Capable": "PWA Offline Capable",
      "Real-time Telemetry": "Real-time Telemetry",
      "Modules Title": "Enterprise AI Modules",
      "Modules Desc": "Select one of our specialized deep-learning engines to process your farm data instantly.",
      "Execute Model": "Execute Model"
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
      "Subtitle": "कृत्रिम बुद्धिमत्ता (AI) द्वारा संचालित आपका उन्नत कृषि सहायक। अपनी उपज बढ़ाएं, बीमारियों का जल्दी पता लगाएं और उर्वरक का उपयोग अनुकूलित करें।",
      "Launch Tool": "लॉन्च करें",
      "Yield Predictor": "उपज भविष्यवक्ता",
      "Weed Detector": "खरपतवार डिटेक्टर",
      "Pest Recognition": "कीट पहचान",
      "Irrigation Forecaster": "सिंचाई पूर्वानुमान",
      "edition": "KrushiAI एंटरप्राइज़ संस्करण V2.0 🚀",
      "hero_title": "आधुनिक युग के लिए कृषि बुद्धिमत्ता।",
      "hero_desc": "अधिकतम उपज की गारंटी के लिए नासा-ग्रेड उपग्रह डेटा, अत्याधुनिक कन्वोल्यूशनल न्यूरल नेटवर्क और रैंडम फॉरेस्ट का लाभ उठाएं।",
      "Start Analysis": "विश्लेषण शुरू करें",
      "AI Accuracy": "AI सटीकता",
      "PWA Offline Capable": "PWA ऑफ़लाइन सक्षम",
      "Real-time Telemetry": "रीयल-टाइम टेलीमेट्री",
      "Modules Title": "एंटरप्राइज़ AI मॉड्यूल",
      "Modules Desc": "अपने कृषि डेटा को तुरंत संसाधित करने के लिए हमारे विशेष डीप-लर्निंग इंजन में से एक का चयन करें।",
      "Execute Model": "मॉडल चलाएं"
    }
  },
  mr: { translation: { "Home": "मुख्यपृष्ठ", "Crop Recommender": "पीक शिफारस", "Dashboard": "डॅशबोर्ड", "Farm Maps": "शेताचे नकाशे", "Krushi Mandi": "कृषी बाजार", "Govt Schemes": "सरकारी योजना" } },
  pa: { translation: { "Home": "ਮੁੱਖ ਪੰਨਾ", "Crop Recommender": "ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼", "Dashboard": "ਡੈਸ਼ਬੋਰਡ", "Farm Maps": "ਖੇਤ ਦੇ ਨਕਸ਼ੇ", "Krushi Mandi": "ਕ੍ਰਿਸ਼ੀ ਮੰਡੀ", "Govt Schemes": "ਸਰਕਾਰੀ ਸਕੀਮਾਂ" } },
  gu: { translation: { "Home": "હોમ", "Crop Recommender": "પાક ભલામણ", "Dashboard": "ડેશબોર્ડ", "Farm Maps": "ખેતરના નકશા", "Krushi Mandi": "કૃષિ મંડી", "Govt Schemes": "સરકારી યોજનાઓ" } },
  ta: { translation: { "Home": "முகப்பு", "Crop Recommender": "பயிர் பரிந்துரை", "Dashboard": "டாஷ்போர்டு", "Farm Maps": "பண்ணை வரைபடங்கள்", "Krushi Mandi": "கிருஷி மண்டி", "Govt Schemes": "அரசு திட்டங்கள்" } },
  te: { translation: { "Home": "హోమ్", "Crop Recommender": "పంట సిఫార్సు", "Dashboard": "డాష్‌బోర్డ్", "Farm Maps": "పొలం పటాలు", "Krushi Mandi": "కృషి మండి", "Govt Schemes": "ప్రభుత్వ పథకాలు" } }
};

const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
