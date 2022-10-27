// src/server/router/_app.ts
import { router } from "../trpc";

import { wordRouter } from "./words";

export const appRouter = router({
  word: wordRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
