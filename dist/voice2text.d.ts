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
