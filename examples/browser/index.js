let voice2text = new VoiceToText({
  model: "vosk",
  language: "fa",
});
const resultTag = document.querySelector("textarea");
const recordButton = document.querySelector("button");
recordButton.addEventListener("click", () => {
  if (voice2text.status !== "STARTED") {
    voice2text.start();
  } else {
    voice2text.pause();
  }
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
    if (e.detail.text === "PAUSED") {
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
