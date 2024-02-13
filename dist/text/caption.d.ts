export default class Caption {
    protected element: any;
    track: any;
    protected lastCue: TextTrackCue;
    constructor(element: Element);
    addCaption(label: string, lang: string, text?: string, endTime?: number): void;
    addText(startTime: number, endTime: number, captionText: string): void;
    clearCaption(): void;
}
