import { useEffect, useRef } from "react";

export default function usePrevious<T>(x: T) {
  if (x == null) throw new TypeError("initial value must be included");
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = x;
  }, [x]);

  return ref.current;
}
