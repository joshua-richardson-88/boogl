import { useEffect, useState } from "react";

const useKeyPress = (targetKey: string, cb?: () => void) => {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setKeyPressed(true);
        if (cb != null) cb();
      }
    };
    const upHandler = (e: KeyboardEvent) => {
      if (e.key === targetKey) setKeyPressed(false);
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [cb, targetKey]);

  return keyPressed;
};

export default useKeyPress;
