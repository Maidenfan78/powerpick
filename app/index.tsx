// /app/index.tsx
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import RegionPicker from '../components/RegionPicker';
import { supabase } from '../lib/supabase';

export default function IndexScreen() {
  const [gameCount, setGameCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // quick connectivity test: count rows in 'games' table
    supabase
      .from('games')
      .select('id', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error('Supabase error:', error);
          setError(error.message);
        } else {
          setGameCount(count ?? 0);
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Header />
      <RegionPicker />
      <View style={styles.debugContainer}>
        {error ? (
          <Text style={styles.errorText}>❌ {error}</Text>
        ) : gameCount === null ? (
          <Text style={styles.debugText}>Loading games…</Text>
        ) : (
          <Text style={styles.debugText}>🎲 {gameCount} games loaded</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C244B',
    padding: 16,
  },
  debugContainer: {
    marginTop: 20,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  errorText: {
    color: '#FF6666',
    fontSize: 18,
  },
});
