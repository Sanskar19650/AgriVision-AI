import React, { useState } from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  Sun,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CloudRain,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { INITIAL_WEATHER } from '../services/mockData';
import { WeatherData } from '../types';

export const WeatherMonitoringPage: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [selectedZone, setSelectedZone] = useState('Nashik Agriculture Zone');

  const zones = [
    { name: 'Nashik Agriculture Zone', temp: 26.4, condition: 'Partly Cloudy', humidity: 58, rainProb: 15, wind: 11.2 },
    { name: 'Ludhiana Wheat Belt (Punjab)', temp: 21.0, condition: 'Clear', humidity: 52, rainProb: 5, wind: 8.5 },
    { name: 'Cauvery River Basin (Karnataka)', temp: 28.5, condition: 'Humid & Overcast', humidity: 76, rainProb: 45, wind: 14.0 },
    { name: 'Guntur Chilli Cluster (Andhra)', temp: 31.2, condition: 'Sunny & Hot', humidity: 62, rainProb: 10, wind: 9.4 },
  ];

  const handleZoneChange = (zoneName: string) => {
    setSelectedZone(zoneName);
    const z = zones.find(item => item.name === zoneName);
    if (z) {
      setWeather({
        ...weather,
        city: z.name,
        currentTemp: z.temp,
        condition: z.condition,
        humidity: z.humidity,
        precipitationChance: z.rainProb,
        windSpeed: z.wind
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Location Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Agro-Meteorological Weather Monitoring
            </h1>
            <Badge variant="emerald" size="sm">Micro-Climate Station</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time atmospheric telemetry, agricultural spraying windows, frost alerts, and 7-day crop forecasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-emerald-600 hidden sm:block" />
          <select
            value={selectedZone}
            onChange={(e) => handleZoneChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {zones.map((z, idx) => (
              <option key={idx} value={z.name}>{z.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Meteorological Hero Card */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Current Weather */}
        <div className="lg:col-span-7 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                {weather.city}
              </span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tight">{weather.currentTemp}°C</span>
                <span className="text-sm font-medium text-emerald-100">Feels like {weather.feelsLike}°C</span>
              </div>
              <p className="text-sm text-emerald-100 mt-1 font-semibold">{weather.condition}</p>
            </div>

            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <CloudSun className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/20 text-xs">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-emerald-200 font-semibold uppercase block">Relative Humidity</span>
              <span className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-300" />
                {weather.humidity}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-emerald-200 font-semibold uppercase block">Wind Velocity</span>
              <span className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                <Wind className="w-3.5 h-3.5 text-emerald-300" />
                {weather.windSpeed} km/h
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-emerald-200 font-semibold uppercase block">Rain Chance</span>
              <span className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-300" />
                {weather.precipitationChance}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-emerald-200 font-semibold uppercase block">UV Radiation</span>
              <span className="text-base font-bold text-white flex items-center gap-1 mt-0.5">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                {weather.uvIndex} (Moderate)
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Agricultural Spraying & Advisory Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Agro Spraying Window</span>
              <Badge variant="emerald" size="sm">Optimal Condition</Badge>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Safe Spraying Window Active</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Wind speed is below 12 km/h and temperatures are mild. Safe for foliar application of micronutrients and biological insecticides without chemical drift.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1 text-xs">
              <div className="flex items-center gap-2 text-amber-950 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Irrigation Guidance</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Rainfall probability increases on Thursday (65%). Reduce drip irrigation run-time by 30% to conserve electricity and avoid root waterlogging.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Evapotranspiration (ET0): 3.8 mm/day</span>
            <span>VPD: 1.15 kPa</span>
          </div>
        </div>

      </div>

      {/* 7-Day Agricultural Forecast */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-stone-900">7-Day Farming Weather Forecast</h3>
          </div>
          <span className="text-xs text-stone-400">Indian Meteorological Dept (IMD) Grounded</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center transition-all ${
                idx === 0
                  ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500/20'
                  : 'border-stone-200/80 bg-stone-50/40 hover:bg-stone-50'
              }`}
            >
              <span className="font-bold text-xs text-stone-800 block">{day.day}</span>
              <CloudSun className="w-7 h-7 mx-auto my-2 text-emerald-600" />
              <div className="flex items-baseline justify-center gap-1.5 text-xs font-bold text-stone-900">
                <span>{day.tempHigh}°</span>
                <span className="text-stone-400 font-normal">{day.tempLow}°</span>
              </div>
              <p className="text-[10px] text-stone-500 mt-1 truncate">{day.condition}</p>
              <div className="mt-2 text-[10px] font-semibold text-blue-600 flex items-center justify-center gap-0.5">
                <Droplets className="w-3 h-3" />
                {day.rainProb}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agronomic Advisories List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-stone-900">District Agricultural Extension Advisories</h3>
        <div className="grid md:grid-cols-2 gap-3 text-xs">
          {weather.agriculturalAdvisories.map((advisory, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-stone-700 leading-relaxed">{advisory}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
