import type { NextPage } from "next";
import Head from "next/head";

import {
  CurrentWord,
  Game,
  NewGameButton,
  LeftAside,
  WordList,
  RightAside,
} from "../components";

const Home: NextPage = () => (
  <>
    <Head>
      <title>Boogl</title>
      <meta name="description" content="Interview Coding Sample" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="container mx-auto flex min-h-screen items-center justify-center gap-4 p-4 text-neutral-100">
      <div className="flex max-w-sm flex-1 flex-col gap-6">
        <h1 className="text-center text-5xl">Boogl</h1>

        <NewGameButton />
        <CurrentWord />
        <div className="flex w-full justify-evenly gap-4">
          <LeftAside />
          <Game />
          <RightAside />
        </div>

        <WordList />
      </div>
    </main>
  </>
);
export default Home;
