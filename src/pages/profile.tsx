import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

import { Card, Header } from "../components";
import { isSSR } from "../utils/isSSR";

const Home: NextPage = () => {
  const [clientOnly, setClientOnly] = useState(false);

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

      <main className="mt-2 w-screen">
        {clientOnly && (
          <div className="flex flex-col items-center">
            <Card />
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
