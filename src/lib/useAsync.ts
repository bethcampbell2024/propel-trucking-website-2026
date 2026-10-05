import { useCallback, useEffect, useState } from "react";

/** Minimal "load this promise, let me reload it" hook for the staff portal. */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T>();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    load().then((value) => {
      if (alive) setData(value);
    });
    return () => {
      alive = false;
    };
    // `load` is recreated every render; the caller controls reloads through `deps`.
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, reload };
}
