import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { Header } from "../components";

const Home: NextPage = () => (
  <>
    <Head>
      <title>Boogl</title>
      <meta name="description" content="Interview Coding Sample" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header />
    <main className="-mt-16 flex h-screen flex-col items-center justify-center overflow-hidden text-neutral-100">
      <Link href="/play">
        <span className="cursor-pointer select-none rounded-md bg-green-800 px-6 py-3 text-3xl hover:bg-green-700 hover:px-8 hover:py-4 focus:bg-green-700 focus:px-8 focus:py-4">
          Solo Play
        </span>
      </Link>
    </main>
  </>
);

export default Home;
