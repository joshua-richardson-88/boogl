import { ChangeEvent, FormEvent, useRef, useState } from "react";

import userStore from "./data/store";
import { MoonIcon, SunIcon, UserIcon } from "../icons";
import useClickOutside from "../../hooks/useClickOutside";
import useToggle from "../../hooks/useToggle";

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
        <h5 className="text-xl font-medium text-white">{state}</h5>
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
        <SunIcon />
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
        <MoonIcon />
      </label>
    </div>
  );
};

const UserCard = () => {
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
    <div className="w-full max-w-sm rounded-lg border  border-gray-700 bg-gray-700 text-neutral-100 shadow-md">
      <ActionMenu clear={clearUser} edit={setEditMode} />
      <div className="flex flex-col gap-4 px-6 pb-10">
        <div className="flex items-center gap-4">
          <UserIcon />
          <div>
            <EditableField
              editing={editMode}
              initState={username}
              update={update}
            />
            <span className="text-sm text-gray-400">{`#${id}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
