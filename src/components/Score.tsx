import useStore from "../utils/store";

const Score = () => {
  const x = useStore().game.score;
  return (
    <div>
      <p>Score</p>
      <p className="text-center text-2xl">{x}</p>
    </div>
  );
};

export default Score;
