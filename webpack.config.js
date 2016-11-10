module.exports = {
  entry: './src/test.js',
  output: {
    filename: './dist/bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  watch: true,
  devtool: 'source-map'
}
