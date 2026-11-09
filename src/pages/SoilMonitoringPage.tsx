import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Download,
  RefreshCw,
  Droplets,
  Thermometer,
  Zap,
  Sparkles
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { INITIAL_SOIL_READINGS, INITIAL_FARMS } from '../services/mockData';
import { SoilReading } from '../types';
import { notarizeReportOnBlockchain } from '../services/blockchainService';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const SoilMonitoringPage: React.FC = () => {
  const { user, isDemoUser } = useAuth();
  const [mode, setMode] = useState<'iot' | 'manual'>('iot');
  const [selectedFarmId, setSelectedFarmId] = useState(INITIAL_FARMS[0].id);

  // Live soil state
  const [nitrogen, setNitrogen] = useState(145);
  const [phosphorus, setPhosphorus] = useState(38);
  const [potassium, setPotassium] = useState(190);
  const [ph, setPh] = useState(6.8);
  const [moisture, setMoisture] = useState(32.4);
  const [temperature, setTemperature] = useState(24.5);
  const [organicMatter, setOrganicMatter] = useState(2.2);

  const [isSimulating, setIsSimulating] = useState(true);
  const [notarizing, setNotarizing] = useState(false);
  const [blockchainSuccess, setBlockchainSuccess] = useState<string | null>(null);

  // Simulated live IoT stream jitter
  useEffect(() => {
    if (mode !== 'iot' || !isSimulating) return;

    const interval = setInterval(() => {
      setMoisture(prev => parseFloat(Math.min(50, Math.max(15, prev + (Math.random() * 0.8 - 0.4))).toFixed(1)));
      setTemperature(prev => parseFloat(Math.min(38, Math.max(16, prev + (Math.random() * 0.4 - 0.2))).toFixed(1)));
      setNitrogen(prev => Math.round(Math.min(220, Math.max(60, prev + (Math.random() * 2 - 1)))));
    }, 3000);

    return () => clearInterval(interval);
  }, [mode, isSimulating]);

  // Fertility score algorithm
  const calculateFertilityScore = () => {
    let score = 50;
    if (nitrogen >= 120 && nitrogen <= 180) score += 15;
    else score += 5;

    if (phosphorus >= 30 && phosphorus <= 60) score += 12;
    else score += 4;

    if (potassium >= 150 && potassium <= 250) score += 12;
    else score += 4;

    if (ph >= 6.5 && ph <= 7.5) score += 11;
    else if (ph >= 6.0 && ph <= 8.0) score += 6;

    return Math.min(100, Math.max(20, Math.round(score)));
  };

  const healthScore = calculateFertilityScore();

  // Fertilizer dosage calculations
  const calculateFertilizerDosage = () => {
    let ureaKg = 0;
    let dapKg = 0;
    let mopKg = 0;

    if (nitrogen < 120) ureaKg = Math.round((140 - nitrogen) * 0.7);
    if (phosphorus < 35) dapKg = Math.round((50 - phosphorus) * 1.2);
    if (potassium < 160) mopKg = Math.round((200 - potassium) * 0.5);

    return { ureaKg, dapKg, mopKg };
  };

  const dosage = calculateFertilizerDosage();

  const handleNotarizeOnBlockchain = async () => {
    setNotarizing(true);
    setBlockchainSuccess(null);

    const readingData: SoilReading = {
      id: `soil-${Date.now()}`,
      userId: user?.uid || 'demo-user-123',
      farmId: selectedFarmId,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      moisture,
      temperature,
      organicMatter,
      electricalConductivity: 0.82,
      healthScore,
      sensorSource: mode === 'iot' ? 'IoT Telemetry (ESP32)' : 'Soil Testing Lab',
      timestamp: new Date().toISOString()
    };

    try {
      const record = await notarizeReportOnBlockchain(
        readingData.userId,
        readingData.id,
        'SOIL_TEST',
        readingData,
        `Soil fertility score of ${healthScore}/100 certified via AgriVision smart contract.`
      );

      if (!isDemoUser && user) {
        try {
          await setDoc(doc(db, 'soil_readings', readingData.id), readingData);
        } catch (err) {
          console.warn('Could not store reading in Firestore:', err);
        }
      }

      setBlockchainSuccess(`Certified on Polygon Amoy! Block #${record.blockNumber} • Tx: ${record.txHash.slice(0, 14)}...`);
    } finally {
      setNotarizing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Soil Health & IoT Monitoring
            </h1>
            <Badge variant="emerald" size="sm">
              {mode === 'iot' ? 'Live Telemetry' : 'Manual Lab Entry'}
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time N-P-K macronutrients, pH balance, capacitive moisture, and ICAR fertilizer recommendations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-stone-100 p-1 rounded-2xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setMode('iot')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                mode === 'iot' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${mode === 'iot' && isSimulating ? 'text-emerald-600 animate-pulse' : ''}`} />
              IoT Stream
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                mode === 'manual' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Lab Calibration
            </button>
          </div>

          <button
            onClick={handleNotarizeOnBlockchain}
            disabled={notarizing}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            {notarizing ? 'Notarizing...' : 'Notarize on Chain'}
          </button>
        </div>
      </div>

      {blockchainSuccess && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span>{blockchainSuccess}</span>
          </div>
          <Badge variant="purple" size="sm">Immutable Record</Badge>
        </div>
      )}

      {/* Top Fertility & Environmental Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Fertility Index</span>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-stone-900">{healthScore}</span>
            <span className="text-xs text-stone-400 font-semibold"> / 100</span>
          </div>
          <Badge variant={healthScore >= 75 ? 'emerald' : healthScore >= 50 ? 'amber' : 'rose'} size="sm">
            {healthScore >= 75 ? 'High Fertility' : healthScore >= 50 ? 'Moderate' : 'Nutrient Deficient'}
          </Badge>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Moisture Content</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-stone-900">{moisture}%</span>
          </div>
          <Badge variant="blue" size="sm">Field Capacity 28-35%</Badge>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Soil Temp</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-stone-900">{temperature}°C</span>
          </div>
          <Badge variant="amber" size="sm">Active Microbial Zone</Badge>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Soil pH (Reaction)</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-stone-900">{ph} pH</span>
          </div>
          <Badge variant="emerald" size="sm">
            {ph < 6.0 ? 'Acidic' : ph > 7.5 ? 'Alkaline' : 'Near Neutral'}
          </Badge>
        </div>
      </div>

      {/* Main Interactive Tuning Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Sliders / Telemetry Inputs */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Soil Parameter Calibrator</h3>
              <p className="text-xs text-stone-500">Adjust parameters or stream live values to evaluate crop suitability</p>
            </div>
            {mode === 'iot' && (
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                {isSimulating ? 'Pause IoT Jitter' : 'Resume IoT Jitter'}
              </button>
            )}
          </div>

          <div className="space-y-6 text-xs">
            {/* Nitrogen Slider */}
            <div>
              <div className="flex justify-between font-bold text-stone-800 mb-1">
                <span>Available Nitrogen (N)</span>
                <span className="text-emerald-700">{nitrogen} mg/kg</span>
              </div>
              <input
                type="range"
                min="30"
                max="250"
                value={nitrogen}
                onChange={e => setNitrogen(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>Deficient (&lt;100)</span>
                <span className="font-semibold text-emerald-600">Optimal (120-180)</span>
                <span>Excess (&gt;200)</span>
              </div>
            </div>

            {/* Phosphorus Slider */}
            <div>
              <div className="flex justify-between font-bold text-stone-800 mb-1">
                <span>Available Phosphorus (P)</span>
                <span className="text-amber-700">{phosphorus} mg/kg</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={phosphorus}
                onChange={e => setPhosphorus(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>Deficient (&lt;25)</span>
                <span className="font-semibold text-amber-600">Optimal (30-60)</span>
                <span>Excess (&gt;75)</span>
              </div>
            </div>

            {/* Potassium Slider */}
            <div>
              <div className="flex justify-between font-bold text-stone-800 mb-1">
                <span>Available Potassium (K)</span>
                <span className="text-teal-700">{potassium} mg/kg</span>
              </div>
              <input
                type="range"
                min="50"
                max="350"
                value={potassium}
                onChange={e => setPotassium(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>Deficient (&lt;120)</span>
                <span className="font-semibold text-teal-600">Optimal (150-250)</span>
                <span>Excess (&gt;280)</span>
              </div>
            </div>

            {/* pH Slider */}
            <div>
              <div className="flex justify-between font-bold text-stone-800 mb-1">
                <span>Soil pH</span>
                <span className="text-blue-700">{ph.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.5"
                step="0.1"
                value={ph}
                onChange={e => setPh(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>Acidic (4.5)</span>
                <span className="font-semibold text-blue-600">Neutral (6.5 - 7.5)</span>
                <span>Alkaline (9.5)</span>
              </div>
            </div>

            {/* Moisture Slider */}
            <div>
              <div className="flex justify-between font-bold text-stone-800 mb-1">
                <span>Soil Moisture (%)</span>
                <span className="text-cyan-700">{moisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="0.5"
                value={moisture}
                onChange={e => setMoisture(Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Fertilizer Recommendation Advice Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-stone-900">ICAR Fertilizer Recommendation</h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Calculated nutrient replenishment based on targeted Indian Council of Agricultural Research agronomy benchmarks:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 block">Urea (46% N)</span>
                  <span className="text-[11px] text-emerald-700">Top-dressing replenishment</span>
                </div>
                <span className="text-base font-extrabold text-emerald-900">
                  {dosage.ureaKg > 0 ? `${dosage.ureaKg} kg/acre` : 'Nil (Adequate)'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 block">DAP (18-46-0)</span>
                  <span className="text-[11px] text-amber-700">Basal root stimulation</span>
                </div>
                <span className="text-base font-extrabold text-amber-900">
                  {dosage.dapKg > 0 ? `${dosage.dapKg} kg/acre` : 'Nil (Adequate)'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-teal-950 block">MOP (60% K2O)</span>
                  <span className="text-[11px] text-teal-700">Fruit and grain filling</span>
                </div>
                <span className="text-base font-extrabold text-teal-900">
                  {dosage.mopKg > 0 ? `${dosage.mopKg} kg/acre` : 'Nil (Adequate)'}
                </span>
              </div>
            </div>

            {/* Organic Amendments */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs space-y-1">
              <span className="font-bold text-stone-800">Organic Soil Health Amendment:</span>
              <p className="text-[11px] text-stone-600">
                Incorporate 2 tons/acre of well-decomposed Vermicompost or Farm Yard Manure (FYM) with 5 kg/acre Trichoderma viride to enrich micro-flora.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <span className="text-[10px] text-stone-400 block text-center">
              Sensor Node: LoRaWAN Gateway #GW-092 • Calibration Valid until 2027
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
