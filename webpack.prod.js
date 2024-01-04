const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  entry: {
    voice2text: "./src/voice2text.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new Dotenv({
      path: "./.env.prod",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    ],
  },
});
