// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ThemeProvider } from './theme';

export default function Layout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        {/* Status bar adapts automatically to light/dark */}
        <StatusBar style="auto" />
        <Stack />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
