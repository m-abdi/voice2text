const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  entry: {
    example: "./src/examples/browser/example.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "examples/browser"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "voice2text browser example",
      template: "./src/examples/browser/index.html",
    }),
    new Dotenv({
      path: "./.env.prod",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./src/examples/browser/example.js",
          to: "./example.js",
        },
      ],
    }),
  ],
});
