import type { Dice, BagODice } from "./gameStore";

export const diceBag: BagODice = [
  ["A", "A", "E", "E", "G", "N"],
  ["A", "B", "B", "J", "O", "O"],
  ["A", "C", "H", "O", "P", "S"],
  ["A", "F", "F", "K", "P", "S"],
  ["A", "O", "O", "T", "T", "W"],
  ["C", "I", "M", "O", "T", "U"],
  ["D", "E", "I", "L", "R", "X"],
  ["D", "E", "L", "R", "V", "Y"],
  ["D", "I", "S", "T", "T", "Y"],
  ["E", "E", "G", "H", "N", "W"],
  ["E", "E", "I", "N", "S", "U"],
  ["E", "H", "R", "T", "V", "W"],
  ["E", "I", "O", "S", "S", "T"],
  ["E", "L", "R", "T", "T", "Y"],
  ["H", "I", "M", "N", "QU", "U"],
  ["H", "L", "N", "N", "R", "Z"],
];

// ----------------------------------------------------------------------------
//                        Generate Tiles for game
// ----------------------------------------------------------------------------
const shuffle = (a: BagODice) => {
  a.reverse().forEach((_, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j] as Dice, a[i] as Dice];
  });
  return a;
};
const rollDice = (a: string[]): string =>
  a[Math.floor(Math.random() * a.length)] as string;
export const generateTileset = (a: BagODice): string[] =>
  shuffle(a).map(rollDice);
// ----------------------------------------------------------------------------
//                             Get New Score
// ----------------------------------------------------------------------------
export const calculateScore = (s: string) => {
  if (s.length < 3) return 0;
  if (s.length < 5) return 1;
  if (s.length === 5) return 2;
  if (s.length === 6) return 3;
  if (s.length === 7) return 5;
  return 11;
};

// ----------------------------------------------------------------------------
//                          Init Helpers
// ----------------------------------------------------------------------------
const keyToIndexes = (as: string[]) => (s: string) =>
  as.reduce((a, v, i) => (v === s ? [...a, i] : a), [] as number[]);

type AdjacentLetters = string[];
type Position = number;
type Instance = [Position, AdjacentLetters];
export type TileMap = {
  [k: string]: Instance[];
};
export const getCurrentMap = (
  as: string[],
  cols: number,
  rows: number
): TileMap => {
  const getAdj = makeGetAdjacent(cols, rows);

  return as.reduce((a, v) => {
    const positions = keyToIndexes(as)(v);
    const adjacentLetters = positions.map((p) => {
      const adj = getAdj(p).map((n) => as[n] ?? "");
      return [p, adj] as Instance;
    });
    a[v] = adjacentLetters;

    return a;
  }, {} as TileMap);
};

// ----------------------------------------------------------------------------
//                          Find letter path
// ----------------------------------------------------------------------------
export const tilesToWord = (a: number[], t: string[]) =>
  a.map((x) => t[x]).join("");
export const makeGetAdjacent =
  (cols: number, rows: number) =>
  (i: number, shouldFilter = true): number[] => {
    const min = 0;
    const max = cols * rows;

    if (i == null || i < min || i > max) return [];
    const adj = [
      i % cols === 0 || i < rows ? -100 : i - cols - 1,
      i < rows ? -100 : i - cols,
      (i + 1) % cols === 0 || i < rows ? -100 : i - cols + 1,
      i % cols === 0 ? -100 : i - 1,
      (i + 1) % cols === 0 ? -100 : i + 1,
      i % cols === 0 || i > max - rows - 1 ? -100 : i + cols - 1,
      i > max - rows - 1 ? -100 : i + cols,
      (i + 1) % cols === 0 || i > max - rows - 1 ? -100 : i + cols + 1,
    ];
    return shouldFilter ? adj.filter((x) => x >= 0) : adj;
  };

export const makeFindPath = (
  tileMap: TileMap,
  getAdj: (i: number) => number[]
) => {
  return function findPath(
    wordArr: string[],
    matches: Set<number>,
    visited: Set<number>,
    start?: Instance[]
  ): Set<number> | undefined {
    if (start == null) {
      return wordArr[0] == null
        ? undefined
        : findPath(wordArr.slice(1), matches, visited, tileMap[wordArr[0]]);
    }

    if (wordArr[0] == null && start[0] != null) return matches.add(start[0][0]);

    const filtered = start
      .filter(
        ([pos, adj]) =>
          adj.includes(wordArr[0] ?? "") &&
          !matches.has(pos) &&
          !visited.has(pos)
      )
      .map(([p]) => p);

    for (const tile of filtered) {
      visited.add(tile);
      const neighbors =
        tileMap[wordArr[0] ?? ""]?.filter(([i]) => {
          if (matches.has(i) || visited.has(i)) return false;
          return getAdj(i).includes(tile);
        }) ?? [];

      for (const neighbor of neighbors) {
        const foundMatches = findPath(wordArr.slice(1), matches, visited, [
          neighbor,
        ]);
        if (foundMatches == null) continue;

        foundMatches.forEach(matches.add, matches);
        break;
      }

      if (matches.size === wordArr.length) {
        return matches.add(tile);
      }
      visited.delete(tile);
    }
  };
};

// ----------------------------------------------------------------------------
//                            Rotate Tiles
// ----------------------------------------------------------------------------
const CWMap = [12, 8, 4, 0, 13, 9, 5, 1, 14, 10, 6, 2, 15, 11, 7, 3];
const CCWMap = [3, 7, 11, 15, 2, 6, 10, 14, 1, 5, 9, 13, 0, 4, 8, 12];
export const rotateGameTiles = (as: string[], dir: "cw" | "ccw"): string[] => {
  if (dir === "cw") return CWMap.map((x) => as[x] ?? "");

  return CCWMap.map((x) => as[x] ?? "");
};
