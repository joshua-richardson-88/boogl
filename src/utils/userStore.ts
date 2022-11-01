import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { customAlphabet } from "nanoid";
import { nolookalikesSafe } from "nanoid-dictionary";

import { GAME_COLS, GAME_ROWS } from "./gameStore";
import {
  findFrequency,
  getCurrentMap,
  makeFindPath,
  makeGetAdjacent,
  type HeatMap,
} from "./gameUtils";

type GameType = "solo" | "multi";
export type Game = {
  type: GameType;
  date: number;
  tiles: string[];
  words: string[];
  heatMap: HeatMap;
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

const nanoid = customAlphabet(nolookalikesSafe, 12);
const initState: State = {
  username: "New User",
  id: nanoid(),
  games: [],
  maxGames: 10,
};
const getAdj = makeGetAdjacent(GAME_COLS, GAME_ROWS);

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
        const wordToTile = makeFindPath(
          getCurrentMap(ts, GAME_COLS, GAME_ROWS),
          getAdj
        );
        const words = ws
          .map((w) => wordToTile(w.split("")))
          .filter(Boolean)
          .map((i) => [...(i as Set<number>).values()].reverse());
        const heatMap = findFrequency(ts, words);

        set((state) => {
          state.games.push({
            type: t,
            date: Date.now(),
            tiles: ts,
            words: ws,
            heatMap,
          });
          if (state.games.length > state.maxGames) {
            state.games.pop();
          }
        });
      },
    })),
    { name: "user-profile" }
  )
);
