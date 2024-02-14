import { VoiceToTextConverter } from "./converters/index";
export interface VoiceToTextInterface {
    converter: VoiceToTextConverter;
    init(): Promise<boolean>;
    start(): Promise<void>;
    pause(): void;
    stop(): void;
    setLanguage(options: {
        language: LANGUAGE;
    }): void;
}
export default class VoiceToText implements VoiceToTextInterface {
    id: string;
    converter: VoiceToTextConverter;
    source?: VoiceSource;
    constructor(options: Options);
    init(): Promise<boolean>;
    start(): Promise<void>;
    stop(): void;
    pause(): void;
    setLanguage(options: {
        language: LANGUAGE;
    }): void;
}
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
