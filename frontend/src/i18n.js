import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: { translation: {
    brand: 'Sahaay', tagline: 'Government Scheme Advisor', prototype: 'Student project demo', language: 'Language',
    loginLink: 'Sign in', backToFinder: 'Back to schemes', loginTitle: 'Sign in', loginIntro: 'Sign in to continue to your saved scheme search.',
    emailLabel: 'Email address', emailPlaceholder: 'name@example.com', passwordLabel: 'Password', passwordPlaceholder: 'Enter your password',
    loginButton: 'Sign in', loginDemoNotice: 'Sign-in is a design preview and is not connected to an account service yet.',
    loginHelp: 'This student project demo does not store or verify account details.',
    eyebrow: 'Government scheme discovery', headline: 'Find schemes that may support you',
    intro: 'Share a little about your situation. We’ll help you understand which government schemes may be relevant to you.',
    tellUs: 'Tell us about yourself', tellHelp: 'Use your own words. You can include your age, state, education, or family income.',
    situationLabel: 'Your situation', placeholder: 'For example: I am a 22-year-old student from Uttarakhand. My family income is around ₹2 lakh a year and I need help with my studies.',
    inputHint: 'Write in English or Hindi', findButton: 'Check schemes', tryExample: 'Or start with an example',
    examples: ['I am a student from Uttarakhand', 'I want to start a small business', 'My family income is below ₹2 lakh'],
    demoTitle: 'Input received — demo preview', demoText: 'In the complete system, your details will be extracted for you to review before scheme matching.',
    howWorks: 'How it works', guideText: 'A simple guided process keeps you in control.',
    stepOne: 'Describe your situation in your own words', stepTwo: 'Review the details the system identifies', stepThree: 'Explore matching schemes and eligibility',
    sourceNote: 'Scheme information should always be checked with official sources.',
    serviceTitle: 'Guidance for citizens', serviceText: 'Recommendations are for information only. Confirm eligibility and application details on the official scheme website.',
    footer: 'A student project to make public support easier to find.', footerNote: 'This prototype is not an official government website.'
  } },
  hi: { translation: {
    brand: 'सहाय', tagline: 'सरकारी योजना सलाहकार', prototype: 'विद्यार्थी परियोजना डेमो', language: 'भाषा',
    loginLink: 'साइन इन', backToFinder: 'योजनाओं पर वापस जाएं', loginTitle: 'साइन इन करें', loginIntro: 'अपनी सेव की गई योजना खोज जारी रखने के लिए साइन इन करें।',
    emailLabel: 'ईमेल पता', emailPlaceholder: 'name@example.com', passwordLabel: 'पासवर्ड', passwordPlaceholder: 'अपना पासवर्ड लिखें',
    loginButton: 'साइन इन', loginDemoNotice: 'यह साइन-इन केवल डिजाइन पूर्वावलोकन है और अभी किसी खाता सेवा से जुड़ा नहीं है।',
    loginHelp: 'यह विद्यार्थी परियोजना डेमो खाता जानकारी सेव या सत्यापित नहीं करता।',
    eyebrow: 'सरकारी योजनाओं की खोज', headline: 'अपने लिए उपयोगी योजनाएं खोजें',
    intro: 'अपनी स्थिति के बारे में थोड़ा बताएं। हम आपके लिए उपयोगी सरकारी योजनाओं को समझने में मदद करेंगे।',
    tellUs: 'अपने बारे में बताएं', tellHelp: 'अपने शब्दों में लिखें। उम्र, राज्य, शिक्षा या परिवार की आय बता सकते हैं।',
    situationLabel: 'आपकी स्थिति', placeholder: 'उदाहरण: मैं उत्तराखंड का 22 साल का विद्यार्थी हूँ। मेरे परिवार की सालाना आय लगभग ₹2 लाख है और मुझे पढ़ाई के लिए सहायता चाहिए।',
    inputHint: 'हिन्दी या अंग्रेज़ी में लिखें', findButton: 'योजनाएं देखें', tryExample: 'या उदाहरण से शुरू करें',
    examples: ['मैं उत्तराखंड का विद्यार्थी हूँ', 'मैं छोटा व्यवसाय शुरू करना चाहता हूँ', 'मेरे परिवार की आय ₹2 लाख से कम है'],
    demoTitle: 'जानकारी मिली — डेमो पूर्वावलोकन', demoText: 'पूरी प्रणाली में, योजना खोजने से पहले आपकी जानकारी पहचानकर जांच के लिए दिखाई जाएगी।',
    howWorks: 'यह कैसे काम करता है', guideText: 'आसान चरणों में आगे बढ़ें और प्रक्रिया पर अपना नियंत्रण रखें।',
    stepOne: 'अपनी स्थिति अपने शब्दों में बताएं', stepTwo: 'पहचानी गई जानकारी की जांच करें', stepThree: 'मिलती-जुलती योजनाएं और पात्रता देखें',
    sourceNote: 'योजना की जानकारी आधिकारिक स्रोतों से अवश्य जांचें।',
    serviceTitle: 'नागरिकों के लिए मार्गदर्शन', serviceText: 'यह सुझाव केवल जानकारी के लिए हैं। पात्रता और आवेदन की जानकारी आधिकारिक योजना वेबसाइट पर जांचें।',
    footer: 'सरकारी सहायता खोजना आसान बनाने की एक विद्यार्थी परियोजना।', footerNote: 'यह प्रोटोटाइप आधिकारिक सरकारी वेबसाइट नहीं है।'
  } },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
