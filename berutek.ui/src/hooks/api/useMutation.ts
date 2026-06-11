"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { AxiosError } from 'axios';
import apiClient from '@services/api/client';

export function useMutation<T, V = any>(
  config: { method: string; url: string },
  options: { onSuccess?: (data: T) => void } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(
    async (variables?: V) => {
      if (!isMountedRef.current) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getInstance()({
          ...config,
          ...(variables && { data: variables }),
        });

        if (isMountedRef.current) {
          setData(response.data);
          options.onSuccess?.(response.data);
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
    },
    [config, options]
  );

  return { data, loading, error, mutate };
}