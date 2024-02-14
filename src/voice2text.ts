import { VoiceToTextConverter } from "./converters/index";
import { Vosk } from "./converters/vosk";
export interface VoiceToTextInterface {
  converter: VoiceToTextConverter;
  init(): Promise<boolean>;
  start(): Promise<void>;
  pause(): void;
  stop(): void;
  setLanguage(options: { language: LANGUAGE }): void;
}
export default class VoiceToText implements VoiceToTextInterface {
  public id: string;
  converter: VoiceToTextConverter;
  source?: VoiceSource;

  constructor(options: Options) {
    this.id =
      options?.id ??
      crypto.getRandomValues(new Uint8Array(16)).toString().replace(/,/g, "");
    // find source
    if (typeof options.source === "string" && options.source !== "microphone") {
      this.source = document.querySelector(options.source);
    } else {
      this.source = this.source;
    }
    if (!options?.converter || options?.converter === "vosk") {
      this.converter = new Vosk({
        id: this.id,
        converter: options?.converter,
        language: options?.language,
        modelUrl: options?.modelUrl,
        sampleRate: options?.sampleRate,
        source: this.source,
      });
    } else {
      alert("Invalid Converter!");
    }
    if (this.source !== "microphone" && this.source) {
      (this.source as Element).addEventListener("play", (e: any) => {
        this.start();
      });

      (this.source as Element).addEventListener("pause", (e) => {
        this.pause();
      });
    }
  }

  async init(): Promise<boolean> {
    return this.converter.init();
  }

  async start() {
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
