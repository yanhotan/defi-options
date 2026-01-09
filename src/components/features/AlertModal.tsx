"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: string;
  currentPrice: number;
}

const FREQUENCY_OPTIONS = [
  { value: "once", label: "Once" },
  { value: "5min", label: "Every 5 minutes" },
  { value: "hourly", label: "Hourly" },
  { value: "everytime", label: "Every time" },
];

const CONDITION_OPTIONS = [
  { value: "above", label: "Price goes above" },
  { value: "below", label: "Price goes below" },
];

interface Alert {
  id: string;
  asset: string;
  price: number;
  condition: "above" | "below";
  frequency: string;
}

export function AlertModal({ isOpen, onClose, asset, currentPrice }: AlertModalProps) {
  const [price, setPrice] = useState(currentPrice.toString());
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [frequency, setFrequency] = useState("once");
  const [alerts, setAlerts] = useState<Alert[]>([]);

  if (!isOpen) return null;

  const handleCreateAlert = () => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      asset,
      price: parseFloat(price),
      condition,
      frequency,
    };
    setAlerts([...alerts, newAlert]);
    setPrice(currentPrice.toString());
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Price Alerts</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Get notified when {asset} reaches your target price
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Condition</label>
            <div className="flex gap-2">
              {CONDITION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    condition === opt.value
                      ? opt.value === "above"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                  onClick={() => setCondition(opt.value as "above" | "below")}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Target Price (USD)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
              placeholder={currentPrice.toString()}
            />
            <div className="flex gap-2 mt-2">
              {[-10, -5, 5, 10].map((pct) => (
                <button
                  key={pct}
                  className="px-3 py-1 bg-gray-800 rounded text-xs text-gray-400 hover:bg-gray-700"
                  onClick={() => setPrice((currentPrice * (1 + pct / 100)).toFixed(2))}
                >
                  {pct > 0 ? "+" : ""}{pct}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Alert Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500"
            >
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <Button className="w-full" onClick={handleCreateAlert}>
            Create Alert
          </Button>
        </div>

        {alerts.length > 0 && (
          <div className="border-t border-gray-800 p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Active Alerts</h3>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          alert.condition === "above"
                            ? "bg-green-900/50 text-green-400"
                            : "bg-red-900/50 text-red-400"
                        }`}
                      >
                        {alert.condition === "above" ? "↑" : "↓"} {alert.condition}
                      </span>
                      <span className="font-medium">
                        ${alert.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {FREQUENCY_OPTIONS.find((f) => f.value === alert.frequency)?.label}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-gray-500 hover:text-red-400 text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t border-gray-800 bg-gray-800/50">
          <p className="text-xs text-gray-500 text-center">
            Alerts are stored locally and will be cleared on page refresh (UI demo only)
          </p>
        </div>
      </div>
    </div>
  );
}
