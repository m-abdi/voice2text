import { VoiceToTextConverter, allLanguages } from "./index.js";
import microphone from "../microphone.js";
import { microphone_to_wav } from "../../voice2text-helper/pkg/voice2text_helper.js";

async function fetchArrayBuffer(url: string) {
  const cacheName = "whisper-candle-cache";
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(url);
  if (cachedResponse) {
    const data = await cachedResponse.arrayBuffer();
    return new Uint8Array(data);
  }
  const res = await fetch(url, { cache: "force-cache" });
  cache.put(url, res.clone());
  return new Uint8Array(await res.arrayBuffer());
}

// Returns Uint8Array of WAV bytes
function getWavBytes(buffer: any, options: any) {
  const type = options.isFloat ? Float32Array : Uint16Array;
  const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

  const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }));
  const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

  // prepend header, then add pcmBytes
  wavBytes.set(headerBytes, 0);
  wavBytes.set(new Uint8Array(buffer), headerBytes.length);

  return wavBytes;
}

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options: any) {
  const numFrames = options.numFrames;
  const numChannels = options.numChannels || 2;
  const sampleRate = options.sampleRate || 44100;
  const bytesPerSample = options.isFloat ? 4 : 2;
  const format = options.isFloat ? 3 : 1;

  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;

  const buffer = new ArrayBuffer(44);
  const dv = new DataView(buffer);

  let p = 0;

  function writeString(s: any) {
    for (let i = 0; i < s.length; i++) {
      dv.setUint8(p + i, s.charCodeAt(i));
    }
    p += s.length;
  }

  function writeUint32(d: any) {
    dv.setUint32(p, d, true);
    p += 4;
  }

  function writeUint16(d: any) {
    dv.setUint16(p, d, true);
    p += 2;
  }

  writeString("RIFF"); // ChunkID
  writeUint32(dataSize + 36); // ChunkSize
  writeString("WAVE"); // Format
  writeString("fmt "); // Subchunk1ID
  writeUint32(16); // Subchunk1Size
  writeUint16(format); // AudioFormat https://i.stack.imgur.com/BuSmb.png
  writeUint16(numChannels); // NumChannels
  writeUint32(sampleRate); // SampleRate
  writeUint32(byteRate); // ByteRate
  writeUint16(blockAlign); // BlockAlign
  writeUint16(bytesPerSample * 8); // BitsPerSample
  writeString("data"); // Subchunk2ID
  writeUint32(dataSize); // Subchunk2Size

  return new Uint8Array(buffer);
}

export class Whisper implements VoiceToTextConverter {
  language: LANGUAGE = undefined;
  private model: any;
  readonly modelUrl: string;
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
  bytes: any[];

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
        if (!this.model && !this.audioContext) {
          const { default: init, Decoder } = await import(
            "../../candle/candle-wasm-examples/whisper/pkg/whisper.js"
          );
          const { default: initHelper, microphone_to_wav } = await import(
            "../../voice2text-helper/pkg/voice2text_helper.js"
          );
          await init();
          await initHelper();
          const [
            weightsArrayU8,
            tokenizerArrayU8,
            mel_filtersArrayU8,
            configArrayU8,
          ] = await Promise.all([
            fetchArrayBuffer(
              "https://huggingface.co/lmz/candle-whisper/resolve/main/model-tiny-en-q80.gguf",
            ),
            fetchArrayBuffer(
              "https://huggingface.co/lmz/candle-whisper/raw/main/tokenizer-tiny-en.json",
            ),
            fetchArrayBuffer(
              "https://huggingface.co/spaces/lmz/candle-whisper/resolve/main/mel_filters.safetensors",
            ),
            fetchArrayBuffer(
              "https://huggingface.co/lmz/candle-whisper/raw/main/config-tiny-en.json",
            ),
          ]);

          this.model = new Decoder(
            weightsArrayU8,
            tokenizerArrayU8,
            mel_filtersArrayU8,
            configArrayU8,
            true, //quantized
            false, // is_multilingual
            false, // timestamps
            null, // task
            null, // language
          );

          //   recognizer.on("result", (message: ServerMessageResult) => {
          //     const result = message.result.text;
          //     if (result && this.result !== result) {
          //       this.result = result;
          //       this.newEvent("FINAL", result);
          //     }
          //   });
          //   recognizer.on(
          //     "partialresult",
          //     (message: ServerMessagePartialResult) => {
          //       const partial = message.result.partial;
          //       if (partial && this.partialResult !== partial) {
          //         this.partialResult = partial;
          //         this.newEvent("PARTIAL", partial);
          //       }
          //     },
          //   );
          this.audioContext = new AudioContext();
        }
        const sampleRate = this.sampleRate;
        const numberOfInputChannels = 1;
        microphone.getMicStream(sampleRate).then((stream) => {
          this.stream = stream;
          const source = this.audioContext.createMediaStreamSource(stream);
          this.source = source;
          if (!this.processor) {
            const processor = this.audioContext.createScriptProcessor(
              16384,
              numberOfInputChannels,
              1,
            );
            processor.onaudioprocess = (event) => {
              try {
                // const wavData = microphone_to_wav(
                //     event.inputBuffer.getChannelData(0),
                //     numberOfInputChannels,
                //     sampleRate,
                //   )

                const segments = this.model.decode(
                  event.inputBuffer.getChannelData(0),
                );
                this.pause();
                console.log(segments);
                // this.stop();
                // this.result = segments;
                // this.newEvent("FINAL", JSON.parse(segments));
              } catch (error) {
                console.error("decode failed", error);
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
