/* eslint-disable react-native/no-unused-styles */
import { View, StyleSheet, Platform, Image } from "react-native";
import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import logo from "../../assets/logo.png"; // Local PNG fallback logo for header
import { useTheme } from "../lib/theme";

export default function Header() {
  const { tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: "center",
          backgroundColor: tokens.color.ui.header.value,
          flexDirection: "row",
          height: TOP_BAR_HEIGHT + insets.top,
          justifyContent: "space-between",
          paddingHorizontal: 5,
          paddingTop: insets.top,
        },
        logo: {
          height: 80,
          width: 160,
        },
      }),
    [insets.top, tokens],
  );

  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
        accessibilityLabel="Powerpick logo"
        resizeMode="contain"
      />
    </View>
  );
}

const TOP_BAR_HEIGHT = Platform.select({ ios: 56, default: 56 });
