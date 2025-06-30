/* eslint-disable react-native/no-unused-styles, react-native/no-color-literals, react-native/sort-styles */
import { useEffect, useState, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import HomeTopBar from "../components/HomeTopBar";
import BottomNav from "../components/BottomNav";
import ComingSoon from "../components/ComingSoon";
import GameGrid from "../components/GameGrid";
import { SCREEN_BG } from "../lib/constants";
import { Game, fetchGames } from "../lib/gamesApi";
import { useRouter } from "expo-router";
import { useGamesStore } from "../stores/useGamesStore";
import { useRegionStore } from "../stores/useRegionStore";
import { REGION_PLACEHOLDER_IMAGES, REGION_LABELS } from "../lib/regionConfig";

const WHITE = "#FFFFFF";

const ERROR_COLOR = "#FF6666";

export default function IndexScreen() {
  const router = useRouter();
  const region = useRegionStore((s) => s.region);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setGamesStore = useGamesStore((s) => s.setGames);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGames();
        setGames(data);
        setGamesStore(data);
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

  // eslint-disable-next-line react-native/no-unused-styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { backgroundColor: SCREEN_BG, flex: 1 },
        debugText: { color: WHITE, fontSize: 18 },
        errorText: { color: ERROR_COLOR, fontSize: 18 },
        gridContainer: { flex: 1, paddingVertical: 8 },
      }),
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <HomeTopBar />

      {region === "AU" ? (
        <View style={styles.gridContainer}>
          {error ? (
            <Text style={styles.errorText}>❌ {error}</Text>
          ) : loading ? (
            <Text style={styles.debugText}>Loading games…</Text>
          ) : (
            <GameGrid games={games} onSelectGame={handleSelectGame} />
          )}
        </View>
      ) : (
        <ComingSoon
          image={REGION_PLACEHOLDER_IMAGES[region] as number}
          region={REGION_LABELS[region]}
        />
      )}
      <BottomNav />
    </SafeAreaView>
  );
}
