# voice2text

speech to text functionality with minimum configuration and maximum compatibility and performance.

[Live Demo](https://m-abdi.github.io/voice2text/)


## web example

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>voice2text</title>
    <script
      src="https://cdn.jsdelivr.net/npm/voice2text/dist/voice2text.js"
      type="text/javascript"
    ></script>
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
    <script>
      let textarea = document.querySelector("textarea");
      let voice2text = new VoiceToText({
        converter: "vosk",
        language: "en", //   | "en" | "zh" | "ru" | "fr" | "de" | "es" | "pt" | "tr" | "vi" | "it" | "nl" | "ca" | "ar" | "fa" | "uk" | "kk" | "ja" | "eo" | "hi" | "cs" | "pl" | "uz" | "ko" | "br"
        sampleRate: 16000,
      });

      voice2text.start();

      window.addEventListener("voice", (e) => {
        if (e.detail.type === "PARTIAL") {
          console.log("partial result: ", e.detail.text);
          textarea.value =
            textarea.value.replace(/~.*?~/g, "") + `~${e.detail.text}~`;
        } else if (e.detail.type === "FINAL") {
          console.log("final result: ", e.detail.text);
          textarea.value =
            textarea.value.replace(/~.*?~/g, "") + " " + e.detail.text;
        }
      });

      setTimeout(() => {
        voice2text.stop;
      }, 20000);
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
