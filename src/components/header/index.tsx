import Link from "next/link";
import { useRouter } from "next/router";
import useToggle from "../../hooks/useToggle";

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox={"0 0 24 24"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const Header = () => {
  const router = useRouter();
  const [isOpen, toggleOpen] = useToggle(false);

  console.log(router.pathname);
  return (
    <header className="static flex w-full flex-col gap-1 bg-black/20 px-4 pt-2 pb-4 text-neutral-100 ">
      <div className="flex items-center justify-between">
        <Link href="/">
          <h1
            tabIndex={0}
            className="cursor-pointer select-none text-center text-4xl hover:animate-wiggle"
          >
            Boogl
          </h1>
        </Link>
        <div className="flex items-center justify-center">
          <button
            tabIndex={0}
            className="rounded p-1 text-neutral-300 hover:bg-neutral-50/20 focus:bg-neutral-50/20"
            onClick={() => toggleOpen()}
          >
            <MenuIcon />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="my-2 flex w-screen flex-col items-center gap-2">
          {router.pathname !== "/play" && (
            <Link href="/play">
              <p
                className="cursor-pointer select-none rounded bg-green-400/30 px-4 py-1 hover:animate-wiggle hover:bg-green-400/50 focus:animate-wiggle focus:bg-green-400/50"
                tabIndex={0}
              >
                Play
              </p>
            </Link>
          )}
          {router.pathname !== "/profile" && (
            <Link href="/profile">
              <p
                tabIndex={0}
                className="cursor-pointer select-none px-4 py-1 hover:animate-wiggle hover:text-green-400 focus:animate-wiggle "
              >
                Profile
              </p>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
