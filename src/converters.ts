import {
  ServerMessagePartialResult,
  ServerMessageResult,
} from "../vosk-browser/lib/dist/interfaces.js";
import { KaldiRecognizer, Model } from "../vosk-browser/lib/dist/vosk.js";
import microphone from "./microphone.js";

const allLanguages: { name: string; code: LANGUAGE; icon: string }[] = [
  { name: "English", code: "en", icon: "" },
  { name: "French", code: "fr", icon: "" },
  { name: "German", code: "de", icon: "" },
  { name: "Chinese", code: "zh", icon: "" },
  { name: "Arabic", code: "ar", icon: "" },
  { name: "Breton", code: "br", icon: "" },
  { name: "Catalan", code: "ca", icon: "" },
  { name: "Czech", code: "cs", icon: "" },
  { name: "Esperanto", code: "eo", icon: "" },
  { name: "Spanish", code: "es", icon: "" },
  { name: "Farsi", code: "fa", icon: "" },
  { name: "Hindi", code: "hi", icon: "" },
  { name: "Italian", code: "it", icon: "" },
  { name: "Japanese", code: "ja", icon: "" },
  { name: "Kazakh", code: "kk", icon: "" },
  { name: "Korean", code: "ko", icon: "" },
  { name: "Dutch", code: "nl", icon: "" },
  { name: "Polish", code: "pl", icon: "" },
  { name: "Portuguese", code: "pt", icon: "" },
  { name: "Russian", code: "ru", icon: "" },
  { name: "Turkish", code: "tr", icon: "" },
  { name: "Ukrainian", code: "uk", icon: "" },
  { name: "Uzbek", code: "uz", icon: "" },
  { name: "Vietnamese", code: "vi", icon: "" },
];

export interface VoiceToTextConverter {
  result: string;
  partialResult: string;
  status: CONVERTER_STATUS;
  languages: { name: string; code: LANGUAGE; icon: string }[];
  start(): void;
  pause(): void;
  stop(): void;
  setLanguage(options: { language: LANGUAGE }): void;
  source?: 'MICROPHONE' | 'MEDIA';
}

export class Vosk implements VoiceToTextConverter {
  language: LANGUAGE = undefined;
  private model: Model;
  readonly modelUrl: string;
  private recognizer: KaldiRecognizer;
  private stream: MediaStream;
  private source: any;
  private processor: any;
  readonly sampleRate: number;
  readonly models: { [keys in LANGUAGE]: string } = {
    en: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-en-us-0.15.zip",
    zh: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-cn-0.22.zip",
    ru: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-ru-0.22.zip",
    fr: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-fr-0.22.zip",
    de: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-de-zamia-0.3.zip",
    es: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-es-0.42.zip",
    pt: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-pt-0.3.zip",
    tr: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-tr-0.3.zip",
    vi: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-vn-0.4.zip",
    it: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-it-0.22.zip",
    nl: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-nl-0.22.zip",
    ca: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-ca-0.4.zip",
    ar: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-ar-mgb2-0.4.zip",
    uk: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-uk-v3-nano.zip",
    kk: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-kz-0.15.zip",
    ja: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-ja-0.22.zip",
    eo: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-eo-0.42.zip",
    hi: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-hi-0.22.zip",
    cs: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-cs-0.4-rhasspy.zip",
    pl: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-pl-0.22.zip",
    uz: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-uz-0.22.zip",
    ko: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-ko-0.22.zip",
    br: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-br-0.8.zip",
    fa: "https://voice2text-proxy.mehdiabdi.com/vosk/models/vosk-model-small-fa-0.4.zip",
  };
  languages: { name: string; code: LANGUAGE; icon: string }[] =
    allLanguages.filter((item) => {
      return this.models?.[item.code] && item;
    });
  private audioContext: AudioContext;
  status: CONVERTER_STATUS;
  result: string;
  partialResult: string;

  constructor(options?: Options) {
    this.language = options?.language;
    this.modelUrl = options?.modelUrl;
    this.sampleRate = options?.sampleRate ?? 16000;
    this.status = "OFF";
  }

