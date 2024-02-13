export default class Caption {
  protected element: any;
  public track: any;
  protected lastCue: TextTrackCue;
  constructor(element: Element) {
    this.element = element;
  }

  addCaption(label: string, lang: string, text?: string, endTime?: number) {
    let track = this.element.addTextTrack("captions", label, lang);
    track.mode = "showing";
    this.track = track;
    this.addText(0, endTime ?? 2, text ?? "Captioned by voice2text!");
  }

  addText(startTime: number, endTime: number, captionText: string) {
    this.lastCue && this.track.removeCue(this.lastCue);
    this.lastCue = new VTTCue(startTime, endTime, captionText);
    this.track.addCue(this.lastCue);
  }

  clearCaption() {
    try {
      this.lastCue && this.track.removeCue(this.lastCue);
    } catch {}
  }
}
