// Simple translation object for English and Hindi
const translations = {
  en: {
    brand: "AYUSHLINK ICD",
    features: "Features",
    testimonials: "Testimonials",
    contact: "Contact",
    signIn: "Sign In",
    signUp: "Sign Up",
    openDashboard: "Open Dashboard",
    exploreApi: "Explore API Tools",
    heroTitle: "Map NAMASTE and ICD-11 seamlessly",
    heroDesc: "Fast and reliable ICD_11–NAMASTE integration, uniting Ayurveda and modern medicine through an AI-powered, multilingual, collaborative, and research-driven platform for seamless clinical care.",
    featuresTitle: "Features",
    feature1: "Fast & Reliable ICD-11-NAMASTE Integration",
    feature1Desc: "Unified search across ICD-11 and NAMASTE codes. Accurate mapping of Ayurveda & modern medical classifications.",
    feature2: "AI-Powered Medical Search",
    feature2Desc: "Smart suggestions based on symptoms, conditions, and observations. Auto-complete, typo tolerance, and intelligent recommendations.",
    feature3: "Multilingual Support 🌐",
    feature3Desc: "Codes and descriptions in multiple languages. Voice search for quick access in local languages.",
    feature4: "Doctor Collaboration Tools 👨‍⚕️👩‍⚕️",
    feature4Desc: "Secure platform for case discussions and second opinions. Easy sharing of insights across clinicians.",
    feature5: "Patient History & Insurance Integration 📑",
    feature5Desc: "Structured records linked with ICD/NAMASTE codes. Insurance-ready history sharing for smooth claim processing.",
    feature6: "Research & Trends Dashboard 📊",
    feature6Desc: "Visual insights into disease patterns, prevalence, and trends — valuable for clinicians and researchers.",
    feature7: "Treatment & Lifestyle Mapping 🩺🌿",
    feature7Desc: "Suggests Panchakarma therapies, Ayurvedic formulations, and dietary recommendations linked to each code.",
    feature8: "Secure & Standards-Compliant 🔒",
    feature8Desc: "EHR/FHIR compliant integrations. Data privacy and healthcare regulation compliance.",
    testimonialsTitle: "Testimonials",
    researchTitle: "Research & Trends",
    testi1: "Clean UI and fast search. Exactly what our clinic needed. — Dr. R",
    testi2: "Clear crosswalk between NAMASTE and ICD-11. — Dr. S",
    testi3: "Saves minutes on every patient. — Dr. K",
    getStarted: "Get Started",
    contactTitle: "Contact Us",
    contactCardTitle: "We’d love to hear from you",
    contactCardDesc: "Have a question, partnership idea, or want a demo? Reach out and we’ll get back within 24 hours.",
    email: "Email:",
    support: "Support:",
    sendMessage: "Send Message",
    footer: "© 2025 AYUSHLINK ICD. All rights reserved.",
    fullName: "Full Name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Your message"
  },
  hi: {
    brand: "आयुषलिंक ICD",
    features: "विशेषताएँ",
    testimonials: "प्रशंसापत्र",
    contact: "संपर्क करें",
    signIn: "साइन इन करें",
    signUp: "साइन अप करें",
    openDashboard: "डैशबोर्ड खोलें",
    exploreApi: "API टूल्स देखें",
    heroTitle: "NAMASTE और ICD-11 को सहजता से जोड़ें",
    heroDesc: "तेज़ और विश्वसनीय ICD_11–NAMASTE एकीकरण, आयुर्वेद और आधुनिक चिकित्सा को एक AI-संचालित, बहुभाषी, सहयोगी और अनुसंधान-आधारित प्लेटफ़ॉर्म के माध्यम से जोड़ता है।",
    featuresTitle: "विशेषताएँ",
    feature1: "तेज़ और विश्वसनीय ICD-11-NAMASTE एकीकरण",
    feature1Desc: "ICD-11 और NAMASTE कोड्स में एकीकृत खोज। आयुर्वेद और आधुनिक चिकित्सा वर्गीकरण का सटीक मिलान।",
    feature2: "AI-संचालित चिकित्सा खोज",
    feature2Desc: "लक्षण, स्थितियों और टिप्पणियों के आधार पर स्मार्ट सुझाव। ऑटो-कम्प्लीट, टाइपो सहिष्णुता और बुद्धिमान अनुशंसाएँ।",
    feature3: "बहुभाषी समर्थन 🌐",
    feature3Desc: "कई भाषाओं में कोड्स और विवरण। स्थानीय भाषाओं में त्वरित पहुँच के लिए वॉयस खोज।",
    feature4: "डॉक्टर सहयोग उपकरण 👨‍⚕️👩‍⚕️",
    feature4Desc: "मामला चर्चा और दूसरी राय के लिए सुरक्षित प्लेटफ़ॉर्म। चिकित्सकों के बीच अंतर्दृष्टि साझा करना आसान।",
    feature5: "रोगी इतिहास और बीमा एकीकरण 📑",
    feature5Desc: "ICD/NAMASTE कोड्स से जुड़े संरचित रिकॉर्ड। आसान दावा प्रक्रिया के लिए बीमा-तैयार इतिहास साझा करना।",
    feature6: "अनुसंधान और प्रवृत्ति डैशबोर्ड 📊",
    feature6Desc: "रोग पैटर्न, प्रसार और प्रवृत्तियों में दृश्य अंतर्दृष्टि — चिकित्सकों और शोधकर्ताओं के लिए मूल्यवान।",
    feature7: "उपचार और जीवनशैली मिलान 🩺🌿",
    feature7Desc: "प्रत्येक कोड से जुड़े पंचकर्म उपचार, आयुर्वेदिक सूत्र और आहार सिफारिशें सुझाता है।",
    feature8: "सुरक्षित और मानक-अनुपालन 🔒",
    feature8Desc: "EHR/FHIR अनुपालन एकीकरण। डेटा गोपनीयता और स्वास्थ्य देखभाल विनियमन अनुपालन।",
    testimonialsTitle: "प्रशंसापत्र",
    researchTitle: "अनुसंधान और प्रवृत्तियाँ",
    testi1: "स्वच्छ UI और तेज़ खोज। बिल्कुल वही जो हमारे क्लिनिक को चाहिए था। — डॉ. आर",
    testi2: "NAMASTE और ICD-11 के बीच स्पष्ट संबंध। — डॉ. एस",
    testi3: "हर मरीज पर मिनटों की बचत। — डॉ. के",
    getStarted: "शुरू करें",
    contactTitle: "संपर्क करें",
    contactCardTitle: "हम आपसे सुनना चाहेंगे",
    contactCardDesc: "कोई प्रश्न, साझेदारी विचार, या डेमो चाहिए? संपर्क करें और हम 24 घंटे के भीतर उत्तर देंगे।",
    email: "ईमेल:",
    support: "सहायता:",
    sendMessage: "संदेश भेजें",
    footer: "© 2025 आयुषलिंक ICD. सर्वाधिकार सुरक्षित।",
    fullName: "पूरा नाम",
    emailPlaceholder: "ईमेल",
    messagePlaceholder: "आपका संदेश"
  }
};

