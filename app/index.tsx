import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import RegionPicker from '../components/RegionPicker';
import { useTheme } from '../lib/theme';
import { supabase } from '../lib/supabase';
import GameGrid from '../components/GameGrid';
import { Game } from '../components/GameCard';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const { tokens } = useTheme();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('id, name, logo_url, jackpot')
          .returns<Game[]>();

        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
        } else {
          setGames(data ?? []);
        }
      } catch (err) {
        console.error('Unexpected fetch error:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleSelectGame = (game: Game) => {
    router.push(`/game/${game.id}/options`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.color.brand.primary.value,
      padding: 16,
    },
    gridContainer: {
      flex: 1,
      marginTop: 20,
    },
    debugText: {
      color: tokens.color.neutral['0'].value,
      fontSize: 18,
    },
    errorText: {
      color: '#FF6666',
      fontSize: 18,
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
