const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  /**
   * Where appointments come from:
   *
   *   "http"  -> json-server on localhost:3333 (development)
   *   "local" -> browser localStorage (published version)
   *
   * In production the default is "local" because Vercel only serves
   * static files — there's no json-server running there. The other
   * mode can be forced with the API_MODE environment variable.
   */
  const apiMode = process.env.API_MODE || (isProduction ? "local" : "http");

  return {
    entry: path.resolve(__dirname, "src", "main.js"),

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction ? "[name].[contenthash].js" : "[name].js",
      assetModuleFilename: "assets/[name][ext]",
      clean: true,
    },

    devtool: isProduction ? false : "source-map",

    devServer: {
      port: 5500,
      open: false,
      hot: true,
      historyApiFallback: true,
      static: { directory: path.resolve(__dirname, "dist") },
    },

    module: {
      rules: [
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/i,
          use: [
            // in dev, style-loader injects the CSS (faster, with hot reload);
            // in production, CSS goes into a separate file.
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.(svg|png|jpe?g|gif|webp)$/i,
          type: "asset/resource",
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: { filename: "fonts/[name][ext]" },
        },
      ],
    },

    plugins: [
      // Replaces __API_MODE__ with a string literal before generating the bundle.
      new webpack.DefinePlugin({
        __API_MODE__: JSON.stringify(apiMode),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "index.html"),
        filename: "index.html",
      }),
      ...(isProduction
        ? [new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" })]
        : []),
    ],
  };
};
