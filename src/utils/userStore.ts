import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { customAlphabet } from "nanoid";
import { nolookalikesSafe } from "nanoid-dictionary";

const nanoid = customAlphabet(nolookalikesSafe, 12);

const initState: State = {
  username: "New User",
  id: nanoid(),
  games: [],
  maxGames: 10,
};

type GameType = "solo" | "multi";
type Game = {
  type: GameType;
  tiles: string[];
  words: string[];
};
type State = {
  username: string;
  id: string;
  games: Game[];
  maxGames: number;
};
type Actions = {
  clearProfile: () => void;
  updateUsername: (s?: string) => void;
  addGame: (t: GameType, ts: string[], ws: string[]) => void;
};
type Store = State & Actions;

export const userStore = create(
  persist(
    immer<Store>((set) => ({
      ...initState,
      clearProfile: () => {
        set((state) => {
          state.username = initState.username;
          state.id = nanoid();
          state.games = [];
          state.maxGames = 10;
        });
      },
      updateUsername: (s) => {
        set((state) => {
          state.username = s ?? "New User";
        });
      },
      addGame: (t, ts, ws) => {
        set((state) => {
          state.games.push({ type: t, tiles: ts, words: ws });
          if (state.games.length > state.maxGames) {
            state.games.pop();
          }
        });
      },
    })),
    { name: "user-profile" }
  )
);
