import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Adding translation resources for Home Page and Navigation as examples.
const resources = {
  en: {
    translation: {
      "Home": "Home", "Crop Recommender": "Crop Recommender", "Fertilizer Recommender": "Fertilizer Recommender", "Disease Recognition": "Disease Recognition", "Dashboard": "Dashboard", "Farm Maps": "Farm Maps", "Krushi Mandi": "Krushi Mandi", "Ledger": "Ledger", "Rent Equipment": "Rent Equipment", "Govt Schemes": "Govt Schemes", "Data Dashboard": "Data Dashboard", "Enterprise AI": "Enterprise AI",
      "Subtitle": "Your advanced agricultural assistant powered by Artificial Intelligence. Maximize your yield, detect diseases early, and optimize fertilizer use.",
      "Launch Tool": "Launch Tool", "Yield Predictor": "Yield Predictor", "Weed Detector": "Weed Detector", "Pest Recognition": "Pest Recognition", "Irrigation Forecaster": "Irrigation Forecaster",
      "edition": "KrushiAI Enterprise Edition V2.0 🚀", "hero_title": "Farming Intelligence for the Modern Era.", "hero_desc": "Leverage NASA-grade satellite metrics, state-of-the-art Convolutional Neural Networks, and Random Forest classifiers to guarantee maximum land yield.", "Start Analysis": "Start Analysis", "AI Accuracy": "AI Accuracy", "PWA Offline Capable": "PWA Offline Capable", "Real-time Telemetry": "Real-time Telemetry", "Modules Title": "Enterprise AI Modules", "Modules Desc": "Select one of our specialized deep-learning engines to process your farm data instantly.", "Execute Model": "Execute Model",
      "Welcome Back": "Welcome Back", "Join KrushiAI": "Join KrushiAI", "Sign in to access your farm ERP.": "Sign in to access your farm ERP.", "Create an account to manage your farm.": "Create an account to manage your farm.",
      "Full Name": "Full Name", "Email Address": "Email Address", "Password": "Password", "Sign In": "Sign In", "Create Account": "Create Account", "Don't have an account? ": "Don't have an account? ", "Already have an account? ": "Already have an account? ", "Register": "Register", "Login": "Login"
    }
  },
  hi: {
    translation: {
      "Home": "होम", "Crop Recommender": "फसल अनुशंसा", "Fertilizer Recommender": "उर्वरक अनुशंसा", "Disease Recognition": "रोग पहचान", "Dashboard": "डैशबोर्ड", "Farm Maps": "खेत के नक्शे", "Krushi Mandi": "कृषि मंडी", "Ledger": "खाता-बही", "Rent Equipment": "उपकरण किराए पर लें", "Govt Schemes": "सरकारी योजनाएं", "Data Dashboard": "डेटा डैशबोर्ड", "Enterprise AI": "एंटरप्राइज़ AI",
      "Subtitle": "कृत्रिम बुद्धिमत्ता (AI) द्वारा संचालित आपका उन्नत कृषि सहायक। अपनी उपज बढ़ाएं, बीमारियों का जल्दी पता लगाएं और उर्वरक का उपयोग अनुकूलित करें।",
      "Launch Tool": "लॉन्च करें", "Yield Predictor": "उपज भविष्यवक्ता", "Weed Detector": "खरपतवार डिटेक्टर", "Pest Recognition": "कीट पहचान", "Irrigation Forecaster": "सिंचाई पूर्वानुमान",
      "edition": "KrushiAI एंटरप्राइज़ संस्करण V2.0 🚀", "hero_title": "आधुनिक युग के लिए कृषि बुद्धिमत्ता।", "hero_desc": "अधिकतम उपज की गारंटी के लिए नासा-ग्रेड उपग्रह डेटा, अत्याधुनिक कन्वोल्यूशनल न्यूरल नेटवर्क और रैंडम फॉरेस्ट का लाभ उठाएं।", "Start Analysis": "विश्लेषण शुरू करें", "AI Accuracy": "AI सटीकता", "PWA Offline Capable": "PWA ऑफ़लाइन सक्षम", "Real-time Telemetry": "रीयल-टाइम टेलीमेट्री", "Modules Title": "एंटरप्राइज़ AI मॉड्यूल", "Modules Desc": "अपने कृषि डेटा को तुरंत संसाधित करने के लिए हमारे विशेष डीप-लर्निंग इंजन में से एक का चयन करें।", "Execute Model": "मॉडल चलाएं",
      "Welcome Back": "वापस स्वागत है", "Join KrushiAI": "KrushiAI से जुड़ें", "Sign in to access your farm ERP.": "अपने फार्म ERP तक पहुंचने के लिए साइन इन करें।", "Create an account to manage your farm.": "अपना खेत प्रबंधित करने के लिए खाता बनाएं।",
      "Full Name": "पूरा नाम", "Email Address": "ईमेल पता", "Password": "पासवर्ड", "Sign In": "साइन इन", "Create Account": "खाता बनाएं", "Don't have an account? ": "खाता नहीं है? ", "Already have an account? ": "क्या पहले से खाता है? ", "Register": "रजिस्टर", "Login": "लॉगिन"
    }
  },
  mr: { translation: { "Home": "मुख्यपृष्ठ", "Crop Recommender": "पीक शिफारस", "Dashboard": "डॅशबोर्ड", "Farm Maps": "शेताचे नकाशे", "Krushi Mandi": "कृषी बाजार", "Govt Schemes": "सरकारी योजना", "Welcome Back": "परत स्वागत आहे", "Join KrushiAI": "KrushiAI मध्ये सामील व्हा", "Sign in to access your farm ERP.": "आपल्या फार्म ईआरपी मध्ये प्रवेश करण्यासाठी साइन इन करा.", "Create an account to manage your farm.": "आपले शेत व्यवस्थापित करण्यासाठी खाते तयार करा.", "Full Name": "पूर्ण नाव", "Email Address": "ईमेल पत्ता", "Password": "पासवर्ड", "Sign In": "साइन इन करा", "Create Account": "खाते तयार करा", "Don't have an account? ": "खाते नाही का? ", "Already have an account? ": "आधीपासूनच खाते आहे का? ", "Register": "नोंदणी", "Login": "लॉगिन" } },
  pa: { translation: { "Home": "ਮੁੱਖ ਪੰਨਾ", "Crop Recommender": "ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼", "Dashboard": "ਡੈਸ਼ਬੋਰਡ", "Farm Maps": "ਖੇਤ ਦੇ ਨਕਸ਼ੇ", "Krushi Mandi": "ਕ੍ਰਿਸ਼ੀ ਮੰਡੀ", "Govt Schemes": "ਸਰਕਾਰੀ ਸਕੀਮਾਂ", "Welcome Back": "ਜੀ ਆਇਆਂ ਨੂੰ", "Join KrushiAI": "KrushiAI ਨਾਲ ਜੁੜੋ", "Sign in to access your farm ERP.": "ਆਪਣੇ ਫਾਰਮ ERP ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ।", "Create an account to manage your farm.": "ਆਪਣਾ ਖੇਤ ਪ੍ਰਬੰਧਿਤ ਕਰਨ ਲਈ ਖਾਤਾ ਬਣਾਓ।", "Full Name": "ਪੂਰਾ ਨਾਮ", "Email Address": "ਈਮੇਲ", "Password": "ਪਾਸਵਰਡ", "Sign In": "ਸਾਈਨ ਇਨ", "Create Account": "ਖਾਤਾ ਬਣਾਓ", "Don't have an account? ": "ਖਾਤਾ ਨਹੀਂ ਹੈ? ", "Already have an account? ": "ਕੀ ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ? ", "Register": "ਰਜਿਸਟਰ", "Login": "ਲਾਗਿਨ" } },
  gu: { translation: { "Home": "હોમ", "Crop Recommender": "પાક ભલામણ", "Dashboard": "ડેશબોર્ડ", "Farm Maps": "ખેતરના નકશા", "Krushi Mandi": "કૃષિ મંડી", "Govt Schemes": "સરકારી યોજનાઓ", "Welcome Back": "સ્વાગત છે", "Join KrushiAI": "KrushiAI માં જોડાઓ", "Sign in to access your farm ERP.": "તમારા ફાર્મ ERP ને ઍક્સેસ કરવા માટે સાઇન ઇન કરો.", "Create an account to manage your farm.": "તમારું ફાર્મ મેનેજ કરવા માટે એકાઉન્ટ બનાવો.", "Full Name": "પૂરું નામ", "Email Address": "ઇમેઇલ", "Password": "પાસવર્ડ", "Sign In": "સાઇન ઇન", "Create Account": "એકાઉન્ટ બનાવો", "Don't have an account? ": "એકાઉન્ટ નથી? ", "Already have an account? ": "પહેલેથી જ એકાઉન્ટ છે? ", "Register": "નોંધણી", "Login": "લોગિન" } },
  ta: { translation: { "Home": "முகப்பு", "Crop Recommender": "பயிர் பரிந்துரை", "Dashboard": "டாஷ்போர்டு", "Farm Maps": "பண்ணை வரைபடங்கள்", "Krushi Mandi": "கிருஷி மண்டி", "Govt Schemes": "அரசு திட்டங்கள்", "Welcome Back": "மீண்டும் வருக", "Join KrushiAI": "KrushiAI-இல் இணையுங்கள்", "Sign in to access your farm ERP.": "உங்கள் பண்ணை ERP-ஐ அணுக உள்நுழையவும்.", "Create an account to manage your farm.": "உங்கள் பண்ணையை நிர்வகிக்க கணக்கை உருவாக்கவும்.", "Full Name": "முழு பெயர்", "Email Address": "மின்னஞ்சல்", "Password": "கடவுச்சொல்", "Sign In": "உள்நுழைக", "Create Account": "கணக்கை உருவாக்கு", "Don't have an account? ": "கணக்கு இல்லையா? ", "Already have an account? ": "ஏற்கனவே கணக்கு உள்ளதா? ", "Register": "பதிவு", "Login": "உள்நுழை" } },
  te: { translation: { "Home": "హోమ్", "Crop Recommender": "పంట సిఫార్సు", "Dashboard": "డాష్‌బోర్డ్", "Farm Maps": "పొలం పటాలు", "Krushi Mandi": "కృషి మండి", "Govt Schemes": "ప్రభుత్వ పథకాలు", "Welcome Back": "స్వాగతం", "Join KrushiAI": "KrushiAI లో చేరండి", "Sign in to access your farm ERP.": "మీ ఫార్మ్ ERP యాక్సెస్ చేయడానికి సైన్ ఇన్ చేయండి.", "Create an account to manage your farm.": "మీ పొలాన్ని నిర్వహించడానికి ఖాతాను సృష్టించండి.", "Full Name": "పూర్తి పేరు", "Email Address": "ఇమెయిల్", "Password": "పాస్‌వర్డ్", "Sign In": "సైన్ ఇన్ చేయండి", "Create Account": "ఖాతాను సృష్టించండి", "Don't have an account? ": "ఖాతా లేదా? ", "Already have an account? ": "ఇప్పటికే ఖాతా ఉందా? ", "Register": "నమోదు", "Login": "లాగిన్" } }
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
