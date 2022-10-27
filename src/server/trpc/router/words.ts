import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import wordList from "../../../utils/data.json";

export const wordRouter = router({
  isValidWord: publicProcedure.input(z.string()).mutation(({ input }) => {
    return wordList.data.includes(input);
  }),
});
