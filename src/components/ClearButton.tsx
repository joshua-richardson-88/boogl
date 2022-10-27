import useStore from "../utils/store";

type Props = {};
const ClearButton = ({}: Props) => {
  const clearCurrent = useStore().clearWord;

  return (
    <button
      className="flex-1 rounded bg-red-400 px-6 py-3"
      onClick={clearCurrent}
    >
      Clear
    </button>
  );
};
export default ClearButton;
