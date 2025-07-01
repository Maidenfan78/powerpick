// components/GameCard.tsx
/* eslint-disable react-native/no-unused-styles, react-native/no-color-literals, react-native/sort-styles */
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
import type { Game } from "../lib/gamesApi";
import placeholder from "../../assets/placeholder.png";
import { getGameColor } from "../lib/gameColors";

const CARD_BG = "#1E1E1E";
const WHITE = "#FFFFFF";

type GameCardProps = {
  game: Game;
  onPress: (e: GestureResponderEvent) => void;
};

export default function GameCard({ game, onPress }: GameCardProps) {
  // eslint-disable-next-line react-native/no-unused-styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          alignItems: "center",
          backgroundColor: CARD_BG,
          borderRadius: 8,
          flex: 1,
          margin: 4,
          paddingHorizontal: 12,
          paddingVertical: 16,
        },
        jackpot: {
          color: WHITE,
          fontSize: 18,
          fontWeight: "700",
        },
        logo: {
          backgroundColor: getGameColor(game.name),
          borderRadius: 64,
          height: 96,
          marginBottom: 10,
          width: 96,
        },
        nextDraw: {
          textAlign: "center",
          color: WHITE,
          fontSize: 14,
          marginTop: 4,
        },
      }),
    [game.name],
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
          resizeMode="center"
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
