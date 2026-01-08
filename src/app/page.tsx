import Link from "next/link";
import { PriceDisplay } from "@/components/features/PriceDisplay";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-green-300 bg-clip-text text-transparent">
          Protect Your Portfolio
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Shield uses put options to protect your crypto from price drops. Like
          insurance for your ETH and BTC.
        </p>
        <div className="flex items-center justify-center gap-4 mb-12">
          <Link href="/shield">
            <Button size="lg">Get Protected</Button>
          </Link>
          <Link href="/orders">
            <Button size="lg" variant="outline">
              View Options
            </Button>
          </Link>
        </div>
        <PriceDisplay />
      </section>

      <section className="grid md:grid-cols-3 gap-6 py-12">
        <Card>
          <CardContent>
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold mb-2">Simple Protection</h3>
            <p className="text-gray-400 text-sm">
              Enter your portfolio value, pick your protection level, done.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-4xl mb-4">📉</div>
            <h3 className="text-lg font-semibold mb-2">Capped Downside</h3>
            <p className="text-gray-400 text-sm">
              Maximum loss is your premium. Sleep well during market crashes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Instant Settlement</h3>
            <p className="text-gray-400 text-sm">
              Built on Base. Low fees, fast transactions, same security.
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="py-12">
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Enter Portfolio Value</h4>
                  <p className="text-gray-400 text-sm">
                    Tell us how much ETH or BTC you want to protect.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Choose Protection Level</h4>
                  <p className="text-gray-400 text-sm">
                    80%, 90%, 95% - more protection costs more.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Pay Premium</h4>
                  <p className="text-gray-400 text-sm">
                    One transaction. You&apos;re protected until expiry.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center font-bold shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Auto-Settlement</h4>
                  <p className="text-gray-400 text-sm">
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
