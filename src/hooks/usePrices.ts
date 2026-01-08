"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPrices } from "@/lib/api/orders";

interface UsePricesResult {
  btc: number;
  eth: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function usePrices(): UsePricesResult {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["prices"],
    queryFn: fetchPrices,
    refetchInterval: 10000,
    staleTime: 5000,
    refetchOnWindowFocus: false,
  });

  return {
    btc: data?.btc ?? 0,
    eth: data?.eth ?? 0,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
