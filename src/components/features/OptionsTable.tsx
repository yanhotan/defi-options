"use client";

import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatExpiry } from "@/lib/utils/format";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import type { FormattedOrder } from "@/types";

interface OptionsTableProps {
  onSelectOrder?: (order: FormattedOrder) => void;
  filterAsset?: string;
}

export function OptionsTable({ onSelectOrder, filterAsset }: OptionsTableProps) {
  const { orders, marketData, isLoading, error, refetch } = useOrders();

  const filteredOrders = filterAsset
    ? orders.filter((o) => o.asset === filterAsset)
    : orders;

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
            {filterAsset
              ? `No ${filterAsset} orders available`
              : "No orders available"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const puts = filteredOrders.filter((o) => o.type === "put");
  const calls = filteredOrders.filter((o) => o.type === "call");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          ETH: {formatCurrency(marketData.eth)} | BTC:{" "}
          {formatCurrency(marketData.btc)}
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Put Options (Protection)</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable orders={puts} onSelect={onSelectOrder} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call Options (Leverage)</CardTitle>
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
    return <div className="text-gray-500 text-sm">No orders available</div>;
  }

  return (
    <div className="overflow-x-auto">
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
  );
}
