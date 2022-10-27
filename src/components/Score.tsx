import useStore from "../utils/store";

type Props = {};

const Score = ({}: Props) => {
  const x = useStore().game.score;
  return (
    <div>
      <p>Score</p>
      <p className="text-center text-2xl">{x}</p>
    </div>
  );
};

export default Score;
