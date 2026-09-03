const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: {
    main: "./app/index.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
    hashFunction: "sha256"
  },
  target: "web",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.mp3$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./index.html",
      filename: "./index.html",
      excludeChunks: ["server"]
    }),
    // Copies ./public verbatim into dist, so files that must keep their name -
    // the og-image.jpg the link preview points at - survive the build. Written
    // inline rather than pulling in copy-webpack-plugin for one directory.
    {
      apply(compiler) {
        compiler.hooks.afterEmit.tapAsync("CopyPublicDir", (compilation, callback) => {
          const source = path.join(__dirname, "public");
          const destination = compiler.options.output.path;
          if (!fs.existsSync(source)) return callback();
          for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
            if (!entry.isFile()) continue;
            fs.copyFileSync(path.join(source, entry.name), path.join(destination, entry.name));
          }
          callback();
        });
      }
    }
  ]
};