let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];
  // Topbar
  document.querySelector('.brand').childNodes[2].nodeValue = t.brand;
  document.querySelectorAll('.top-links .link-btn')[0].textContent = t.features;
  document.querySelectorAll('.top-links .link-btn')[1].textContent = t.testimonials;
  document.querySelectorAll('.top-links .link-btn')[2].textContent = t.contact;
  var btnSignin = document.getElementById('btn-signin');
  var btnSignup = document.getElementById('btn-signup');
  if (btnSignin) btnSignin.textContent = t.signIn;
  if (btnSignup) btnSignup.textContent = t.signUp;
  // Hero
  document.querySelector('.hero h1').textContent = t.heroTitle;
  document.querySelector('.hero p').textContent = t.heroDesc;
  var btnDash = document.getElementById('btn-open-dashboard');
  var btnApi = document.getElementById('btn-explore-api');
  if (btnDash) btnDash.textContent = t.openDashboard;
  if (btnApi) btnApi.textContent = t.exploreApi;
  // Features
  var featuresTitleEl = document.getElementById('features-title');
  if (featuresTitleEl) featuresTitleEl.textContent = t.featuresTitle;
  const featureTitles = document.querySelectorAll('.feature .title');
  const featureDescs = document.querySelectorAll('.feature .muted');
  featureTitles[0].textContent = t.feature1;
  featureDescs[0].textContent = t.feature1Desc;
  featureTitles[1].textContent = t.feature2;
  featureDescs[1].textContent = t.feature2Desc;
  featureTitles[2].textContent = t.feature3;
  featureDescs[2].textContent = t.feature3Desc;
  featureTitles[3].textContent = t.feature4;
  featureDescs[3].textContent = t.feature4Desc;
  featureTitles[4].textContent = t.feature5;
  featureDescs[4].textContent = t.feature5Desc;
  featureTitles[5].textContent = t.feature6;
  featureDescs[5].textContent = t.feature6Desc;
  featureTitles[6].textContent = t.feature7;
  featureDescs[6].textContent = t.feature7Desc;
  featureTitles[7].textContent = t.feature8;
  featureDescs[7].textContent = t.feature8Desc;
  // Testimonials
  var testiTitleEl = document.getElementById('testimonials-title');
  if (testiTitleEl) testiTitleEl.textContent = t.testimonialsTitle;
  // Research & Trends title (static cards for now)
  var researchTitleEl = document.getElementById('research-title');
  if (researchTitleEl) researchTitleEl.textContent = t.researchTitle;
  const testis = document.querySelectorAll('.testi');
  testis[0].textContent = t.testi1;
  testis[1].textContent = t.testi2;
  testis[2].textContent = t.testi3;
  // Get Started
  document.querySelector('.section.center .cta-btn.cta-large').textContent = t.getStarted;
  // Contact
  var contactTitleEl = document.getElementById('contact-title');
  if (contactTitleEl) contactTitleEl.textContent = t.contactTitle;
  document.querySelector('.contact-card h3').textContent = t.contactCardTitle;
  document.querySelector('.contact-card p').textContent = t.contactCardDesc;
  document.querySelectorAll('.contact-card p')[1].innerHTML = `<strong>${t.email}</strong> hello@ayushlink.example`;
  document.querySelectorAll('.contact-card p')[2].innerHTML = `<strong>${t.support}</strong> support@ayushlink.example`;
  // Contact form
  document.querySelector('.contact-form input[type="text"]').placeholder = t.fullName;
  document.querySelector('.contact-form input[type="email"]').placeholder = t.emailPlaceholder;
  document.querySelector('.contact-form textarea').placeholder = t.messagePlaceholder;
  document.querySelector('.contact-form button').textContent = t.sendMessage;
  // Footer
  document.querySelector('footer').textContent = t.footer;
}

document.addEventListener('DOMContentLoaded', function(){
  setLanguage(currentLang);
});
