type LANGUAGE = "en" | "fa";

type MODELS = "vosk" | "whisper";

type MODEL_STATUS = "STARTED" | "STOPPED" | "PAUSED";

interface ResultEvent {
  text: string;
}

interface PartialResultEvent {
  text: string;
}
