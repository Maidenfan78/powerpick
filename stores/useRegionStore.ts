// apps/mobile/src/stores/useRegionStore.ts
import { create } from 'zustand';

export type Region = 'AU' | 'US' | 'EU';

interface RegionState {
  region: Region;
  setRegion: (r: Region) => void;
}

export const useRegionStore = create<RegionState>((set) => ({
  region: 'AU',
  setRegion: (r) => set({ region: r }),
}));
