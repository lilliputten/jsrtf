var
    webpack = require('webpack'),
    path = require('path')
;

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: {
    'jsrtf': './lib/index.js',
    'jsrtf.min': './lib/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
    })
  ],
  module: {
  loaders: [
    {
      loader: 'babel-loader',
      // Skip any files outside of your project's `src` directory
      include: [
        __dirname,
      ],
      // Options to configure babel with
      query: {
        // plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-0'],
      }
    },
  ],
  },
  // devServer: {
  //   inline:true,
  //   port: 10000,
  // },
};
