/* eslint-disable react-native/no-color-literals, react-native/sort-styles, react-native/no-unused-styles */
import React, { useMemo } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BLACK = "#000000";
const GREY = "#B0B0B0";
const PURPLE = "#7B1FA2";

const NAV_ITEMS = [
  { key: "home", icon: "🏠", label: "Home", path: "/" },
  { key: "settings", icon: "⚙️", label: "Settings", path: "/settings" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: "center",
          backgroundColor: BLACK,
          flexDirection: "row",
          height: 56 + insets.bottom,
          justifyContent: "space-around",
          paddingBottom: insets.bottom,
        },
        item: { alignItems: "center" },
        icon: { color: GREY, fontSize: 24 },
        label: { color: GREY, fontSize: 12 },
        active: { color: PURPLE },
      }),
    [insets.bottom],
  );

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Pressable
            key={item.key}
            style={styles.item}
            onPress={() => router.navigate(item.path)}
            accessibilityLabel={item.label}
          >
            <Text style={[styles.icon, isActive && styles.active]}>
              {item.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.active]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
