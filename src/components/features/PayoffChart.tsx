"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { formatCurrency } from "@/lib/utils/format";

interface PayoffChartProps {
  strike: number;
  premium: number;
  currentPrice: number;
  isCall: boolean;
  isLong: boolean;
  size: number;
}

export function PayoffChart({
  strike,
  premium,
  currentPrice,
  isCall,
  isLong,
  size,
}: PayoffChartProps) {
  const data = useMemo(() => {
    const minPrice = Math.floor(currentPrice * 0.5);
    const maxPrice = Math.ceil(currentPrice * 1.5);
    const step = (maxPrice - minPrice) / 50;

    return Array.from({ length: 51 }, (_, i) => {
      const price = minPrice + i * step;
      let payoff: number;

      if (isCall) {
        const intrinsic = Math.max(0, price - strike);
        payoff = isLong
          ? (intrinsic - premium) * size
          : (premium - intrinsic) * size;
      } else {
        const intrinsic = Math.max(0, strike - price);
        payoff = isLong
          ? (intrinsic - premium) * size
          : (premium - intrinsic) * size;
      }

      const portfolioWithoutProtection = (price / currentPrice - 1) * size * currentPrice;
      const portfolioWithProtection = isLong && !isCall
        ? Math.max(portfolioWithoutProtection, -premium * size - (1 - strike / currentPrice) * size * currentPrice)
        : portfolioWithoutProtection;

      return {
        price,
        payoff: Math.round(payoff * 100) / 100,
        unprotected: Math.round(portfolioWithoutProtection * 100) / 100,
        protected: Math.round((portfolioWithoutProtection + payoff) * 100) / 100,
      };
    });
  }, [strike, premium, currentPrice, isCall, isLong, size]);

  const breakeven = isCall
    ? isLong
      ? strike + premium
      : strike - premium
    : isLong
    ? strike - premium
    : strike + premium;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="price"
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelFormatter={(value) => formatCurrency(value as number)}
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === "payoff"
                ? "Option P&L"
                : name === "protected"
                ? "Portfolio (Protected)"
                : "Portfolio (Unprotected)",
            ]}
          />
          <ReferenceLine x={currentPrice} stroke="#60A5FA" strokeDasharray="5 5" />
          <ReferenceLine x={strike} stroke="#F59E0B" strokeDasharray="5 5" />
          <ReferenceLine y={0} stroke="#6B7280" />
          <Area
            type="monotone"
            dataKey="protected"
            stroke="#22C55E"
            fill="#22C55E"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="unprotected"
            stroke="#EF4444"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="payoff"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-green-500" />
          <span className="text-gray-400">Protected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-red-500 opacity-50" />
          <span className="text-gray-400">Unprotected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-purple-500" />
          <span className="text-gray-400">Option P&L</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-yellow-500" />
          <span className="text-gray-400">Strike: {formatCurrency(strike)}</span>
        </div>
      </div>
    </div>
  );
}

interface SimplePayoffProps {
  portfolioValue: number;
  protectionLevel: number;
  premium: number;
  currentPrice: number;
}

export function SimplePayoff({
  portfolioValue,
  protectionLevel,
  premium,
  currentPrice,
}: SimplePayoffProps) {
  const protectedValue = portfolioValue * (protectionLevel / 100);
  const maxLoss = portfolioValue - protectedValue + premium;

  const scenarios = [
    {
      label: "Price drops 30%",
      priceChange: -30,
      withoutProtection: -portfolioValue * 0.3,
      withProtection: -maxLoss,
    },
    {
      label: "Price drops 20%",
      priceChange: -20,
      withoutProtection: -portfolioValue * 0.2,
      withProtection: protectionLevel >= 80 ? -maxLoss : -portfolioValue * 0.2 - premium,
    },
    {
      label: "Price drops 10%",
      priceChange: -10,
      withoutProtection: -portfolioValue * 0.1,
      withProtection: protectionLevel >= 90 ? -maxLoss : -portfolioValue * 0.1 - premium,
    },
    {
      label: "Price unchanged",
      priceChange: 0,
      withoutProtection: 0,
      withProtection: -premium,
    },
    {
      label: "Price rises 10%",
      priceChange: 10,
      withoutProtection: portfolioValue * 0.1,
      withProtection: portfolioValue * 0.1 - premium,
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-gray-400 border-b border-gray-700 pb-2">
        <div>Scenario</div>
        <div className="text-right">Without Shield</div>
        <div className="text-right">With Shield</div>
      </div>
      {scenarios.map((s) => (
        <div key={s.label} className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="text-gray-300">{s.label}</div>
          <div
            className={`text-right font-mono ${
              s.withoutProtection >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {s.withoutProtection >= 0 ? "+" : ""}
            {formatCurrency(s.withoutProtection)}
          </div>
          <div
            className={`text-right font-mono ${
              s.withProtection >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {s.withProtection >= 0 ? "+" : ""}
            {formatCurrency(s.withProtection)}
          </div>
        </div>
      ))}
      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-primary-900/20 border border-primary-800 rounded-lg">
        <p className="text-xs sm:text-sm text-primary-300">
          <strong>Max Loss with Shield:</strong> {formatCurrency(maxLoss)} (premium + gap to strike)
        </p>
        <p className="text-xs text-gray-400 mt-1">
          vs potential {formatCurrency(portfolioValue)} loss without protection
        </p>
      </div>
    </div>
  );
}