  start(): void {
    if (this.status !== "LOADING") {
      const newStatus = "LOADING";
      this.status = newStatus;
      this.newEvent("STATUS", newStatus);
      (async () => {
        if (!this.model && !this.recognizer && !this.audioContext) {
          const { createModel } = await import(
            /* webpackChunkName: "vosk" */ "../vosk-browser/lib/dist/vosk.js"
          );
          const model: Model = await createModel(
            this.language ? this.models[this.language] : this.modelUrl,
          );
          model.setLogLevel(-2);
          const recognizer: KaldiRecognizer = new model.KaldiRecognizer(
            this.sampleRate,
          );
          // recognizer.setWords(true);
          this.model = model;
          this.recognizer = recognizer;
          recognizer.on("result", (message: ServerMessageResult) => {
            const result = message.result.text;
            if (result && this.result !== result) {
              this.result = result;
              this.newEvent("FINAL", result);
            }
          });
          recognizer.on(
            "partialresult",
            (message: ServerMessagePartialResult) => {
              const partial = message.result.partial;
              if (partial && this.partialResult !== partial) {
                this.partialResult = partial;
                this.newEvent("PARTIAL", partial);
              }
            },
          );
          this.audioContext = new AudioContext();
        }
        const sampleRate = this.sampleRate;
        microphone.getMicStream(sampleRate).then((stream) => {
          this.stream = stream;
          const source = this.audioContext.createMediaStreamSource(stream);
          this.source = source;
          if (!this.processor) {
            const processor = this.audioContext.createScriptProcessor(
              1024,
              1,
              1,
            );
            processor.onaudioprocess = (event) => {
              try {
                this.recognizer.acceptWaveform(event.inputBuffer);
              } catch (error) {
                console.error("acceptWaveform failed", error);
              }
            };
            processor.connect(this.audioContext.destination);
            this.processor = processor;
          }
          source.connect(this.processor);
          this?.audioContext.resume();
        });
        const newStatus = "STARTED";
        this.status = newStatus;
        this.newEvent("STATUS", newStatus);
      })();
    }
  }

  pause(): void {
    this.audioContext.suspend().then(() => {
      this.stream.getAudioTracks()[0].stop();
      this.source.disconnect(this.processor);
      const newStatus = "PAUSED";
      this.status = newStatus;
      this.newEvent("STATUS", newStatus);
    });
  }

  stop(): void {
    this.audioContext &&
      this.audioContext.close().then(() => {
        this.stream.getAudioTracks()[0].stop();
        // this.source.disconnect(this.processor);
        this.model.terminate();

        const newStatus = "OFF";
        this.status = newStatus;
        this.newEvent("STATUS", newStatus);

        this.model = undefined;
        this.recognizer = undefined;
        this.audioContext = undefined;
        this.source = undefined;
        this.processor = undefined;
        this.stream = undefined;
      });
  }

  setLanguage(options: { language: LANGUAGE }): void {
    this.stop();
    this.language = options?.language;
  }

  newEvent(type: "FINAL" | "PARTIAL" | "STATUS", text: string) {
    const event = new CustomEvent("voice", {
      detail: {
        text,
        type,
      },
    });
    window.dispatchEvent(event);
  }

  async trackFetchProgress(
    response: Response,
    handler: (progress: number) => void,
    interval: number = 1500,
  ) {
    const reader = response.body.getReader();
    const contentLength = +response.headers.get("Content-Length");
    let receivedLength = 0; // length at the moment
    let progress = 0;
    let intervalId: any;
    intervalId = setInterval(() => {
      reader.read().then(({ done, value }) => {
        if (done) {
          clearInterval(intervalId);
          return;
        }
        receivedLength += value.length;
        if (
          progress !==
          parseInt(((receivedLength / contentLength) * 100).toFixed(0))
        ) {
          progress = parseInt(
            ((receivedLength / contentLength) * 100).toFixed(0),
          );
          handler(progress);
        }
      });
    }, interval);
  }
}
