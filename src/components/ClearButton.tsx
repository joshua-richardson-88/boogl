import useStore from "../utils/store";

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

  return (
    <button
      className="flex flex-1 items-center justify-center rounded"
      onClick={clearCurrent}
    >
      <ClearIcon />
    </button>
  );
};
export default ClearButton;
