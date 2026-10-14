import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const API_URL = 'https://open.er-api.com/v6/latest/USD';
const CACHE_KEY = 'verter:rate';
// Used only on the very first launch with no internet and nothing cached.
const FALLBACK_RATE = 3200;

type Cached = { rate: number; updatedAt: number };

export type RateState = {
  rate: number; // COP per 1 USD
  updatedAt: number | null; // ms timestamp of the rate, null for the fallback
  offline: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
};

async function readCache(): Promise<Cached | null> {
  try {
    const json = await AsyncStorage.getItem(CACHE_KEY);
    return json ? (JSON.parse(json) as Cached) : null;
  } catch {
    return null;
  }
}

async function fetchRate(): Promise<Cached> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(API_URL, { signal: controller.signal });
    const data = await res.json();
    const rate = data?.rates?.COP;
    if (data?.result !== 'success' || typeof rate !== 'number') {
      throw new Error('Bad rate response');
    }
    return { rate, updatedAt: (data.time_last_update_unix ?? Date.now() / 1000) * 1000 };
  } finally {
    clearTimeout(timeout);
  }
}

// Returns a fresh rate (and saves it for offline use), or null when offline.
async function fetchAndCache(): Promise<Cached | null> {
  try {
    const fresh = await fetchRate();
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fresh)).catch(() => {});
    return fresh;
  } catch {
    return null;
  }
}

export function useRate(): RateState {
  const [cached, setCached] = useState<Cached | null>(null);
  const [offline, setOffline] = useState(false);
  const [loading, setLoading] = useState(true);

  const apply = useCallback((fresh: Cached | null) => {
    if (fresh) setCached(fresh);
    setOffline(!fresh);
    setLoading(false);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    apply(await fetchAndCache());
  }, [apply]);

  useEffect(() => {
    // Show the cached rate instantly, then try to get a fresh one.
    readCache().then((c) => {
      if (c) setCached((current) => current ?? c);
    });
    fetchAndCache().then(apply);
  }, [apply]);

  return {
    rate: cached?.rate ?? FALLBACK_RATE,
    updatedAt: cached?.updatedAt ?? null,
    offline,
    loading,
    refresh,
  };
}
