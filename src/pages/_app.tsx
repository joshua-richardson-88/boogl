// modules
import { useEffect } from "react";

// project files
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

// types
import type { AppType } from "next/app";
import userStore from "../components/profile/data/store";

const MyApp: AppType = ({ Component, pageProps }) => {
  const userTheme = userStore().theme;

  useEffect(() => {
    const themeIsDark = userTheme === "dark";
    const userPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDarkMode =
      themeIsDark || (userTheme === "system" && userPrefersDark);

    console.log("is dark mode", isDarkMode);
    document.documentElement.classList.remove(isDarkMode ? "light" : "dark");
    document.documentElement.classList.add(isDarkMode ? "dark" : "light");
  }, [userTheme]);
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
