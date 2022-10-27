import type { NextPage } from "next";
import Head from "next/head";

import {
  ClearButton,
  CurrentWord,
  Game,
  InfoPanel,
  NewGameButton,
  SubmitButton,
  WordList,
} from "../components";

const Home: NextPage = () => (
  <>
    <Head>
      <title>Bond Interview</title>
      <meta name="description" content="Interview Coding Sample" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="container mx-auto flex min-h-screen items-center justify-center gap-4 p-4 text-neutral-100">
      <div className="flex max-w-sm flex-1 flex-col gap-6">
        <h1 className="text-center text-5xl">Boggle!</h1>

        <NewGameButton />
        <CurrentWord />
        <div className="flex w-full justify-between">
          <Game />
          <InfoPanel />
        </div>
        <div className="flex gap-4">
          <ClearButton />
          <SubmitButton />
        </div>
        <WordList />
      </div>
    </main>
  </>
);
export default Home;
