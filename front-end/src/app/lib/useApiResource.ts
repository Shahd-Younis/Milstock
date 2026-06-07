import { useEffect, useState } from 'react';
import { ApiList } from './types';

interface ResourceState<T> {
  data: T[];
  loading: boolean;
  error: string;
}

export const useApiResource = <T,>(loader: () => Promise<unknown>, deps: unknown[] = []) => {
  const [state, setState] = useState<ResourceState<T>>({
    data: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    let mounted = true;

    setState((current) => ({ ...current, loading: true, error: '' }));

    loader()
      .then((response) => {
        if (!mounted) return;
        const payload = response as ApiList<T>;
        setState({ data: payload.data || [], loading: false, error: '' });
      })
      .catch((error) => {
        if (!mounted) return;
        setState({ data: [], loading: false, error: error.message || 'Unable to load data' });
      });

    return () => {
      mounted = false;
    };
  }, deps);

  return state;
};
