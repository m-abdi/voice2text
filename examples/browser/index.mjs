import VoiceToText from "https://cdn.jsdelivr.net/npm/voice2text/dist/voice2text.js";
let voice2text = new VoiceToText({
  converter: "vosk",
  language: "en",
  sampleRate: 42100,
});
const resultTag = document.querySelector("textarea");
const recordButton = document.querySelector("#mic-button");
const converterMenu = document.querySelector("#converter-menu");
const languageMenu = document.querySelector("#language-menu");
voice2text.converter.languages.map((lang) => {
  const option = document.createElement("option");
  option.value = lang.code;
  option.text = lang.name;
  languageMenu.add(option);
});

recordButton.addEventListener("click", () => {
  if (voice2text.converter.status !== "STARTED") {
    voice2text.start();
  } else {
    voice2text.pause();
  }
});

converterMenu.addEventListener("change", (e) => {
  console.log(e.target.value);
});

languageMenu.addEventListener("change", (e) => {
  voice2text.setLanguage({
    language: e.target.value,
  });
});

window.addEventListener("voice", (e) => {
  console.log(e.detail);
  if (e.detail.type === "PARTIAL") {
    resultTag.value =
      resultTag.value.replace(/~.*?~/g, "") + `~${e.detail.text}~`;
  } else if (e.detail.type === "FINAL") {
    resultTag.value =
      resultTag.value.replace(/~.*?~/g, "") + " " + e.detail.text;
  } else if (e.detail.type === "STATUS") {
    if (e.detail.text === "PAUSED" || e.detail.text === "OFF") {
      recordButton.ariaLabel = "start recording";
      recordButton.title = "start recording";

      recordButton.innerHTML =
        '<img src="./images/microphone.svg" width="70" height="70" alt="microphone" />';
    } else if (e.detail.text === "LOADING") {
      recordButton.ariaLabel = "loading";
      recordButton.title = "loading";
      recordButton.innerHTML =
        '<img src="./images/loading.gif" width="70" height="70" alt="loading" >';
    } else if (e.detail.text === "STARTED") {
      recordButton.ariaLabel = "pause";
      recordButton.title = "pause";

      recordButton.innerHTML =
        '<img src="./images/pause.png" width="30" height="30" alt="pause" >';
    }
  }
});

document.querySelector("#copy-button").addEventListener("click", () => {
  navigator.clipboard.writeText(resultTag.value);
  alert("Copied.");
});

const videoElement = document.querySelector("video");

videoElement.addEventListener("play", (e) => {
  const audioTrack =
    e.target?.captureStream?.().getAudioTracks?.()?.[0] ??
    e.target?.mozCaptureStream?.().getAudioTracks?.()?.[0];
  const audioContext = new AudioContext();

  const source = audioContext.createMediaStreamTrackSource(audioTrack);
  const scriptNode = audioContext.createScriptProcessor(4096, 1, 1); // Adjust buffer size as needed

  // Process audio data in real-time
  scriptNode.onaudioprocess = (event) => {
    const inputBuffer = event.inputBuffer;
    const channelData = inputBuffer.getChannelData(0); // Raw audio data (Float32Array)
    // Process channelData as needed (e.g., analyze, visualize, etc.)
    console.log(channelData);
  };

  // Connect nodes and start processing
  source.connect(scriptNode);
  scriptNode.connect(audioContext.destination);
  videoElement.addEventListener("pause", (e) => {
    audioContext.suspend();
  });
});
