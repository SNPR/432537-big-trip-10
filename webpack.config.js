"use strict";

const path = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: path.join(_dirname, `public`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(_dirname, `public`),
    publicPath: `http:/localhost:8080/`,
    compress: true,
    watchContentBase: true
  }
};
