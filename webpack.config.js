const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtensionReloader = require("webpack-extension-reloader");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = env => {
  return {
    entry: {
      "content-script": [
        "./src/content/content.js",
        "./src/content/content.scss"
      ],
      background: "./src/background/background.js"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name].js"
    },
    plugins: [
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].css"
      }),
      new CopyWebpackPlugin([
        { from: "./src/manifest.json" },
        { from: "./src/assets/", to: "./assets" }
      ]),
      new ExtensionReloader()
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                sourceMap: true
              }
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [require("autoprefixer")],
                sourceMap: true
              }
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: { loader: "html-loader" }
        }
      ]
    },
    mode: env.mode || "production"
  };
};
