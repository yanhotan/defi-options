"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useOrders } from "@/hooks/useOrders";
import { usePrices } from "@/hooks/usePrices";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { OrderFillModal } from "@/components/features/OrderFillModal";
import { PayoffChart, SimplePayoff } from "@/components/features/PayoffChart";
import { formatCurrency } from "@/lib/utils/format";
import type { FormattedOrder } from "@/types";

export default function ShieldPage() {
  const { isConnected } = useAccount();
  const { orders, marketData, isLoading: ordersLoading } = useOrders();
  const { eth, btc, isLoading: pricesLoading } = usePrices();

  const [asset, setAsset] = useState<"ETH" | "BTC">("ETH");
  const [portfolioValue, setPortfolioValue] = useState("");
  const [protectionLevel, setProtectionLevel] = useState(90);
  const [selectedOrder, setSelectedOrder] = useState<FormattedOrder | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const currentPrice = asset === "ETH" ? (marketData.eth || eth) : (marketData.btc || btc);
  const portfolioNum = parseFloat(portfolioValue) || 0;
  const targetStrike = currentPrice * (protectionLevel / 100);

  const putOptions = orders
    .filter((o) => o.type === "put" && o.asset === asset && !o.isLong)
    .sort((a, b) => Math.abs(a.strike - targetStrike) - Math.abs(b.strike - targetStrike));

  const bestOption = putOptions[0];
  const estimatedPremium = bestOption
    ? (bestOption.price * portfolioNum) / currentPrice
    : 0;

  const handleProtect = () => {
    if (bestOption) {
      setSelectedOrder(bestOption);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Portfolio Protection</h1>
        <p className="text-gray-400 mb-8">
          Connect your wallet to start protecting your portfolio.
        </p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (ordersLoading || pricesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shield Your Portfolio</h1>
        <p className="text-gray-400">
          Buy put options to protect against price drops.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <button
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  asset === "ETH"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setAsset("ETH")}
              >
                ETH ({formatCurrency(marketData.eth || eth)})
              </button>
              <button
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  asset === "BTC"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setAsset("BTC")}
              >
                BTC ({formatCurrency(marketData.btc || btc)})
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value (USD)</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="number"
              value={portfolioValue}
              onChange={(e) => setPortfolioValue(e.target.value)}
              placeholder="10000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-primary-500"
            />
            {portfolioNum > 0 && (
              <p className="text-gray-400 text-sm mt-2">
                ≈ {(portfolioNum / currentPrice).toFixed(4)} {asset}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protection Level</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="range"
              min="70"
              max="99"
              value={protectionLevel}
              onChange={(e) => setProtectionLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-2">
              <span className="text-gray-400">70%</span>
              <span className="text-xl font-bold text-primary-400">
                {protectionLevel}%
              </span>
              <span className="text-gray-400">99%</span>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Protection kicks in if {asset} drops below{" "}
              {formatCurrency(targetStrike)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary-600/50">
          <CardHeader>
            <CardTitle>Protection Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Portfolio Value</span>
                <span>{formatCurrency(portfolioNum)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current {asset} Price</span>
                <span>{formatCurrency(currentPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Protected Below</span>
                <span className="text-primary-400">
                  {formatCurrency(targetStrike)}
                </span>
              </div>
              {bestOption && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Best Available Strike</span>
                    <span>{formatCurrency(bestOption.strike)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3 flex justify-between text-lg">
                    <span className="font-medium">Estimated Premium</span>
                    <span className="font-bold text-primary-400">
                      {formatCurrency(estimatedPremium)}
                    </span>
                  </div>
                </>
              )}
              {!bestOption && portfolioNum > 0 && (
                <div className="text-yellow-400 text-sm">
                  No matching put options available. Try adjusting your
                  protection level.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {portfolioNum > 0 && bestOption && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Outcome Scenarios</CardTitle>
                <button
                  className="text-sm text-primary-400 hover:underline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? "Simple View" : "Advanced Chart"}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {showAdvanced ? (
                <PayoffChart
                  strike={bestOption.strike}
                  premium={estimatedPremium / (portfolioNum / currentPrice)}
                  currentPrice={currentPrice}
                  isCall={false}
                  isLong={true}
                  size={portfolioNum / currentPrice}
                />
              ) : (
                <SimplePayoff
                  portfolioValue={portfolioNum}
                  protectionLevel={protectionLevel}
                  premium={estimatedPremium}
                  currentPrice={currentPrice}
                />
              )}
            </CardContent>
          </Card>
        )}

        <Button
          className="w-full"
          size="lg"
          disabled={!bestOption || portfolioNum <= 0}
          onClick={handleProtect}
        >
          {portfolioNum <= 0
            ? "Enter Portfolio Value"
            : !bestOption
            ? "No Options Available"
            : `Protect for ${formatCurrency(estimatedPremium)}`}
        </Button>

        {selectedOrder && (
          <OrderFillModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onSuccess={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}
