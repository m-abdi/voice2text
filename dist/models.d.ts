export interface VoiceToTextConverter {
    result: string;
    partialResult: string;
    status: CONVERTER_STATUS;
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
export declare class Vosk implements VoiceToTextConverter {
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
    status: CONVERTER_STATUS;
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
