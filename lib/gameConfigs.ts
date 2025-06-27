export interface GameConfig {
  mainMax: number;
  mainCount: number;
  suppCount?: number;
  suppMax?: number;
  powerballMax?: number;
}

export const gameConfigs: Record<string, GameConfig> = {
  Powerball: { mainMax: 35, mainCount: 7, powerballMax: 20 },
  "Saturday Lotto": { mainMax: 45, mainCount: 6, suppCount: 2, suppMax: 45 },
  "Oz Lotto": { mainMax: 45, mainCount: 7, suppCount: 2, suppMax: 45 },
  "Set for Life": { mainMax: 44, mainCount: 7, suppCount: 2, suppMax: 44 },
  "Weekday Windfall": { mainMax: 45, mainCount: 6 },
};
