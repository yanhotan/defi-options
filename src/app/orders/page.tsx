"use client";

import { useState } from "react";
import { OptionsTable } from "@/components/features/OptionsTable";
import { AssetChart } from "@/components/features/AssetChart";
import { OrderFillModal } from "@/components/features/OrderFillModal";
import { AlertModal } from "@/components/features/AlertModal";
import { usePrices } from "@/hooks/usePrices";
import type { FormattedOrder } from "@/types";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<FormattedOrder | null>(null);
  const [selectedAsset, setSelectedAsset] = useState("ETH");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const { eth, btc } = usePrices();

  const currentPrice = selectedAsset === "ETH" ? eth : selectedAsset === "BTC" ? btc : eth;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Options Market</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Analyze price action and fill pre-signed orders from market makers.
        </p>
      </div>

      <AssetChart 
        onAssetSelect={setSelectedAsset} 
        onAlertClick={() => setShowAlertModal(true)}
      />

      <OptionsTable onSelectOrder={setSelectedOrder} />

      {selectedOrder && (
        <OrderFillModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={() => setSelectedOrder(null)}
        />
      )}

      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        asset={selectedAsset}
        currentPrice={currentPrice}
      />
    </div>
  );
}
