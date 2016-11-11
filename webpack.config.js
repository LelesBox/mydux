var path = require('path')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'mydux.js',
    library: 'mydux',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist')
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
  devtool: 'source-map'
}
