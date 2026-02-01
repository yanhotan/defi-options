"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface Position {
  id: string;
  asset: string;
  type: "call" | "put";
  direction: "long" | "short";
  strike: number;
  expiry: string;
  size: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  status: "active" | "expired" | "exercised";
}

const MOCK_POSITIONS: Position[] = [
  {
    id: "1",
    asset: "ETH",
    type: "put",
    direction: "long",
    strike: 3200,
    expiry: "2025-01-15",
    size: 2.5,
    entryPrice: 85,
    currentPrice: 142,
    pnl: 142.5,
    pnlPercent: 67.06,
    status: "active",
  },
  {
    id: "2",
    asset: "BTC",
    type: "call",
    direction: "long",
    strike: 98000,
    expiry: "2025-01-20",
    size: 0.5,
    entryPrice: 1200,
    currentPrice: 890,
    pnl: -155,
    pnlPercent: -25.83,
    status: "active",
  },
];

export default function PositionsPage() {
  const { isConnected, address } = useAccount();

  const totalPnl = MOCK_POSITIONS.reduce((sum, p) => sum + p.pnl, 0);
  const totalValue = MOCK_POSITIONS.reduce((sum, p) => sum + p.currentPrice * p.size, 0);

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-8 sm:py-16 px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Your Positions</h1>
        <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
          Connect your wallet to view your positions.
        </p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Positions</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Active protections and past trades for{" "}
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card>
          <CardContent className="pt-3 sm:pt-4">
            <p className="text-gray-400 text-xs sm:text-sm">Total Positions</p>
            <p className="text-xl sm:text-2xl font-bold">{MOCK_POSITIONS.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 sm:pt-4">
            <p className="text-gray-400 text-xs sm:text-sm">Portfolio Value</p>
            <p className="text-xl sm:text-2xl font-bold">${totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 md:col-span-1">
          <CardContent className="pt-3 sm:pt-4">
            <p className="text-gray-400 text-xs sm:text-sm">Total P&L</p>
            <p className={`text-xl sm:text-2xl font-bold ${totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Active Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Strike</th>
                  <th className="pb-3 font-medium">Expiry</th>
                  <th className="pb-3 font-medium">Size</th>
                  <th className="pb-3 font-medium">Entry</th>
                  <th className="pb-3 font-medium">Current</th>
                  <th className="pb-3 font-medium text-right">P&L</th>
                  <th className="pb-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_POSITIONS.map((position) => (
                  <tr key={position.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-4">
                      <span className="font-medium">{position.asset}</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        position.type === "call" 
                          ? "bg-green-900/50 text-green-400" 
                          : "bg-red-900/50 text-red-400"
                      }`}>
                        {position.type.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-xs ml-1">
                        {position.direction}
                      </span>
                    </td>
                    <td className="py-4">${position.strike.toLocaleString()}</td>
                    <td className="py-4 text-gray-400">{position.expiry}</td>
                    <td className="py-4">{position.size} {position.asset}</td>
                    <td className="py-4">${position.entryPrice}</td>
                    <td className="py-4">${position.currentPrice}</td>
                    <td className="py-4 text-right">
                      <div className={position.pnl >= 0 ? "text-green-400" : "text-red-400"}>
                        <span className="font-medium">
                          {position.pnl >= 0 ? "+" : ""}${position.pnl.toLocaleString()}
                        </span>
                        <span className="text-xs ml-1">
                          ({position.pnlPercent >= 0 ? "+" : ""}{position.pnlPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        position.status === "active"
                          ? "bg-blue-900/50 text-blue-400"
                          : position.status === "exercised"
                          ? "bg-green-900/50 text-green-400"
                          : "bg-gray-800 text-gray-400"
                      }`}>
                        {position.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {MOCK_POSITIONS.map((position) => (
              <div key={position.id} className="bg-gray-800/30 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{position.asset}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      position.type === "call" 
                        ? "bg-green-900/50 text-green-400" 
                        : "bg-red-900/50 text-red-400"
                    }`}>
                      {position.type.toUpperCase()}
                    </span>
                    <span className="text-gray-500 text-xs">{position.direction}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    position.status === "active"
                      ? "bg-blue-900/50 text-blue-400"
                      : position.status === "exercised"
                      ? "bg-green-900/50 text-green-400"
                      : "bg-gray-800 text-gray-400"
                  }`}>
                    {position.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400 text-xs">Strike</span>
                    <p className="font-medium">${position.strike.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Expiry</span>
                    <p className="text-gray-300">{position.expiry}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Size</span>
                    <p className="font-medium">{position.size} {position.asset}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Entry / Current</span>
                    <p className="font-medium">${position.entryPrice} / ${position.currentPrice}</p>
                  </div>
                </div>
                
                <div className={`flex justify-between items-center pt-2 border-t border-gray-700 ${position.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                  <span className="text-xs text-gray-400">P&L</span>
                  <div className="text-right">
                    <span className="font-bold">
                      {position.pnl >= 0 ? "+" : ""}${position.pnl.toLocaleString()}
                    </span>
                    <span className="text-xs ml-1">
                      ({position.pnlPercent >= 0 ? "+" : ""}{position.pnlPercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-gray-500 text-xs text-center mt-4">
        Demo data shown. Live position tracking requires indexing on-chain events.
      </p>
    </div>
  );
}
