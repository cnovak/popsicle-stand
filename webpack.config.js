const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  watch: true,
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Popsicle Stand',
      template: 'index.html'
    })
  ],
  mode: 'development',
};

