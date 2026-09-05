import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi" | "mr";

export const languageOptions: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

type Dict = Record<string, string>;

const en: Dict = {
  brand: "CraftLink AI",
  tagline: "From your craft to the world.",
  login: "Login",
  register: "Register as Artisan",
  registerShort: "Register",
  continue: "Continue",
  back: "Back",
  cancel: "Cancel",
  logout: "Logout",
  profile: "Profile",
  secureSimple: "Secure & Simple",
  multilingual: "Multilingual",
  designedForArtisans: "Designed for Artisans",
  welcomeBack: "Welcome Back 👋",
  mobile: "Mobile Number",
  password: "Password",
  continueWithOtp: "Continue with OTP",
  forgotPassword: "Forgot Password?",
  noAccount: "Don't have an account? Register",
  haveAccount: "Already have an account? Login",
  basicInfo: "Basic Information",
  fullName: "Full Name",
  email: "Email Address (optional)",
  state: "State",
  district: "District",
  preferredLanguage: "Preferred Language",
  artisanInfo: "Artisan Profile Information",
  artisanName: "Artisan / Business Name",
  craftCategory: "Craft Category",
  experience: "Years of Experience",
  village: "Village / Town",
  verifyIdentity: "Verify Your Identity",
  verificationStatus: "Verification Status",
  verifyLater: "Verify Later",
  startVerification: "Start Verification",
  verified: "Identity Verified",
  verifiedArtisan: "Verified Artisan",
  demoMode: "Demo Mode",
  useVoice: "Use Voice",
  errName: "Please enter your full name.",
  errMobile: "Please enter a valid 10-digit mobile number.",
  errLanguage: "Please select your preferred language.",
  errPassword: "Password must be at least 6 characters.",
  errGeneric: "Something went wrong. Please try again.",
  errService: "Verification service is temporarily unavailable.",
  errSession: "Your session has expired. Please login again.",
  okLogin: "Logged in successfully.",
  okRegister: "Your artisan account has been created successfully.",
};

const hi: Dict = {
  ...en,
  tagline: "आपकी कारीगरी, पूरी दुनिया तक।",
  login: "लॉग इन",
  register: "कारीगर के रूप में रजिस्टर करें",
  registerShort: "रजिस्टर",
  continue: "आगे बढ़ें",
  back: "पीछे",
  cancel: "रद्द करें",
  logout: "लॉग आउट",
  profile: "प्रोफ़ाइल",
  secureSimple: "सुरक्षित और आसान",
  multilingual: "बहुभाषी",
  designedForArtisans: "कारीगरों के लिए बना",
  welcomeBack: "वापसी पर स्वागत है 👋",
  mobile: "मोबाइल नंबर",
  password: "पासवर्ड",
  continueWithOtp: "OTP से आगे बढ़ें",
  forgotPassword: "पासवर्ड भूल गए?",
  noAccount: "खाता नहीं है? रजिस्टर करें",
  haveAccount: "पहले से खाता है? लॉग इन करें",
  basicInfo: "बुनियादी जानकारी",
  fullName: "पूरा नाम",
  email: "ईमेल (वैकल्पिक)",
  state: "राज्य",
  district: "ज़िला",
  preferredLanguage: "पसंदीदा भाषा",
  artisanInfo: "कारीगर प्रोफ़ाइल जानकारी",
  artisanName: "कारीगर / व्यवसाय का नाम",
  craftCategory: "शिल्प श्रेणी",
  experience: "अनुभव (वर्ष)",
  village: "गाँव / कस्बा",
  verifyIdentity: "अपनी पहचान सत्यापित करें",
  verificationStatus: "सत्यापन स्थिति",
  verifyLater: "बाद में करें",
  startVerification: "सत्यापन शुरू करें",
  verified: "पहचान सत्यापित",
  verifiedArtisan: "सत्यापित कारीगर",
  demoMode: "डेमो मोड",
  useVoice: "आवाज़ का उपयोग करें",
  errName: "कृपया अपना पूरा नाम भरें।",
  errMobile: "कृपया सही 10 अंकों का मोबाइल नंबर भरें।",
  errLanguage: "कृपया अपनी भाषा चुनें।",
  errPassword: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए।",
  errGeneric: "कुछ गड़बड़ हो गई। कृपया फिर कोशिश करें।",
  errService: "सत्यापन सेवा अभी उपलब्ध नहीं है।",
  errSession: "आपका सत्र समाप्त हो गया। कृपया फिर लॉग इन करें।",
  okLogin: "सफलतापूर्वक लॉग इन हुआ।",
  okRegister: "आपका कारीगर खाता बन गया है।",
};

