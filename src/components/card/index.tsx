import { FormEvent, useRef } from "react";

import useClickOutside from "../../hooks/useClickOutside";
import useToggle from "../../hooks/useToggle";
import { userStore } from "../../utils/userStore";

const ActionMenuIcon = () => (
  <svg
    className="h-6 w-6"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
  </svg>
);
type MenuProps = { clear: () => void; edit: () => void };
const ActionMenu = ({ clear, edit }: MenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, toggleOpen] = useToggle(false);

  const handleClick = (isClear: boolean) => {
    toggleOpen(false);
    if (isClear) {
      clear();
    } else {
      edit();
    }
  };

  useClickOutside(menuRef, () => toggleOpen(false));

  return (
    <div ref={menuRef} className="relative flex justify-end px-4 pt-4">
      <button
        className="inline-block rounded-lg p-1.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        type="button"
        onClick={() => toggleOpen()}
      >
        <span className="sr-only">Open dropdown</span>
        <ActionMenuIcon />
      </button>
      {isOpen && (
        <div className="absolute top-full right-4 z-10 w-44 list-none divide-y divide-gray-100 rounded bg-white text-base shadow dark:bg-gray-800">
          <span
            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => handleClick(false)}
          >
            Edit
          </span>
          <span
            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => handleClick(true)}
          >
            Clear Data
          </span>
        </div>
      )}
    </div>
  );
};
const Avatar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-12 w-12"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const Card = () => {
  const [editMode, setEditMode] = useToggle(false);
  const updateUser = userStore().updateUsername;
  const clearUser = userStore().clearProfile;
  const username = userStore().username;
  const id = userStore().id;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const name = (e.target as typeof e.target & { username: { value: string } })
      .username.value;
    updateUser(name);
    setEditMode(false);
  };

  return (
    <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-gray-200 text-neutral-100 shadow-md dark:border-gray-700 dark:bg-gray-700">
      <ActionMenu clear={clearUser} edit={setEditMode} />
      <div className="flex flex-col px-6 pb-10">
        <div className="flex items-center gap-4">
          <Avatar />
          <div>
            {!editMode && (
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                {username}
              </h5>
            )}
            {editMode && (
              <form onSubmit={handleSubmit}>
                <input
                  className="hover-bg-white/20 rounded-t-md bg-white/10 px-2 py-px outline-none focus:bg-white/20 active:bg-white/20"
                  name="username"
                  placeholder={username}
                  type="text"
                />
              </form>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {`#${id}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
