import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Header from "../components/Header";
import RegionPicker from "../components/RegionPicker";
import { useTheme } from "../lib/theme";
import GameGrid from "../components/GameGrid";
import { Game, fetchGames } from "../lib/gamesApi";
import { useRouter } from "expo-router";

const ERROR_COLOR = "#FF6666";

export default function IndexScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames();
        setGames(data);
      } catch (err) {
        console.error("Unexpected fetch error:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const handleSelectGame = (game: Game) => {
    router.push(`/game/${game.id}/options`);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: tokens.color.brand.primary.value,
      flex: 1,
      padding: 16,
    },
    debugText: {
      color: tokens.color.neutral["0"].value,
      fontSize: 18,
    },
    errorText: {
      color: ERROR_COLOR,
      fontSize: 18,
    },
    gridContainer: {
      flex: 1,
      marginTop: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header />
      <RegionPicker />

      <View style={styles.gridContainer}>
        {error ? (
          <Text style={styles.errorText}>❌ {error}</Text>
        ) : loading ? (
          <Text style={styles.debugText}>Loading games…</Text>
        ) : (
          <GameGrid games={games} onSelectGame={handleSelectGame} />
        )}
      </View>
    </SafeAreaView>
  );
}
