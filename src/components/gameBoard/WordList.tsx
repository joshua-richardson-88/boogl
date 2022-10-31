import useStore from "../../utils/store";

const WordList = () => {
  const list = useStore().game.wordList;

  return (
    <div className="h-40 select-none">
      <h3 className="border-b border-b-neutral-100 text-center text-xl">
        Words Found
      </h3>
      <div className="flex h-40 w-full flex-col flex-wrap items-start overflow-x-auto px-2 pt-2">
        {list.map((w, i) => (
          <p
            className={`${i === 0 && "rounded bg-green-800"}  px-4 py-1`}
            key={i}
          >
            {w}
          </p>
        ))}
      </div>
    </div>
  );
};
export default WordList;
