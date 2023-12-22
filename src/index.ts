import { VoiceToTextModel, Vosk } from "./models";

export class VoiceToText {
  constructor(options: {
    model?: MODELS;
    language?: LANGUAGE;
    modelUrl?: string;
  }) {
    if (options?.model === "vosk") {
      return new Vosk({
        model: options?.model,
        language: options?.language,
        modelUrl: options?.modelUrl,
      });
    } else {
      return new Vosk({
        model: "vosk",
        language: options?.language,
        modelUrl: options?.modelUrl,
      });
    }
  }
}
