"use client";

import { useState } from "react";
import { OptionsTable } from "@/components/features/OptionsTable";
import { PriceDisplay } from "@/components/features/PriceDisplay";
import { OrderFillModal } from "@/components/features/OrderFillModal";
import type { FormattedOrder } from "@/types";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<FormattedOrder | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Options Market</h1>
          <p className="text-gray-400">
            Pre-signed orders from market makers. Ready to fill.
          </p>
        </div>
        <PriceDisplay />
      </div>

      <OptionsTable onSelectOrder={setSelectedOrder} />

      {selectedOrder && (
        <OrderFillModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
