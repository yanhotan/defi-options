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
      <div className="max-w-2xl mx-auto text-center py-8 sm:py-16 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Portfolio Protection</h1>
        <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
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
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Shield Your Portfolio</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Buy put options to protect against price drops.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Select Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                className={`flex-1 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  asset === "ETH"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setAsset("ETH")}
              >
                ETH ({formatCurrency(marketData.eth || eth)})
              </button>
              <button
                className={`flex-1 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
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
            <CardTitle className="text-base sm:text-lg">Portfolio Value (USD)</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="number"
              value={portfolioValue}
              onChange={(e) => setPortfolioValue(e.target.value)}
              placeholder="10000"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-base sm:text-lg focus:outline-none focus:border-primary-500"
            />
            {portfolioNum > 0 && (
              <p className="text-gray-400 text-xs sm:text-sm mt-2">
                ≈ {(portfolioNum / currentPrice).toFixed(4)} {asset}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Protection Level</CardTitle>
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
              <span className="text-gray-400 text-sm sm:text-base">70%</span>
              <span className="text-lg sm:text-xl font-bold text-primary-400">
                {protectionLevel}%
              </span>
              <span className="text-gray-400 text-sm sm:text-base">99%</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Protection kicks in if {asset} drops below{" "}
              {formatCurrency(targetStrike)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary-600/50">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Protection Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Portfolio Value</span>
                <span>{formatCurrency(portfolioNum)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Current {asset} Price</span>
                <span>{formatCurrency(currentPrice)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">Protected Below</span>
                <span className="text-primary-400">
                  {formatCurrency(targetStrike)}
                </span>
              </div>
              {bestOption && (
                <>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-400">Best Available Strike</span>
                    <span>{formatCurrency(bestOption.strike)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 sm:pt-3 flex justify-between text-base sm:text-lg">
                    <span className="font-medium">Estimated Premium</span>
                    <span className="font-bold text-primary-400">
                      {formatCurrency(estimatedPremium)}
                    </span>
                  </div>
                </>
              )}
              {!bestOption && portfolioNum > 0 && (
                <div className="text-yellow-400 text-xs sm:text-sm">
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-base sm:text-lg">Outcome Scenarios</CardTitle>
                <button
                  className="text-xs sm:text-sm text-primary-400 hover:underline"
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
