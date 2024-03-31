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
        {
            return this.source.getStream(sampleRate);
        }
    }
}
var microphone = new Microphone();

class Media {
    constructor(elementOrSelector) {
        if (typeof elementOrSelector === "string") {
            this.sourceElement = document.querySelector(elementOrSelector);
        }
        else {
            this.sourceElement = elementOrSelector;
        }
    }
    async getStream() {
        return (this.sourceElement?.captureStream?.() ??
            this.sourceElement?.mozCaptureStream?.());
    }
}

class Caption {
    constructor(element) {
        this.element = element;
    }
    addCaption(label, lang, text, endTime) {
        let track = this.element.addTextTrack("captions", label, lang);
        track.mode = "showing";
        this.track = track;
        this.addText(0, endTime ?? 2, text ?? "Captioned by voice2text!");
    }
    addText(startTime, endTime, captionText) {
        this.lastCue && this.track.removeCue(this.lastCue);
        this.lastCue = new VTTCue(startTime, endTime, captionText);
        this.track.addCue(this.lastCue);
    }
    clearCaption() {
        try {
            this.lastCue && this.track.removeCue(this.lastCue);
        }
        catch { }
    }
}

function process(thisObject, stream) {
    thisObject.stream = stream;
    const source = thisObject.audioContext.createMediaStreamSource(stream);
    thisObject.audioSource = source;
    if (!thisObject.processor) {
        const processor = thisObject.audioContext.createScriptProcessor(1024, 1, 1);
        processor.onaudioprocess = (event) => {
            try {
                thisObject.recognizer.acceptWaveform(event.inputBuffer);
            }
            catch (error) {
                console.error("acceptWaveform failed", error);
            }
        };
        processor.connect(thisObject.audioContext.destination);
        thisObject.processor = processor;
    }
    source.connect(thisObject.processor);
    thisObject?.audioContext.resume();
}

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
        this.id = options?.id;
        this.language = options?.language;
        this.modelUrl = options?.modelUrl;
        this.sampleRate = options?.sampleRate ?? 16000;
        this.status = "OFF";
        this.source =
            !options.source || options?.source === "microphone"
                ? "microphone"
                : options.source;
    }
    async init() {
        try {
            if (!this.model && !this.recognizer && !this.audioContext) {
                this.newEvent("STATUS", "LOADING");
                const { createModel } = await import('./vosk.js');
                const model = await createModel(this.language ? this.models[this.language] : this.modelUrl);
                model.setLogLevel(-2);
                const recognizer = new model.KaldiRecognizer(this.sampleRate);
                // recognizer.setWords(true);
                this.model = model;
                this.recognizer = recognizer;
                recognizer.on("result", (message) => {
                    const result = message.result.text;
                    if (result) {
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
                if (model) {
                    this.newEvent("STATUS", "LOADED");
                }
            }
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async start() {
        if (this.status === "OFF") {
            await this.init();
        }
        else if (this.status === "LOADING") {
            this.delayedStart = true;
            try {
                this.caption = new Caption(this.source);
                this.caption.addCaption(`${this.language?.toUpperCase() ?? "ENGLISH"}-voice2text`, this.language ?? "en", "Loading voice2text...", this.source?.duration);
            }
            catch (e) {
                console.log(e);
            }
            return;
        }
        if (this.status === "LOADED" || this.status === "PAUSED") {
            const sampleRate = this.sampleRate;
            if (this.source === "microphone") {
                microphone
                    .getMicStream(sampleRate)
                    .then((stream) => process(this, stream));
            }
            else {
                if (!this.caption) {
                    this.caption = new Caption(this.source);
                }
                const mediaClient = new Media(this.source);
                const r = await mediaClient.getStream();
                process(this, r);
            }
            this.newEvent("STATUS", "STARTED");
        }
    }
    pause() {
        this?.audioContext?.suspend?.().then(() => {
            this.stream.getAudioTracks()[0].stop();
            this.audioSource.disconnect(this.processor);
            this.newEvent("STATUS", "PAUSED");
        });
    }
    stop() {
        this.audioContext &&
            this?.audioContext?.close?.().then(() => {
                this.stream.getAudioTracks()[0].stop();
                // this.source.disconnect(this.processor);
                this.model.terminate();
                this.newEvent("STATUS", "OFF");
                this.model = undefined;
                this.recognizer = undefined;
                this.audioContext = undefined;
                this.audioSource = undefined;
                this.processor = undefined;
                this.stream = undefined;
            });
    }
    setLanguage(options) {
        this.stop();
        this.language = options?.language;
    }
    newEvent(type, text) {
        if (type === "STATUS") {
            this.status = text;
        }
        const event = new CustomEvent("voice", {
            detail: {
                text,
                type,
                id: this.id,
            },
        });
        window.dispatchEvent(event);
        if (type === "STATUS" && text === "LOADED" && this?.delayedStart) {
            this.start();
        }
        if (this.source !== "microphone") {
            if (text === "STARTED") {
                !this.caption.track &&
                    this.caption.addCaption(`${this.language?.toUpperCase() ?? "ENGLISH"}-voice2text`, this.language ?? "en");
            }
            else if (type === "PARTIAL" || type === "FINAL") {
                this.caption.addText(0, this.source?.duration, text);
            }
        }
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
        this.id =
            options?.id ??
                crypto.getRandomValues(new Uint8Array(16)).toString().replace(/,/g, "");
        // find source
        if (typeof options.source === "string" && options.source !== "microphone") {
            this.source = document.querySelector(options.source);
        }
        else {
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
        }
        else {
            alert("Invalid Converter!");
        }
        if (this.source !== "microphone" && this.source) {
            this.source.addEventListener("play", (e) => {
                this.start();
            });
            this.source.addEventListener("pause", (e) => {
                this.pause();
            });
        }
    }
    async init() {
        return this.converter.init();
    }
    async start() {
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
