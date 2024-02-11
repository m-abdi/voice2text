export const allLanguages: { name: string; code: LANGUAGE; icon: string }[] = [
  { name: "English", code: "en", icon: "" },
  { name: "French", code: "fr", icon: "" },
  { name: "German", code: "de", icon: "" },
  { name: "Chinese", code: "zh", icon: "" },
  { name: "Arabic", code: "ar", icon: "" },
  { name: "Breton", code: "br", icon: "" },
  { name: "Catalan", code: "ca", icon: "" },
  { name: "Czech", code: "cs", icon: "" },
  { name: "Esperanto", code: "eo", icon: "" },
  { name: "Spanish", code: "es", icon: "" },
  { name: "Farsi", code: "fa", icon: "" },
  { name: "Hindi", code: "hi", icon: "" },
  { name: "Italian", code: "it", icon: "" },
  { name: "Japanese", code: "ja", icon: "" },
  { name: "Kazakh", code: "kk", icon: "" },
  { name: "Korean", code: "ko", icon: "" },
  { name: "Dutch", code: "nl", icon: "" },
  { name: "Polish", code: "pl", icon: "" },
  { name: "Portuguese", code: "pt", icon: "" },
  { name: "Russian", code: "ru", icon: "" },
  { name: "Turkish", code: "tr", icon: "" },
  { name: "Ukrainian", code: "uk", icon: "" },
  { name: "Uzbek", code: "uz", icon: "" },
  { name: "Vietnamese", code: "vi", icon: "" },
];

export interface VoiceToTextConverter {
  result: string;
  partialResult: string;
  status: CONVERTER_STATUS;
  languages: { name: string; code: LANGUAGE; icon: string }[];
  start(): void;
  pause(): void;
  stop(): void;
  setLanguage(options: { language: LANGUAGE }): void;
}
