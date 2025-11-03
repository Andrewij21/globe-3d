"use client";

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-blue-500"
          style={{ animation: "spin 2s linear infinite" }}
        ></div>
      </div>
      <p className="text-slate-300 text-sm">Loading globe data...</p>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
