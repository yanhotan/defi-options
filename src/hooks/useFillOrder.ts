"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, zeroAddress } from "viem";
import { OPTION_BOOK_ABI } from "@/constants/abis";
import { CONTRACTS, DECIMALS } from "@/constants/contracts";
import type { ApiOrder } from "@/types";

interface UseFillOrderResult {
  fillOrder: (order: ApiOrder, size: string) => void;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  hash: `0x${string}` | undefined;
}

export function useFillOrder(): UseFillOrderResult {
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const fillOrder = (order: ApiOrder, size: string) => {
    const decimals = order.order.isCall ? DECIMALS.weth : DECIMALS.usdc;
    const numContracts = parseUnits(size, decimals);

    const optionBookAddress =
      (order.optionBookAddress as `0x${string}`) ?? CONTRACTS.optionBook;

    const orderTuple = {
      maker: order.order.maker as `0x${string}`,
      orderExpiryTimestamp: BigInt(order.order.orderExpiryTimestamp),
      collateral: order.order.collateral as `0x${string}`,
      isCall: order.order.isCall,
      priceFeed: order.order.priceFeed as `0x${string}`,
      implementation: order.order.implementation as `0x${string}`,
      isLong: order.order.isLong,
      maxCollateralUsable: BigInt(order.order.maxCollateralUsable),
      strikes: order.order.strikes.map((s) => BigInt(s)),
      expiry: BigInt(order.order.expiry),
      price: BigInt(order.order.price),
      numContracts,
      extraOptionData: (order.order.extraOptionData || "0x") as `0x${string}`,
    };

    writeContract({
      address: optionBookAddress,
      abi: OPTION_BOOK_ABI,
      functionName: "fillOrder",
      args: [orderTuple, order.signature as `0x${string}`, zeroAddress],
    });
  };

  return {
    fillOrder,
    isPending,
    isConfirming,
    isSuccess,
    error: writeError,
    hash,
  };
}
