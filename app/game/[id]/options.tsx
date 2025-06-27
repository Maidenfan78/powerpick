import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../../lib/theme";
import { generateSet } from "../../../lib/generator";
import { useGeneratedNumbersStore } from "../../../stores/useGeneratedNumbersStore";
import { gameConfigs } from "../../../lib/gameConfigs";
import { useGamesStore } from "../../../stores/useGamesStore";

export default function GameOptionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const router = useRouter();
  const [current, setCurrent] = useState<number[]>([]);
  const saveNumbers = useGeneratedNumbersStore((s) => s.saveNumbers);
  const game = useGamesStore((s) => (id ? s.getGame(id) : undefined));
  const config = game ? gameConfigs[game.name] : undefined;

  const handleGenerate = () => {
    if (!config) return;
    const nums = generateSet({
      maxNumber: config.mainMax,
      pickCount: config.mainCount,
    });
    if (config.suppCount) {
      nums.push(
        ...generateSet({
          maxNumber: config.suppMax ?? config.mainMax,
          pickCount: config.suppCount,
        }),
      );
    }
    if (config.powerballMax) {
      nums.push(
        ...generateSet({ maxNumber: config.powerballMax, pickCount: 1 }),
      );
    }
    setCurrent(nums);
    if (id) saveNumbers(id, nums);
  };

  const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      backgroundColor: tokens.color.brand.primary.value,
      borderRadius: 8,
      padding: 12,
    },
    buttonText: { color: tokens.color.neutral["0"].value, fontSize: 18 },
    close: { color: tokens.color.brand.primary.value, fontSize: 20 },
    container: { flex: 1, padding: 16 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    numbers: {
      color: tokens.color.brand.primary.value,
      fontSize: 24,
      marginVertical: 16,
      textAlign: "center",
    },
    title: { color: tokens.color.brand.primary.value, fontSize: 20 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game Options</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      {current.length > 0 && (
        <Text style={styles.numbers}>{current.join(" - ")}</Text>
      )}

      <Pressable
        style={styles.button}
        onPress={handleGenerate}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Generate Numbers</Text>
      </Pressable>
    </SafeAreaView>
  );
}
