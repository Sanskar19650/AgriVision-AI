import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Droplets,
  Calendar,
  IndianRupee,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { runCropRecommendationModel } from '../services/aiService';
import { CropRecommendationResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const CropRecommendationPage: React.FC = () => {
  const { user, isDemoUser } = useAuth();

  // Agronomic inputs
  const [nitrogen, setNitrogen] = useState(90);
  const [phosphorus, setPhosphorus] = useState(42);
  const [potassium, setPotassium] = useState(43);
  const [temperature, setTemperature] = useState(25.0);
  const [humidity, setHumidity] = useState(82.0);
  const [ph, setPh] = useState(6.5);
  const [rainfall, setRainfall] = useState(200.0);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendationResult | null>(null);

  // Regional preset configurations for quick testing
  const presets = [
    { name: 'Maharashtra Black Soil', n: 110, p: 45, k: 25, temp: 28, humidity: 65, ph: 7.2, rainfall: 90, desc: 'Cotton, Maize, Soybean' },
    { name: 'Punjab Alluvial Plains', n: 130, p: 55, k: 38, temp: 19, humidity: 55, ph: 6.8, rainfall: 75, desc: 'Wheat, Mustard, Barley' },
    { name: 'Cauvery Coastal Basin', n: 85, p: 48, k: 40, temp: 27, humidity: 85, ph: 6.4, rainfall: 220, desc: 'Rice (Paddy), Sugarcane' },
    { name: 'Rajasthan Arid Tract', n: 35, p: 65, k: 80, temp: 26, humidity: 45, ph: 7.4, rainfall: 50, desc: 'Chickpea, Mothbeans, Pearl Millet' },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setNitrogen(p.n);
    setPhosphorus(p.p);
    setPotassium(p.k);
    setTemperature(p.temp);
    setHumidity(p.humidity);
    setPh(p.ph);
    setRainfall(p.rainfall);
  };

  const handleRunModel = async () => {
    setLoading(true);
    try {
      const res = await runCropRecommendationModel(
        user?.uid || 'demo-user-123',
        nitrogen,
        phosphorus,
        potassium,
        temperature,
        humidity,
        ph,
        rainfall
      );
      setResult(res);

      if (!isDemoUser && user) {
        try {
          await setDoc(doc(db, 'crop_recommendations', res.id), res);
        } catch (err) {
          console.warn('Could not sync recommendation to Firestore:', err);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleRunModel();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Crop Recommendation (Random Forest)
            </h1>
            <Badge variant="blue" size="sm">22 Agro-Climatic Crops</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Machine learning algorithm trained on Indian ICAR agro-climatic datasets mapping N, P, K, pH, and precipitation.
          </p>
        </div>

        <button
          onClick={handleRunModel}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Run Recommendation
        </button>
      </div>

      {/* Regional Presets Strip */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Regional Presets (Quick Evaluation)
        </span>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-all group"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 group-hover:text-emerald-800">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{preset.name}</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Form Controls & Results Split */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left 5 Cols: Sliders Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-sm text-stone-900">Agro-Climatic Parameters</h3>
            <span className="text-xs text-stone-400">7 Input Features</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Nitrogen (N)</span>
                <span className="text-emerald-700">{nitrogen} kg/ha</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                value={nitrogen}
                onChange={e => setNitrogen(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Phosphorus (P)</span>
                <span className="text-amber-700">{phosphorus} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                value={phosphorus}
                onChange={e => setPhosphorus(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-stone-700 mb-1">
                <span>Potassium (K)</span>
                <span className="text-teal-700">{potassium} kg/ha</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                value={potassium}
                onChange={e => setPotassium(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Humidity (%)</label>
                <input
                  type="number"
                  step="1"
                  value={humidity}
                  onChange={e => setHumidity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Soil pH (0-14)</label>
                <input
                  type="number"
                  step="0.1"
                  value={ph}
                  onChange={e => setPh(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Rainfall (mm)</label>
                <input
                  type="number"
                  step="5"
                  value={rainfall}
                  onChange={e => setRainfall(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>
            </div>

            <button
              onClick={handleRunModel}
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              Re-Calculate Suitability
            </button>
          </div>
        </div>

        {/* Right 7 Cols: Results & Agronomy Specs */}
        <div className="lg:col-span-7 space-y-5">
          {result && !loading ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
              
              {/* Top Crop Winner Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                    Top Recommended Cultivar
                  </span>
                  <h2 className="text-3xl font-black text-white mt-1">
                    {result.topCrop}
                  </h2>
                  <p className="text-xs text-stone-200 mt-1">
                    Maximum predicted harvest index for current agro-climatic conditions.
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl text-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-emerald-100 block">Match Score</span>
                  <span className="text-3xl font-black text-white">{result.topProbability}%</span>
                </div>
              </div>

              {/* Ranked Bar Chart (Recharts) */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Suitability Probability Distribution
                </span>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.recommendations} layout="vertical" margin={{ left: 30, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
                      <YAxis type="category" dataKey="crop" tick={{ fontSize: 11, fill: '#334155' }} />
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '10px' }} />
                      <Bar dataKey="probability" name="Probability (%)" fill="#059669" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Agronomic Profile for Top Crop */}
              {result.recommendations[0] && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Expected Yield</span>
                    <span className="text-base font-extrabold text-stone-900">
                      {result.recommendations[0].expectedYieldTonsPerAcre} Tons/Ac
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Water Need</span>
                    <span className="text-base font-extrabold text-stone-900">
                      {result.recommendations[0].waterRequirement}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Growth Window</span>
                    <span className="text-base font-extrabold text-stone-900">
                      {result.recommendations[0].growingPeriodDays} Days
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80">
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">MSP / Market Est.</span>
                    <span className="text-base font-extrabold text-stone-900">
                      ₹{result.recommendations[0].marketPriceEstimateINR}/qtl
                    </span>
                  </div>
                </div>
              )}

              {/* Fertilizer Balancing Advice */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
                <span className="font-bold text-amber-950 block">Agronomic Soil Health Guidance:</span>
                <p className="text-amber-800 leading-relaxed">
                  {result.fertilizerAdvice}
                </p>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-stone-200/80 shadow-xs flex items-center justify-center">
              <LoadingSpinner text="Running Random Forest Crop Decision Tree..." size="lg" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
