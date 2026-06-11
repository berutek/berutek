import { useState, useCallback, useRef, useEffect } from 'react';
import { AxiosError } from 'axios';
import apiClient from '@services/api/client';

export function useApi<T>(
  url: string | null,
  options: { immediate?: boolean } = {}
) {
  const { immediate = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    if (!url || !isMountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getInstance().get<T>(url);
      if (isMountedRef.current) {
        setData(response.data);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err as AxiosError);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [execute, immediate, url]);

  return { data, loading, error, refetch: execute };
}