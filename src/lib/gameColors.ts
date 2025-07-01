export const gameColors: Record<string, string> = {
  "Saturday Lotto": "#cf0010",
  "Oz Lotto": "#015700",
  Powerball: "#1d3782",
  "Set for Life": "#3bb3c3",
  "Weekday Windfall": "#c4cae1",
};

export const getGameColor = (name: string): string =>
  gameColors[name] ?? "#7B1FA2";
