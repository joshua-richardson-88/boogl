import useStore from "../../utils/gameStore";
import useKeyPress from "../../hooks/useKeyPress";

const RotateCWIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
    />
  </svg>
);
const RotateCCWIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
    />
  </svg>
);
type ButtonProps = { dir: "cw" | "ccw" };
const RotateButton = ({ dir }: ButtonProps) => {
  const rotate = useStore().rotateTiles;
  const keyPressed = useKeyPress(
    dir === "cw" ? "ArrowRight" : "ArrowLeft",
    () => rotate(dir)
  );

  return (
    <button
      className={`
      inset-shadow flex h-10 w-10 flex-1 items-center justify-center rounded p-2 hover:bg-neutral-600 ${
        keyPressed && "bg-neutral-600"
      }
      `}
      name={`rotate-${dir === "cw" ? "" : "counter-"}clockwise`}
      onClick={() => rotate(dir)}
      type="button"
    >
      {dir === "cw" ? <RotateCWIcon /> : <RotateCCWIcon />}
    </button>
  );
};

const LeftAside = () => (
  <div className="flex flex-col gap-2">
    <RotateButton dir="ccw" />
    <RotateButton dir="cw" />
  </div>
);

export default LeftAside;
