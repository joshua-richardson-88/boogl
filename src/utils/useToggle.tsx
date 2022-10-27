import { useState } from "react";

type UpdateFn = (b?: boolean) => void;
const useToggle = (init: boolean): [boolean, UpdateFn] => {
  const [state, setState] = useState(init);

  const update: UpdateFn = (b) => setState((p) => (b != null ? b : !p));

  return [state, update];
};
export default useToggle;
