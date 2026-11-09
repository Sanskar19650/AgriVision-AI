import React from 'react';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200/80 py-6 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-stone-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-stone-900">AgriVision AI</span>
          <span>— Precision Agriculture & Blockchain Verification Platform</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            B.Tech Final Year CSE Capstone Demonstration
          </span>
          <span className="hidden sm:inline text-stone-300">|</span>
          <span>FastAPI • React • Firebase • Solidity</span>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <span>Engineered for Sustainable Agriculture</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
        </div>
      </div>
    </footer>
  );
};
