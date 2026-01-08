"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from "lightweight-charts";
import { Card, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

const ASSETS = [
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "ARB", name: "Arbitrum" },
  { symbol: "OP", name: "Optimism" },
  { symbol: "LINK", name: "Chainlink" },
  { symbol: "UNI", name: "Uniswap" },
  { symbol: "AAVE", name: "Aave" },
];

const TIMEFRAMES = [
  { label: "1D", days: "1" },
  { label: "7D", days: "7" },
  { label: "14D", days: "14" },
  { label: "30D", days: "30" },
  { label: "90D", days: "90" },
  { label: "180D", days: "180" },
  { label: "1Y", days: "365" },
];

interface ChartCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface AssetChartProps {
  onAssetSelect?: (symbol: string) => void;
}

export function AssetChart({ onAssetSelect }: AssetChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [selectedAsset, setSelectedAsset] = useState("ETH");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);

  const filteredAssets = ASSETS.filter(
    (a) =>
      a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchChartData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/chart?symbol=${selectedAsset}&days=${selectedTimeframe}`
      );
      const data = await response.json();

      if (data.candles && data.candles.length > 0 && seriesRef.current) {
        const formattedData: CandlestickData[] = data.candles.map(
          (c: ChartCandle) => ({
            time: c.time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          })
        );

        seriesRef.current.setData(formattedData);
        chartRef.current?.timeScale().fitContent();

        const lastCandle = data.candles[data.candles.length - 1];
        const firstCandle = data.candles[0];
        if (lastCandle && firstCandle) {
          setCurrentPrice(lastCandle.close);
          const change =
            ((lastCandle.close - firstCandle.open) / firstCandle.open) * 100;
          setPriceChange(change);
        }
      }
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAsset, selectedTimeframe]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#111827" },
        textColor: "#9CA3AF",
      },
      grid: {
        vertLines: { color: "#1F2937" },
        horzLines: { color: "#1F2937" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        borderColor: "#374151",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#4ADE80",
          width: 1,
          style: 2,
        },
        horzLine: {
          color: "#4ADE80",
          width: 1,
          style: 2,
        },
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#22C55E",
      downColor: "#EF4444",
      borderUpColor: "#22C55E",
      borderDownColor: "#EF4444",
      wickUpColor: "#22C55E",
      wickDownColor: "#EF4444",
    });

    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (seriesRef.current) {
      fetchChartData();
    }
  }, [fetchChartData]);

  const handleAssetSelect = (symbol: string) => {
    setSelectedAsset(symbol);
    setSearchQuery("");
    onAssetSelect?.(symbol);
  };

  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
                {searchQuery && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                    {filteredAssets.map((asset) => (
                      <button
                        key={asset.symbol}
                        className="w-full px-4 py-2 text-left hover:bg-gray-700 text-sm flex justify-between"
                        onClick={() => handleAssetSelect(asset.symbol)}
                      >
                        <span className="font-medium">{asset.symbol}</span>
                        <span className="text-gray-400">{asset.name}</span>
                      </button>
                    ))}
                    {filteredAssets.length === 0 && (
                      <div className="px-4 py-2 text-gray-400 text-sm">
                        No assets found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {ASSETS.slice(0, 4).map((asset) => (
                  <button
                    key={asset.symbol}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedAsset === asset.symbol
                        ? "bg-primary-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                    onClick={() => handleAssetSelect(asset.symbol)}
                  >
                    {asset.symbol}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {currentPrice !== null && (
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  {priceChange !== null && (
                    <div
                      className={`text-sm ${
                        priceChange >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {priceChange >= 0 ? "+" : ""}
                      {priceChange.toFixed(2)}%
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.days}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      selectedTimeframe === tf.days
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setSelectedTimeframe(tf.days)}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
                <Spinner size="lg" />
              </div>
            )}
            <div ref={chartContainerRef} className="w-full" />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Chart data from CoinGecko</span>
            <span>{selectedAsset}/USD</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
