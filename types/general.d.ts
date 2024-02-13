type LANGUAGE =
  | "en"
  | "zh"
  | "ru"
  | "fr"
  | "de"
  | "es"
  | "pt"
  | "tr"
  | "vi"
  | "it"
  | "nl"
  | "ca"
  | "ar"
  | "fa"
  | "uk"
  | "kk"
  | "ja"
  | "eo"
  | "hi"
  | "cs"
  | "pl"
  | "uz"
  | "ko"
  | "br";

type CONVERTER = "vosk" | "whisper";

type CONVERTER_STATUS = "OFF" | "LOADING" | "LOADED" | "STARTED" | "PAUSED";

interface ResultEvent {
  text: string;
}

interface PartialResultEvent {
  text: string;
}

interface Options {
  id?: string;
  converter?: CONVERTER;
  language?: LANGUAGE;
  modelUrl?: string;
  sampleRate?: number;
  source?: VoiceSource;
}

type VoiceSource = "microphone" | Element | string;
