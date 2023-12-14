const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const Dotenv = require("dotenv-webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  entry: {
    index: "./src/index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "pkg"),
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
  // devtool: 'source-map',

  // optimization: {
  //   splitChunks: {
  //     chunks: "all",
  //   },
  // },
  // use: [
  //   {
  //     loader: 'ts-loader',
  //     options: {
  //       transpileOnly: true,
  //     },
  //   },
  // ],
});
