import { customAlphabet } from "nanoid";
import { nolookalikesSafe } from "nanoid-dictionary";
import create from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import gameStore from "../../play/data/store";
import { type HeatMap } from "../../play/data/utils";

const nanoid = customAlphabet(nolookalikesSafe, 12);
const initState: State = {
  games: [],
  id: nanoid(),
  maxGames: 10,
  username: "New User",
  theme: "system",
};
const userStore = create(
  persist(
    immer<UserStore>((set) => ({
      ...initState,
      addGame: (type) => {
        const tiles = gameStore.getState().tiles;
        const words = gameStore.getState().wordList;
        const heatMap = gameStore.getState().heatMap;

        set((state) => {
          state.games = [
            { type, date: Date.now(), tiles, words, heatMap },
            ...state.games,
          ].slice(0, 10);
        });
      },
      clearProfile: () =>
        set((_) => ({
          ...initState,
          id: nanoid(),
        })),
      setTheme: (t) =>
        set((state) => {
          state.theme = t;
        }),
      updateUsername: (s) =>
        set((state) => {
          state.username = s ?? "New User";
        }),
    })),
    { name: "profile" }
  )
);

export default userStore;
export type GameType = "solo" | "multi";
export type Game = {
  type: GameType;
  date: number;
  tiles: string[];
  words: string[];
  heatMap: HeatMap;
};
type ThemeType = "light" | "dark" | "system";
type State = {
  games: Game[];
  id: string;
  maxGames: number;
  theme: ThemeType;
  username: string;
};
type Actions = {
  addGame: (t: GameType) => void;
  clearProfile: () => void;
  setTheme: (t: ThemeType) => void;
  updateUsername: (s?: string) => void;
};
type UserStore = State & Actions;
