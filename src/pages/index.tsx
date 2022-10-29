import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";

import { CurrentWord, Game, WordList, TopAside } from "../components";
import useStore from "../utils/store";

const debounce = (f: any, x: number) => {
  let timerId: NodeJS.Timeout | undefined = undefined;
  return (...args: any) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => f(...args), x);
  };
};

const Home: NextPage = () => {
  const [pressed, setPressed] = useState(false);
  const update = useStore().updateTouchPosition;
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
    const finishHandler = (e: PointerEvent) => {
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
        <title>Boogl</title>
        <meta name="description" content="Interview Coding Sample" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen items-center justify-center gap-4 p-4 text-neutral-100">
        <div className="flex max-w-sm flex-1 flex-col gap-6">
          <h1 className="text-center text-5xl">Boogl</h1>
          <TopAside />
          <Game />
          <CurrentWord />
          <WordList />
        </div>
      </main>
    </>
  );
};

export default Home;
