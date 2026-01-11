"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits, zeroAddress, maxUint256 } from "viem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency, formatExpiry } from "@/lib/utils/format";
import { OPTION_BOOK_ABI, ERC20_ABI } from "@/constants/abis";
import { CONTRACTS, DECIMALS } from "@/constants/contracts";
import type { FormattedOrder } from "@/types";

interface OrderFillModalProps {
  order: FormattedOrder;
  onClose: () => void;
  onSuccess: () => void;
}

export function OrderFillModal({ order, onClose, onSuccess }: OrderFillModalProps) {
  const { address, isConnected } = useAccount();
  const [size, setSize] = useState("");
  const [step, setStep] = useState<"input" | "approve" | "fill" | "success">("input");

  const collateralAddress = order.raw.order.collateral as `0x${string}`;
  const optionBookAddress = (order.raw.optionBookAddress ?? CONTRACTS.optionBook) as `0x${string}`;
  const isEthAsset = order.asset === "ETH";
  const decimals = order.type === "call" 
    ? (isEthAsset ? DECIMALS.weth : DECIMALS.wbtc)
    : DECIMALS.usdc;
  const sizeNum = parseFloat(size) || 0;

  // For PUT: size is USDC collateral, convert to underlying notional for premium calc
  // For CALL: size is underlying (ETH/BTC), use directly
  // Premium = price_per_contract × number_of_contracts
  const contracts = order.type === "put" 
    ? sizeNum / order.strike  // USDC ÷ strike = underlying units
    : sizeNum;                // Already in underlying units
  const premium = order.price * contracts;

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: collateralAddress,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, optionBookAddress] : undefined,
    query: { enabled: !!address },
  });

  const { data: balance } = useReadContract({
    address: collateralAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const {
    writeContract: approve,
    data: approveHash,
    isPending: isApproving,
  } = useWriteContract();

  const {
    writeContract: fillOrder,
    data: fillHash,
    isPending: isFilling,
    error: fillError,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { isLoading: isFillConfirming, isSuccess: isFillSuccess } =
    useWaitForTransactionReceipt({ hash: fillHash });

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
      setStep("fill");
    }
  }, [isApproveSuccess, refetchAllowance]);

  useEffect(() => {
    if (isFillSuccess) {
      setStep("success");
      setTimeout(onSuccess, 2000);
    }
  }, [isFillSuccess, onSuccess]);

  // BUY (isLong=true): Pay premium to buy option
  // SELL (isLong=false): Lock collateral (size) to sell option
  const requiredAmount = parseUnits(
    order.isLong ? premium.toString() : sizeNum.toString(),
    decimals
  );

  const needsApproval = allowance !== undefined && allowance < requiredAmount;
  const hasBalance = balance !== undefined && balance >= requiredAmount;

  const handleApprove = () => {
    setStep("approve");
    approve({
      address: collateralAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [optionBookAddress, maxUint256],
    });
  };

  const handleFill = () => {
    const numContracts = parseUnits(size, decimals);

    const orderTuple = {
      maker: order.raw.order.maker as `0x${string}`,
      orderExpiryTimestamp: BigInt(order.raw.order.orderExpiryTimestamp),
      collateral: order.raw.order.collateral as `0x${string}`,
      isCall: order.raw.order.isCall,
      priceFeed: order.raw.order.priceFeed as `0x${string}`,
      implementation: order.raw.order.implementation as `0x${string}`,
      isLong: order.raw.order.isLong,
      maxCollateralUsable: BigInt(order.raw.order.maxCollateralUsable),
      strikes: order.raw.order.strikes.map((s) => BigInt(s)),
      expiry: BigInt(order.raw.order.expiry),
      price: BigInt(order.raw.order.price),
      numContracts,
      extraOptionData: (order.raw.order.extraOptionData || "0x") as `0x${string}`,
    };

    fillOrder({
      address: optionBookAddress,
      abi: OPTION_BOOK_ABI,
      functionName: "fillOrder",
      args: [orderTuple, order.raw.signature as `0x${string}`, zeroAddress],
    });
  };

  if (!isConnected) {
    return (
      <ModalWrapper onClose={onClose}>
        <CardContent>
          <p className="text-center text-gray-400">Connect wallet to fill orders</p>
        </CardContent>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper onClose={onClose}>
      <CardHeader>
        <CardTitle>
          Fill {order.type.toUpperCase()} Order
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-gray-400">Asset</div>
            <div className="text-right font-medium">{order.asset}</div>
            
            <div className="text-gray-400">Strike</div>
            <div className="text-right font-mono">{formatCurrency(order.strike)}</div>
            
            <div className="text-gray-400">Expiry</div>
            <div className="text-right">{formatExpiry(order.expiry)}</div>
            
            <div className="text-gray-400">Price per contract</div>
            <div className="text-right font-mono">{formatCurrency(order.price)}</div>
            
            <div className="text-gray-400">Side</div>
            <div className="text-right">
              <span className={order.isLong ? "text-green-400" : "text-red-400"}>
                {order.isLong ? "BUY" : "SELL"}
              </span>
            </div>
            
            <div className="text-gray-400">Max Available</div>
            <div className="text-right font-mono">{order.maxSize.toFixed(4)}</div>
          </div>

          {step === "input" && (
            <>
              <div className="border-t border-gray-700 pt-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Size ({order.type === "call" ? "ETH/BTC" : "USDC"})
                </label>
                <input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="0.0"
                  max={order.maxSize}
                  step="0.0001"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>
                    Balance: {balance ? formatUnits(balance, decimals) : "0"}{" "}
                    {order.type === "call" ? (order.asset === "ETH" ? "WETH" : "WBTC") : "USDC"}
                  </span>
                  <button
                    className="text-primary-400 hover:underline"
                    onClick={() => setSize(Math.min(order.maxSize, Number(balance ? formatUnits(balance, decimals) : 0)).toString())}
                  >
                    Max
                  </button>
                </div>
              </div>

              {sizeNum > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Premium</span>
                    <span className="font-mono">{formatCurrency(premium)}</span>
                  </div>
                  {order.type === "put" && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contracts ({order.asset})</span>
                      <span className="font-mono">{contracts.toFixed(6)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      {order.isLong ? "You Pay" : "You Receive"}
                    </span>
                    <span className="font-mono font-semibold text-primary-400">
                      {formatCurrency(premium)}
                    </span>
                  </div>
                  {!order.isLong && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Collateral Locked</span>
                      <span className="font-mono">
                        {sizeNum.toFixed(2)} {order.type === "call" ? order.asset : "USDC"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {!hasBalance && sizeNum > 0 && (
                <div className="text-red-400 text-sm">
                  Insufficient balance
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                {needsApproval ? (
                  <Button
                    className="flex-1"
                    onClick={handleApprove}
                    disabled={!sizeNum || !hasBalance}
                  >
                    Approve
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    onClick={handleFill}
                    disabled={!sizeNum || !hasBalance}
                  >
                    Fill Order
                  </Button>
                )}
              </div>
            </>
          )}

          {step === "approve" && (
            <div className="text-center py-4">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-400">
                {isApproving ? "Confirm approval in wallet..." : "Waiting for confirmation..."}
              </p>
            </div>
          )}

          {step === "fill" && (
            <div className="space-y-4">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-3 text-green-400 text-sm">
                Approval confirmed! Ready to fill order.
              </div>
              <Button className="w-full" onClick={handleFill} disabled={isFilling || isFillConfirming}>
                {isFilling || isFillConfirming ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" /> Processing...
                  </span>
                ) : (
                  "Fill Order"
                )}
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-green-400 font-semibold">Order Filled Successfully!</p>
              <p className="text-gray-400 text-sm mt-2">
                Transaction: {fillHash?.slice(0, 10)}...
              </p>
            </div>
          )}

          {fillError && (
            <div className="text-red-400 text-sm">
              Error: {fillError.message.slice(0, 100)}
            </div>
          )}
        </div>
      </CardContent>
    </ModalWrapper>
  );
}

function ModalWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 z-10"
        >
          ✕
        </button>
        <Card>{children}</Card>
      </div>
    </div>
  );
}
