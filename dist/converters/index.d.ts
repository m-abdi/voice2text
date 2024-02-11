export declare const allLanguages: {
    name: string;
    code: LANGUAGE;
    icon: string;
}[];
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
