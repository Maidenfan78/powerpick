// metro.config.cjs
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Opt-out of the new package-exports resolver for now
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
