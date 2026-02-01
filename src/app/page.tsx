import Link from "next/link";
import { PriceDisplay } from "@/components/features/PriceDisplay";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <section className="text-center py-8 sm:py-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary-400 to-green-300 bg-clip-text text-transparent">
          Protect Your Portfolio
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
          Shield uses put options to protect your crypto from price drops. Like
          insurance for your ETH and BTC.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
          <Link href="/shield" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">Get Protected</Button>
          </Link>
          <Link href="/orders" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Options
            </Button>
          </Link>
        </div>
        <PriceDisplay />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 py-8 sm:py-12">
        <Card>
          <CardContent>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🛡️</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Simple Protection</h3>
            <p className="text-gray-400 text-sm">
              Enter your portfolio value, pick your protection level, done.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📉</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Capped Downside</h3>
            <p className="text-gray-400 text-sm">
              Maximum loss is your premium. Sleep well during market crashes.
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 md:col-span-1">
          <CardContent>
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">⚡</div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Instant Settlement</h3>
            <p className="text-gray-400 text-sm">
              Built on Base. Low fees, fast transactions, same security.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="py-8 sm:py-12">
        <Card>
          <CardContent>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">How It Works</h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold shrink-0 text-sm sm:text-base">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Enter Portfolio Value</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Tell us how much ETH or BTC you want to protect.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold shrink-0 text-sm sm:text-base">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Choose Protection Level</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    80%, 90%, 95% - more protection costs more.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold shrink-0 text-sm sm:text-base">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Pay Premium</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    One transaction. You&apos;re protected until expiry.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold shrink-0 text-sm sm:text-base">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">Auto-Settlement</h4>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    If price drops below your strike, you get paid automatically.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
