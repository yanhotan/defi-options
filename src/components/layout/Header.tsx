"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navItems = [
  { href: "/shield", label: "Protect" },
  { href: "/orders", label: "Orders" },
  { href: "/rfq", label: "RFQ" },
  { href: "/positions", label: "Positions" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      {/* Main header row */}
      <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="text-lg sm:text-xl font-bold text-primary-400 shrink-0">
          Shield
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary-600/20 text-primary-400 border border-primary-600/50"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Wallet connect button */}
        <div className="shrink-0">
          <div className="hidden sm:block">
            <ConnectButton />
          </div>
          <div className="sm:hidden">
            <ConnectButton.Custom>
              {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs font-medium"
                          >
                            Connect
                          </button>
                        );
                      }

                      return (
                        <button
                          onClick={openAccountModal}
                          className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-medium"
                        >
                          {account.displayName}
                        </button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation - always visible horizontal tabs */}
      <nav className="md:hidden border-t border-gray-800 bg-gray-950/95">
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-between">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 text-center px-2 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "text-primary-400 border-b-2 border-primary-400"
                      : "text-gray-400 hover:text-white border-b-2 border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
