import { calculateScore, type HeatMap } from "../play/data/utils";
import userStore, { type Game, type GameType } from "./data/store";

const reduceScore = (as: string[]) =>
  as.reduce((a, v) => a + calculateScore(v.length), 0);

const Tile = ({ letter, opacity }: TileProps) => (
  <div className="relative flex h-8 w-8 items-center justify-center rounded bg-neutral-400 text-black">
    <span
      className="absolute inset-0"
      style={{ backgroundColor: `rgba(21 128 61 / ${opacity})` }}
    />
    <span className="absolute z-10">{letter}</span>
  </div>
);

const TileList = ({ heatMap, tiles }: TileListProps) => (
  <div className="mx-auto my-4 grid w-fit select-none grid-cols-4 grid-rows-4 gap-px">
    {tiles.map((tile, i) => (
      <Tile key={i} letter={tile} opacity={(heatMap[i] ?? 0) / heatMap.max} />
    ))}
  </div>
);
``;

const PlayType = ({ type }: { type: GameType }) => (
  <p className="font-bold">{type === "solo" ? "Solo Play" : "Multiplayer"}</p>
);
const PlayDate = ({ date }: { date: number }) => (
  <p className="text-neutral-400">{new Date(date).toLocaleString()}</p>
);
const Score = ({ score }: { score: number }) => (
  <h2 className="text-4xl">{score}</h2>
);

const CardHeader = ({ date, score, type }: CardHeaderProps) => (
  <div className="flex justify-between">
    <div className="flex flex-col">
      <PlayType type={type} />
      <PlayDate date={date} />
    </div>
    <Score score={score} />
  </div>
);
const WordList = ({ words }: { words: string[] }) => {
  if (words.length === 0) return null;
  return (
    <div>
      <h3 className="mb-2 border-b font-bold">Words found</h3>
      <p className="text-neutral-400">
        {words
          .filter((w) => w.length > 2)
          .sort((a, b) => b.length - a.length)
          .join(" • ")}
      </p>
    </div>
  );
};

const GameCard = ({ type, date, tiles, words, heatMap }: Game) => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-gray-700 bg-gray-700 p-4 text-neutral-100 shadow-md">
      <CardHeader date={date} score={reduceScore(words)} type={type} />
      <TileList tiles={tiles} heatMap={heatMap} />
      <WordList words={words} />
    </div>
  );
};
const GameList = () => {
  const games = userStore().games;

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      {games.map((game, i) => (
        <GameCard key={i} {...game} />
      ))}
    </div>
  );
};

export default GameList;

type TileListProps = { tiles: string[]; heatMap: HeatMap };
type TileProps = { letter: string; opacity: number };
type CardHeaderProps = { date: number; score: number; type: GameType };
