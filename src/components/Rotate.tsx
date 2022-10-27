import { useEffect } from "react";

import useStore from "../utils/store";
import useKeyPress from "../utils/useKeyPress";

const Rotate = () => {
  const arrowLeftPressed = useKeyPress("ArrowLeft");
  const arrowRightPressed = useKeyPress("ArrowRight");

  const rotate = useStore().rotateTiles;

  useEffect(() => {
    if (arrowLeftPressed) rotate("ccw");
    if (arrowRightPressed) rotate("cw");
  }, [arrowLeftPressed, arrowRightPressed, rotate]);
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        name="rotate-counter-clockwise"
        type="button"
        className={`
        flex h-10 w-10 items-center justify-center rounded border border-neutral-100 p-2 hover:bg-neutral-600 ${
          arrowLeftPressed && "bg-neutral-600"
        }
        `}
        onClick={() => rotate("ccw")}
      >
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
      </button>
      <button
        name="rotate-clockwise"
        type="button"
        className={`flex h-10 w-10 items-center justify-center rounded border border-neutral-100 p-2 hover:bg-neutral-600 ${
          arrowRightPressed && "bg-neutral-600"
        }`}
        onClick={() => rotate("cw")}
      >
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
      </button>
    </div>
  );
};

export default Rotate;
