const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  resolve: {
    alias: {
      // use the es2017 build of Hub.js packages
      '@esri/hub-common': '@esri/hub-common/dist/es2017'
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
