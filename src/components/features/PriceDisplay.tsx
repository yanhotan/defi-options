"use client";

import { useOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/utils/format";
import { Spinner } from "@/components/ui/Spinner";

export function PriceDisplay() {
  const { marketData, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-4 text-gray-400 text-sm sm:text-base">
        <Spinner size="sm" />
        <span>Loading prices...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-sm sm:text-base">Failed to load prices</div>;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm sm:text-base">ETH</span>
        <span className="font-mono font-semibold text-sm sm:text-base">{formatCurrency(marketData.eth)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm sm:text-base">BTC</span>
        <span className="font-mono font-semibold text-sm sm:text-base">{formatCurrency(marketData.btc)}</span>
      </div>
    </div>
  );
}
