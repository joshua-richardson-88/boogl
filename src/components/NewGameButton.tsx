import useStore from "../utils/store";

const NewGameButton = () => {
  const isGameStarted = useStore().gameStarted;
  const startGame = useStore().startGame;

  return (
    <div className="flex flex-1 justify-center">
      {!isGameStarted && (
        <button
          className="w-60 animate-pulse rounded bg-green-700 px-6 py-3"
          disabled={isGameStarted}
          onClick={startGame}
        >
          Start a new game
        </button>
      )}
    </div>
  );
};
export default NewGameButton;
