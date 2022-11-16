const randomInt = (x: number): number => Math.floor(Math.random() * x);
const shuffle = (a: BagODice) => {
  a.reverse().forEach((_, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j] as Dice, a[i] as Dice];
  });
  return a;
};
const rollDice = (a: string[]): string => a[randomInt(a.length)] ?? "";
const keyToIndexes =
  (as: string[]) =>
  (s: string): number[] =>
    as.reduce((a, v, i) => (v === s ? [...a, i] : a), [] as number[]);
const CWMap = [12, 8, 4, 0, 13, 9, 5, 1, 14, 10, 6, 2, 15, 11, 7, 3];
const CCWMap = [3, 7, 11, 15, 2, 6, 10, 14, 1, 5, 9, 13, 0, 4, 8, 12];

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
export const generateTileset = (): string[] => shuffle(diceBag).map(rollDice);
export const calculateScore = (n: number): number => {
  if (n < 3) return 0;
  if (n < 5) return 1;
  if (n === 5) return 2;
  if (n === 6) return 3;
  if (n === 7) return 5;
  return 11;
};
export const getCurrentMap =
  (f: AdjFn) =>
  (as: string[]): TileMap =>
    as.reduce((a, v) => {
      a[v] = keyToIndexes(as)(v).map((p) => [p, f(p).map((n) => as[n] ?? "")]);
      return a;
    }, {} as TileMap);
export const tilesToWord = (a: number[], t: string[]): string =>
  a.map((x) => t[x]).join("");
export const makeGetAdjacent =
  (c: number, r: number) =>
  (i: number): AdjacencyTuple => {
    const min = 0;
    const max = c * r;
    if (i == null || i < min || i > max)
      return [-1, -1, -1, -1, -1, -1, -1, -1];
    return [
      i % c === 0 || i < r ? -1 : i - c - 1,
      i < r ? -1 : i - c,
      (i + 1) % c === 0 || i < r ? -1 : i - c + 1,
      i % c === 0 ? -1 : i - 1,
      (i + 1) % c === 0 ? -1 : i + 1,
      i % c === 0 || i > max - r - 1 ? -1 : i + c - 1,
      i > max - r - 1 ? -1 : i + c,
      (i + 1) % c === 0 || i > max - r - 1 ? -1 : i + c + 1,
    ];
  };
export const makeFindPath = (f: AdjFn) => (m: TileMap) => {
  return function g(
    ls: string[],
    n = new Set<number>(),
    v = new Set<number>(),
    s?: Instance[]
  ): Set<number> | undefined {
    if (s == null)
      return ls[0] == null ? undefined : g(ls.slice(1), n, v, m[ls[0]]);
    if (ls[0] == null && s[0] != null) return n.add(s[0][0]);

    const fi = s
      .filter(([p, a]) => a.includes(ls[0] ?? "") && !n.has(p) && !v.has(p))
      .map((p) => p[0]);

    for (const t of fi) {
      v.add(t);
      const ns =
        m[ls[0] ?? ""]?.filter((l) => {
          return n.has(l[0]) || v.has(l[0]) ? false : f(l[0]).includes(t);
        }) ?? [];

      for (const ne of ns) {
        const found = g(ls.slice(1), n, v, [ne]);
        if (found == null) continue;
        found.forEach(n.add, n);
        break;
      }

      if (n.size === ls.length) return n.add(t);
      v.delete(t);
    }
  };
};
export const rotateGameTiles = (as: string[], d: "cw" | "ccw"): string[] =>
  d === "cw" ? CWMap.map((x) => as[x] ?? "") : CCWMap.map((x) => as[x] ?? "");
export const findFrequency = (ts: string[], ws: number[][]) =>
  ts.reduce(
    (a, _, i) => {
      const c = ws.reduce((a, v) => a + v.filter((x) => x === i).length, 0);
      a[i] = c;
      a.max = c > a.max ? c : a.max;
      return a;
    },
    { max: 0 } as HeatMap
  );

export type Dice = [string, string, string, string, string, string];
export type BagODice = Dice[];
export type AdjacencyTuple = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
export type HeatMap = {
  [k: string]: number;
  max: number;
};
export type TileMap = { [k: string]: Instance[] };
type AdjacentLetters = string[];
type Instance = [number, AdjacentLetters];
type AdjFn = (n: number) => AdjacencyTuple;
