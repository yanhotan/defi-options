"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPrices } from "@/lib/api/orders";

interface UsePricesResult {
  btc: number;
  eth: number;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePrices(): UsePricesResult {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["prices"],
    queryFn: fetchPrices,
    refetchInterval: 10000,      // Auto-refresh every 10 seconds
    staleTime: 5000,             // Data considered fresh for 5 seconds
    refetchOnWindowFocus: false, // Don't refetch when user returns to tab
    placeholderData: keepPreviousData, // Keep showing old data during refetch (no UI flicker)
    retry: 2,                    // Retry failed requests twice
  });

  return {
    btc: data?.btc ?? 0,
    eth: data?.eth ?? 0,
    isLoading,   // True only on initial load
    isFetching,  // True during any fetch (including background)
    error: error as Error | null,
    refetch,
  };
}
