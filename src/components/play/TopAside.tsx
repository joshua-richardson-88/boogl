import { useEffect, useRef, useState, type MouseEvent } from "react";
import gameStore from "./data/store";
import userStore from "../profile/data/store";

const GameButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isGameStarted = gameStore().gameStarted;
  const tiles = gameStore().tiles;
  const words = gameStore().wordList;

  const startGame = gameStore().startGame;
  const endGame = gameStore().endGame;

  const persistGame = userStore().addGame;

  const handleClick = (_: MouseEvent<HTMLButtonElement>) => {
    buttonRef.current?.blur();
    if (isGameStarted) {
      persistGame("solo");
      endGame();
    } else {
      startGame();
    }
  };

  return (
    <button
      className={`${
        isGameStarted ? "" : "animate-pulse "
      }rounded w-16 bg-green-700 hover:bg-green-600 active:bg-green-600`}
      onClick={handleClick}
      ref={buttonRef}
    >
      {isGameStarted ? "End" : "Start"}
    </button>
  );
};
const Score = () => {
  const x = gameStore().score;
  return (
    <div className="flex w-16 flex-col items-center">
      <p>Score</p>
      <p className="text-center text-3xl">{x}</p>
    </div>
  );
};
type TimerProps = { maxTime: number };
const Timer = ({ maxTime }: TimerProps) => {
  const [t, setT] = useState(-1);

  const isGameStarted = gameStore().gameStarted;

  const endGame = gameStore().endGame;
  const persistGame = userStore().addGame;

  useEffect(() => {
    if (!isGameStarted) {
      if (t > -1) setT(-1);
      return;
    }
    if (isGameStarted && t === -1) setT(maxTime);
    if (t === 0) {
      endGame();

      persistGame("solo");
      setT(-1);
      return;
    }
    const timer = setInterval(() => setT((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [endGame, isGameStarted, maxTime, persistGame, t]);

  return (
    <div>
      <p>Time Left</p>
      <p
        className={`flex-1 text-center text-xl ${
          t <= 0 || t >= maxTime / 2
            ? "text-neutral-100"
            : t < maxTime / 4
            ? "text-red-500"
            : "text-amber-500"
        }`}
      >
        {t > 0
          ? `${Math.floor(t / 60)
              .toString()
              .padStart(2, "0")}:${Math.floor(t % 60)
              .toString()
              .padStart(2, "0")}`
          : "--:--"}
      </p>
    </div>
  );
};

const TopAside = () => (
  <div className="flex w-full justify-between border-t border-b border-t-neutral-200 border-b-neutral-200 py-4">
    <GameButton />
    <Timer maxTime={180} />
    <Score />
  </div>
);

export default TopAside;
