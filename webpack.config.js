const path = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./src/main.ts`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [`style-loader`, `css-loader`],
      },
      {
        test: /\.([tj])sx?$/,
        use: `awesome-typescript-loader`,
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [`.ts`, `.js`, `.json`, `.webpack.js`],
  },
  devtool: `inline-source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:9090/`,
    port: 9090,
    watchContentBase: true
  }
};
