import {
  ServerMessagePartialResult,
  ServerMessageResult,
} from "../vosk-browser/lib/dist/interfaces.js";
import { KaldiRecognizer, Model } from "../vosk-browser/lib/dist/vosk.js";

export interface VoiceToTextModel {
  result: string;
  partialResult: string;
  status: MODEL_STATUS;
  start(): void;
  pause(): void;
  stop(): void;
}

const sampleRate = 16000;

export class Vosk implements VoiceToTextModel {
  readonly language: LANGUAGE = undefined;
  private model: Model;
  readonly modelUrl: string;
  private recognizer: KaldiRecognizer;
  private stream: MediaStream;
  private source: any;
  private processor: any;
  readonly models: { [keys in LANGUAGE]: string } = {
    en: "https://alphacephei.com/vosk/models/vosk-model-small-en-us-0.15.zip",
    fa: "../models/vosk/vosk-model-small-fa-0.4.zip",
  };
  private audioContext: AudioContext;
  status: MODEL_STATUS;
  result: string;
  partialResult: string;

  constructor(options?: {
    model: MODELS;
    language?: LANGUAGE;
    modelUrl?: string;
  }) {
    this.language = options?.language;
    this.modelUrl = options?.modelUrl;
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
            sampleRate,
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

        navigator.mediaDevices
          .getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              channelCount: 1,
              sampleRate,
            },
          })
          .then((stream) => {
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
    this.audioContext.close().then(() => {
      this.stream.getAudioTracks()[0].stop();
      this.source.disconnect(this.processor);
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

  newEvent(type: "FINAL" | "PARTIAL" | "STATUS", text: string) {
    const event = new CustomEvent("voice", {
      detail: {
        text,
        type,
      },
    });
    window.dispatchEvent(event);
  }
}
