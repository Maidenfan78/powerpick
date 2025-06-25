// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove svg from assetExts (so it’s not treated as a file asset),
// and add it to sourceExts so it passes through the SVG transformer.
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts.push('svg');

// Point to the transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config;
