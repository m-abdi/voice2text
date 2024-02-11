import { VoiceToTextConverter } from "./converters/index";
import { Vosk } from "./converters/vosk";
export interface VoiceToTextInterface {
  converter: VoiceToTextConverter;
  start(): void;
  pause(): void;
  stop(): void;
  setLanguage(options: { language: LANGUAGE }): void;
}
export default class VoiceToText implements VoiceToTextInterface {
  converter: VoiceToTextConverter;

  constructor(options: Options) {
    if (options?.converter === "vosk") {
      this.converter = new Vosk({
        converter: options?.converter,
        language: options?.language,
        modelUrl: options?.modelUrl,
        sampleRate: options?.sampleRate,
      });
    } else {
      alert("Invalid Converter!");
    }
  }

  start(): void {
    return this.converter.start();
  }

  stop(): void {
    return this.converter.stop();
  }

  pause(): void {
    return this.converter.pause();
  }

  setLanguage(options: { language: LANGUAGE }): void {
    return this.converter.setLanguage(options);
  }
}
