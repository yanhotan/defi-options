"use client";

import { usePrices } from "@/hooks/usePrices";
import { formatCurrency } from "@/lib/utils/format";
import { Spinner } from "@/components/ui/Spinner";

export function PriceDisplay() {
  const { btc, eth, isLoading, error } = usePrices();

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 text-gray-400">
        <Spinner size="sm" />
        Loading prices...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400">Failed to load prices</div>;
  }

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">ETH</span>
        <span className="font-mono font-semibold">{formatCurrency(eth)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">BTC</span>
        <span className="font-mono font-semibold">{formatCurrency(btc)}</span>
      </div>
    </div>
  );
}
