// babel.config.js
module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo'           // Expo’s default preset :contentReference[oaicite:3]{index=3}
    ],
    plugins: [
      // '@expo-router/babel' is deprecated in SDK 50; routing is handled
      // automatically by `babel-preset-expo`.
      '@babel/plugin-transform-flow-strip-types'
    ]
  };
};
