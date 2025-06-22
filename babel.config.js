module.exports = {
  presets: ['babel-preset-expo'],  // includes TypeScript support out of the box :contentReference[oaicite:2]{index=2}
  plugins: ['@babel/plugin-transform-flow-strip-types'],  // necessary to strip Flow types in RN deps
};
