import {
  ServerMessagePartialResult,
  ServerMessageResult,
} from "../vosk-browser/lib/dist/interfaces.js";
import { KaldiRecognizer, Model } from "../vosk-browser/lib/dist/vosk.js";

export interface VoiceToTextModel {
  start(): void;
  pause(): void;
  stop(): void;
}

const sampleRate = 16000;

export class Vosk implements VoiceToTextModel {
  readonly language: LANGUAGE = undefined;
  readonly model: string;
  readonly modelUrl: string;
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
    this.model = options?.model;
    this.modelUrl = options?.modelUrl;
    this.audioContext = new AudioContext();
  }

  start(): void {
    if (this.status === "PAUSED" || this.status === "STOPPED") {
      this.audioContext.resume();
    } else {
      (async () => {
        const { createModel } = await import(
          /* webpackChunkName: "vosk" */ "../vosk-browser/lib/dist/vosk.js"
        );
        const model: Model = await createModel(
          this.language ? this.models[this.language] : this.model,
        );
        const recognizer: KaldiRecognizer = new model.KaldiRecognizer(
          sampleRate,
        );
        // recognizer.setWords(true);

        recognizer.on("result", (message: ServerMessageResult) => {
          const result = message.result.text;
          if (result && this.result !== result) {
            const resultEvent = new CustomEvent("voice", {
              detail: {
                text: result,
                type: "final",
              },
            });
            window.dispatchEvent(resultEvent);
            this.result = result;
          }
        });

        recognizer.on(
          "partialresult",
          (message: ServerMessagePartialResult) => {
            const partial = message.result.partial;
            if (partial && this.partialResult !== partial) {
              const partialResultEvent = new CustomEvent("voice", {
                detail: {
                  text: partial,
                  type: "partial",
                },
              });
              window.dispatchEvent(partialResultEvent);
              this.partialResult = partial;
            }
          },
        );

        const audioContext = new AudioContext();
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
            const readableStream = new ReadableStream({
              start(controller) {
                const source = audioContext.createMediaStreamSource(stream);
                const processor = audioContext.createScriptProcessor(
                  1024,
                  1,
                  1,
                );
                source.connect(processor);
                processor.connect(audioContext.destination);
                processor.onaudioprocess = (event) => {
                  try {
                    recognizer.acceptWaveform(event.inputBuffer);
                  } catch (error) {
                    console.error("acceptWaveform failed", error);
                  }
                };
              },
            });
          });

        this.status = "STARTED";
      })();
    }
  }

  pause(): void {
    this.audioContext.suspend();
    this.status = "PAUSED";
  }

  stop(): void {
    this.audioContext.close();
    this.status = "STOPPED";
  }
}
