import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../../lib/theme";
import { generateSet } from "../../../lib/generator";
import { useGeneratedNumbersStore } from "../../../stores/useGeneratedNumbersStore";
import type { GameConfig } from "../../../lib/gameConfigs";
import { useGamesStore } from "../../../stores/useGamesStore";

export default function GameOptionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const router = useRouter();

  const [current, setCurrent] = useState<number[]>([]);
  const [isAuto, setIsAuto] = useState(true);
  const [hotRatio, setHotRatio] = useState(50);
  const [hotPercent, setHotPercent] = useState(50);

  const saveNumbers = useGeneratedNumbersStore((s) => s.saveNumbers);
  const game = useGamesStore((s) => (id ? s.getGame(id) : undefined));

  // Build config from store if available
  const config: GameConfig | undefined =
    game && game.mainMax && game.mainCount
      ? {
          mainMax: game.mainMax,
          mainCount: game.mainCount,
          suppCount: game.suppCount ?? undefined,
          suppMax: game.suppMax ?? undefined,
          powerballMax: game.powerballMax ?? undefined,
        }
      : undefined;

  // Human-readable description of the pick
  const descParts: string[] = [];
  if (config) {
    descParts.push(`${config.mainCount} main`);
    if (config.suppCount) descParts.push(`${config.suppCount} supp`);
    if (config.powerballMax) descParts.push("Powerball");
  }
  const description = descParts.join(" + ");

  // Fallback for missing config
  const displayCfg: GameConfig = config ?? {
    mainMax: 50,
    mainCount: 6,
    suppMax: undefined,
    suppCount: undefined,
    powerballMax: undefined,
  };

  // Slice the current array into the pieces for display
  const mainNums = current.slice(0, displayCfg.mainCount);
  const suppNums =
    displayCfg.suppCount !== undefined
      ? current.slice(
          displayCfg.mainCount,
          displayCfg.mainCount + displayCfg.suppCount,
        )
      : [];
  const powerballNum =
    displayCfg.powerballMax !== undefined
      ? current[current.length - 1]
      : undefined;

  // Generate a fresh set of numbers
  const handleGenerate = () => {
    const nums: number[] = [];

    // Main balls
    nums.push(
      ...generateSet({
        maxNumber: displayCfg.mainMax,
        pickCount: displayCfg.mainCount,
      }),
    );

    // Supplementary balls
    if (
      displayCfg.suppMax !== undefined &&
      displayCfg.suppCount !== undefined
    ) {
      nums.push(
        ...generateSet({
          maxNumber: displayCfg.suppMax,
          pickCount: displayCfg.suppCount,
        }),
      );
    }

    // Powerball (or equivalent)
    if (displayCfg.powerballMax !== undefined) {
      nums.push(
        ...generateSet({
          maxNumber: displayCfg.powerballMax,
          pickCount: 1,
        }),
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
    buttonSpacing: { marginTop: 12 },
    buttonText: { color: tokens.color.neutral["0"].value, fontSize: 18 },
    close: { color: tokens.color.brand.primary.value, fontSize: 20 },
    configText: {
      color: tokens.color.brand.primary.value,
      fontSize: 16,
      marginBottom: 16,
      textAlign: "center",
    },
    container: { flex: 1, padding: 16 },
    disabled: { opacity: 0.5 },
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
    sliderContainer: { marginBottom: 16 },
    sliderLabel: { color: tokens.color.brand.primary.value },
    title: { color: tokens.color.brand.primary.value, fontSize: 20 },
    toggleRow: { alignItems: "center", flexDirection: "row", marginBottom: 16 },
    toggleText: { color: tokens.color.brand.primary.value, marginLeft: 8 },
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
        <>
          <Text style={styles.numbers}>Main: {mainNums.join(" - ")}</Text>
          {suppNums.length > 0 && (
            <Text style={styles.numbers}>Supp: {suppNums.join(" - ")}</Text>
          )}
          {powerballNum !== undefined && (
            <Text style={styles.numbers}>Powerball: {powerballNum}</Text>
          )}
        </>
      )}

      <View accessibilityLabel="Auto toggle" style={styles.toggleRow}>
        <Switch
          value={isAuto}
          onValueChange={setIsAuto}
          accessibilityRole="switch"
        />
        <Text style={styles.toggleText}>Auto</Text>
      </View>

      <View
        pointerEvents={isAuto ? "none" : "auto"}
        style={[styles.sliderContainer, isAuto && styles.disabled]}
      >
        <Text style={styles.sliderLabel}>Hot vs Cold: {hotRatio}% Hot</Text>
        <Slider
          value={hotRatio}
          minimumValue={0}
          maximumValue={100}
          step={1}
          onValueChange={setHotRatio}
          disabled={isAuto}
          accessibilityLabel="Hot cold ratio"
        />
        <Text style={styles.sliderLabel}>
          Hot/Cold Numbers Used: {hotPercent}%
        </Text>
        <Slider
          value={hotPercent}
          minimumValue={0}
          maximumValue={100}
          step={1}
          onValueChange={setHotPercent}
          disabled={isAuto}
          accessibilityLabel="Hot cold percent"
        />
      </View>

      <Pressable
        style={styles.button}
        onPress={handleGenerate}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Generate Numbers</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.buttonSpacing]}
        onPress={() => router.push(`/game/${id}/draws`)}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Last 10 Draws</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.buttonSpacing]}
        onPress={() => router.push(`/game/${id}/hotcold`)}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Hot & Cold Numbers</Text>
      </Pressable>
    </SafeAreaView>
  );
}
