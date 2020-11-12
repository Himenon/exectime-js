/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  optimization: {
    minimize: isProduction,
  },
  entry: path.join(process.cwd(), isProduction ? "./src/index.ts" : "./src/develop/index.ts"),
  target: ["web"],
  output: {
    path: path.join(process.cwd(), "dist"),
    filename: "ticktack.min.js",
    library: "Ticktack",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  externals: {
    perf_hooks: {
      root: "window",
      commonjs2: "window",
      commonjs: "window",
      amd: "window",
    },
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 9000,
    open: true,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "performance check",
      template: "public/index.html",
    }),
  ],
};
