import { useCallback } from 'react';

const PREFIX = 'nr_cache_';

export function useCache() {
  const cGet = useCallback((key) => {
    try {
      const item = localStorage.getItem(PREFIX + key);
      if (!item) return null;
      return JSON.parse(item);
    } catch (e) {
      console.warn('Cache read error:', e);
      return null;
    }
  }, []);

  const cSet = useCallback((key, data) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.warn('Cache write error:', e);
    }
  }, []);

  return { cGet, cSet };
}
