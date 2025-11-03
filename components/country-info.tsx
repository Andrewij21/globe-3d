"use client";

interface Country {
  name: { common: string; official: string };
  flags: { svg: string };
  region: string;
  subregion: string;
  capital?: string[];
  population: number;
  area: number;
  languages?: Record<string, string>;
}

export function CountryInfo({ country }: { country: Country }) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  return (
    <div className="p-6 border-b border-slate-700">
      {/* Flag */}
      <div className="mb-4 rounded-lg overflow-hidden border border-slate-600">
        <img
          src={country.flags.svg || "/placeholder.svg"}
          alt={country.name.common}
          className="w-full h-32 object-cover"
        />
      </div>

      {/* Country Name */}
      <h2 className="text-2xl font-bold text-white mb-1">
        {country.name.common}
      </h2>
      <p className="text-sm text-slate-400 mb-4">{country.name.official}</p>

      {/* Location Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Region:</span>
          <span className="text-white font-medium">{country.region}</span>
        </div>
        {country.subregion && (
          <div className="flex justify-between">
            <span className="text-slate-400">Sub-region:</span>
            <span className="text-white font-medium">{country.subregion}</span>
          </div>
        )}
        {country.capital && (
          <div className="flex justify-between">
            <span className="text-slate-400">Capital:</span>
            <span className="text-white font-medium">{country.capital[0]}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-400">Languages:</span>
          <span className="text-white font-medium text-right text-xs">
            {languages}
          </span>
        </div>
      </div>
    </div>
  );
}
