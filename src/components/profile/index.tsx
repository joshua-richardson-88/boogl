import { useEffect, useState } from "react";
import { isSSR } from "../../utils/isSSR";

import GameList from "./GameCard";
import UserCard from "./UserCard";

const Profile = () => {
  const [clientOnly, setClientOnly] = useState(false);
  useEffect(() => {
    if (!isSSR) setClientOnly(true);
  }, []);

  return (
    <main className="mt-16 mb-8 h-full w-full">
      {clientOnly && (
        <div className="flex flex-col items-center gap-4 pt-4">
          <UserCard />
          <GameList />
        </div>
      )}
    </main>
  );
};

export default Profile;
