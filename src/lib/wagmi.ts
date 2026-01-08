import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "viem/chains";

export const config = getDefaultConfig({
  appName: "Shield - Portfolio Insurance",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID ?? "demo",
  chains: [base],
  ssr: true,
});
