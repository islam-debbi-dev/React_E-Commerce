type WebStorageLike = Pick<
  Storage,
  "length" | "key" | "getItem" | "setItem" | "removeItem" | "clear"
>;

const createMemoryStorage = (): WebStorageLike => {
  const store = new Map<string, string>();

  return {
    get length() {
      return store.size;
    },
    key: (index: number) => [...store.keys()][index] ?? null,
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
};

const shim = (name: "localStorage" | "sessionStorage") => {
  try {
    globalThis[name].getItem("__probe__");
  } catch {
    Object.defineProperty(globalThis, name, {
      value: createMemoryStorage(),
      configurable: true,
    });
  }
};

/**
 * Node 24and newer ship a Web Storage implementation that throws unless the
 * process was started with --localstorage-file. Any dependency that reads
 * storage while server rendering would crash, so fall back to an in-memory
 * store when the platform one is unusable.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }
  shim("localStorage");
  shim("sessionStorage");
}