interface VoiceProcessor {}

export function process(thisObject: any, stream: MediaStream) {
  thisObject.stream = stream;
  const source = thisObject.audioContext.createMediaStreamSource(stream);
  thisObject.audioSource = source;
  if (!thisObject.processor) {
    const processor = thisObject.audioContext.createScriptProcessor(1024, 1, 1);
    processor.onaudioprocess = (event: any) => {
      try {
        thisObject.recognizer.acceptWaveform(event.inputBuffer);
      } catch (error) {
        console.error("acceptWaveform failed", error);
      }
    };
    processor.connect(thisObject.audioContext.destination);
    thisObject.processor = processor;
  }
  source.connect(thisObject.processor);
  thisObject?.audioContext.resume();
}
