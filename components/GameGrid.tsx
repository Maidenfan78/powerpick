import React from "react";
import { FlatList, StyleSheet } from "react-native";
import GameCard from "./GameCard";
import { Game } from "../lib/gamesApi";

type GameGridProps = {
  games: Game[];
  onSelectGame: (game: Game) => void;
};

export default function GameGrid({ games, onSelectGame }: GameGridProps) {
  return (
    <FlatList<Game>
      data={games}
      keyExtractor={(item: Game) => item.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }: { item: Game }) => (
        <GameCard game={item} onPress={() => onSelectGame(item)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
});
