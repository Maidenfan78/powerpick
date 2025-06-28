import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { useTheme } from "../lib/theme";

export default function ComingSoon({
  image,
  region,
}: {
  image: number;
  region: string;
}) {
  const { tokens } = useTheme();
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: tokens.color.brand.primary.value,
      flex: 1,
      justifyContent: "center",
    },
    image: { height: 200, resizeMode: "contain", width: 200 },
  });
  return (
    <View style={styles.container}>
      <Image
        source={image}
        style={styles.image}
        accessibilityLabel={`${region} coming soon`}
      />
    </View>
  );
}