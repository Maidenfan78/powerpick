// babel.config.js
module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo'           // Expo’s default preset :contentReference[oaicite:3]{index=3}
    ],
    plugins: [
      'expo-router/babel',          // Injects routing code :contentReference[oaicite:4]{index=4}
      '@babel/plugin-transform-flow-strip-types'
    ]
  };
};
