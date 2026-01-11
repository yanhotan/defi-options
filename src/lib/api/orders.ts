import { CONTRACTS, DECIMALS } from "@/constants/contracts";
import type { OrderBookResponse, FormattedOrder, ApiOrder } from "@/types";

export async function fetchOrders(): Promise<OrderBookResponse> {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchPrices(): Promise<{ btc: number; eth: number }> {
  const response = await fetch("/api/prices");
  if (!response.ok) {
    throw new Error(`Failed to fetch prices: ${response.statusText}`);
  }
  const data = await response.json();
  return {
    btc: data.btc_usd ?? data.BTC ?? 0,
    eth: data.eth_usd ?? data.ETH ?? 0,
  };
}

export function formatOrder(order: ApiOrder, index: number): FormattedOrder {
  // Determine asset by price feed address (more reliable than collateral)
  const priceFeedLower = order.order.priceFeed.toLowerCase();
  const isEth = priceFeedLower === CONTRACTS.ethPriceFeed.toLowerCase();
  const asset = isEth ? "ETH" : "BTC";

  const strikeRaw = BigInt(order.order.strikes[0] ?? "0");
  const strike = Number(strikeRaw) / 10 ** DECIMALS.strike;

  const priceRaw = BigInt(order.order.price);
  const price = Number(priceRaw) / 10 ** DECIMALS.strike;

  const maxCollateralRaw = BigInt(order.order.maxCollateralUsable);
  // For calls: WETH (18) for ETH, WBTC (8) for BTC; For puts: always USDC (6)
  const decimals = order.order.isCall
    ? (isEth ? DECIMALS.weth : DECIMALS.wbtc)
    : DECIMALS.usdc;
  const maxSize = Number(maxCollateralRaw) / 10 ** decimals;

  return {
    id: `${order.nonce}-${index}`,
    type: order.order.isCall ? "call" : "put",
    asset,
    strike,
    expiry: new Date(order.order.expiry * 1000),
    price,
    maxSize,
    isLong: order.order.isLong,
    raw: order,
  };
}

export function formatOrders(response: OrderBookResponse): FormattedOrder[] {
  return response.data.orders.map((order, index) => formatOrder(order, index));
}
