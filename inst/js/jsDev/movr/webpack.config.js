module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'dist/bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: 9003,
  },
  module: {
    rules: [
      {
        exclude: '/node_modules/',
        loader: 'babel-loader',
        query: {
          presets: ['env'],
        },
      },
    ],
  },
};