import typescript from "@rollup/plugin-typescript";
import { importMetaAssets } from "@web/rollup-plugin-import-meta-assets";

export default {
  input: "src/voice2text.ts",
  output: {
    name: "VoiceToText",
    dir: "dist",
    format: "es",
    assetFileNames: "[name][extname]",
    chunkFileNames: "[name].js",
  },
  plugins: [typescript(), importMetaAssets()],
};
