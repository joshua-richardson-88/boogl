import { Rotate, Score, Timer } from "./index";

type Props = {};

const InfoPanel = ({}: Props) => {
  return (
    <div className="flex w-fit min-w-fit flex-col justify-between pl-4 sm:pl-0">
      <Timer maxTime={180} />
      <Rotate />
      <Score />
    </div>
  );
};

export default InfoPanel;
