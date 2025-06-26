// babel.config.js
module.exports = {
  presets: [
    "babel-preset-expo"        // The official Expo Babel preset, with TS support built-in :contentReference[oaicite:0]{index=0}
  ],
  plugins: [
    "@babel/plugin-transform-flow-strip-types"  // Removes Flow annotations from RN dependencies :contentReference[oaicite:1]{index=1}
  ]
};
