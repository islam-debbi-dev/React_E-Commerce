import { useCallback, useEffect, useState } from "react";

const read = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is full or blocked, the UI still works for this session.
  }
};

export function useStoredIds(key, limit = 12) {
  const [ids, setIds] = useState(() => read(key, []));

  useEffect(() => {
    setIds(read(key, []));
  }, [key]);

  const update = useCallback(
    (next) => {
      const value = next.slice(0, limit);
      setIds(value);
      write(key, value);
      return value;
    },
    [key, limit]
  );

  const has = useCallback((id) => ids.includes(id), [ids]);

  const add = useCallback(
    (id) => {
      if (ids.includes(id)) return ids;
      return update([id, ...ids]);
    },
    [ids, update]
  );

  const remove = useCallback(
    (id) => update(ids.filter((value) => value !== id)),
    [ids, update]
  );

  const toggle = useCallback(
    (id) => (ids.includes(id) ? remove(id) : add(id)),
    [ids, add, remove]
  );

  const clear = useCallback(() => update([]), [update]);

  return { ids, has, add, remove, toggle, clear };
}