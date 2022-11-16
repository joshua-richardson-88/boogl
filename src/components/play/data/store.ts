import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  calculateScore,
  findFrequency,
  generateTileset,
  getCurrentMap,
  HeatMap,
  makeFindPath,
  makeGetAdjacent,
  rotateGameTiles,
  TileMap,
  tilesToWord,
} from "./utils";

const GAME_COLS = 4;
const GAME_ROWS = 4;

const _tiles = Array(GAME_COLS * GAME_ROWS).fill("");
const _pointer: Position = { x: null, y: null };
const _heatMap = { max: 0 };
const _url = new URL("https://api.dictionaryapi.dev/api/v2/entries/en");
const longEnough = (s: string): boolean => s.length > 2;

const initState: State = {
  alreadyFound: false,
  currentWord: [],
  gameStarted: false,
  heatMap: _heatMap,
  pointer: _pointer,
  score: 0,
  tileMap: {},
  tiles: _tiles,
  validationUrl: _url,
  wasIncorrectWord: false,
  wordList: [],
  words: [],
};
const gameStore = create<GameStore>()(
  immer(
    devtools((set) => ({
      ...initState,
      addLetter: (n) => {
        set(
          (state) => {
            state.currentWord.push(n);
          },
          false,
          "game/addLetter"
        );
      },
      addWordToList: () => {
        set(
          (state) => {
            const _w = tilesToWord(state.currentWord, state.tiles);

            state.wordList = [_w, ...state.wordList].filter(longEnough);
            state.words = [state.currentWord, ...state.words];
            state.score += calculateScore(_w.length);
            state.currentWord = [];
            state.heatMap = findFrequency(state.tiles, state.words);
          },
          false,
          "game/addWordToList"
        );
      },
      backspace: () => {
        set(
          (state) => {
            state.currentWord = state.currentWord.slice(0, -1);
          },
          false,
          "game/backspace"
        );
      },
      clearWord: () => {
        set(
          (state) => {
            state.currentWord = [];
          },
          false,
          "game/clearWord"
        );
      },
      endGame: () => {
        set(
          (state) => {
            state.gameStarted = false;
            state.tiles = _tiles;
            state.tileMap = {};
          },
          false,
          "game/endGame"
        );
      },
      removeLetter: (i = 0, e) => {
        set(
          (state) => {
            state.currentWord.slice(i, e);
          },
          false,
          "game/removeLetter"
        );
      },
      rotateTiles: (s) => {
        set(
          (state) => {
            const _t = rotateGameTiles(state.tiles, s);
            state.tiles = _t;
            state.tileMap = getMap(_t);
          },
          false,
          "game/rotateTiles"
        );
      },
      startGame: () => {
        set(
          (state) => {
            const _tiles = generateTileset();
            const _tileMap = getMap(_tiles);

            state.currentWord = [];
            state.gameStarted = true;
            state.heatMap = _heatMap;
            state.pointer = _pointer;
            state.score = 0;
            state.tileMap = _tileMap;
            state.tiles = _tiles;
            state.wordList = [];
            state.words = [];
          },
          false,
          "game/startGame"
        );
      },
      toggleAlreadyFound: (f) => {
        set(
          (state) => {
            state.alreadyFound = f != null ? f : !state.alreadyFound;
          },
          false,
          "game/toggleAlreadyFound"
        );
      },
      toggleIncorrectWord: (f) => {
        set(
          (state) => {
            state.wasIncorrectWord = f != null ? f : !state.wasIncorrectWord;
          },
          false,
          "game/toggleIncorrectWord"
        );
      },
      updateTouchPosition: (pos) => {
        set(
          (state) => {
            state.pointer = pos;
          },
          false,
          "game/updateTouchPosition"
        );
      },
    }))
  )
);

export const getAdj = makeGetAdjacent(GAME_COLS, GAME_ROWS);
export const getMap = getCurrentMap(getAdj);
export const findPath = makeFindPath(getAdj);
export default gameStore;

type State = {
  alreadyFound: boolean;
  currentWord: number[];
  gameStarted: boolean;
  heatMap: HeatMap;
  pointer: Position;
  score: number;
  tiles: string[];
  tileMap: TileMap;
  validationUrl: URL;
  wasIncorrectWord: boolean;
  wordList: string[];
  words: number[][];
};
type Actions = {
  addLetter: (n: number) => void;
  addWordToList: () => void;
  backspace: () => void;
  clearWord: () => void;
  endGame: () => void;
  removeLetter: (s?: number, e?: number) => void;
  rotateTiles: (s: "cw" | "ccw") => void;
  startGame: () => void;
  toggleAlreadyFound: (f?: boolean) => void;
  toggleIncorrectWord: (f?: boolean) => void;
  updateTouchPosition: (p: Position) => void;
};
type GameStore = State & Actions;
type Nullable<T> = T | null;

export type Position = { x: Nullable<number>; y: Nullable<number> };
