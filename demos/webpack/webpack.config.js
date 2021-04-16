const path = require('path');

module.exports = {
  entry: './src/index.js',
  resolve: {
    alias: {
      // use the es2017 build of Hub.js packages
      '@esri/hub-common': '@esri/hub-common/dist/esm'
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
