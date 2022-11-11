import { ChangeEvent, FormEvent, useRef, useState } from "react";

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
const LightThemeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    />
  </svg>
);
const DarkThemeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
    />
  </svg>
);

type EditableFieldProps = {
  editing: boolean;
  initState: string;
  update: (s: string) => void;
};
const EditableField = ({ editing, initState, update }: EditableFieldProps) => {
  const [state, setState] = useState(initState);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setState(e.currentTarget.value);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    update(state);
  };

  return (
    <>
      {editing ? (
        <form onSubmit={handleSubmit}>
          <input
            autoFocus={true}
            autoComplete="off"
            className="hover-bg-white/20 rounded-t-md bg-white/10 px-2 py-px outline-none focus:bg-white/20 active:bg-white/20"
            name="username"
            value={state}
            type="text"
            onChange={handleChange}
          />
        </form>
      ) : (
        <h5 className="text-xl font-medium text-gray-900 dark:text-white">
          {state}
        </h5>
      )}
    </>
  );
};

const ThemeSwitcher = () => {
  const updateTheme = userStore().setTheme;
  const theme = userStore().theme;
  return (
    <div className="flex gap-4">
      <input className="hidden" id="light" name="toggle-theme" type="radio" />
      <label
        onClick={() => updateTheme("light")}
        htmlFor="light"
        className={`rounded px-2 py-1 hover:bg-neutral-500 focus:bg-neutral-500 ${
          theme === "light" ? " bg-neutral-500" : ""
        }`}
      >
        <LightThemeIcon />
      </label>
      <input className="hidden" id="system" name="toggle-theme" type="radio" />
      <label
        onClick={() => updateTheme("system")}
        htmlFor="system"
        className={`rounded px-2 py-1 hover:bg-neutral-500 focus:bg-neutral-500 ${
          theme === "system" ? " bg-neutral-500" : ""
        }`}
      >
        System
      </label>
      <input className="hidden" id="dark" name="toggle-theme" type="radio" />
      <label
        onClick={() => updateTheme("dark")}
        htmlFor="dark"
        className={`rounded px-2 py-1 hover:bg-neutral-500 focus:bg-neutral-500 ${
          theme === "dark" ? " bg-neutral-500" : ""
        }`}
      >
        <DarkThemeIcon />
      </label>
    </div>
  );
};

const Card = () => {
  const [editMode, setEditMode] = useToggle(false);
  const updateUser = userStore().updateUsername;
  const clearUser = userStore().clearProfile;
  const username = userStore().username;
  const id = userStore().id;

  const update = (s: string) => {
    updateUser(s);
    setEditMode(false);
  };

  return (
    <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-gray-200 text-neutral-100 shadow-md dark:border-gray-700 dark:bg-gray-700">
      <ActionMenu clear={clearUser} edit={setEditMode} />
      <div className="flex flex-col gap-4 px-6 pb-10">
        <div className="flex items-center gap-4">
          <Avatar />
          <div>
            <EditableField
              editing={editMode}
              initState={username}
              update={update}
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {`#${id}`}
            </span>
          </div>
        </div>
        <ThemeSwitcher />
      </div>
    </div>
  );
};
export default Card;
