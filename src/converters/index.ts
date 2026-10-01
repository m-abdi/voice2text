export const allLanguages: { name: string; code: LANGUAGE; icon: string }[] = [
  { name: "Arabic", code: "ar", icon: "" },
  { name: "Arabic (Tunisia)", code: "ar-tn", icon: "" },
  { name: "Breton", code: "br", icon: "" },
  { name: "Catalan", code: "ca", icon: "" },
  { name: "Chinese", code: "zh", icon: "" },
  { name: "Czech", code: "cs", icon: "" },
  { name: "Dutch", code: "nl", icon: "" },
  { name: "English", code: "en", icon: "" },
  { name: "English (India)", code: "en-in", icon: "" },
  { name: "Esperanto", code: "eo", icon: "" },
  { name: "Farsi", code: "fa", icon: "" },
  { name: "French", code: "fr", icon: "" },
  { name: "Georgian", code: "ka", icon: "" },
  { name: "German", code: "de", icon: "" },
  { name: "Greek", code: "el", icon: "" },
  { name: "Gujarati", code: "gu", icon: "" },
  { name: "Hindi", code: "hi", icon: "" },
  { name: "Italian", code: "it", icon: "" },
  { name: "Japanese", code: "ja", icon: "" },
  { name: "Kazakh", code: "kk", icon: "" },
  { name: "Korean", code: "ko", icon: "" },
  { name: "Kyrgyz", code: "ky", icon: "" },
  { name: "Polish", code: "pl", icon: "" },
  { name: "Portuguese", code: "pt", icon: "" },
  { name: "Russian", code: "ru", icon: "" },
  { name: "Spanish", code: "es", icon: "" },
  { name: "Swedish", code: "sv", icon: "" },
  { name: "Tagalog", code: "tl", icon: "" },
  { name: "Tajik", code: "tg", icon: "" },
  { name: "Telugu", code: "te", icon: "" },
  { name: "Turkish", code: "tr", icon: "" },
  { name: "Ukrainian", code: "uk", icon: "" },
  { name: "Uzbek", code: "uz", icon: "" },
  { name: "Vietnamese", code: "vi", icon: "" },
];

export interface VoiceToTextConverter {
  result: string;
  partialResult: string;
  status: CONVERTER_STATUS;
  source?: VoiceSource;
  languages: { name: string; code: LANGUAGE; icon: string }[];
  init(): Promise<boolean>;
  start(): Promise<void>;
  pause(): void;
  stop(): void;
  setLanguage(options: { language: LANGUAGE }): void;
}
