"use client";

import { useEffect, useState } from "react";
import { getStats, StatsResponse } from "@/lib/api";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

export default function Analytics() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const formatCHF = (value: number) =>
    new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(value);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading analytics...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm font-bold">🏠</div>
            <span className="font-semibold text-lg">Swiss House Predictor</span>
          </div>
          <nav className="flex gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Predictor</Link>
            <Link href="/analytics" className="text-white font-medium">Analytics</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Model Analytics</h1>
          <p className="text-gray-400">Performance metrics and dataset insights</p>
        </div>

        {/* Model stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Algorithm", value: stats?.model.algorithm, color: "text-blue-400" },
            { label: "R² Score", value: stats?.model.r2.toFixed(4), color: "text-green-400" },
            { label: "RMSE", value: formatCHF(stats?.model.rmse ?? 0), color: "text-yellow-400" },
            { label: "MAE", value: formatCHF(stats?.model.mae ?? 0), color: "text-purple-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price distribution */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Price Distribution</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats?.price_distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="range" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: 8 }}
                  labelStyle={{ color: "#F9FAFB" }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Model comparison */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Model Comparison — R² Score</h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats?.model_comparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" domain={[0, 1]} tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                <YAxis dataKey="model" type="category" tick={{ fill: "#9CA3AF", fontSize: 11 }} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: 8 }}
                  labelStyle={{ color: "#F9FAFB" }}
                />
                <Bar dataKey="r2" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Dataset stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Dataset Price Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Min Price", value: formatCHF(stats?.dataset.price_min ?? 0), color: "text-red-400" },
                { label: "Average Price", value: formatCHF(stats?.dataset.price_mean ?? 0), color: "text-yellow-400" },
                { label: "Max Price", value: formatCHF(stats?.dataset.price_max ?? 0), color: "text-green-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-800 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-xs mb-1">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Features used in the model:</p>
              <div className="flex flex-wrap gap-2">
                {stats?.dataset.features.map((f) => (
                  <span key={f} className="bg-blue-900 text-blue-300 text-xs px-3 py-1 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}