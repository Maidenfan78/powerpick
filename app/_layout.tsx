// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../lib/theme";
import Header from "../components/Header";
import { View, StyleSheet, Platform } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <View style={styles.container}>
          <Stack screenOptions={{ header: () => <Header /> }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </View>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    ...Platform.select({
      web: { maxWidth: 1280, marginLeft: "auto", marginRight: "auto" },
    }),
  },
});
