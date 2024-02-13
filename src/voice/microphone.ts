import * as jsEnv from "https://cdn.skypack.dev/browser-or-node?dts";
import { VoiceSource } from ".";

class WebMicrophoneSource implements VoiceSource {
  async getStream(sampleRate: number) {
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

export class Microphone {
  protected source;
  constructor(source?: VoiceSource) {
    this.source = source ?? new WebMicrophoneSource();
  }

  async getMicStream(sampleRate: number) {
    if (jsEnv?.isBrowser) {
      return this.source.getStream(sampleRate);
    }
  }
}

export default new Microphone();
