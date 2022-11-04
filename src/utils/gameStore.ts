import create from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  calculateScore,
  diceBag,
  generateTileset,
  getCurrentMap,
  rotateGameTiles,
  tilesToWord,
  type TileMap,
} from "./gameUtils";

export type Dice = [string, string, string, string, string, string];
export type BagODice = Dice[];
export type Position = { x: number | null; y: number | null };
type GameBoard = {
  rows: number;
  cols: number;
  tiles: string[]; // tiles.length = rows * cols
  tileMap: TileMap;
};
type Game = {
  wordList: string[];
  score: number;
  currentWord: number[];
  pointerPosition: { x: number | null; y: number | null };
};
type State = {
  diceBag: BagODice;
  gameBoard: GameBoard;
  game: Game;
  wasIncorrectWord: boolean;
  alreadyFound: boolean;
  gameStarted: boolean;
  validationUrl: URL;
};
type Actions = {
  startGame: () => void;
  endGame: () => void;
  updateGameBoardSize: (r: number, c: number) => void;
  clearWord: () => void;
  addWordToList: () => void;
  addLetter: (n: number) => void;
  removeLetter: (s?: number, e?: number) => void;
  backspace: () => void;
  toggleIncorrectWord: (f?: boolean) => void;
  toggleAlreadyFound: (f?: boolean) => void;
  rotateTiles: (s: "cw" | "ccw") => void;
  updateTouchPosition: (p: Position) => void;
};
type Store = State & Actions;

export const GAME_ROWS = 4;
export const GAME_COLS = 4;

const initState: State = {
  diceBag: diceBag,
  gameBoard: {
    rows: GAME_ROWS,
    cols: GAME_COLS,
    tiles: Array(GAME_COLS * GAME_ROWS).fill(""),
    tileMap: {},
  },
  game: {
    wordList: [],
    score: 0,
    currentWord: [],
    pointerPosition: { x: null, y: null },
  },
  wasIncorrectWord: false,
  alreadyFound: false,
  gameStarted: false,
  validationUrl: new URL("https://api.dictionaryapi.dev/api/v2/entries/en"),
};

const useStore = create<Store>()(
  immer(
    devtools((set) => ({
      ...initState,
      startGame: () => {
        set(
          (state) => {
            const _tiles = generateTileset(state.diceBag);
            const _tileMap = getCurrentMap(_tiles, GAME_COLS, GAME_ROWS);

            state.gameStarted = true;
            state.gameBoard.tileMap = _tileMap;
            state.gameBoard.tiles = _tiles;
            state.game = initState.game;
          },
          false,
          "game/startGame"
        );
      },
      endGame: () =>
        set(
          (state) => {
            state.gameStarted = false;
            state.gameBoard = initState.gameBoard;
          },
          false,
          "game/endGame"
        ),
      updateGameBoardSize: (r, c) =>
        set(
          (state) => {
            state.gameBoard.rows = r;
            state.gameBoard.cols = c;
          },
          false,
          "game/updateGameBoardSize"
        ),
      addWordToList: () => {
        set(
          (state) => {
            const _w = tilesToWord(
              state.game.currentWord,
              state.gameBoard.tiles
            );
            if (_w == null) return;
            state.game.wordList.splice(0, 0, _w);
            state.game.wordList.filter((w) => w.length > 2);
            state.game.score += calculateScore(_w);
            state.game.currentWord = [];
          },
          false,
          "game/addWordToList"
        );
      },
      clearWord: () => {
        set(
          (state) => {
            state.game.currentWord = [];
          },
          false,
          "game/clearWord"
        );
      },
      addLetter: (n) => {
        set(
          (state) => {
            state.game.currentWord.push(n);
          },
          false,
          "game/addLetter"
        );
      },
      removeLetter: (i = 0, e) => {
        set(
          (state) => {
            state.game.currentWord.slice(i, e);
          },
          false,
          "game/removeLetter"
        );
      },
      backspace: () => {
        set(
          (state) => {
            state.game.currentWord = state.game.currentWord.slice(0, -1);
          },
          false,
          "game/backspace"
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
      toggleAlreadyFound: (f) => {
        set(
          (state) => {
            state.alreadyFound = f != null ? f : !state.alreadyFound;
          },
          false,
          "game/toggleAlreadyFound"
        );
      },
      rotateTiles: (s) => {
        set(
          (state) => {
            const _t = rotateGameTiles(state.gameBoard.tiles, s);
            state.gameBoard.tiles = _t;
            state.gameBoard.tileMap = getCurrentMap(_t, GAME_COLS, GAME_ROWS);
          },
          false,
          "game/rotateTiles"
        );
      },
      updateTouchPosition: (pos) => {
        set(
          (state) => {
            state.game.pointerPosition = pos;
          },
          false,
          "game/updateTouchPosition"
        );
      },
    }))
  )
);

export default useStore;
