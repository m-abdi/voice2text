import { VoiceToTextModel, Vosk } from "./models";

export class VoiceToText {
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
