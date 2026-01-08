export interface Order {
  maker: `0x${string}`;
  orderExpiryTimestamp: bigint;
  collateral: `0x${string}`;
  isCall: boolean;
  priceFeed: `0x${string}`;
  implementation: `0x${string}`;
  isLong: boolean;
  maxCollateralUsable: bigint;
  strikes: bigint[];
  expiry: bigint;
  price: bigint;
  numContracts: bigint;
  extraOptionData: `0x${string}`;
}

export interface ApiOrder {
  order: {
    maker: string;
    orderExpiryTimestamp: number;
    collateral: string;
    isCall: boolean;
    priceFeed: string;
    implementation: string;
    isLong: boolean;
    maxCollateralUsable: string;
    strikes: string[];
    expiry: number;
    price: string;
    extraOptionData: string;
  };
  signature: string;
  nonce: string;
  optionBookAddress?: string;
}

export interface OrderBookResponse {
  data: {
    orders: ApiOrder[];
    market_data: {
      BTC: number;
      ETH: number;
    };
  };
}

export interface PriceData {
  btc_usd: number;
  eth_usd: number;
}

export interface FormattedOrder {
  id: string;
  type: "call" | "put";
  asset: "ETH" | "BTC";
  strike: number;
  expiry: Date;
  price: number;
  maxSize: number;
  isLong: boolean;
  raw: ApiOrder;
}
