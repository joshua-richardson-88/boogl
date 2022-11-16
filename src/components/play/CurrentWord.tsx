import gameStore from "./data/store";
import { tilesToWord } from "./data/utils";
import useKeyPress from "../../hooks/useKeyPress";

const CurrentWord = () => {
  const word = gameStore().currentWord;
  const tiles = gameStore().tiles;
  const wasIncorrect = gameStore().wasIncorrectWord;
  const wasFound = gameStore().alreadyFound;

  const backspace = gameStore().backspace;
  const clear = gameStore().clearWord;
  const toggleIncorrect = gameStore().toggleIncorrectWord;
  const toggleAlreadyFound = gameStore().toggleAlreadyFound;

  const updateAnimation = () => {
    setTimeout(() => {
      toggleIncorrect(false);
      toggleAlreadyFound(false);
    }, 500);
  };

  useKeyPress("Backspace", backspace);
  useKeyPress("Delete", backspace);
  useKeyPress("Escape", clear);

  return (
    <h2
      className={`
      flex h-12 max-w-sm items-center justify-center rounded bg-neutral-600 text-3xl ${
        wasIncorrect && "animate-wiggle bg-red-500/30"
      } ${wasFound && "animate-wiggle bg-orange-500/30"}
    `}
      onAnimationEnd={updateAnimation}
    >
      {wasIncorrect
        ? "Not a word"
        : wasFound
        ? "Already Found!"
        : tilesToWord(word, tiles)}
    </h2>
  );
};

export default CurrentWord;
