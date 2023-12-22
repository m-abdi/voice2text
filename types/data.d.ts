type LANGUAGE = "en" | "fa";

type MODELS = "vosk" | "whisper";

type MODEL_STATUS = "OFF" | "LOADING" | "STARTED" | "PAUSED";

interface ResultEvent {
  text: string;
}

interface PartialResultEvent {
  text: string;
}
