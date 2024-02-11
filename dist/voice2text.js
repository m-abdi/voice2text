import * as jsEnv from 'https://cdn.skypack.dev/browser-or-node?dts';

const allLanguages = [
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

class WebMicrophoneSource {
    async getStream(sampleRate) {
        return navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                channelCount: 1,
                sampleRate,
            },
        });
    }
}
class Microphone {
    constructor(source) {
        this.source = source ?? new WebMicrophoneSource();
    }
    async getMicStream(sampleRate) {
        if (jsEnv?.isBrowser) {
            return this.source.getStream(sampleRate);
        }
    }
}
var microphone = new Microphone();

class Vosk {
    constructor(options) {
        this.language = undefined;
        this.models = {
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
        this.languages = allLanguages.filter((item) => {
            return this.models?.[item.code] && item;
        });
        this.language = options?.language;
        this.modelUrl = options?.modelUrl;
        this.sampleRate = options?.sampleRate ?? 16000;
        this.status = "OFF";
    }
    start() {
        if (this.status !== "LOADING") {
            const newStatus = "LOADING";
            this.status = newStatus;
            this.newEvent("STATUS", newStatus);
            (async () => {
                if (!this.model && !this.recognizer && !this.audioContext) {
                    const { createModel } = await import(
                    /* webpackChunkName: "vosk" */ './vosk.js');
                    const model = await createModel(this.language ? this.models[this.language] : this.modelUrl);
                    model.setLogLevel(-2);
                    const recognizer = new model.KaldiRecognizer(this.sampleRate);
                    // recognizer.setWords(true);
                    this.model = model;
                    this.recognizer = recognizer;
                    recognizer.on("result", (message) => {
                        const result = message.result.text;
                        if (result && this.result !== result) {
                            this.result = result;
                            this.newEvent("FINAL", result);
                        }
                    });
                    recognizer.on("partialresult", (message) => {
                        const partial = message.result.partial;
                        if (partial && this.partialResult !== partial) {
                            this.partialResult = partial;
                            this.newEvent("PARTIAL", partial);
                        }
                    });
                    this.audioContext = new AudioContext();
                }
                const sampleRate = this.sampleRate;
                microphone.getMicStream(sampleRate).then((stream) => {
                    this.stream = stream;
                    const source = this.audioContext.createMediaStreamSource(stream);
                    this.source = source;
                    if (!this.processor) {
                        const processor = this.audioContext.createScriptProcessor(1024, 1, 1);
                        processor.onaudioprocess = (event) => {
                            try {
                                this.recognizer.acceptWaveform(event.inputBuffer);
                            }
                            catch (error) {
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
    pause() {
        this.audioContext.suspend().then(() => {
            this.stream.getAudioTracks()[0].stop();
            this.source.disconnect(this.processor);
            const newStatus = "PAUSED";
            this.status = newStatus;
            this.newEvent("STATUS", newStatus);
        });
    }
    stop() {
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
    setLanguage(options) {
        this.stop();
        this.language = options?.language;
    }
    newEvent(type, text) {
        const event = new CustomEvent("voice", {
            detail: {
                text,
                type,
            },
        });
        window.dispatchEvent(event);
    }
    async trackFetchProgress(response, handler, interval = 1500) {
        const reader = response.body.getReader();
        const contentLength = +response.headers.get("Content-Length");
        let receivedLength = 0; // length at the moment
        let progress = 0;
        let intervalId;
        intervalId = setInterval(() => {
            reader.read().then(({ done, value }) => {
                if (done) {
                    clearInterval(intervalId);
                    return;
                }
                receivedLength += value.length;
                if (progress !==
                    parseInt(((receivedLength / contentLength) * 100).toFixed(0))) {
                    progress = parseInt(((receivedLength / contentLength) * 100).toFixed(0));
                    handler(progress);
                }
            });
        }, interval);
    }
}

async function fetchArrayBuffer(url) {
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
class Whisper {
    constructor(options) {
        this.language = undefined;
        this.models = {
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
        this.languages = allLanguages.filter((item) => {
            return this.models?.[item.code] && item;
        });
        this.language = options?.language;
        this.modelUrl = options?.modelUrl;
        this.sampleRate = options?.sampleRate ?? 16000;
        this.status = "OFF";
    }
    start() {
        if (this.status !== "LOADING") {
            const newStatus = "LOADING";
            this.status = newStatus;
            this.newEvent("STATUS", newStatus);
            (async () => {
                if (!this.model && !this.audioContext) {
                    const { default: init, Decoder } = await import('./whisper.js');
                    const { default: initHelper, microphone_to_wav } = await import('./voice2text_helper.js');
                    await init();
                    await initHelper();
                    const [weightsArrayU8, tokenizerArrayU8, mel_filtersArrayU8, configArrayU8,] = await Promise.all([
                        fetchArrayBuffer("https://huggingface.co/lmz/candle-whisper/resolve/main/model-tiny-en-q80.gguf"),
                        fetchArrayBuffer("https://huggingface.co/lmz/candle-whisper/raw/main/tokenizer-tiny-en.json"),
                        fetchArrayBuffer("https://huggingface.co/spaces/lmz/candle-whisper/resolve/main/mel_filters.safetensors"),
                        fetchArrayBuffer("https://huggingface.co/lmz/candle-whisper/raw/main/config-tiny-en.json"),
                    ]);
                    this.model = new Decoder(weightsArrayU8, tokenizerArrayU8, mel_filtersArrayU8, configArrayU8, true, //quantized
                    false, // is_multilingual
                    false, // timestamps
                    null, // task
                    null);
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
                        const processor = this.audioContext.createScriptProcessor(16384, numberOfInputChannels, 1);
                        processor.onaudioprocess = (event) => {
                            try {
                                // const wavData = microphone_to_wav(
                                //     event.inputBuffer.getChannelData(0),
                                //     numberOfInputChannels,
                                //     sampleRate,
                                //   )
                                const segments = this.model.decode(event.inputBuffer.getChannelData(0));
                                this.pause();
                                console.log(segments);
                                // this.stop();
                                // this.result = segments;
                                // this.newEvent("FINAL", JSON.parse(segments));
                            }
                            catch (error) {
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
    pause() {
        this.audioContext.suspend().then(() => {
            this.stream.getAudioTracks()[0].stop();
            this.source.disconnect(this.processor);
            const newStatus = "PAUSED";
            this.status = newStatus;
            this.newEvent("STATUS", newStatus);
        });
    }
    stop() {
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
    setLanguage(options) {
        this.stop();
        this.language = options?.language;
    }
    newEvent(type, text) {
        const event = new CustomEvent("voice", {
            detail: {
                text,
                type,
            },
        });
        window.dispatchEvent(event);
    }
    async trackFetchProgress(response, handler, interval = 1500) {
        const reader = response.body.getReader();
        const contentLength = +response.headers.get("Content-Length");
        let receivedLength = 0; // length at the moment
        let progress = 0;
        let intervalId;
        intervalId = setInterval(() => {
            reader.read().then(({ done, value }) => {
                if (done) {
                    clearInterval(intervalId);
                    return;
                }
                receivedLength += value.length;
                if (progress !==
                    parseInt(((receivedLength / contentLength) * 100).toFixed(0))) {
                    progress = parseInt(((receivedLength / contentLength) * 100).toFixed(0));
                    handler(progress);
                }
            });
        }, interval);
    }
}

class VoiceToText {
    constructor(options) {
        if (options?.converter === "vosk") {
            this.converter = new Vosk({
                converter: options?.converter,
                language: options?.language,
                modelUrl: options?.modelUrl,
                sampleRate: options?.sampleRate,
            });
        }
        else if (options?.converter === 'whisper') {
            this.converter = new Whisper({
                converter: options?.converter,
                language: options?.language,
                modelUrl: options?.modelUrl,
                sampleRate: options?.sampleRate,
            });
        }
        else {
            alert("Invalid Converter!");
        }
    }
    start() {
        return this.converter.start();
    }
    stop() {
        return this.converter.stop();
    }
    pause() {
        return this.converter.pause();
    }
    setLanguage(options) {
        return this.converter.setLanguage(options);
    }
}

export { VoiceToText as default };
