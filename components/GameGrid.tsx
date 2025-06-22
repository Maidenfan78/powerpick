import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import GameCard, { Game } from './GameCard';

type GameGridProps = {
  games: Game[];
  onSelectGame: (game: Game) => void;
};

export default function GameGrid({ games, onSelectGame }: GameGridProps) {
  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <GameCard
          game={item}
          onPress={() => onSelectGame(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
});
