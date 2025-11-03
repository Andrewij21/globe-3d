"use client";

interface Country {
  population: number;
  area: number;
}

export function StatsPanel({ country }: { country: Country }) {
  console.log({ country });
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const density = country.area
    ? (country.population / country.area).toFixed(2)
    : "N/A";

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>

      <div className="space-y-4">
        {/* Population */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-300 text-sm">Population</span>
            <span className="text-blue-400 text-lg font-bold">
              {formatNumber(country.population)}
            </span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  (country.population / 1500000000) * 100,
                  100
                )}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Relative to world population
          </p>
        </div>

        {/* Area */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-300 text-sm">Area (km²)</span>
            <span className="text-emerald-400 text-lg font-bold">
              {formatNumber(country.area)}
            </span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full"
              style={{
                width: `${Math.min((country.area / 17098246) * 100, 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Largest country is Russia
          </p>
        </div>

        {/* Population Density */}
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex justify-between items-start">
            <span className="text-slate-300 text-sm">Population Density</span>
            <span className="text-purple-400 text-lg font-bold">
              {density} /km²
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
