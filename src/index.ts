import { VoiceToTextModel, Vosk } from "./models";

export class VoiceToText {
  private readonly model: VoiceToTextModel;

  constructor(options: {
    model?: MODELS;
    language?: LANGUAGE;
    modelUrl?: string;
  }) {
    if (options?.model === "vosk") {
      this.model = new Vosk({
        model: options?.model,
        language: options?.language,
        modelUrl: options?.modelUrl,
      });
    } else {
      this.model = new Vosk({
        model: "vosk",
        language: options?.language,
        modelUrl: options?.modelUrl,
      });
    }
  }

  start() {
    this.model.start();
  }

  stop() {
    this.model.stop();
  }

  puase() {
    this.model.pause();
  }
}
