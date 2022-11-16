import { useCallback, useEffect, useState } from "react";

import Cell from "./Cell";
import LeftAside from "./LeftAside";
import RightAside from "./RightAside";
import gameStore, { findPath, getAdj } from "./data/store";

const keyIsLetter = (s: string) =>
  s.length === 1 && s.toLowerCase().match(/[a-z]/);

const GameBoard = () => {
  const [adjacentCurrent, setAdjacentCurrent] = useState<number[]>([]);

  const gameStarted = gameStore().gameStarted;
  const currentWord = gameStore().currentWord;
  const tiles = gameStore().tiles;
  const tileMap = gameStore().tileMap;

  const addLetter = gameStore().addLetter;
  const clearWord = gameStore().clearWord;

  const updateAdjacent = useCallback(
    (n?: number) => {
      if (currentWord.length === 0 || n == null) {
        setAdjacentCurrent([]);
        return;
      }

      setAdjacentCurrent(getAdj(currentWord[currentWord.length - 1] ?? -10));
    },
    [currentWord]
  );
  const keyToIndexes = useCallback(
    (s: string) =>
      tiles.reduce((a, v, i) => (v === s ? [...a, i] : a), [] as number[]),
    [tiles]
  );

  useEffect(() => {
    const word = currentWord[currentWord.length - 1];

    setAdjacentCurrent(word == null ? [] : getAdj(word));
  }, [currentWord, tiles]);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (!gameStarted) return;
      if (!keyIsLetter(e.key)) return;
      const key = e.key === "q" ? "QU" : e.key.toUpperCase();

      if (!tiles.includes(key)) return;
      if (currentWord.length === 0) {
        const pos = keyToIndexes(key)[0];
        if (pos == null) return;

        addLetter(pos);
        setAdjacentCurrent(getAdj(pos));
        return;
      }
      const _path = findPath(tileMap)([
        ...currentWord.map((i) => tiles[i] ?? ""),
        key,
      ]);
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
