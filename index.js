// index.js
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

// Tell ExpoRouter to load all files under `app/`
const ctx = require.context("./app", true, /\.(tsx|ts|js)$/);

function App() {
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
