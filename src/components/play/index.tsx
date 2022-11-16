import CurrentWord from "./CurrentWord";
import Game from "./Game";
import TopAside from "./TopAside";
import WordList from "./WordList";

const GameBoard = () => (
  <main className="flex min-h-screen items-center justify-center text-neutral-100">
    <div className="flex max-w-sm flex-1 flex-col gap-6">
      <TopAside />
      <Game />
      <CurrentWord />
      <WordList />
    </div>
  </main>
);
export default GameBoard;
