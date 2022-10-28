import { useEffect, useState } from "react";
import useStore from "../utils/store";

const GameButton = () => {
  const isGameStarted = useStore().gameStarted;
  const startGame = useStore().startGame;
  const endGame = useStore().endGame;

  const handleClick = () => {
    console.log("handle click");
    console.log("game is started", isGameStarted);
    if (isGameStarted) endGame();
    else startGame();
  };

  return (
    <button
      className={`${
        isGameStarted ? "" : "animate-pulse "
      }rounded w-16 bg-green-700`}
      disabled={isGameStarted}
      onClick={handleClick}
    >
      {isGameStarted ? "End" : "Start"}
    </button>
  );
};
const Score = () => {
  const x = useStore().game.score;
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

  const isGameStarted = useStore().gameStarted;
  const endGame = useStore().endGame;

  useEffect(() => {
    if (!isGameStarted) return;
    if (isGameStarted && t === -1) setT(maxTime);
    if (t === 0) {
      endGame();
      setT(-1);
      return;
    }
    const timer = setInterval(() => setT((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [endGame, isGameStarted, maxTime, t]);

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
