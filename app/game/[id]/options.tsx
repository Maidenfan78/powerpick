import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../../lib/theme";
import { generateSet } from "../../../lib/generator";
import { useGeneratedNumbersStore } from "../../../stores/useGeneratedNumbersStore";
import { getGameConfig, GameConfig } from "../../../lib/gameConfigs";
import { useGamesStore } from "../../../stores/useGamesStore";

export default function GameOptionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const router = useRouter();
  const [current, setCurrent] = useState<number[]>([]);
  const saveNumbers = useGeneratedNumbersStore((s) => s.saveNumbers);
  const game = useGamesStore((s) => (id ? s.getGame(id) : undefined));
  const config = game ? getGameConfig(game.name) : undefined;

  const descParts = [] as string[];
  if (config) {
    descParts.push(`${config.mainCount} main`);
    if (config.suppCount) descParts.push(`${config.suppCount} supp`);
    if (config.powerballMax) descParts.push("Powerball");
  }
  const description = descParts.join(" + ");

  const handleGenerate = () => {
    const cfg: GameConfig =
      config ??
      ({
        mainMax: 50,
        mainCount: 6,
      } as GameConfig);
    const nums = generateSet({
      maxNumber: cfg.mainMax,
      pickCount: cfg.mainCount,
    });
    if (cfg.suppCount) {
      nums.push(
        ...generateSet({
          maxNumber: cfg.suppMax ?? cfg.mainMax,
          pickCount: cfg.suppCount,
        }),
      );
    }
    if (cfg.powerballMax) {
      nums.push(...generateSet({ maxNumber: cfg.powerballMax, pickCount: 1 }));
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
    configText: {
      color: tokens.color.brand.primary.value,
      fontSize: 16,
      marginBottom: 16,
      textAlign: "center",
    },
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

      {description !== "" && (
        <Text style={styles.configText}>Pick {description}</Text>
      )}

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
