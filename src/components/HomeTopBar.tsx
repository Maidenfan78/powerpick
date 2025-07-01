/* eslint-disable react-native/no-unused-styles, react-native/no-color-literals, react-native/sort-styles */
import React, { useMemo } from "react";
import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RegionPicker from "./RegionPicker";
import logoImg from "../../assets/logo.png";

const BLACK = "#000000";
const WHITE = "#FFFFFF";

export default function HomeTopBar() {
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: "center",
          backgroundColor: BLACK,
          flexDirection: "row",
          height: 56 + insets.top,
          justifyContent: "space-between",
          paddingHorizontal: 8,
          paddingTop: insets.top,
        },
        logo: {
          height: 32,
          resizeMode: "contain",
          width: 120,
        },
        menuIcon: {
          color: WHITE,
          fontSize: 24,
        },
      }),
    [insets.top],
  );

  return (
    <View style={styles.container}>
      <Image source={logoImg} style={styles.logo} />
      <RegionPicker variant="header" />
      <Pressable accessibilityLabel="Menu">
        <Text style={styles.menuIcon}>⋮</Text>
      </Pressable>
    </View>
  );
}
