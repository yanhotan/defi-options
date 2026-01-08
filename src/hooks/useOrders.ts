"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOrders, formatOrders } from "@/lib/api/orders";
import type { FormattedOrder } from "@/types";

interface UseOrdersResult {
  orders: FormattedOrder[];
  marketData: { btc: number; eth: number };
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useOrders(): UseOrdersResult {
  const { data, isLoading, error, refetch } = useQuery({
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
    refetchInterval: 30000,
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });

  return {
    orders: data?.orders ?? [],
    marketData: data?.marketData ?? { btc: 0, eth: 0 },
    isLoading,
    error: error as Error | null,
    refetch,
  };
}
