import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { makeGetAdjacent } from "../../utils/gameUtils";
import useStore from "../../utils/gameStore";
import usePrevious from "../../hooks/usePrevious";

type Props = {
  adjCurrent: boolean;
  letter: string;
  position: number;
  update: (n?: number) => void;
};
const Cell = ({ adjCurrent, letter, position }: Props) => {
  const tileRef = useRef<HTMLDivElement>(null);
  const currentWord = useStore().game.currentWord;
  const gameStarted = useStore().gameStarted;
  const { cols, rows } = useStore().gameBoard;
  const pointer = useStore().game.pointerPosition;

  const addLetter = useStore().addLetter;
  const removeLetter = useStore().removeLetter;
  const getAdj = useMemo(() => makeGetAdjacent(cols, rows), [cols, rows]);

  const [adjacent, setAdjacent] = useState<number[]>([]);
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
    [adjCurrent, currentWord, gameStarted, position]
  );

  useEffect(() => {
    if (!gameStarted) {
      setAdjacent([]);
      return;
    }
    if (currentWord.includes(position)) {
      const startIndex = currentWord.indexOf(position);
      const wordSegment = currentWord.slice(startIndex + 1, startIndex + 2);

      if (wordSegment.length < 1) return;

      const a = getAdj(position, false).map((x) => {
        if (x < 0) return x;
        return wordSegment.includes(x) ? x : -100;
      });
      setAdjacent(a);
    } else {
      setAdjacent([]);
    }
  }, [currentWord, gameStarted, getAdj, position]);

  useEffect(() => {
    if (tileRef.current == null) return;
    if (pointer.x == null || pointer.y == null) return;

    const rect = tileRef.current.getBoundingClientRect();
    const withinTile =
      pointer.x >= rect.x &&
      pointer.x <= rect.x + rect.width &&
      pointer.y >= rect.y &&
      pointer.y <= rect.y + rect.height;

    setWithinTile(withinTile);
  }, [pointer, tileRef]);

  useEffect(() => {
    if (withinTile === wasWithinTile || !withinTile) return;
    selectTile(true);
  }, [letter, selectTile, withinTile, wasWithinTile]);

  return (
    <div className="400 relative flex h-14 w-14 cursor-pointer select-none items-center justify-center text-xl">
      {/* top-left */}
      <div
        className={`absolute -left-2 -top-3 h-3 w-1 -rotate-45 ${
          adjacent[0] != null && adjacent[0] >= 0
            ? "bg-green-600 shadow-md shadow-green-400"
            : ""
        }`}
      />
      {/* top */}
      <div
        className={`absolute left-1/2 -top-2 h-2 w-1  ${
          adjacent[1] != null && adjacent[1] >= 0
            ? "bg-green-600 shadow-md shadow-green-400"
            : ""
        }`}
      />
      {/* top-right */}
      <div
        className={`absolute -right-1 -top-3 h-4 w-1 rotate-45 ${
          adjacent[2] != null && adjacent[2] >= 0
            ? "bg-green-600 shadow-md shadow-green-400"
            : ""
        }`}
      />
      {/* left */}
      <div
        className={`absolute right-full top-1/2 h-1 w-2 ${
          adjacent[3] != null && adjacent[3] >= 0
            ? "bg-green-600 shadow-md shadow-green-400"
            : ""
        }`}
      />
      {/* right */}
      <div
        className={`absolute left-full top-1/2 h-1 w-1.5  ${
          adjacent[4] != null && adjacent[4] >= 0
            ? "bg-green-600 shadow-md shadow-green-400"
            : ""
        }`}
      />
      {/* bottom-left */}
      <div
        className={`absolute -left-1 -bottom-2 h-3 w-1 -translate-x-full rotate-45 ${
          adjacent[5] != null && adjacent[5] >= 0
            ? "bg-green-600 shadow-md shadow-green-400"
            : ""
        }`}
      />
      {/* bottom */}
      <div
        className={`absolute left-1/2 -bottom-1 h-1 w-1.5 -translate-x-1/2 rotate-90 ${
          adjacent[6] != null && adjacent[6] >= 0
            ? "bg-green-600 shadow-md shadow-green-400"
            : ""
        }`}
      />
      {/* bottom-right */}
      <div
        className={`absolute -right-1.5 -bottom-2 h-3 w-1 -rotate-45 ${
          adjacent[7] != null && adjacent[7] >= 0
            ? "bg-green-600 shadow-md shadow-green-400"
            : ""
        }`}
      />

      <div className="inset-shadow absolute inset-0 z-10 overflow-hidden rounded-md">
        <div
          className={`flex h-full w-full items-center justify-center ${
            currentWord.includes(position)
              ? "bg-green-600/40"
              : adjCurrent
              ? "bg-amber-600/40"
              : "bg-neutral-800"
          }`}
          ref={tileRef}
        >
          {letter}
        </div>
      </div>
    </div>
  );
};

export default Cell;
