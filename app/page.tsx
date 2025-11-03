"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { CountryInfo } from "@/components/country-info";
import { StatsPanel } from "@/components/stats-panel";
import { LoadingSpinner } from "@/components/loading-spinner";

const Globe = dynamic(
  () => import("@/components/globe").then((mod) => ({ default: mod.Globe })),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        console.log("[v0] Starting country fetch from API route");
        const response = await fetch("/api/countries", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.log("[v0] API route returned status:", response.status);
          throw new Error(`API route returned ${response.status}`);
        }

        const data = await response.json();
        console.log("[v0] Received", data.length, "countries from API");
        setCountries(data);
        setLoading(false);
      } catch (err) {
        console.error("[v0] Error fetching countries:", err);
        setError("Failed to load countries data. Please refresh the page.");
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-slate-900 to-transparent p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Global Data Explorer
          </h1>
          <p className="text-slate-400 text-sm">
            Explore countries and their statistics in an interactive 3D globe
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full h-full pt-28">
        {/* Globe Section */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
              </div>
            </div>
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              <Globe
                countries={countries}
                onCountrySelect={setSelectedCountry}
                selectedCountry={selectedCountry}
              />
            </Suspense>
          )}
        </div>

        {/* Info Panel */}
        <div className="w-96 bg-slate-800/80 backdrop-blur-sm border-l border-slate-700 overflow-y-auto">
          {selectedCountry ? (
            <>
              <CountryInfo country={selectedCountry} />
              <StatsPanel country={selectedCountry} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Click on the globe
              </h3>
              <p className="text-slate-400 text-sm">
                Select a country to view detailed information
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
