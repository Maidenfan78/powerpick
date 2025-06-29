// components/GameCard.tsx
/* eslint-disable react-native/no-unused-styles */
import React, { useState, useEffect, useMemo } from "react";
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
import type { Game, DrawResult } from "../lib/gamesApi";
import { fetchRecentDraws } from "../lib/gamesApi";
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
        jackpotLabel: {
          color: tokens.color.neutral["500"].value,
          fontSize: tokens.typography.fontSizes.xs.value,
        },
        lastDraw: {
          color: tokens.color.neutral["600"].value,
          fontSize: tokens.typography.fontSizes.sm.value,
        },
        lastDrawLabel: {
          color: tokens.color.neutral["500"].value,
          fontSize: tokens.typography.fontSizes.xs.value,
          marginTop: tokens.spacing["2"].value,
        },
        logo: {
          height: 96,
          marginBottom: tokens.spacing["3"].value,
          width: 96,
        },
        name: {
          color: tokens.color.brand.primary.value,
          fontSize: tokens.typography.fontSizes.lg.value,
          fontWeight: "700",
          marginBottom: tokens.spacing["1"].value,
        },
        nextDraw: {
          color: tokens.color.neutral["600"].value,
          fontSize: tokens.typography.fontSizes.sm.value,
        },
        nextDrawLabel: {
          color: tokens.color.neutral["500"].value,
          fontSize: tokens.typography.fontSizes.xs.value,
          marginTop: tokens.spacing["2"].value,
        },
      }),
    [tokens],
  );

  const [loading, setLoading] = useState(!!game.logoUrl);
  const [error, setError] = useState(false);
  const [lastDraw, setLastDraw] = useState<DrawResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const draws = await fetchRecentDraws(game.id);
        if (!cancelled) setLastDraw(draws[0] ?? null);
      } catch (err) {
        console.error("GameCard fetch draws", err);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [game.id]);

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
      <Text style={styles.name}>{game.name}</Text>
      <Text style={styles.jackpotLabel}>Jackpot</Text>
      <Text style={styles.jackpot}>{game.jackpot}</Text>
      {game.nextDrawTime && (
        <>
          <Text style={styles.nextDrawLabel}>Next Draw</Text>
          <Text style={styles.nextDraw}>
            {new Date(game.nextDrawTime).toLocaleString()}
          </Text>
        </>
      )}
      {lastDraw && (
        <>
          <Text style={styles.lastDrawLabel}>Last Draw</Text>
          <Text style={styles.lastDraw}>
            #{lastDraw.draw_number}: {lastDraw.winning_numbers.join(" - ")}
            {lastDraw.supplementary_numbers?.length
              ? ` - Supp: ${lastDraw.supplementary_numbers.join(" - ")}`
              : ""}
            {lastDraw.powerball !== null && lastDraw.powerball !== undefined
              ? ` - Powerball: ${lastDraw.powerball}`
              : ""}
          </Text>
        </>
      )}
    </Pressable>
  );
}
