const Dotenv = require("dotenv-webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {

  output: {
    library: {
      name: "SpeechToText",
      type: "umd",
      export: ['SpeechToText']
    }
  },
  plugins: [
    new Dotenv(),
    new NodePolyfillPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "./vosk-browser/lib/dist/vosk-worker.js",
          to: "./vosk-worker.js",
        },
        {
          from: "./vosk-browser/lib/dist/vosk.wasm",
          to: "./vosk.wasm",
        },
      ],
    }),
  ],
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
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  experiments: {
    asyncWebAssembly: true,
  },
};
