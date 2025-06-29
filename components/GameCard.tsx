// components/GameCard.tsx
/* eslint-disable react-native/no-unused-styles */
import React, { useState, useMemo, useEffect } from "react";
import {
  Text,
  Image,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from "react-native";
import { useTheme } from "../lib/theme";
import type { Game } from "../lib/gamesApi";
import placeholder from "../assets/placeholder.png";

type GameCardProps = {
  game: Game;
  onPress: (e: GestureResponderEvent) => void;
};

export default function GameCard({ game, onPress }: GameCardProps) {
  const { tokens } = useTheme();
  // eslint-disable-next-line react-native/no-unused-styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          alignItems: "center",
          backgroundColor: tokens.color.neutral["0"].value,
          borderRadius: tokens.radius.md.value,
          flex: 1,
          margin: tokens.spacing["2"].value,
          padding: tokens.spacing["4"].value,
        },
        jackpot: {
          color: tokens.color.neutral["600"].value,
          fontSize: tokens.typography.fontSizes.lg.value,
          fontWeight: "700",
        },
        logo: {
          height: 96,
          marginBottom: tokens.spacing["3"].value,
          width: 96,
        },
        nextDraw: {
          color: tokens.color.neutral["600"].value,
          fontSize: tokens.typography.fontSizes.sm.value,
        },
      }),
    [tokens],
  );

  const [loading, setLoading] = useState(!!game.logoUrl);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!game.logoUrl) {
      setLoading(false);
    }
  }, [game.logoUrl]);

  const imageSource =
    error || !game.logoUrl ? { uri: "" } : { uri: game.logoUrl };

  return (
    <Pressable
      style={styles.card as StyleProp<ViewStyle>}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${game.name} options`}
    >
      {loading && <ActivityIndicator style={styles.logo} />}
      {error || !game.logoUrl ? (
        <Image source={placeholder} style={styles.logo} resizeMode="contain" />
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
      {game.nextDrawTime && (
        <Text style={styles.nextDraw}>
          {new Date(game.nextDrawTime).toLocaleString()}
        </Text>
      )}
    </Pressable>
  );
}
