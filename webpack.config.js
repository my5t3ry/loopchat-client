var path = require('path');
var webpack = require('webpack');
var values = require('postcss-icss-values');

// TODO (cw|11.3.2017) migrate from webpack 1.x.x -> 2.0.0

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    modulesDirectories: ['node_modules', 'src'],
    extensions: ['', '.js', '.jsx']
  },
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  postcss: [
    values
  ],
  module: {
    loaders: [
      {
        test: /\.js.*$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&camelCase=dashes&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ]
  }
};
