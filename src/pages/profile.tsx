import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

import { Card, Header } from "../components";
import GameCard from "../components/card/gameCard";
import { isSSR } from "../utils/isSSR";
import { userStore } from "../utils/userStore";

const Home: NextPage = () => {
  const [clientOnly, setClientOnly] = useState(false);
  const games = userStore().games;
  useEffect(() => {
    if (!isSSR) setClientOnly(true);
  }, []);

  return (
    <>
      <Head>
        <title>Boogl | Profile</title>
        <meta name="description" content="Interview Coding Sample" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className="mt-16 mb-8 w-full">
        {clientOnly && (
          <div className="flex flex-col items-center gap-4 pt-4">
            <Card />
            <div className="flex flex-col gap-2">
              {games.map((game) => (
                <GameCard {...game} />
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
