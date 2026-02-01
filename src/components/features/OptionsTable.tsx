"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatExpiry } from "@/lib/utils/format";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import type { FormattedOrder } from "@/types";

interface OptionsTableProps {
  onSelectOrder?: (order: FormattedOrder) => void;
}

export function OptionsTable({ onSelectOrder }: OptionsTableProps) {
  const { orders, marketData, isLoading, error, refetch } = useOrders();
  const [assetFilter, setAssetFilter] = useState<"ALL" | "ETH" | "BTC">("ALL");

  const filteredOrders = assetFilter === "ALL"
    ? orders
    : orders.filter((o) => o.asset === assetFilter);

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load orders</p>
            <Button onClick={refetch} variant="outline">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-12 text-gray-400">
            {assetFilter !== "ALL"
              ? `No ${assetFilter} orders available`
              : "No orders available"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const puts = filteredOrders.filter((o) => o.type === "put");
  const calls = filteredOrders.filter((o) => o.type === "call");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="text-xs sm:text-sm text-gray-400">
          ETH: {formatCurrency(marketData.eth)} | BTC:{" "}
          {formatCurrency(marketData.btc)}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
            {(["ALL", "ETH", "BTC"] as const).map((asset) => (
              <button
                key={asset}
                onClick={() => setAssetFilter(asset)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                  assetFilter === asset
                    ? "bg-emerald-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
          <Button onClick={refetch} variant="outline" size="sm" className="text-xs sm:text-sm">
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Put Options (Protection)</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable orders={puts} onSelect={onSelectOrder} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Call Options (Leverage)</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable orders={calls} onSelect={onSelectOrder} />
        </CardContent>
      </Card>
    </div>
  );
}

function OrderTable({
  orders,
  onSelect,
}: {
  orders: FormattedOrder[];
  onSelect?: (order: FormattedOrder) => void;
}) {
  if (orders.length === 0) {
    return <div className="text-gray-500 text-xs sm:text-sm">No orders available</div>;
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-800">
              <th className="pb-3 font-medium">Asset</th>
              <th className="pb-3 font-medium">Strike</th>
              <th className="pb-3 font-medium">Expiry</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Side</th>
              <th className="pb-3 font-medium">Max Size</th>
              {onSelect && <th className="pb-3 font-medium"></th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-800/50 hover:bg-gray-800/30"
              >
                <td className="py-3 font-medium">{order.asset}</td>
                <td className="py-3 font-mono">{formatCurrency(order.strike)}</td>
                <td className="py-3">{formatExpiry(order.expiry)}</td>
                <td className="py-3 font-mono">{formatCurrency(order.price)}</td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      order.isLong
                        ? "bg-green-900/50 text-green-400"
                        : "bg-red-900/50 text-red-400"
                    }`}
                  >
                    {order.isLong ? "BUY" : "SELL"}
                  </span>
                </td>
                <td className="py-3 font-mono">{order.maxSize.toFixed(4)}</td>
                {onSelect && (
                  <td className="py-3">
                    <Button size="sm" onClick={() => onSelect(order)}>
                      Select
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-gray-800/30 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold">{order.asset}</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs ${
                    order.isLong
                      ? "bg-green-900/50 text-green-400"
                      : "bg-red-900/50 text-red-400"
                  }`}
                >
                  {order.isLong ? "BUY" : "SELL"}
                </span>
              </div>
              {onSelect && (
                <Button size="sm" onClick={() => onSelect(order)} className="text-xs px-2 py-1">
                  Select
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400">Strike</span>
                <p className="font-mono font-medium">{formatCurrency(order.strike)}</p>
              </div>
              <div>
                <span className="text-gray-400">Price</span>
                <p className="font-mono font-medium">{formatCurrency(order.price)}</p>
              </div>
              <div>
                <span className="text-gray-400">Expiry</span>
                <p>{formatExpiry(order.expiry)}</p>
              </div>
              <div>
                <span className="text-gray-400">Max Size</span>
                <p className="font-mono">{order.maxSize.toFixed(4)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
