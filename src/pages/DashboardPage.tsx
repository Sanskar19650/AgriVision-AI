import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tractor,
  FlaskConical,
  ScanEye,
  ShieldCheck,
  CloudSun,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  Radio
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { INITIAL_FARMS, INITIAL_SOIL_READINGS, SAMPLE_LEAF_IMAGES, INITIAL_BLOCKCHAIN_RECORDS, INITIAL_WEATHER } from '../services/mockData';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedFarm, setSelectedFarm] = useState(INITIAL_FARMS[0]);

  // Synthetic telemetry chart data
  const telemetryTrendData = [
    { time: '02:00', moisture: 34, temp: 19, ec: 0.7 },
    { time: '05:00', moisture: 35, temp: 18, ec: 0.72 },
    { time: '08:00', moisture: 33, temp: 21, ec: 0.78 },
    { time: '11:00', moisture: 30, temp: 26, ec: 0.85 },
    { time: '14:00', moisture: 27, temp: 28, ec: 0.88 },
    { time: '17:00', moisture: 29, temp: 25, ec: 0.82 },
    { time: '20:00', moisture: 32, temp: 22, ec: 0.76 },
    { time: '23:00', moisture: 33, temp: 20, ec: 0.74 },
  ];

  const diseasePrevalenceData = [
    { crop: 'Tomato', blight: 34, healthy: 66 },
    { crop: 'Potato', blight: 42, healthy: 58 },
    { crop: 'Maize', blight: 18, healthy: 82 },
    { crop: 'Apple', blight: 24, healthy: 76 },
    { crop: 'Rice', blight: 8, healthy: 92 },
  ];

  const soilLatest = INITIAL_SOIL_READINGS[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Farm Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              Namaste, {user?.fullName || 'Farmer'}! 🌱
            </h1>
            <Badge variant="emerald" size="sm">Active Season: Rabi 2026</Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Monitoring precision farm telemetry, edge AI models, and immutable blockchain audits.
          </p>
        </div>

        {/* Farm Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-stone-600 hidden sm:block">Farm:</label>
          <select
            value={selectedFarm.id}
            onChange={(e) => {
              const f = INITIAL_FARMS.find(item => item.id === e.target.value);
              if (f) setSelectedFarm(f);
            }}
            className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {INITIAL_FARMS.map(farm => (
              <option key={farm.id} value={farm.id}>
                {farm.name} ({farm.totalAcres} Acres • {farm.primaryCrop})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weather Advisory Alert Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 shrink-0">
            <CloudSun className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-200">Agro-Meteorological Advisory</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium">Nashik Zone</span>
            </div>
            <p className="text-xs text-stone-100 mt-0.5 font-medium">
              Optimal foliar spray window: <strong className="text-white">Active until 11:30 AM</strong> (Wind 7 km/h, Temp 26.4°C). Low drift risk.
            </p>
          </div>
        </div>
        <Link
          to="/weather"
          className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-stone-100 transition-colors shrink-0"
        >
          Detailed Forecast →
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Acreage"
          value={`${selectedFarm.totalAcres} Acres`}
          subtitle={selectedFarm.soilType + ' Soil'}
          icon={Tractor}
          accentColor="emerald"
          trend={{ value: '100% Covered', isPositive: true }}
        />
        <StatCard
          title="Soil Fertility Score"
          value={`${soilLatest.healthScore} / 100`}
          subtitle="Optimal Balanced N-P-K"
          icon={FlaskConical}
          accentColor="blue"
          trend={{ value: '+4.2% MoM', isPositive: true }}
        />
        <StatCard
          title="AI Leaf Scans"
          value="48 Scans"
          subtitle="3 Pathogens Flagged"
          icon={ScanEye}
          accentColor="amber"
          trend={{ value: '98.4% Acc', isPositive: true }}
        />
        <StatCard
          title="Blockchain Notaries"
          value={`${INITIAL_BLOCKCHAIN_RECORDS.length} Certified`}
          subtitle="Polygon PoS Ledger"
          icon={ShieldCheck}
          accentColor="purple"
          trend={{ value: 'Zero Tampering', isPositive: true }}
        />
      </div>

      {/* Quick Action Workflow Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          to="/disease"
          className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-emerald-500 hover:shadow-sm transition-all group flex flex-col justify-between"
        >
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <ScanEye className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <p className="font-bold text-xs text-stone-900">Scan Crop Leaf</p>
            <p className="text-[11px] text-stone-500">CNN Plant Pathology</p>
          </div>
        </Link>

        <Link
          to="/soil"
          className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-500 hover:shadow-sm transition-all group flex flex-col justify-between"
        >
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 w-fit group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <p className="font-bold text-xs text-stone-900">Soil IoT Telemetry</p>
            <p className="text-[11px] text-stone-500">NPK & Moisture Stream</p>
          </div>
        </Link>

        <Link
          to="/recommend"
          className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-blue-500 hover:shadow-sm transition-all group flex flex-col justify-between"
        >
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <p className="font-bold text-xs text-stone-900">Crop Recommender</p>
            <p className="text-[11px] text-stone-500">Random Forest Model</p>
          </div>
        </Link>

        <Link
          to="/mapping"
          className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-teal-500 hover:shadow-sm transition-all group flex flex-col justify-between"
        >
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 w-fit group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <p className="font-bold text-xs text-stone-900">Farm GIS Map</p>
            <p className="text-[11px] text-stone-500">Leaflet NDVI Demarcation</p>
          </div>
        </Link>
      </div>

      {/* Telemetry Charts & Soil Nutrients Split */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: 24h IoT Sensor Trend */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h3 className="font-bold text-sm text-stone-900">Soil Moisture & Temperature (24h IoT Stream)</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Simulated telemetry feed from ESP32 field probe #ESP-042</p>
            </div>
            <Badge variant="emerald" size="sm">Sampling: 15 min</Badge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="moisture" name="Soil Moisture (%)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#moistureGrad)" />
                <Area type="monotone" dataKey="temp" name="Temperature (°C)" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Moisture: <strong className="text-stone-900">{soilLatest.moisture}% (Optimal)</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Soil Temp: <strong className="text-stone-900">{soilLatest.temperature}°C</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Electrical Cond: <strong className="text-stone-900">{soilLatest.electricalConductivity} dS/m</strong></span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Instant N-P-K Gauges */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900">Macronutrients (N-P-K)</h3>
            <Link to="/soil" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
              Details →
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            {/* Nitrogen */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-stone-700">Available Nitrogen (N)</span>
                <span className="text-emerald-700">{soilLatest.nitrogen} mg/kg (Adequate)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(100, (soilLatest.nitrogen / 200) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-stone-400">Target Range: 120 - 180 mg/kg</span>
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-stone-700">Available Phosphorus (P)</span>
                <span className="text-amber-700">{soilLatest.phosphorus} mg/kg (Moderate)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (soilLatest.phosphorus / 80) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-stone-400">Target Range: 30 - 60 mg/kg</span>
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-stone-700">Available Potassium (K)</span>
                <span className="text-teal-700">{soilLatest.potassium} mg/kg (High)</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: `${Math.min(100, (soilLatest.potassium / 250) * 100)}%` }} />
              </div>
              <span className="text-[10px] text-stone-400">Target Range: 150 - 250 mg/kg</span>
            </div>

            {/* pH Meter */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-600 uppercase">Soil Reaction (pH)</span>
                <p className="text-base font-extrabold text-stone-900">{soilLatest.ph} pH</p>
              </div>
              <Badge variant="emerald" size="sm">Near Neutral</Badge>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Scans & Blockchain Audit Records */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Plant Scans */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanEye className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-stone-900">Recent Plant Pathology Scans</h3>
            </div>
            <Link to="/disease" className="text-xs font-bold text-emerald-700 hover:text-emerald-900">
              Run New Scan →
            </Link>
          </div>

          <div className="space-y-3">
            {SAMPLE_LEAF_IMAGES.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/70 border border-stone-200/60 hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={item.previewUrl} alt={item.name} className="w-11 h-11 rounded-xl object-cover ring-1 ring-stone-200" />
                  <div>
                    <p className="font-bold text-xs text-stone-900">{item.crop} — {item.disease}</p>
                    <p className="text-[11px] text-stone-500">Confidence: {item.confidence}% • {item.pathogen} Pathogen</p>
                  </div>
                </div>
                <Badge variant={item.severity === 'Healthy' ? 'emerald' : item.severity === 'Severe' ? 'rose' : 'amber'} size="sm">
                  {item.severity}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain Ledger Feed */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-sm text-stone-900">Cryptographic Ledger Audit Trail</h3>
            </div>
            <Link to="/blockchain" className="text-xs font-bold text-purple-700 hover:text-purple-900">
              Block Explorer →
            </Link>
          </div>

          <div className="space-y-3">
            {INITIAL_BLOCKCHAIN_RECORDS.map((rec) => (
              <div key={rec.id} className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-900">Block #{rec.blockNumber}</span>
                  <Badge variant="purple" size="sm">CONFIRMED</Badge>
                </div>
                <p className="text-[11px] text-stone-600 font-mono truncate">
                  SHA-256: {rec.sha256Hash}
                </p>
                <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                  <span>Type: {rec.reportType}</span>
                  <span>{new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
