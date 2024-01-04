export default interface VoiceToText {
    result: string;
    partialResult: string;
    status: MODEL_STATUS;
    start(): void;
    pause(): void;
    stop(): void;
    setLanguage(options: {
        language: LANGUAGE;
    }): void;
}
export default class VoiceToText implements VoiceToText {
    constructor(options: Options);
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

type MODEL_STATUS = "OFF" | "LOADING" | "STARTED" | "PAUSED";

interface ResultEvent {
  text: string;
}

interface PartialResultEvent {
  text: string;
}

interface Options {
  converter?: CONVERTER;
  language?: LANGUAGE;
  modelUrl?: string;
  sampleRate?: number;
}
export interface VoiceToTextModel {
    result: string;
    partialResult: string;
    status: MODEL_STATUS;
    languages: {
        name: string;
        code: LANGUAGE;
        icon: string;
    }[];
    start(): void;
    pause(): void;
    stop(): void;
    setLanguage(options: {
        language: LANGUAGE;
    }): void;
}
export declare class Vosk implements VoiceToTextModel {
    language: LANGUAGE;
    private model;
    readonly modelUrl: string;
    private recognizer;
    private stream;
    private source;
    private processor;
    readonly sampleRate: number;
    readonly models: {
        [keys in LANGUAGE]: string;
    };
    languages: {
        name: string;
        code: LANGUAGE;
        icon: string;
    }[];
    private audioContext;
    status: MODEL_STATUS;
    result: string;
    partialResult: string;
    constructor(options?: Options);
    start(): void;
    pause(): void;
    stop(): void;
    setLanguage(options: {
        language: LANGUAGE;
    }): void;
    newEvent(type: "FINAL" | "PARTIAL" | "STATUS", text: string): void;
    trackFetchProgress(response: Response, handler: (progress: number) => void, interval?: number): Promise<void>;
}
