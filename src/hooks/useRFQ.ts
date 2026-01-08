"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits, zeroAddress } from "viem";
import { OPTION_FACTORY_ABI } from "@/constants/abis";
import { CONTRACTS, DECIMALS } from "@/constants/contracts";

interface RFQParams {
  isCall: boolean;
  asset: "ETH" | "BTC";
  strike: string;
  size: string;
  expiryDays: number;
  isLong: boolean;
}

export function useRFQ() {
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: quotationCount } = useReadContract({
    address: CONTRACTS.optionFactory as `0x${string}`,
    abi: OPTION_FACTORY_ABI,
    functionName: "getQuotationCount",
  });

  const submitRFQ = (params: RFQParams) => {
    const collateral = params.isCall
      ? (params.asset === "ETH" ? CONTRACTS.weth : CONTRACTS.cbbtc)
      : CONTRACTS.usdc;

    const priceFeed = params.asset === "ETH" 
      ? CONTRACTS.ethPriceFeed 
      : CONTRACTS.btcPriceFeed;

    const implementation = params.isCall
      ? CONTRACTS.callImplementation
      : CONTRACTS.putImplementation;

    const strikeDecimals = DECIMALS.strike;
    const collateralDecimals = params.isCall
      ? (params.asset === "ETH" ? DECIMALS.weth : DECIMALS.wbtc)
      : DECIMALS.usdc;

    const strikeValue = parseUnits(params.strike, strikeDecimals);
    const sizeValue = parseUnits(params.size, collateralDecimals);

    const now = Math.floor(Date.now() / 1000);
    const expiryTimestamp = now + (params.expiryDays * 86400);
    const offerEndTimestamp = now + 300;

    const rfqParams = {
      requester: zeroAddress,
      existingOptionAddress: zeroAddress,
      collateral: collateral as `0x${string}`,
      collateralPriceFeed: priceFeed as `0x${string}`,
      implementation: implementation as `0x${string}`,
      strikes: [strikeValue],
      numContracts: sizeValue,
      requesterDeposit: BigInt(0),
      collateralAmount: BigInt(0),
      expiryTimestamp: BigInt(expiryTimestamp),
      offerEndTimestamp: BigInt(offerEndTimestamp),
      isRequestingLongPosition: params.isLong,
      convertToLimitOrder: false,
      extraOptionData: "0x" as `0x${string}`,
    };

    const tracking = {
      referralId: BigInt(0),
      eventCode: BigInt(0),
    };

    const reservePrice = parseUnits("1000", collateralDecimals);

    writeContract({
      address: CONTRACTS.optionFactory as `0x${string}`,
      abi: OPTION_FACTORY_ABI,
      functionName: "requestForQuotation",
      args: [rfqParams, tracking, reservePrice, ""],
    });
  };

  return {
    submitRFQ,
    isPending,
    isConfirming,
    isSuccess,
    error: writeError,
    hash,
    quotationCount: quotationCount ? Number(quotationCount) : 0,
  };
}
