// modules
import { useEffect } from "react";

// project files
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

// types
import type { AppType } from "next/app";

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const shouldSetDarkTheme =
      theme === "dark" ||
      (theme == null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.remove(
      shouldSetDarkTheme ? "light" : "dark"
    );
    document.documentElement.classList.add(
      shouldSetDarkTheme ? "dark" : "light"
    );
  }, []);
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
