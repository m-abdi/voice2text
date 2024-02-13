export interface VoiceSource {
  getStream: (sampleRate?: number) => Promise<MediaStream>;
}
