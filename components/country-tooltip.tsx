"use client";

import { useEffect, useState } from "react";
import type * as THREE from "three";

interface CountryTooltipProps {
  name: string;
  position: THREE.Vector3;
  visible: boolean;
}

export function CountryTooltip({
  name,
  visible,
}: Omit<CountryTooltipProps, "position">) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div
      className="
        absolute
        flex items-center gap-2
        bg-gradient-to-r from-slate-900/95 to-slate-800/95
        backdrop-blur-xl
        text-white
        text-sm font-semibold
        px-4 py-2.5
        rounded-xl
        shadow-2xl
        border border-slate-600/40
        pointer-events-none
        animate-in fade-in zoom-in-95 duration-200
        whitespace-nowrap
      "
    >
      <div className="w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"></div>
      {name}
    </div>
  );
}
