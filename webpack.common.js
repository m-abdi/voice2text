const Dotenv = require("dotenv-webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  output: {
    library: {
      name: "VoiceToText",
      type: "umd",
      export: ["VoiceToText"],
    },
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
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  experiments: {
    asyncWebAssembly: true,
  },
};
