import { useCallback, useEffect, useRef, useState } from "react";

import gameStore, { getAdj, type Position } from "./data/store";
import { type AdjacencyTuple } from "./data/utils";
import usePrevious from "../../hooks/usePrevious";

const defaultAdjacent: AdjacencyTuple = [-1, -1, -1, -1, -1, -1, -1, -1];
const isWithinTile = (a: Position, b: DOMRect): boolean => {
  if (a.x == null || a.y == null) return false;
  return (
    a.x >= b.x && a.x <= b.x + b.width && a.y >= b.y && a.y <= b.y + b.height
  );
};
const vOffset = (y: number) =>
  y < 3 ? "-top-2" : y < 5 ? "top-6" : "-bottom-1";
const hOffset = (x: number) =>
  [0, 3, 5].includes(x)
    ? "-left-3"
    : [1, 6].includes(x)
    ? "left-5"
    : "-right-3";
const rotate = (i: number) =>
  [0, 7].includes(i)
    ? "rotate-45"
    : [2, 5].includes(i)
    ? "-rotate-45"
    : [1, 6].includes(i)
    ? "rotate-90"
    : "";
const visibility = (n: number) =>
  n >= 0 ? "bg-green-600 shadow-md shadow-green-400" : "";

type Props = {
  adjCurrent: boolean;
  letter: string;
  position: number;
  update: (n?: number) => void;
};
const Cell = ({ adjCurrent, letter, position }: Props) => {
  const tileRef = useRef<HTMLDivElement>(null);
  const currentWord = gameStore().currentWord;
  const gameStarted = gameStore().gameStarted;
  const pointer = gameStore().pointer;

  const addLetter = gameStore().addLetter;
  const removeLetter = gameStore().removeLetter;

  const [adjacent, setAdjacent] = useState<AdjacencyTuple>(defaultAdjacent);
  const [withinTile, setWithinTile] = useState(false);
  const wasWithinTile = usePrevious(withinTile);

  const selectTile = useCallback(
    (f = false) => {
      if (!gameStarted) return;
      if (currentWord.includes(position)) {
        removeLetter(currentWord.indexOf(position), f ? undefined : -1);
        return;
      }
      if (currentWord.length > 0 && !adjCurrent) return;

      addLetter(position);
    },
    [addLetter, adjCurrent, currentWord, gameStarted, position, removeLetter]
  );
  const color = currentWord.includes(position)
    ? "bg-green-600/40"
    : adjCurrent
    ? "bg-amber-600/40"
    : "bg-neutral-800";

  useEffect(() => {
    if (!gameStarted) {
      setAdjacent(defaultAdjacent);
      return;
    }
    if (currentWord.includes(position)) {
      const startIndex = currentWord.indexOf(position);
      const wordSegment = currentWord.slice(startIndex + 1, startIndex + 2);

      if (wordSegment.length < 1) return;

      const a = getAdj(position).map((x) => {
        if (x < 0) return x;
        return wordSegment.includes(x) ? x : -100;
      });
      setAdjacent(a as AdjacencyTuple);
    } else {
      setAdjacent(defaultAdjacent);
    }
  }, [currentWord, gameStarted, getAdj, position]);

  useEffect(() => {
    if (tileRef.current == null) return;

    setWithinTile(
      isWithinTile(pointer, tileRef.current.getBoundingClientRect())
    );
  }, [pointer, tileRef]);

  useEffect(() => {
    if (withinTile === wasWithinTile || !withinTile) return;
    selectTile(true);
  }, [letter, selectTile, withinTile, wasWithinTile]);

  return (
    <div className="400 relative flex h-14 w-14 cursor-pointer select-none items-center justify-center text-xl">
      {adjacent.map((a, i) => (
        <div
          key={i}
          className={`absolute h-1 w-4 ${vOffset(i)} ${hOffset(i)} 
            ${rotate(i)} ${visibility(a)}`}
        />
      ))}
      <div className="inset-shadow absolute inset-0 z-10 overflow-hidden rounded-md bg-neutral-800">
        <div
          className={`flex h-full w-full items-center justify-center ${color}`}
          ref={tileRef}
        >
          {letter}
        </div>
      </div>
    </div>
  );
};

export default Cell;
