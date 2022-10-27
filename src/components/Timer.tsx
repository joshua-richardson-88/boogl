import { useEffect, useState } from "react";

import useStore from "../utils/store";

type Props = { maxTime: number };
const Timer = ({ maxTime }: Props) => {
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
  }, [t, isGameStarted]);

  return (
    <div>
      <p>Time Left</p>
      <p
        className={`text-center text-xl ${
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
export default Timer;
