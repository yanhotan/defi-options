"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchOrders, formatOrders } from "@/lib/api/orders";
import type { FormattedOrder } from "@/types";

interface UseOrdersResult {
  orders: FormattedOrder[];
  marketData: { btc: number; eth: number };
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useOrders(): UseOrdersResult {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await fetchOrders();
      return {
        orders: formatOrders(response),
        marketData: {
          btc: response.data.market_data?.BTC ?? 0,
          eth: response.data.market_data?.ETH ?? 0,
        },
      };
    },
    refetchInterval: 30000,      // Auto-refresh every 30 seconds
    staleTime: 10000,            // Data considered fresh for 10 seconds
    refetchOnWindowFocus: false, // Don't refetch when user returns to tab
    placeholderData: keepPreviousData, // Keep showing old data during refetch (no UI flicker)
    retry: 2,                    // Retry failed requests twice
  });

  return {
    orders: data?.orders ?? [],
    marketData: data?.marketData ?? { btc: 0, eth: 0 },
    isLoading,   // True only on initial load
    isFetching,  // True during any fetch (including background)
    error: error as Error | null,
    refetch,
  };
}
