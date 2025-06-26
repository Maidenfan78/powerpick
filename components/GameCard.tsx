// components/GameCard.tsx
import React, { useState } from "react";
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

type GameCardProps = {
  game: Game;
  onPress: (e: GestureResponderEvent) => void;
};

export default function GameCard({ game, onPress }: GameCardProps) {
  const { tokens } = useTheme();
  const styles = StyleSheet.create({
    card: {
      alignItems: "center",
      backgroundColor: tokens.color.neutral["0"].value,
      borderRadius: tokens.radius.md.value,
      flex: 1,
      margin: tokens.spacing["2"].value,
      padding: tokens.spacing["3"].value,
    },
    jackpot: {
      color: tokens.color.neutral["600"].value,
      fontSize: tokens.typography.fontSizes.sm.value,
      fontWeight: "600",
    },
    logo: {
      height: 96,
      marginBottom: tokens.spacing["2"].value,
      width: 96,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        <Image
          source={require("../assets/placeholder.png")}
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
