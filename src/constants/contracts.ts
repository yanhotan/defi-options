export const CONTRACTS = {
  optionBook: "0xA63D2717538834E553cbe811B04a17eC748D71FB",
  optionFactory: "0x1aDcD391CF15Fb699Ed29B1D394F4A64106886e5",
  putImplementation: "0xF480F636301d50Ed570D026254dC5728b746A90F",
  callImplementation: "0x3CeB524cBA83D2D4579F5a9F8C0D1f5701dd16FE",
  usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  weth: "0x4200000000000000000000000000000000000006",
  cbbtc: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
  ethPriceFeed: "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
  btcPriceFeed: "0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F",
  kyberRouter: "0x6131B5fae19EA4f9D964eAc0408E4408b66337b5",
  oneInchRouter: "0x111111125421cA6dc452d289314280a0f8842A65",
  zeroExProxy: "0xDef1C0ded9bec7F1a1670819833240f027b25EfF",
  odosRouter: "0x19cEeAd7105607Cd444F5ad10dd51356436095a1",
  paraswapRouter: "0x6A000F20005980200259B80c5102003040001068",
} as const;

export const APIS = {
  prices: "https://pricing.thetanuts.finance",
  orders: "https://round-snowflake-9c31.devops-118.workers.dev/",
} as const;

export const CHAIN_ID = 8453;

export const DECIMALS = {
  usdc: 6,
  weth: 18,
  wbtc: 8,
  strike: 8,
} as const;
