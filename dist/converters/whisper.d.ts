import { VoiceToTextConverter } from "./index.js";
export declare class Whisper implements VoiceToTextConverter {
    language: LANGUAGE;
    private model;
    readonly modelUrl: string;
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
    status: CONVERTER_STATUS;
    result: string;
    partialResult: string;
    bytes: any[];
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
