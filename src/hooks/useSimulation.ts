import { create } from 'zustand';

type SimulationState = {
  isPlaying: boolean;
  speed: number;
  tick: number;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  advanceTick: () => void;
  reset: () => void;
};

export const useSimulation = create<SimulationState>((set) => ({
  isPlaying: false,
  speed: 1,
  tick: 0,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ speed }),
  advanceTick: () => set((state) => ({ tick: state.tick + 1 })),
  reset: () => set({ isPlaying: false, tick: 0 }),
}));
