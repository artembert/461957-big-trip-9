// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require(`path`);

module.exports = {
  mode: "development",
  entry: `./src/main.ts`,
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`),
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
};
