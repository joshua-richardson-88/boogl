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
      if (isValid) {
        addWord();
      } else {
        clear();
        toggleIncorrect(true);
      }
    },
  });

  const handleSubmit = () => {
    const word = tilesToWord(currentWord, tiles);
    const wordTooShort = currentWord.length < 3;
    const alreadyUsed = list.includes(word);

    if (wordTooShort || alreadyUsed) {
      clear();
      if (alreadyUsed) toggleAlreadyUsed(true);
      if (wordTooShort) toggleIncorrect(true);
      return;
    }

    mutate(word);
  };

  useEffect(() => {
    const submitHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    };

    window.addEventListener("keydown", submitHandler);
    return () => window.removeEventListener("keydown", submitHandler);
  }, [handleSubmit]);

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
