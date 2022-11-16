import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";

import Header from "../components/header";
import GameBoard from "../components/play";
import gameStore from "../components/play/data/store";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const debounce = (f: any, x: number) => {
  let timerId: NodeJS.Timeout | undefined = undefined;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  return (...args: any) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => f(...args), x);
  };
};

const Home: NextPage = () => {
  const [pressed, setPressed] = useState(false);
  const update = gameStore().updateTouchPosition;
  const debounceHandler = useCallback(
    (e: PointerEvent) => {
      if (pressed) {
        debounce(
          update({
            x: e.pageX,
            y: e.pageY,
          }),
          200
        );
      }
    },
    [pressed, update]
  );
  useEffect(() => {
    const startHandler = (e: PointerEvent) => {
      setPressed(true);
      debounceHandler(e);
    };
    const finishHandler = () => {
      setPressed(false);
      update({ x: null, y: null });
    };

    window.addEventListener("pointerdown", startHandler, { passive: false });
    window.addEventListener("pointermove", debounceHandler, { passive: false });
    window.addEventListener("pointerup", finishHandler, { passive: false });
    return () => {
      window.removeEventListener("pointerdown", debounceHandler);
      window.removeEventListener("pointermove", debounceHandler);
      window.removeEventListener("pointerup", finishHandler);
    };
  }, [debounceHandler, update]);

  return (
    <>
      <Head>
        <title>Boogl | Game</title>
        <meta name="description" content="Interview Coding Sample" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <GameBoard />
    </>
  );
};

export default Home;
