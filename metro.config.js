/**
 * Minimal Metro configuration for React Native
 * Adds TypeScript extensions so the bundler resolves .ts/.tsx files.
 */
const path = require('path');

module.exports = {
  transformer: {
    // Use the default RN transformer
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  },
  resolver: {
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    /*
      If you use custom asset extensions (svg etc.) you can add them here.
      assetExts: ['png','jpg',...]
    */
  },
  watchFolders: [path.resolve(__dirname, '.')],
};
