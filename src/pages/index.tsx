import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect } from "react";

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
  const update = useStore().updateTouchPosition;
  const debounceHandler = useCallback(
    (e: TouchEvent) =>
      debounce(
        update({
          x: e.touches[0]?.pageX ?? null,
          y: e.touches[0]?.pageY ?? null,
        }),
        100
      ),
    [update]
  );
  useEffect(() => {
    // const touchHandler = (e: TouchEvent) => {
    //   update({
    //     x: e.touches[0]?.pageX ?? null,
    //     y: e.touches[0]?.pageY ?? null,
    //   });
    // };
    const finishHandler = (e: TouchEvent) => update({ x: null, y: null });

    window.addEventListener("touchstart", debounceHandler);
    window.addEventListener("touchmove", debounceHandler);
    window.addEventListener("touchend", finishHandler);
    return () => {
      window.removeEventListener("touchstart", debounceHandler);
      window.removeEventListener("touchmove", debounceHandler);
      window.removeEventListener("touchend", finishHandler);
    };
  }, [debounceHandler, update]);

  return (
    <>
      <Head>
        <title>Boogl</title>
        <meta name="description" content="Interview Coding Sample" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container fixed mx-auto flex min-h-screen items-center justify-center gap-4 overflow-hidden p-4 text-neutral-100">
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
