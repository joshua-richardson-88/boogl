import create from "zustand";
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

type Store = {
  diceBag: BagODice;
  gameBoard: GameBoard;
  game: Game;
  wasIncorrectWord: boolean;
  alreadyFound: boolean;
  gameStarted: boolean;
  validationUrl: URL;

  startGame: () => void;
  endGame: () => void;
  updateGameBoardSize: (r: number, c: number) => void;
  clearWord: () => void;
  addWordToList: () => void;
  addLetter: (n: number) => void;
  removeLetter: (s?: number, e?: number) => void;
  toggleIncorrectWord: (f?: boolean) => void;
  toggleAlreadyFound: (f?: boolean) => void;
  rotateTiles: (s: "cw" | "ccw") => void;
  updateTouchPosition: ({
    x,
    y,
  }: {
    x: number | null;
    y: number | null;
  }) => void;
};

const GAME_ROWS = 4;
const GAME_COLS = 4;

const useStore = create<Store>((set) => ({
  diceBag: diceBag as BagODice,
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
  startGame: () => {
    set((state) => {
      const tiles = generateTileset(state.diceBag);
      const tileMap = getCurrentMap(tiles, GAME_COLS, GAME_ROWS);
      const newState: Store = {
        ...state,
        gameStarted: true,
        gameBoard: {
          ...state.gameBoard,
          tiles,
          tileMap,
        },
        game: {
          currentWord: [],
          score: 0,
          wordList: [],
          pointerPosition: { x: null, y: null },
        },
      };
      return newState;
    });
  },
  endGame: () => {
    set((state) => ({
      ...state,
      gameStarted: false,
      gameBoard: {
        ...state.gameBoard,
        tiles: Array(GAME_COLS * GAME_ROWS).fill(""),
        tileMap: {},
      },
    }));
  },
  updateGameBoardSize: (r, c) => {
    set((state) => ({
      ...state,
      gameBoard: {
        ...state.gameBoard,
        rows: r,
        cols: c,
      },
    }));
  },
  addWordToList: () => {
    set((state) => {
      const word = tilesToWord(state.game.currentWord, state.gameBoard.tiles);
      const newScore = calculateScore(word);
      return {
        ...state,
        game: {
          ...state.game,
          wordList: [word, ...state.game.wordList],
          score: state.game.score + newScore,
          currentWord: [],
        },
      };
    });
  },
  clearWord: () => {
    set((state) => ({
      ...state,
      game: {
        ...state.game,
        currentWord: [],
      },
    }));
  },
  addLetter: (n: number) => {
    set((state) => ({
      ...state,
      game: {
        ...state.game,
        currentWord: [...state.game.currentWord, n],
      },
    }));
  },
  removeLetter: (i = 0, e) => {
    set((state) => ({
      ...state,
      game: {
        ...state.game,
        currentWord: state.game.currentWord.filter((_, x) => {
          return x < i ? true : e != null && x >= e ? true : false;
        }),
      },
    }));
  },
  toggleIncorrectWord: (f) => {
    set((state) => ({
      ...state,
      wasIncorrectWord: f != null ? f : !state.wasIncorrectWord,
    }));
  },
  toggleAlreadyFound: (f) => {
    set((state) => ({
      ...state,
      alreadyFound: f != null ? f : !state.wasIncorrectWord,
    }));
  },
  rotateTiles: (s) => {
    set((state) => {
      const tiles = rotateGameTiles(state.gameBoard.tiles, s);
      const tileMap = getCurrentMap(tiles, GAME_COLS, GAME_ROWS);
      const newState: Store = {
        ...state,
        gameBoard: {
          ...state.gameBoard,
          tiles,
          tileMap,
        },
      };
      return newState;
    });
  },
  updateTouchPosition: (pos) => {
    set((state) => ({
      ...state,
      game: {
        ...state.game,
        pointerPosition: pos,
      },
    }));
  },
}));

export default useStore;
