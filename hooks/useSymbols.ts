'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchSymbols, type SymbolEntry } from '@/lib/api/symbols';

const LOCAL_STORAGE_KEY = 'nse_symbols_cache';

interface CacheData {
  metadata: {
    last_fetch_date: string;
    last_fetch_time: string;
  };
  symbols: SymbolEntry[];
}

function getCacheFromStorage(): CacheData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Error reading from localStorage:', e);
  }
  return null;
}

function saveCacheToStorage(data: CacheData) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing to localStorage:', e);
  }
}

function isCacheFromToday(cache: CacheData | null): boolean {
  if (!cache) return false;
  
  const today = new Date().toLocaleDateString("en-CA", { 
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
  
  return cache.metadata.last_fetch_date === today;
}

export function useSymbols() {
  const [symbols, setSymbols] = useState<SymbolEntry[]>([]);
  const [metadata, setMetadata] = useState<{ last_fetch_date: string; last_fetch_time: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSymbols = useCallback(async () => {
    // Check localStorage first
    const cached = getCacheFromStorage();
    
    if (cached && isCacheFromToday(cached)) {
      // Cache is from today - use it, no backend call needed
      setSymbols(cached.symbols);
      setMetadata(cached.metadata);
      setIsLoading(false);
      setError(null);
      return;
    }
    
    // Need to fetch from backend
    setIsLoading(true);
    
    try {
      const response = await fetchSymbols();
      
      const cacheData: CacheData = {
        metadata: response.metadata,
        symbols: response.symbols,
      };
      
      // Save to localStorage
      saveCacheToStorage(cacheData);
      
      // Update state
      setSymbols(response.symbols);
      setMetadata(response.metadata);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch symbols'));
      
      // If fetch failed but we have stale cache, use it
      if (cached) {
        setSymbols(cached.symbols);
        setMetadata(cached.metadata);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadSymbols();
  }, [loadSymbols]);

  return {
    symbols,
    metadata,
    isLoading,
    error,
    refetch: loadSymbols,
  };
}