const mr: Dict = {
  ...en,
  tagline: "तुमच्या कलेपासून जगापर्यंत.",
  login: "लॉग इन",
  register: "कारागीर म्हणून नोंदणी करा",
  registerShort: "नोंदणी",
  continue: "पुढे चला",
  back: "मागे",
  cancel: "रद्द करा",
  logout: "लॉग आउट",
  profile: "प्रोफाइल",
  secureSimple: "सुरक्षित आणि सोपे",
  multilingual: "बहुभाषिक",
  designedForArtisans: "कारागिरांसाठी बनवलेले",
  welcomeBack: "पुन्हा स्वागत आहे 👋",
  mobile: "मोबाइल नंबर",
  password: "पासवर्ड",
  continueWithOtp: "OTP ने पुढे जा",
  forgotPassword: "पासवर्ड विसरलात?",
  noAccount: "खाते नाही? नोंदणी करा",
  haveAccount: "आधीच खाते आहे? लॉग इन करा",
  basicInfo: "मूलभूत माहिती",
  fullName: "पूर्ण नाव",
  email: "ईमेल (ऐच्छिक)",
  state: "राज्य",
  district: "जिल्हा",
  preferredLanguage: "पसंतीची भाषा",
  artisanInfo: "कारागीर प्रोफाइल माहिती",
  artisanName: "कारागीर / व्यवसायाचे नाव",
  craftCategory: "कलेचा प्रकार",
  experience: "अनुभव (वर्षे)",
  village: "गाव / शहर",
  verifyIdentity: "तुमची ओळख पडताळा",
  verificationStatus: "पडताळणी स्थिती",
  verifyLater: "नंतर करा",
  startVerification: "पडताळणी सुरू करा",
  verified: "ओळख पडताळली",
  verifiedArtisan: "पडताळलेला कारागीर",
  demoMode: "डेमो मोड",
  useVoice: "आवाज वापरा",
  errName: "कृपया तुमचे पूर्ण नाव लिहा.",
  errMobile: "कृपया योग्य 10 अंकी मोबाइल नंबर लिहा.",
  errLanguage: "कृपया तुमची भाषा निवडा.",
  errPassword: "पासवर्ड किमान 6 अक्षरांचा हवा.",
  errGeneric: "काहीतरी चूक झाली. पुन्हा प्रयत्न करा.",
  errService: "पडताळणी सेवा सध्या उपलब्ध नाही.",
  errSession: "सत्र संपले आहे. पुन्हा लॉग इन करा.",
  okLogin: "यशस्वीरित्या लॉग इन झाले.",
  okRegister: "तुमचे कारागीर खाते तयार झाले आहे.",
};

const dicts: Record<Lang, Dict> = { en, hi, mr };

const STORAGE_KEY = "craftlink.lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof en | string) => string };

const I18nContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => en[k as string] ?? String(k) });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && stored in dicts) setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: string) => dicts[lang][key] ?? en[key] ?? key, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={`flex items-center gap-1 rounded-full bg-card/80 p-1 shadow-soft ${className}`}>
      {languageOptions.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLang(o.code)}
          aria-pressed={lang === o.code}
          className={`tap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            lang === o.code ? "bg-gradient-warm text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          {o.native}
        </button>
      ))}
    </div>
  );
}
