import { useEffect, useState } from "react";
import { tilesToWord } from "../../utils/gameUtils";
import useStore from "../../utils/gameStore";
import { trpc } from "../../utils/trpc";
import useKeyPress from "../../hooks/useKeyPress";

const SubmitIcon = () => (
  <div role="status">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
    <span className="sr-only">Add Word</span>
  </div>
);
const LoadingIcon = () => (
  <div role="status">
    <svg
      aria-hidden="true"
      className="mr-2 h-6 w-6 animate-spin fill-green-600 text-gray-200 dark:text-gray-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);
const ClearIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const ClearButton = () => {
  const clearCurrent = useStore().clearWord;
  const keyPressed = useKeyPress("Escape", () => clearCurrent());

  return (
    <button
      className={`
      inset-shadow flex h-10 w-10 flex-1 items-center justify-center rounded bg-red-500/40 p-2 hover:bg-red-500/60 ${
        keyPressed && "bg-red-500"
      }
      `}
      onClick={clearCurrent}
    >
      <ClearIcon />
    </button>
  );
};
const SubmitButton = () => {
  const [keyPressed, setKeyPressed] = useState(false);
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
    const downHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
        setKeyPressed(true);
      }
    };
    const upHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter") setKeyPressed(false);
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [handleSubmit]);

  return (
    <button
      className={`
      inset-shadow flex h-10 w-10 flex-1 items-center justify-center rounded bg-neutral-500/40 p-2 hover:bg-neutral-500/60 ${
        keyPressed && "bg-neutral-500"
      }
      `}
      onClick={handleSubmit}
    >
      {isLoading ? <LoadingIcon /> : <SubmitIcon />}
    </button>
  );
};

const RightAside = () => (
  <div className="flex flex-col gap-2">
    <ClearButton />
    <SubmitButton />
  </div>
);

export default RightAside;
