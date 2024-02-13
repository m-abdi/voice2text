import { VoiceSource } from ".";

export default class Media implements VoiceSource {
  protected sourceElement: any;
  constructor(elementOrSelector?: Element | string) {
    if (typeof elementOrSelector === "string") {
      this.sourceElement = document.querySelector(elementOrSelector);
    } else {
      this.sourceElement = elementOrSelector;
    }
  }

  async getStream() {
    return (
      this.sourceElement?.captureStream?.() ??
      this.sourceElement?.mozCaptureStream?.()
    );
  }
}
