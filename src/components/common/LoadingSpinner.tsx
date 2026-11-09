import React from 'react';
import { Loader2, Sprout } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  subtext?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = 'Processing agricultural telemetry...', 
  subtext,
  size = 'md' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="relative mb-4 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-3 border-emerald-100 border-t-emerald-600 animate-spin" />
        <Sprout className="w-6 h-6 text-emerald-600 absolute animate-pulse" />
      </div>
      {text && <p className="text-stone-800 font-medium text-sm">{text}</p>}
      {subtext && <p className="text-stone-500 text-xs mt-1 max-w-sm">{subtext}</p>}
    </div>
  );
};
