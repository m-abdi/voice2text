const Dotenv = require("dotenv-webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  output: {
    library: {
      name: "VoiceToText", // The name of the UMD global variable
      type: "umd", // The module type
      umdNamedDefine: true,
      // export: "default", // Expose the default export
    },
    globalObject: "this", // Ensures UMD works in both Node and browser environments
  },
  plugins: [new Dotenv(), new NodePolyfillPlugin()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(tar.gz|zip)$/i,
        type: "asset",
        generator: {
          filename: "[name][ext][query]",
        },
      },
      {
        test: /\.(wasm)$/i,
        type: "asset",
        generator: {
          filename: "[name][ext][query]",
        },
      },
      {
        test: /vosk-worker\.js$/,
        type: "asset/resource", // Emit a separate file and export the URL
        generator: {
          filename: "vosk-worker.js", // Keep the original file name
        },
      },
      {
        test: /vosk_browser_helper_bg\.wasm$/,
        type: "asset/resource",
        generator: {
          filename: "vosk-helper.wasm",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  experiments: {
    asyncWebAssembly: true,
  },
};
