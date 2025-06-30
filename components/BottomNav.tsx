/* eslint-disable react-native/no-color-literals, react-native/sort-styles */
import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";

const BLACK = "#000000";
const GREY = "#B0B0B0";
const PURPLE = "#7B1FA2";

const NAV_ITEMS = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "draws", icon: "📜", label: "Draws" },
  { key: "stats", icon: "📊", label: "Stats" },
  { key: "settings", icon: "⚙️", label: "Settings" },
];

export default function BottomNav() {
  const [active, setActive] = useState("home");

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => (
        <Pressable
          key={item.key}
          style={styles.item}
          onPress={() => setActive(item.key)}
          accessibilityLabel={item.label}
        >
          <Text style={[styles.icon, active === item.key && styles.active]}>
            {item.icon}
          </Text>
          <Text style={[styles.label, active === item.key && styles.active]}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: BLACK,
    flexDirection: "row",
    height: 56,
    justifyContent: "space-around",
  },
  item: { alignItems: "center" },
  icon: { color: GREY, fontSize: 24 },
  label: { color: GREY, fontSize: 12 },
  active: { color: PURPLE },
});
