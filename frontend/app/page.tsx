"use client";

import { useState } from "react";
import { predictPrice, HouseFeatures, PredictionResponse } from "@/lib/api";
import Link from "next/link";

export default function Home() {
  const [features, setFeatures] = useState<HouseFeatures>({
    MedInc: 5.0,
    HouseAge: 20,
    AveRooms: 6,
    AveBedrms: 1,
    Population: 1000,
    AveOccup: 3,
    Latitude: 37.5,
    Longitude: -122.0,
  });

  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const prediction = await predictPrice(features);
      setResult(prediction);
    } catch {
      setError("Error connecting to the API. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const formatCHF = (value: number) =>
    new Intl.NumberFormat("de-CH", { style: "currency", currency: "CHF", maximumFractionDigits: 0 }).format(value);

  const fields = [
    { key: "MedInc", label: "Median Income", min: 0.5, max: 15, step: 0.1, description: "Household median income (x$10k)" },
    { key: "HouseAge", label: "House Age (years)", min: 1, max: 52, step: 1, description: "Median age of houses in block" },
    { key: "AveRooms", label: "Average Rooms", min: 1, max: 20, step: 0.5, description: "Average number of rooms per household" },
    { key: "AveBedrms", label: "Average Bedrooms", min: 0.5, max: 5, step: 0.5, description: "Average number of bedrooms" },
    { key: "Population", label: "Population", min: 10, max: 5000, step: 10, description: "Block population" },
    { key: "AveOccup", label: "Avg Occupants", min: 1, max: 10, step: 0.5, description: "Average house occupants" },
    { key: "Latitude", label: "Latitude", min: 32, max: 42, step: 0.1, description: "Geographic latitude" },
    { key: "Longitude", label: "Longitude", min: -124, max: -114, step: 0.1, description: "Geographic longitude" },
  ];

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
            <Link href="/" className="text-white font-medium">Predictor</Link>
            <Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">House Price Predictor</h1>
          <p className="text-gray-400">ML-powered predictions using XGBoost — R² score: 0.83</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold mb-6">Property Features</h2>
            <div className="space-y-5">
              {fields.map(({ key, label, min, max, step, description }) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-300">{label}</label>
                    <span className="text-sm font-mono text-blue-400">
                      {features[key as keyof HouseFeatures]}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={features[key as keyof HouseFeatures]}
                    onChange={(e) => setFeatures({ ...features, [key]: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Predicting..." : "Predict Price"}
            </button>

            {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
          </div>

          {/* Result */}
          <div className="space-y-4">
            {result ? (
              <>
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
                  <p className="text-blue-200 text-sm mb-1">Predicted Price</p>
                  <p className="text-4xl font-bold">{formatCHF(result.predicted_price)}</p>
                  <p className="text-blue-200 text-sm mt-2">
                    Range: {formatCHF(result.price_range_low)} — {formatCHF(result.price_range_high)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Model Confidence</p>
                    <p className="text-2xl font-bold text-green-400">{result.confidence}</p>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">R² Score</p>
                    <p className="text-2xl font-bold text-blue-400">{result.model_r2.toFixed(3)}</p>
                  </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-3">Price confidence interval</p>
                  <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-[20%] right-[20%] bg-blue-500 opacity-30 rounded-full" />
                    <div
                      className="absolute inset-y-0 w-1 bg-blue-400 rounded-full"
                      style={{ left: "50%" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatCHF(result.price_range_low)}</span>
                    <span className="text-blue-400 font-medium">{formatCHF(result.predicted_price)}</span>
                    <span>{formatCHF(result.price_range_high)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                <div className="text-5xl mb-4">🏠</div>
                <p className="text-gray-400">Adjust the sliders and click <strong className="text-white">Predict Price</strong> to get an ML-powered estimate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}