import { useCallback, useEffect, useMemo, useState } from "react";

import { Cell, LeftAside, RightAside } from "./index";
import { makeGetAdjacent, makeFindPath } from "../utils/gameUtils";
import useStore from "../utils/store";

const keyIsLetter = (s: string) =>
  s.length === 1 && s.toLowerCase().match(/[a-z]/);

const GameBoard = () => {
  const [adjacentHover, setAdjacentHover] = useState<number[]>([]);
  const [adjacentCurrent, setAdjacentCurrent] = useState<number[]>([]);

  const gameStarted = useStore().gameStarted;
  const { cols, rows } = useStore().gameBoard;
  const currentWord = useStore().game.currentWord;
  const tiles = useStore().gameBoard.tiles;
  const tileMap = useStore().gameBoard.tileMap;

  const addLetter = useStore().addLetter;
  const clearWord = useStore().clearWord;

  const getAdj = useMemo(() => makeGetAdjacent(cols, rows), [cols, rows]);
  const findPath = useMemo(
    () => makeFindPath(tileMap, getAdj),
    [tileMap, getAdj]
  );

  const updateAdjacent = useCallback(
    (n?: number) => {
      if (currentWord.length === 0 || n == null) {
        setAdjacentCurrent([]);
        setAdjacentHover([]);
        return;
      }

      const getAdj = makeGetAdjacent(cols, rows);
      setAdjacentHover(getAdj(n));
      setAdjacentCurrent(getAdj(currentWord[currentWord.length - 1] ?? -10));
    },
    [cols, rows, currentWord]
  );
  const keyToIndexes = useCallback(
    (s: string) =>
      tiles.reduce((a, v, i) => (v === s ? [...a, i] : a), [] as number[]),
    [tiles]
  );

  useEffect(() => {
    const word = currentWord[currentWord.length - 1];

    setAdjacentCurrent(word == null ? [] : makeGetAdjacent(cols, rows)(word));
  }, [currentWord, cols, rows, tiles]);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      if (!keyIsLetter(e.key)) return;
      const key = e.key.toUpperCase();

      if (!tiles.includes(key)) return;
      if (currentWord.length === 0) {
        const pos = keyToIndexes(key)[0];
        if (pos == null) return;

        addLetter(pos);
        setAdjacentCurrent(getAdj(pos));
        return;
      }
      const _path = findPath(
        [...currentWord.map((i) => tiles[i] ?? ""), key],
        new Set(),
        new Set()
      );
      if (_path == null) return;

      const path = [..._path.values()].reverse();
      clearWord();
      path.forEach((l) => addLetter(l));
      const endOfWord = path[path.length - 1];
      if (endOfWord != null) setAdjacentCurrent(getAdj(endOfWord));
    };
    window.addEventListener("keydown", keyDownHandler);
    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [
    addLetter,
    clearWord,
    findPath,
    gameStarted,
    getAdj,
    keyToIndexes,
    tileMap,
    tiles,
    currentWord,
  ]);

  return (
    <div className="grid touch-none grid-cols-4 grid-rows-4 gap-2">
      {tiles.map((d, i) => (
        <Cell
          key={i}
          letter={d}
          position={i}
          adjCurrent={adjacentCurrent.includes(i)}
          adjHover={adjacentHover.includes(i)}
          update={updateAdjacent}
        />
      ))}
    </div>
  );
};
const Game = () => (
  <div className="flex w-full justify-evenly gap-4">
    <LeftAside />
    <GameBoard />
    <RightAside />
  </div>
);

export default Game;
