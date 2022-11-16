import type { NextPage } from "next";
import Head from "next/head";

import Header from "../components/header";
import Profile from "../components/profile";

const Home: NextPage = () => (
  <>
    <Head>
      <title>Boogl | Profile</title>
      <meta name="description" content="Interview Coding Sample" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header />
    <Profile />
  </>
);

export default Home;
