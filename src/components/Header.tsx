/* eslint-disable react-native/no-unused-styles */
import { View, Pressable, StyleSheet, Platform, Image } from "react-native";
import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../lib/theme";
import { useRouter } from "expo-router";
import { Text } from "react-native";
import logo from "../../assets/logo.png"; // Local PNG fallback logo for header

export default function Header() {
  const { tokens } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: "center",
          backgroundColor: tokens.color.brand.primary.value,
          flexDirection: "row",
          height: TOP_BAR_HEIGHT + insets.top,
          justifyContent: "space-between",
          paddingHorizontal: 5,
          paddingTop: insets.top,
        },
        icon: {
          color: tokens.color.neutral["0"].value,
          fontSize: 20,
        },
        logo: {
          height: 80,
          width: 160,
        },
      }),
    [tokens, insets.top],
  );

  return (
    <View style={styles.container}>
      <Image
        source={logo}
        style={styles.logo}
        accessibilityLabel="Powerpick logo"
        resizeMode="contain"
      />
      <Pressable onPress={() => router.navigate("/settings")}>
        <Text style={styles.icon}>☰</Text>
      </Pressable>
    </View>
  );
}

const TOP_BAR_HEIGHT = Platform.select({ ios: 56, default: 56 });
