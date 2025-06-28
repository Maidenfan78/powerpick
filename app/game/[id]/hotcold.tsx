import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../lib/theme";
import { fetchHotColdNumbers, HotColdNumbers } from "../../../lib/gamesApi";
import { useGamesStore } from "../../../stores/useGamesStore";

export default function HotColdScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tokens } = useTheme();
  const [numbers, setNumbers] = useState<HotColdNumbers | null>(null);
  const game = useGamesStore((s) => (id ? s.getGame(id) : undefined));

  useEffect(() => {
    const load = async () => {
      if (id) {
        const data = await fetchHotColdNumbers(id);
        setNumbers(data);
      }
    };
    load();
  }, [id]);

  if (!game) return null;

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    text: {
      color: tokens.color.brand.primary.value,
      fontSize: 16,
      marginBottom: 8,
    },
    title: {
      color: tokens.color.brand.primary.value,
      fontSize: 20,
      marginBottom: 16,
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{game.name} Hot & Cold Numbers</Text>
      {numbers ? (
        <>
          <Text style={styles.text}>Hot: {numbers.mainHot.join(" - ")}</Text>
          {numbers.suppHot?.length ? (
            <Text style={styles.text}>
              Supp Hot: {numbers.suppHot.join(" - ")}
            </Text>
          ) : null}
          {numbers.powerballHot?.length ? (
            <Text style={styles.text}>
              Powerball Hot: {numbers.powerballHot.join(" - ")}
            </Text>
          ) : null}
          <Text style={styles.text}>Cold: {numbers.mainCold.join(" - ")}</Text>
          {numbers.suppCold?.length ? (
            <Text style={styles.text}>
              Supp Cold: {numbers.suppCold.join(" - ")}
            </Text>
          ) : null}
          {numbers.powerballCold?.length ? (
            <Text style={styles.text}>
              Powerball Cold: {numbers.powerballCold.join(" - ")}
            </Text>
          ) : null}
        </>
      ) : (
        <Text style={styles.text}>Loading…</Text>
      )}
    </SafeAreaView>
  );
}
