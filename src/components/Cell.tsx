import { useEffect, useMemo, useState } from "react";

import { makeGetAdjacent } from "../utils/gameUtils";
import useStore from "../utils/store";

type Props = {
  adjCurrent: boolean;
  adjHover: boolean;
  letter: string;
  position: number;
  update: (n?: number) => void;
};
const Cell = ({ adjCurrent, adjHover, letter, position, update }: Props) => {
  const currentWord = useStore().game.currentWord;
  const gameStarted = useStore().gameStarted;
  const { cols, rows } = useStore().gameBoard;

  const addLetter = useStore().addLetter;
  const getAdj = useMemo(() => makeGetAdjacent(cols, rows), [cols, rows]);

  const [adjacent, setAdjacent] = useState<number[]>([]);

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
  }, [gameStarted, currentWord, position]);

  const selectTile = () => {
    if (
      !gameStarted ||
      currentWord.includes(position) ||
      (currentWord.length > 0 && !adjCurrent)
    )
      return;
    addLetter(position);
  };

  return (
    <div className="relative flex h-14 w-14 cursor-pointer select-none items-center justify-center rounded border-2 border-neutral-400 text-xl">
      {/* top-left */}
      <div
        className={`absolute left-1 -top-3 h-1 w-1/2 -translate-x-full rotate-45 ${
          adjacent[0]! > 0 ? "bg-green-600 shadow-md shadow-green-400" : ""
        }`}
      />
      {/* top */}
      <div
        className={`absolute left-0 -top-3 h-1 w-1/2 translate-x-1/2 rotate-90 ${
          adjacent[1]! > 0 ? "bg-green-600 shadow-md shadow-green-400" : ""
        }`}
      />
      {/* top-right */}
      <div
        className={`absolute right-1 -top-3 h-1 w-1/2 translate-x-full -rotate-45 ${
          adjacent[2]! > 0 ? "bg-green-600 shadow-md shadow-green-400" : ""
        }`}
      />
      {/* left */}
      <div
        className={`absolute right-full top-1/2 h-1 w-1/2  ${
          adjacent[3]! > 0 ? "bg-green-600 shadow-md shadow-green-400" : ""
        }`}
      />
      {/* right */}
      <div
        className={`absolute left-full top-1/2 h-1 w-1/2  ${
          adjacent[4]! > 0 ? "bg-green-600 shadow-md shadow-green-400" : ""
        }`}
      />
      {/* bottom-left */}
      <div
        className={`absolute left-1 -bottom-3 h-1 w-1/2 -translate-x-full -rotate-45 ${
          adjacent[5]! > 0 ? "bg-green-600 shadow-md shadow-green-400" : ""
        }`}
      />
      {/* bottom */}
      <div
        className={`absolute left-0 -bottom-3 h-1 w-1/2 translate-x-1/2 rotate-90 ${
          adjacent[6]! > 0 ? "bg-green-600 shadow-md shadow-green-400" : ""
        }`}
      />
      {/* bottom-right */}
      <div
        className={`absolute right-1 -bottom-3 h-1 w-1/2 translate-x-full rotate-45 ${
          adjacent[7]! > 0 ? "bg-green-600 shadow-md shadow-green-400" : ""
        }`}
      />

      <div
        className={`${
          currentWord.includes(position)
            ? "bg-gradient-radial from-neutral-800 to-green-700  hover:to-green-500"
            : adjCurrent || adjHover
            ? "bg-gradient-radial from-neutral-800 to-yellow-500 hover:to-amber-700"
            : "bg-neutral-800"
        } absolute inset-0 z-10 flex items-center justify-center hover:bg-neutral-700 focus:bg-neutral-800`}
        onClick={selectTile}
        onMouseEnter={() => update(position)}
        onMouseLeave={() => update()}
      >
        {letter}
      </div>
    </div>
  );
};

export default Cell;
