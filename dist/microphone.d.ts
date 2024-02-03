export declare class Microphone {
    protected source: MicrophoneSource;
    constructor(source?: MicrophoneSource);
    getMicStream(sampleRate: number): Promise<MediaStream>;
}
declare const _default: Microphone;
export default _default;
interface MicrophoneSource {
    getStream: (sampleRate?: number) => Promise<MediaStream>;
}
