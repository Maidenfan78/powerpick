import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../lib/theme';

export interface Game {
  id: string;
  name: string;
  logoUrl: string;
  jackpot: string; // e.g. "$5 m"
}

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
      padding: tokens.spacing['4'].value,
      alignItems: 'center',
      margin: tokens.spacing['2'].value,
    },
    logo: {
      width: 48,
      height: 48,
      marginBottom: tokens.spacing['2'].value,
    },
    name: {
      fontSize: tokens.typography.fontSizes.md.value,
      fontWeight: '500',
      color: tokens.color.brand.primary.value,
      marginBottom: tokens.spacing['1'].value,
    },
    jackpot: {
      fontSize: tokens.typography.fontSizes.sm.value,
      fontWeight: '400',
      color: tokens.color.neutral['600'].value,
    },
  });

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${game.name} options`}
    >
      <Image
        source={{ uri: game.logoUrl }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.name}>{game.name}</Text>
      <Text style={styles.jackpot}>{game.jackpot}</Text>
    </Pressable>
  );
}

