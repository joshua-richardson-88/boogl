import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";

import {
  CurrentWord,
  Game,
  NewGameButton,
  LeftAside,
  WordList,
  RightAside,
  TopAside,
} from "../components";

const Home: NextPage = () => {
  useEffect(() => {
    const touchHandler = (e: TouchEvent) => console.log(e);
    window.addEventListener("touchstart", touchHandler);
    window.addEventListener("touchmove", touchHandler);

    return () => {
      window.removeEventListener("touchstart", touchHandler);
      window.removeEventListener("touchmove", touchHandler);
    };
  }, []);
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
