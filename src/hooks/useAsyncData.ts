"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { ApiError, getErrorMessage } from "@/lib/api";

interface Result<T> {
  key: string;
  data?: T;
  error?: string;
  errorStatus?: number;
}

/**
 * Small data-loading hook.
 * `key` identifies the request: when it changes the data is fetched again.
 * `loading` is true while the current key has no result yet (previous data is kept
 * so tables do not flicker).
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, key: string) {
  const [result, setResult] = useState<Result<T> | null>(null);
  const [version, setVersion] = useState(0);

  const requestKey = `${key}#${version}`;
  const run = useEffectEvent(fetcher);

  useEffect(() => {
    let cancelled = false;

    run()
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            error: getErrorMessage(error),
            errorStatus: error instanceof ApiError ? error.status : undefined,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const isCurrent = result?.key === requestKey;

  return {
    data: result?.data,
    error: isCurrent ? result?.error : undefined,
    errorStatus: isCurrent ? result?.errorStatus : undefined,
    loading: !isCurrent,
    reload: () => setVersion((v) => v + 1),
  };
}
