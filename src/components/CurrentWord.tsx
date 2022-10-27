import { useEffect } from "react";

import { tilesToWord } from "../utils/gameUtils";
import useStore from "../utils/store";
import useKeyPress from "../utils/useKeyPress";

const CurrentWord = () => {
  const backspaceKey = useKeyPress("Backspace");
  const deleteKey = useKeyPress("Delete");

  const word = useStore().game.currentWord;
  const tiles = useStore().gameBoard.tiles;
  const wasIncorrect = useStore().wasIncorrectWord;
  const wasFound = useStore().alreadyFound;

  const removeLetter = useStore().removeLetter;
  const toggleIncorrect = useStore().toggleIncorrectWord;
  const toggleAlreadyFound = useStore().toggleAlreadyFound;

  const updateAnimation = () => {
    setTimeout(() => {
      toggleIncorrect(false);
      toggleAlreadyFound(false);
    }, 500);
  };

  useEffect(() => {
    if (backspaceKey || deleteKey) removeLetter();
  }, [backspaceKey, deleteKey, removeLetter]);

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
