"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Card, CardContent } from "@/components/ui/Card";

export default function PositionsPage() {
  const { isConnected, address } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold mb-4">Your Positions</h1>
        <p className="text-gray-400 mb-8">
          Connect your wallet to view your positions.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Positions</h1>
        <p className="text-gray-400">
          Active protections and past trades for{" "}
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-2">No active positions</p>
            <p className="text-sm">
              Position tracking coming in Milestone 4. For now, check your
              wallet for option tokens.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
