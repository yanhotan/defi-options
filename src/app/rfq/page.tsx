"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { usePrices } from "@/hooks/usePrices";
import { useRFQ } from "@/hooks/useRFQ";
import { formatCurrency } from "@/lib/utils/format";

export default function RFQPage() {
  const { isConnected } = useAccount();
  const { eth, btc, isLoading: pricesLoading } = usePrices();
  const { submitRFQ, isPending, isConfirming, isSuccess, error, hash, quotationCount } = useRFQ();

  const [optionType, setOptionType] = useState<"call" | "put">("put");
  const [asset, setAsset] = useState<"ETH" | "BTC">("ETH");
  const [strike, setStrike] = useState("");
  const [size, setSize] = useState("");
  const [expiryDays, setExpiryDays] = useState(7);
  const [direction, setDirection] = useState<"buy" | "sell">("buy");

  const currentPrice = asset === "ETH" ? eth : btc;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRFQ({
      isCall: optionType === "call",
      asset,
      strike,
      size,
      expiryDays,
      isLong: direction === "buy",
    });
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Request for Quote</h1>
        <p className="text-gray-400 mb-8">
          Connect your wallet to submit custom option requests.
        </p>
        <ConnectButton />
      </div>
    );
  }

  if (pricesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Request for Quote (RFQ)</h1>
        <p className="text-gray-400">
          Submit custom option requests to market makers.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Total RFQs submitted: {quotationCount}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Option Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  optionType === "call"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setOptionType("call")}
              >
                CALL (Bullish)
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  optionType === "put"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setOptionType("put")}
              >
                PUT (Bearish)
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Underlying Asset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  asset === "ETH"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setAsset("ETH")}
              >
                ETH ({formatCurrency(eth)})
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  asset === "BTC"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setAsset("BTC")}
              >
                BTC ({formatCurrency(btc)})
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Direction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  direction === "buy"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setDirection("buy")}
              >
                BUY (Long)
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  direction === "sell"
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                onClick={() => setDirection("sell")}
              >
                SELL (Short)
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strike Price (USD)</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="number"
              value={strike}
              onChange={(e) => setStrike(e.target.value)}
              placeholder={currentPrice.toString()}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
              required
            />
            <div className="flex gap-2 mt-2">
              {[0.9, 0.95, 1.0, 1.05, 1.1].map((multiplier) => (
                <button
                  key={multiplier}
                  type="button"
                  className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400 hover:bg-gray-700"
                  onClick={() => setStrike(Math.round(currentPrice * multiplier).toString())}
                >
                  {multiplier === 1 ? "ATM" : `${(multiplier * 100 - 100).toFixed(0)}%`}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Size ({optionType === "call" ? asset : "USDC"})</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="1.0"
              step="0.01"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expiry</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={expiryDays}
              onChange={(e) => setExpiryDays(parseInt(e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
            >
              <option value={1}>1 Day</option>
              <option value={7}>1 Week</option>
              <option value={14}>2 Weeks</option>
              <option value={30}>1 Month</option>
            </select>
          </CardContent>
        </Card>

        <Card className="border-primary-600/50">
          <CardHeader>
            <CardTitle>RFQ Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span className={optionType === "call" ? "text-green-400" : "text-red-400"}>
                  {optionType.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Asset</span>
                <span>{asset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Direction</span>
                <span className={direction === "buy" ? "text-green-400" : "text-red-400"}>
                  {direction.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Strike</span>
                <span>{strike ? formatCurrency(parseFloat(strike)) : "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Size</span>
                <span>{size || "-"} {optionType === "call" ? asset : "USDC"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Expiry</span>
                <span>{expiryDays} day{expiryDays > 1 ? "s" : ""}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {isSuccess && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
            <p className="text-green-400 font-medium">RFQ Submitted Successfully!</p>
            <p className="text-gray-400 text-sm mt-1">
              Transaction: {hash?.slice(0, 20)}...
            </p>
            <p className="text-gray-400 text-sm">
              Market makers will submit quotes within 5 minutes.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400 font-medium">Error</p>
            <p className="text-gray-400 text-sm">{error.message.slice(0, 100)}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!strike || !size || isPending || isConfirming}
        >
          {isPending || isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner size="sm" />
              {isPending ? "Confirm in wallet..." : "Processing..."}
            </span>
          ) : (
            "Submit RFQ"
          )}
        </Button>
      </form>
    </div>
  );
}
