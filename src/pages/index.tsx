import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import Header from "../components/header";

const Home: NextPage = () => (
  <>
    <Head>
      <title>Boogl</title>
      <meta name="description" content="A classic board game, online!" />
      <meta property="og:url" content="boogl.cursedtale.com" />
      <meta property="og:type" content="website" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <main className="flex h-screen items-center justify-center text-neutral-100">
      <Link href="/play">
        <span className="cursor-pointer select-none rounded-md bg-green-800 px-6 py-3 text-3xl hover:bg-green-700 hover:px-8 hover:py-4 focus:bg-green-700 focus:px-8 focus:py-4">
          Solo Play
        </span>
      </Link>
    </main>
  </>
);

export default Home;
