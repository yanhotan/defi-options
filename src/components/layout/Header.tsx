"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-primary-400">
            Shield
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/shield"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Protect
            </Link>
            <Link
              href="/orders"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Orders
            </Link>
            <Link
              href="/rfq"
              className="text-gray-400 hover:text-white transition-colors"
            >
              RFQ
            </Link>
            <Link
              href="/positions"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Positions
            </Link>
          </nav>
        </div>
        <ConnectButton />
      </div>
    </header>
  );
}
