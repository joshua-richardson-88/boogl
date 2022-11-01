import type { Game } from "../../utils/userStore";

const GameCard = ({ type, date, tiles, words, heatMap }: Game) => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-gray-200 bg-gray-200 p-4 text-neutral-100 shadow-md dark:border-gray-700 dark:bg-gray-700">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold">
            {type === "solo" ? "Solo Play" : "Multiplayer"}
          </h2>
          <span className="text-neutral-400">
            {new Date(date).toLocaleString()}
          </span>
        </div>
        <div className="grid w-fit select-none grid-cols-4 grid-rows-4 gap-px">
          {tiles.map((tile, i) => {
            const heat =
              heatMap[i] == null ? 0 : (heatMap[i] as number) / heatMap.max;

            return (
              <div
                key={i}
                className="relative flex h-8 w-8 items-center justify-center rounded bg-neutral-400 text-black"
              >
                <span
                  style={{
                    backgroundColor: `rgba(21 128 61 / ${heat})`,
                  }}
                  className="absolute inset-0"
                />
                <span className="absolute z-10">{tile}</span>
              </div>
            );
          })}
        </div>
      </div>
      {words.length > 0 && (
        <div>
          <h3 className="mb-2 border-b font-bold">Words found</h3>
          <p>
            {words
              .filter((w) => w.length > 2)
              .sort((a, b) => b.length - a.length)
              .join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameCard;
