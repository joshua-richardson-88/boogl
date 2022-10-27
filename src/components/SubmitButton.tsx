import { useEffect } from "react";

import { tilesToWord } from "../utils/gameUtils";
import useStore from "../utils/store";
import { trpc } from "../utils/trpc";
import useKeyPress from "../utils/useKeyPress";

const SubmitButton = () => {
  const list = useStore().game.wordList;
  const currentWord = useStore().game.currentWord;
  const tiles = useStore().gameBoard.tiles;

  const clear = useStore().clearWord;
  const addWord = useStore().addWordToList;
  const toggleIncorrect = useStore().toggleIncorrectWord;
  const toggleAlreadyUsed = useStore().toggleAlreadyFound;

  const { isLoading, mutate } = trpc.word.isValidWord.useMutation({
    onSuccess: (isValid) => {
      console.log("8");
      if (isValid) {
        addWord();
        console.log("9");
      } else {
        console.log("10");
        clear();
        toggleIncorrect(true);
        console.log("11");
      }
    },
  });

  const handleSubmit = () => {
    console.log("1");
    const word = tilesToWord(currentWord, tiles);
    const wordTooShort = currentWord.length < 3;
    const alreadyUsed = list.includes(word);
    console.log("2");

    if (wordTooShort || alreadyUsed) {
      console.log("3");
      clear();
      console.log("4");
      if (alreadyUsed) toggleAlreadyUsed(true);
      if (wordTooShort) toggleIncorrect(true);
      return;
    }

    console.log("5");
    mutate(word);
    console.log("6");
  };

  useKeyPress("Enter", handleSubmit);

  return (
    <button
      className="flex-1 rounded bg-neutral-400 px-6 py-3"
      onClick={handleSubmit}
    >
      {isLoading ? "Submitting..." : "Submit"}
    </button>
  );
};
export default SubmitButton;
