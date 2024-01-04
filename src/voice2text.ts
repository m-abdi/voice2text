import { VoiceToTextModel, Vosk } from "./models";

export interface VoiceToText {
  result: string;
  partialResult: string;
  status: MODEL_STATUS;
  start(): void;
  pause(): void;
  stop(): void;
  setLanguage(options: { language: LANGUAGE }): void;
}
export class VoiceToText implements VoiceToText {
  constructor(options: Options) {
    if (options?.converter === "vosk") {
      return new Vosk({
        converter: options?.converter,
        language: options?.language,
        modelUrl: options?.modelUrl,
        sampleRate: options?.sampleRate,
      });
    } else {
      alert("Invalid Converter!");
    }
  }
}
