<p align="center">
<img src="./voice2text-high-resolution-logo-transparent.png" alt="logo" width="300"/>
</p>

Speech to text functionality with minimum configuration and maximum compatibility and performance. It is executed securely and efficiently in the browser with web assembly (wasm).

## Features

- Convert voice from microphone in real-time
- Create automatic captions for html video tag (webvtt)
- Convert voice from html audio tags
- Support multiple languages and dialects
- No server-side processing or internet connection required

## Demo

You can try out the live demo of [Voice2Text here](https://voice2text.mehdiabdi.com/).

## Installation

To install Voice2Text as a dependency in your project, run the following command:

```
npm install voice2text
```

## Usage

To use Voice2Text in your code, you need to import it and create an instance of the Voice2Text class. You can pass some options to the constructor to configure the speech recognition engine. For example, you can specify the language, the model, and the source of the audio.

Here is a simple example of how to use Voice2Text to convert voice from the microphone to text:

```javascript
import VoiceToText from "voice2text";

// Create a new instance of VoiceToText
const voice2text = new VoiceToText({
  converter: "vosk",
  language: "en", // The language of the speech
});

// Start the speech recognition
voice2text.start();

// Listen to the result event
window.addEventListener("voice", (e) => {
  console.log(e.detail);
});
```

## Supported Languages

| language | vosk | full name  |
| :------- | :--: | :--------- |
| en       |  ✅  | English    |
| de       |  ✅  | German     |
| fr       |  ✅  | French     |
| ru       |  ✅  | Russian    |
| es       |  ✅  | Spanish    |
| it       |  ✅  | Italian    |
| ja       |  ✅  | Japanese   |
| ar       |  ✅  | Arabic     |
| br       |  ✅  | Breton     |
| ca       |  ✅  | Catalan    |
| cs       |  ✅  | Czech      |
| eo       |  ✅  | Esperanto  |
| fa       |  ✅  | Persian    |
| hi       |  ✅  | Hindi      |
| kk       |  ✅  | Kazakh     |
| ko       |  ✅  | Korean     |
| nl       |  ✅  | Dutch      |
| pl       |  ✅  | Polish     |
| pt       |  ✅  | Portuguese |
| tr       |  ✅  | Turkish    |
| uk       |  ✅  | Ukrainian  |
| uz       |  ✅  | Uzbek      |
| vi       |  ✅  | Vietnamese |
| zh       |  ✅  | Chinese    |

## Web examples

### Microphone

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>voice2text</title>
  </head>
  <body
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    "
  >
    <textarea rows="30" cols="100" style=""></textarea>
    <h1></h1>
    <script type="module">
      import VoiceToText from "https://cdn.jsdelivr.net/npm/voice2text@latest/dist/voice2text.js";
      let voice2text = new VoiceToText({
        converter: "vosk",
        language: "en",
        sampleRate: 16000,
      });

      let textarea = document.querySelector("textarea");
      let status = document.querySelector("h1");
      status.innerHTML = voice2text.converter.status;

      window.addEventListener("voice", (e) => {
        if (e.detail.type === "PARTIAL") {
          console.log("partial result: ", e.detail.text);
          textarea.value =
            textarea.value.replace(/~.*?~/g, "") + `~${e.detail.text}~`;
        } else if (e.detail.type === "FINAL") {
          console.log("final result: ", e.detail.text);
          textarea.value =
            textarea.value.replace(/~.*?~/g, "") + " " + e.detail.text;
        } else if (e.detail.type === "STATUS") {
          console.log("status: ", e.detail.text);
          status.innerHTML = e.detail.text;
        }
      });

      voice2text.start();

      setTimeout(() => {
        voice2text.stop(); // or voice2text.pause();
      }, 60000);
    </script>
  </body>
</html>
```

### Video

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>voice2text</title>
  </head>
  <body
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    "
  >
    <video crossorigin="anonymous" controls>
      <source
        src="https://github.com/m-abdi/voice2text/raw/main/examples/browser/media/Watch%20Sir%20David%20Attenborough%20s%20powerful%20speech%20to%20leaders%20at%20COP26.mp4"
        type="video/mp4"
      />
    </video>
    <h1></h1>
    <script type="module">
      import VoiceToText from "https://cdn.jsdelivr.net/npm/voice2text@latest/dist/voice2text.js";
      let voice2text_video = new VoiceToText({
        converter: "vosk",
        language: "en",
        source: "video", // dom element reference or query selector string of the html video tag
      });

      // preload required assets
      voice2text_video.init();

      // play the video
    </script>
  </body>
</html>
```

### Audio

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>voice2text</title>
  </head>
  <body
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    "
  >
    <audio crossorigin="anonymous" controls>
      <source
        src="https://github.com/m-abdi/voice2text/raw/main/examples/browser/media/Watch%20Sir%20David%20Attenborough%20s%20powerful%20speech%20to%20leaders%20at%20COP26.mp3"
        type="audio/mpeg"
      />
    </audio>
    <textarea rows="30" cols="100" style=""></textarea>
    <h1></h1>
    <script type="module">
      import VoiceToText from "https://cdn.jsdelivr.net/npm/voice2text@latest/dist/voice2text.js";
      let voice2text_audio = new VoiceToText({
        converter: "vosk",
        language: "en",
        source: "audio", // dom element reference or query selector string of the html audio tag
      });

      // preload required assets
      voice2text_audio.init();

      let textarea = document.querySelector("textarea");
      let status = document.querySelector("h1");
      status.innerHTML = voice2text_audio.converter.status;

      window.addEventListener("voice", (e) => {
        if (e.detail.type === "PARTIAL") {
          console.log("partial result: ", e.detail.text);
          textarea.value =
            textarea.value.replace(/~.*?~/g, "") + `~${e.detail.text}~`;
        } else if (e.detail.type === "FINAL") {
          console.log("final result: ", e.detail.text);
          textarea.value =
            textarea.value.replace(/~.*?~/g, "") + " " + e.detail.text;
        } else if (e.detail.type === "STATUS") {
          console.log("status: ", e.detail.text);
          status.innerHTML = e.detail.text;
        }
      });

      // play the audio
    </script>
  </body>
</html>
```

## Build from source

1. Clone/Download the repository:

```
git clone https://github.com/m-abdi/voice2text.git
```

2. Install the dependencies:

```
cd voice2text && npm install
```

3. Build vosk-browser

```
npm run build-vosk
```

4. Build the package

```
npm run build
```
