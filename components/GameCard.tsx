// components/GameCard.tsx
import React, { useState } from 'react';
import {
  Text,
  Image,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../lib/theme';
import type { Game } from '../lib/gamesApi';

type GameCardProps = {
  game: Game;
  onPress: (e: GestureResponderEvent) => void;
};

export default function GameCard({ game, onPress }: GameCardProps) {
  const { tokens } = useTheme();
  const styles = StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: tokens.color.neutral['0'].value,
      borderRadius: tokens.radius.md.value,
      padding: tokens.spacing['3'].value,
      alignItems: 'center',
      margin: tokens.spacing['2'].value,
    },
    logo: {
      width: 96,
      height: 96,
      marginBottom: tokens.spacing['2'].value,
    },
    jackpot: {
      fontSize: tokens.typography.fontSizes.sm.value,
      fontWeight: '600',
      color: tokens.color.neutral['600'].value,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const imageSource =
    error || !game.logoUrl ? { uri: '' } : { uri: game.logoUrl };

  return (
    <Pressable
      style={styles.card as StyleProp<ViewStyle>}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${game.name} options`}
    >
      {loading && <ActivityIndicator style={styles.logo} />}
      {error || !game.logoUrl ? (
        <Image
          source={require('../assets/placeholder.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      ) : (
        <Image
          source={imageSource}
          style={styles.logo}
          resizeMode="contain"
          onLoadStart={() => {
            setLoading(true);
            setError(false);
          }}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
      <Text style={styles.jackpot}>{game.jackpot}</Text>
    </Pressable>
  );
}
