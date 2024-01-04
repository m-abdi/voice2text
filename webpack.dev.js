const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  entry: {
    index: "./src/voice2text.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dev"),
    clean: true,
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./dev",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "voice2text dev mode",
      template: "./src/examples/browser/index.html",
    }),
    new Dotenv({
      path: "./.env.dev",
    }),
  ],
});
