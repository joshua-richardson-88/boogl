import { useCallback, useEffect, useState } from "react";

const accessStorage = <T>(key: string, value: T, storageObject: Storage) => {
  const jsonValue = storageObject.getItem(key);
  if (jsonValue != null) return JSON.parse(jsonValue) as T;

  return typeof value === "function" ? (value() as T) : (value as T);
};

export const useLocalStorage = <T>(key: string, value?: T) =>
  useStorage(key, window.localStorage, value);
export const useSessionStorage = <T>(key: string, value?: T) =>
  useStorage(key, window.sessionStorage, value);

export const useStorage = <T>(
  key: string,
  storageObject: Storage,
  value?: T
) => {
  if (key == null) throw new TypeError("key must be defined");
  if (value == null) throw new TypeError("value must be defined");

  const [state, setState] = useState<T | undefined>(
    accessStorage<T>(key, value, storageObject)
  );

  useEffect(() => {
    if (state === undefined) return storageObject.removeItem(key);

    storageObject.setItem(key, JSON.stringify(state));
  }, [key, state, storageObject]);

  const remove = useCallback(() => setState(undefined), []);

  return [state, setState, remove] as const;
};
